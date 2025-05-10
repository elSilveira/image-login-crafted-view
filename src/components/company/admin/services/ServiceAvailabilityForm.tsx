
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyProfessionalServices } from "@/lib/api-services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceItem } from "./types";

const daysOfWeek = [
  { label: "Segunda-feira", value: "MONDAY" },
  { label: "Terça-feira", value: "TUESDAY" },
  { label: "Quarta-feira", value: "WEDNESDAY" },
  { label: "Quinta-feira", value: "THURSDAY" },
  { label: "Sexta-feira", value: "FRIDAY" },
  { label: "Sábado", value: "SATURDAY" },
  { label: "Domingo", value: "SUNDAY" }
];

const timeSlotSchema = z.object({
  dayOfWeek: z.string().min(1, "Selecione um dia da semana"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido (HH:MM)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato inválido (HH:MM)"),
  isActive: z.boolean().default(true),
});

const serviceAvailabilitySchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  slots: z.array(timeSlotSchema).min(1, "Adicione pelo menos um horário"),
});

type ServiceAvailabilityFormValues = z.infer<typeof serviceAvailabilitySchema>;

interface ServiceAvailabilityFormProps {
  professionalId: string;
}

export const ServiceAvailabilityForm: React.FC<ServiceAvailabilityFormProps> = ({ professionalId }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  const { data: myServices, isLoading: isLoadingServices } = useQuery({
    queryKey: ["myProfessionalServices"],
    queryFn: getMyProfessionalServices,
  });

  const form = useForm<ServiceAvailabilityFormValues>({
    resolver: zodResolver(serviceAvailabilitySchema),
    defaultValues: {
      serviceId: "",
      slots: [
        { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00", isActive: true }
      ]
    }
  });

  const { fields, append, remove } = form.useFieldArray({
    name: "slots",
    keyName: "id"
  });

  // When selecting a service, fetch its availability
  const handleSelectService = async (serviceId: string) => {
    if (!serviceId) return;
    
    form.setValue("serviceId", serviceId);
    
    // Find the selected service object
    const service = myServices?.find((s: any) => s.serviceId === serviceId);
    setSelectedService(service || null);
    
    try {
      // TODO: Implement API call to get service availability
      // For now using mock data
      const mockAvailability = [
        { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00", isActive: true },
        { dayOfWeek: "WEDNESDAY", startTime: "10:00", endTime: "18:00", isActive: true },
      ];
      
      // Update form with fetched availability
      form.setValue("slots", mockAvailability);
    } catch (error) {
      console.error("Error fetching service availability:", error);
      toast.error("Erro ao carregar horários do serviço");
    }
  };

  const addTimeSlot = () => {
    append({ 
      dayOfWeek: "MONDAY", 
      startTime: "09:00", 
      endTime: "17:00", 
      isActive: true 
    });
  };

  const onSubmit = async (data: ServiceAvailabilityFormValues) => {
    console.log("Submitting service availability:", data);
    
    // TODO: Implement API call to save service availability
    
    // Simulate API call
    try {
      toast.success("Horários do serviço salvos com sucesso");
    } catch (error) {
      toast.error("Erro ao salvar horários do serviço");
    }
  };

  if (isLoadingServices) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const serviceOptions = myServices || [];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-4">Defina horários específicos para cada serviço</h2>
        <p className="text-muted-foreground mb-6">
          Cada serviço pode ter horários de disponibilidade diferentes. Selecione um serviço e defina os dias e horários em que ele está disponível.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="serviceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Selecione o serviço</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleSelectService(value);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um serviço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceOptions.length > 0 ? (
                      serviceOptions.map((service: any) => (
                        <SelectItem key={service.serviceId} value={service.serviceId}>
                          {service.service?.name || "Serviço sem nome"}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        Nenhum serviço cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedService && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Horários de disponibilidade</CardTitle>
                <CardDescription>
                  Defina os dias da semana e horários em que o serviço está disponível
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-md">
                    <div className="flex justify-between items-start">
                      <FormField
                        control={form.control}
                        name={`slots.${index}.isActive`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                Ativo
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`slots.${index}.dayOfWeek`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dia</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um dia" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {daysOfWeek.map((day) => (
                                  <SelectItem key={day.value} value={day.value}>
                                    {day.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`slots.${index}.startTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Início</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="time"
                                step="60"
                                placeholder="09:00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`slots.${index}.endTime`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fim</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="time"
                                step="60"
                                placeholder="17:00"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimeSlot}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Adicionar outro horário
                </Button>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setSelectedService(null);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!selectedService || !form.formState.isDirty}>
              Salvar horários
            </Button>
          </div>
        </form>
      </Form>
      
      {serviceOptions.length === 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Você ainda não tem serviços cadastrados. Cadastre um serviço primeiro para definir horários.
              </p>
              <Button variant="default" onClick={() => form.reset()}>
                Ir para cadastro de serviços
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
