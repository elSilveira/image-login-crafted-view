
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyProfessionalServices } from "@/lib/api-services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Clock, Loader2, Plus, Trash } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceItem } from "./types";
import { Badge } from "@/components/ui/badge";

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

  // Fix: Use form.control for useFieldArray
  const { fields, append, remove } = form.useFieldArray({
    name: "slots",
    control: form.control
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
          <Card className="overflow-visible">
            <CardHeader className="bg-muted/30">
              <CardTitle className="text-lg">Selecionar Serviço</CardTitle>
              <CardDescription>
                Escolha o serviço para o qual deseja definir a disponibilidade
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FormField
                control={form.control}
                name="serviceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serviço</FormLabel>
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
            </CardContent>
          </Card>
          
          {selectedService && (
            <Card className="overflow-visible">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Horários de disponibilidade</span>
                  <Badge variant="outline" className="font-normal text-xs">
                    {selectedService.service?.name || "Serviço selecionado"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Defina os dias da semana e horários em que o serviço está disponível
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Day selection with improved UI */}
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map(day => {
                    const dayExists = fields.some(field => field.dayOfWeek === day.value && field.isActive);
                    
                    return (
                      <div 
                        key={day.value} 
                        className={`
                          flex flex-col items-center justify-center p-2 rounded-md cursor-pointer border
                          ${dayExists 
                            ? 'bg-iazi-primary/10 border-iazi-primary/30' 
                            : 'bg-white hover:bg-muted/30 border-gray-200'}
                        `}
                        onClick={() => {
                          const existingIdx = fields.findIndex(f => f.dayOfWeek === day.value);
                          if (existingIdx >= 0) {
                            // Toggle active state
                            const isCurrentlyActive = fields[existingIdx].isActive;
                            form.setValue(`slots.${existingIdx}.isActive`, !isCurrentlyActive);
                          } else {
                            // Add new day
                            append({
                              dayOfWeek: day.value,
                              startTime: "09:00",
                              endTime: "17:00",
                              isActive: true
                            });
                          }
                        }}
                      >
                        <span className="text-xs font-medium">{day.label.substring(0, 3)}</span>
                        {dayExists ? (
                          <div className="mt-1 text-xs text-iazi-primary flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Configurado</span>
                          </div>
                        ) : (
                          <span className="mt-1 text-xs text-muted-foreground">Não configurado</span>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Time slots configuration */}
                {fields.filter(field => field.isActive).length > 0 ? (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium text-sm">Configuração de horários por dia</h4>
                    {fields.map((field, index) => (
                      field.isActive && (
                        <Card key={field.id} className="overflow-visible border-l-4 border-l-iazi-primary">
                          <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <h5 className="font-medium">
                                {daysOfWeek.find(d => d.value === field.dayOfWeek)?.label || field.dayOfWeek}
                              </h5>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  // Instead of removing, just set as inactive
                                  form.setValue(`slots.${index}.isActive`, false);
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`slots.${index}.startTime`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Horário de início</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="time"
                                        step="60"
                                        className="bg-muted/30"
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
                                    <FormLabel>Horário de término</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        type="time"
                                        step="60"
                                        className="bg-muted/30"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>Selecione ao menos um dia da semana para definir horários</p>
                  </div>
                )}
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
            <Button 
              type="submit" 
              disabled={!selectedService || !form.formState.isDirty || fields.filter(f => f.isActive).length === 0}
            >
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
