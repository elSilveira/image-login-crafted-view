import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock, Calendar } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox is available

// Define the structure for a single availability slot
interface AvailabilitySlot {
  dayOfWeek: string; // e.g., "Segunda", "Terça" (frontend) que serão mapeados para "MONDAY", "TUESDAY" (backend)
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "17:00"
}

// Assuming the main form data structure includes an array for availability
interface AvailabilityFormData {
  availability: AvailabilitySlot[];
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
  const { control, register } = useFormContext<AvailabilityFormData>();

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "availability",
  });

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
    <Card>
      <CardHeader>
        <CardTitle>Horários de Atendimento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Day Selection */}
        <div className="space-y-2">
          <Label>Dias da Semana Ativos</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {daysOfWeek.map((day) => {
              const isChecked = fields.some(field => field.dayOfWeek === day);
              return (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`day-${day}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleDayToggle(day, !!checked)}
                  />
                  <Label htmlFor={`day-${day}`} className="font-normal">
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
            <Label>Definir Horários</Label>            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 border p-3 rounded-md bg-muted/50">
                <div className="font-medium w-20 flex-shrink-0 flex flex-col">
                  <span>{field.dayOfWeek}:</span>
                  <span className="text-xs text-muted-foreground" title={`Será enviado como ${dayOfWeekBackendMap[field.dayOfWeek]} para o backend`}>
                    ({dayOfWeekBackendMap[field.dayOfWeek]})
                  </span>
                </div>
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Início</FormLabel>
                  <FormControl>
                    <Input 
                      type="time"
                      {...register(`availability.${index}.startTime` as const)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                <span>até</span>
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Fim</FormLabel>
                  <FormControl>
                    <Input 
                      type="time"
                      {...register(`availability.${index}.endTime` as const)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {/* Remove button is implicitly handled by unchecking the day */}
              </div>
            ))}
          </div>
        )}

        {fields.length === 0 && (
           <p className="text-sm text-muted-foreground">
             Selecione os dias da semana em que você atende.
           </p>
        )}
      </CardContent>
    </Card>
  );
};

