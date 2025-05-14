"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and QueryClient
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createAppointment } from "@/lib/api"; // Import API function
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth to get user ID
import { toast } from "sonner"; // Import toast for notifications
import { Loader2 } from "lucide-react"; // Import Loader icon
import { formatISO, parse } from "date-fns"; // Import date-fns functions
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Define Zod schema for form validation
const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof formSchema>;

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface BookingConfirmationProps {
  services: Service[]; // Changed from 'service' to 'services' array
  professional?: { // Professional might be optional depending on service
    id: string; // Need professional ID if applicable
    name: string;
    avatar: string;
  };
  company?: { // Company might be relevant too
    id: string;
  };
  date: Date;
  time: string; // HH:mm format
  onBack: () => void;
  // Remove onSubmit prop, handle submission internally
  // onSubmit: (data: BookingFormData) => void;
  onSuccess: (appointmentData: any) => void; // Callback for successful booking
}

const BookingConfirmation = ({
  services,
  professional,
  company,
  date,
  time,
  onBack,
  onSuccess,
}: BookingConfirmationProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Get user info from AuthContext

  // Calculate total price and duration
  const totalPrice = React.useMemo(() => {
    return services.reduce((sum, service) => sum + (service?.price || 0), 0);
  }, [services]);

  const totalDuration = React.useMemo(() => {
    return services.reduce((sum, service) => sum + (service?.duration || 0), 0);
  }, [services]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(formSchema),
    // Pre-fill form if user data is available
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "", // Autofill phone from user
      notes: "",
    },
  });

  // Mutation for creating the appointment
  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: (data) => {
      toast.success("Agendamento confirmado com sucesso!");
      // Invalidate relevant queries, e.g., user's appointments
      queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] }); // Invalidate availability
      onSuccess(data); // Call the success callback (e.g., close modal, redirect)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao confirmar agendamento. Tente novamente.");
    },
  });

  // Handle form submission
  const handleFinalSubmit = (formData: BookingFormData) => {
    if (!user?.id) {
      toast.error("Erro: Usuário não identificado. Faça login novamente.");
      return;
    }

    // Validate date and time
    if (!date || !time) {
      toast.error("Data e hora do agendamento são obrigatórias.");
      return;
    }
    if (typeof time !== 'string' || !/^\d{2}:\d{2}$/.test(time)) {
      toast.error("Horário inválido. Selecione um horário válido.");
      return;
    }
    // Ensure date is a Date object
    let bookingDate: Date;
    if (date instanceof Date && !isNaN(date.getTime())) {
      bookingDate = new Date(date.getTime()); // clone
    } else if (typeof date === 'string' || typeof date === 'number') {
      bookingDate = new Date(date);
    } else {
      toast.error("Data do agendamento inválida.");
      return;
    }
    if (isNaN(bookingDate.getTime())) {
      toast.error("Data do agendamento inválida.");
      return;
    }
    // Debug log
    console.log('BookingConfirmation: bookingDate', bookingDate, 'time', time);

    try {
      // Parse hours and minutes safely
      const [hoursStr, minutesStr] = time.split(":");
      const hours = Number(hoursStr);
      const minutes = Number(minutesStr);
      if (
        isNaN(hours) || isNaN(minutes) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59
      ) {
        toast.error("Horário inválido. Selecione um horário válido.");
        return;
      }
      // Always treat bookingDate as local time
      const startDateTime = new Date(bookingDate.getTime());
      startDateTime.setHours(hours, minutes, 0, 0);
      if (isNaN(startDateTime.getTime())) {
        toast.error("Data e hora do agendamento inválidas.");
        return;
      }
      // Format date as YYYY-MM-DD
      const dateStr = startDateTime.toISOString().slice(0, 10);
      // Format time as HH:MM
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      // Extract service IDs for the new API contract
      const serviceIds = services.map(service => service.id);

      // Build payload according to new contract
      const appointmentData: any = {
        serviceIds: serviceIds, // Now sending an array of service IDs
        date: dateStr,
        time: timeStr,
        notes: formData.notes || undefined,
      };
      if (professional?.id) {
        appointmentData.professionalId = professional.id;
      } else if (company?.id) {
        appointmentData.companyId = company.id;
      }

      mutation.mutate(appointmentData);

    } catch (e) {
      console.error("Error formatting date/time:", e, { date, time });
      toast.error("Erro ao formatar data/hora do agendamento.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Confirmar agendamento</h3>
        <p className="text-muted-foreground">
          Por favor, verifique os detalhes e preencha suas informações
        </p>
      </div>

      <div className="space-y-4">
        {/* Booking Summary */} 
        <div>
          <h4 className="font-medium mb-2">Resumo do agendamento</h4>
          <div className="space-y-2 text-sm">
            {/* Show all selected services */}
            <div className="space-y-2">
              <div className="text-muted-foreground">Serviços:</div>
              {services.map((service, index) => (
                <div key={service.id} className="flex justify-between">
                  <span>{service.name}</span>
                  <span>R$ {service.price}</span>
                </div>
              ))}
            </div>
            {professional && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profissional:</span>
                <span>{professional.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span>{date.toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horário:</span>
              <span>{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duração:</span>
              <span>{totalDuration} minutos</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Valor total:</span>
              <span>R$ {totalPrice}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* User Information Form */} 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="seu@email.com" {...field} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} disabled={mutation.isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alguma observação para o profissional?"
                      {...field}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */} 
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={mutation.isPending}>
                Voltar
              </Button>
              <Button type="submit" disabled={mutation.isPending || !form.formState.isValid}>
                {mutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizando...</>
                ) : (
                  "Finalizar Agendamento"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingConfirmation;

