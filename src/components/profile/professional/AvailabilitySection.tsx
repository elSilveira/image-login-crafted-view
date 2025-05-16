
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock, Calendar } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import ServicesList from "@/components/booking/ServicesList";
import { parseDurationToMinutes, formatDuration } from "@/lib/utils";

// Define the structure for a single availability slot
interface AvailabilitySlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

// Assuming the main form data structure includes an array for availability
interface AvailabilityFormData {
  availability: AvailabilitySlot[];
  selectedServices?: any[];
}

// Dias em português para interface do usuário
const daysOfWeek = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

// Mapeamento para backend (para depuração)
const dayOfWeekBackendMap: Record<string, string> = {
  "Segunda": "MONDAY",
  "Terça": "TUESDAY",
  "Quarta": "WEDNESDAY",
  "Quinta": "THURSDAY",
  "Sexta": "FRIDAY",
  "Sábado": "SATURDAY",
  "Domingo": "SUNDAY"
};

export const AvailabilitySection = () => {
  const { control, register, watch } = useFormContext<AvailabilityFormData>();
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "availability",
  });

  // Watch the selected services
  const selectedServices = watch("selectedServices") || [];
  
  // Calculate total duration of selected services
  const totalDuration = useMemo(() => {
    return selectedServices.reduce((sum, service) => {
      const duration = parseDurationToMinutes(service?.duration || 0);
      return sum + duration;
    }, 0);
  }, [selectedServices]);

  // Helper to add/remove a day's default slot
  const handleDayToggle = (day: string, checked: boolean) => {
    const existingIndex = fields.findIndex(field => field.dayOfWeek === day);
    if (checked && existingIndex === -1) {
      append({ dayOfWeek: day, startTime: "09:00", endTime: "17:00" }); // Add default slot
    } else if (!checked && existingIndex !== -1) {
      remove(existingIndex); // Remove slot for this day
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      {/* Left column: Calendar and time slots */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Horários de Atendimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Day Selection - Improved grid layout */}
          <div className="space-y-2">
            <Label>Dias da Semana Disponíveis</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {daysOfWeek.map((day) => {
                const isChecked = fields.some(field => field.dayOfWeek === day);
                return (
                  <div key={day} className={`
                    flex items-center p-3 rounded-md border
                    ${isChecked ? 'border-iazi-primary bg-iazi-primary/5' : 'border-gray-200'}
                    hover:bg-muted/30 cursor-pointer
                  `}
                  onClick={() => handleDayToggle(day, !isChecked)}>
                    <Checkbox 
                      id={`day-${day}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleDayToggle(day, !!checked)}
                      className="mr-2"
                    />
                    <Label htmlFor={`day-${day}`} className="font-normal cursor-pointer w-full">
                      {day}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slots for Active Days */}
          {fields.length > 0 && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <Label>Definir Horários</Label>
                <span className="text-xs text-muted-foreground">Total: {fields.length} dias</span>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 border p-3 rounded-md bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="font-medium w-28 flex-shrink-0 flex flex-col">
                    <span>{field.dayOfWeek}:</span>
                    <span className="text-xs text-muted-foreground">
                      ({dayOfWeekBackendMap[field.dayOfWeek]})
                    </span>
                  </div>
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...register(`availability.${index}.startTime` as const)}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <span className="text-muted-foreground">até</span>
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Fim</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...register(`availability.${index}.endTime` as const)}
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {fields.length === 0 && (
             <p className="text-center text-muted-foreground py-4 border rounded-md bg-muted/10">
               Selecione os dias da semana em que você atende.
             </p>
          )}
        </CardContent>
      </Card>
      
      {/* Right column: Service selection */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Serviços Selecionados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedServices && selectedServices.length > 0 ? (
            <div className="space-y-4">
              <ServicesList 
                services={selectedServices}
                showPrice={true}
                showDuration={true}
              />
              
              <div className="flex flex-col border-t pt-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Duração total:</span>
                  <span className="font-bold text-iazi-primary">{formatDuration(totalDuration)}</span>
                </div>
              </div>
              
              <Button
                type="button"
                className="w-full bg-iazi-primary hover:bg-iazi-primary/90 mt-4"
              >
                Agendar
              </Button>
            </div>
          ) : (
            <div className="text-center py-6 border rounded-md bg-muted/10">
              <p className="text-muted-foreground text-sm">
                Selecione serviços para agendamento
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" /> Adicionar serviços
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
