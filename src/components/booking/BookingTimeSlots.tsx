"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { fetchAvailability } from "@/lib/api"; // Import API function
import { format } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react"; // Import icons
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

interface BookingTimeSlotsProps {
  date: Date | undefined;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  // Need context for booking, e.g., serviceId or professionalId
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
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
  serviceId,
  professionalId,
  companyId,
}: BookingTimeSlotsProps) => {
  const location = useLocation();
  const isRescheduling = location.pathname.includes("/reschedule");

  // Format date for API query (YYYY-MM-DD)
  const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;

  // Fetch available time slots using React Query
  const { data, isLoading, isError, error } = useQuery<AvailabilityData, Error>({
    queryKey: ["availability", formattedDate, serviceId, professionalId, companyId],
    queryFn: () => fetchAvailability({
      date: formattedDate!,
      serviceId,
      professionalId,
      companyId,
    }),
    enabled: !!formattedDate && (!!serviceId || !!professionalId || !!companyId), // Only run query if date and context are available
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const timeSlots = data?.availableSlots || [];

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
        {!isLoading && !isError && timeSlots.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeSelect(time)}
                className="w-full"
                disabled={!date} // Already disabled if no date, but good practice
              >
                {time} {/* Assuming time is in HH:mm format */}
              </Button>
            ))}
          </div>
        )}
        {!isLoading && !isError && timeSlots.length === 0 && date && (
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

