import React from "react";
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

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  notes: z.string().optional(),
});

interface BookingConfirmationProps {
  service: {
    name: string;
    price: number;
    duration: number;
  };
  professional: {
    name: string;
    avatar: string;
  };
  date: Date;
  time: string;
  onBack: () => void;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const BookingConfirmation = ({
  service,
  professional,
  date,
  time,
  onBack,
  onSubmit,
}: BookingConfirmationProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Confirmar agendamento</h3>
        <p className="text-muted-foreground">
          Por favor, verifique os detalhes e preencha suas informações
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Resumo do agendamento</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Serviço:</span>
              <span>{service.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profissional:</span>
              <span>{professional.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data:</span>
              <span>{date.toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horário:</span>
              <span>{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duração:</span>
              <span>{service.duration} minutos</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Valor total:</span>
              <span>R$ {service.price}</span>
            </div>
          </div>
        </div>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
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
                    <Input type="email" placeholder="seu@email.com" {...field} />
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
                    <Input placeholder="(00) 00000-0000" {...field} />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Voltar
              </Button>
              <Button type="submit">
                Finalizar Agendamento
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookingConfirmation;
