"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { fetchAvailability } from "@/lib/api"; // API: fetchAvailability(professionalId, date)
import { format } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react"; // Import icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

// Utility to generate time slots every N minutes
const generateTimeSlots = (start: string, end: string, interval: number) => {
  const times: string[] = [];
  let [sh, sm] = start.split(':').map(Number);
  let [eh, em] = end.split(':').map(Number);
  const current = new Date(); current.setHours(sh, sm, 0, 0);
  const endDate = new Date(); endDate.setHours(eh, em, 0, 0);
  while (current <= endDate) {
    times.push(format(current, 'HH:mm'));
    current.setMinutes(current.getMinutes() + interval);
  }
  return times;
};

interface BookingTimeSlotsProps {
  date: Date | undefined;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  professionalId: string;  // required now
  serviceId: string;
  serviceSchedule?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
}

interface AvailabilityData {
  availableSlots: string[];
  // disabledDates?: string[]; // Potentially returned by the API
}

const BookingTimeSlots = ({
  date,
  selectedTime,
  onTimeSelect,
  onNext,
  professionalId,
  serviceId,
  serviceSchedule,
}: BookingTimeSlotsProps) => {
  const location = useLocation();
  const isRescheduling = location.pathname.includes("/reschedule");

  // Format date for API query (YYYY-MM-DD)
  const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;

  // Fetch available time slots using React Query
  const { data: availabilityData, isLoading, isError, error } = useQuery<AvailabilityData, Error>({
    queryKey: ["availability", professionalId, serviceId, formattedDate],
    queryFn: () => fetchAvailability(professionalId, serviceId, formattedDate!),
    enabled: !!formattedDate && !!professionalId && !!serviceId,
    staleTime: 5 * 60 * 1000,
  });
  // Extract array of slots
  const slots: string[] = availabilityData?.availableSlots || [];

  // Determine schedule for the selected date based on serviceSchedule
  let allSlots: string[] = [];
  if (date && serviceSchedule) {
    const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const dayKey = days[date.getDay()];
    const slotDef = serviceSchedule.find(s => s.dayOfWeek === dayKey);
    if (slotDef) {
      allSlots = generateTimeSlots(slotDef.startTime, slotDef.endTime, 30);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha um horário</h3>
        <p className="text-muted-foreground">
          {date ? `Horários disponíveis para ${date.toLocaleDateString("pt-BR")}` : "Selecione uma data primeiro"}
        </p>
      </div>

      <ScrollArea className="h-[300px] rounded-md border p-4">
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os horários disponíveis.
              {error?.message && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
            </AlertDescription>
          </Alert>
        )}
        {!isLoading && !isError && (
          <div className="grid grid-cols-3 gap-2">
            {allSlots.map((time) => {
              // If slots is empty, all times are available; otherwise, only those in slots
              const available = slots.length === 0 ? true : slots.includes(time);
              return (
                <Button
                  key={time}
                  variant={available ? 'default' : 'destructive'}
                  onClick={() => available && onTimeSelect(time)}
                  className="w-full"
                  disabled={!date}
                >
                  {time}
                </Button>
              );
            })}
          </div>
        )}
        {/* If no available slots at all */}
        {!isLoading && !isError && slots && slots.length === 0 && date && (
          <p className="text-center text-muted-foreground py-10">Nenhum horário disponível para esta data.</p>
        )}
        {!date && (
           <p className="text-center text-muted-foreground py-10">Selecione uma data para ver os horários.</p>
        )}
      </ScrollArea>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedTime || isLoading || isError}>
          {isRescheduling ? "Confirmar Reagendamento" : "Próximo"}
        </Button>
      </div>
    </div>
  );
};

export default BookingTimeSlots;

