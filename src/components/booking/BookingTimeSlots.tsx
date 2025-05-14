"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { fetchProfessionalAppointments } from "@/lib/api";
import { format, addMinutes } from "date-fns";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  professionalId: string;
  serviceId?: string; // Optional now since we might have multiple services
  serviceSchedule?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
  selectedServices: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
}

interface AvailabilityData {
  availableSlots: string[];
}

const BookingTimeSlots = ({
  date,
  selectedTime,
  onTimeSelect,
  onNext,
  professionalId,
  serviceId,
  serviceSchedule,
  selectedServices,
}: BookingTimeSlotsProps) => {
  const location = useLocation();
  const isRescheduling = location.pathname.includes("/reschedule");

  // Calculate total duration of all selected services
  const totalDuration = React.useMemo(() => {
    return selectedServices.reduce((sum, service) => sum + (service.duration || 0), 0);
  }, [selectedServices]);

  // Format date for API query (YYYY-MM-DD)
  const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;

  // Fetch all appointments for the selected professional and date
  const { data: appointmentsData, isLoading, isError, error } = useQuery<any, Error>({
    queryKey: ["appointments", professionalId, formattedDate],
    queryFn: () => fetchProfessionalAppointments(professionalId, formattedDate!, formattedDate!),
    enabled: !!formattedDate && !!professionalId,
    staleTime: 5 * 60 * 1000,
  });
  const appointments = appointmentsData?.data || [];

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

  // Mark slots as unavailable if they conflict with existing appointments
  // or don't have enough time for the total duration of all services
  const slots = allSlots.filter(time => {
    // Parse the time slot
    const [hours, minutes] = time.split(':').map(Number);
    const slotDateTime = new Date(date!);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculate end time based on total duration of all services
    const endDateTime = addMinutes(slotDateTime, totalDuration);
    
    // Check if this time slot is already booked or overlaps with any appointment
    for (const appointment of appointments) {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime || appointment.startTime); // Fallback if no end time
      
      // If appointment overlaps with our time slot + duration, it's not available
      if (
        (slotDateTime <= appointmentEnd && endDateTime >= appointmentStart) ||
        (appointmentStart <= endDateTime && appointmentEnd >= slotDateTime)
      ) {
        return false;
      }
    }
    
    // Check if the slot's end time exceeds the work day
    if (serviceSchedule) {
      const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
      const dayKey = days[date!.getDay()];
      const slotDef = serviceSchedule.find(s => s.dayOfWeek === dayKey);
      
      if (slotDef) {
        const [endHours, endMinutes] = slotDef.endTime.split(':').map(Number);
        const workDayEnd = new Date(date!);
        workDayEnd.setHours(endHours, endMinutes, 0, 0);
        
        // If the service would end after the workday, it's not available
        if (endDateTime > workDayEnd) {
          return false;
        }
      }
    }
    
    return true;
  });

  // Get current time for comparison
  const now = new Date();
  const isToday = date && now.toDateString() === date.toDateString();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Escolha um horário</h3>
        <p className="text-muted-foreground">
          {date ? `Horários disponíveis para ${date.toLocaleDateString("pt-BR")}` : "Selecione uma data primeiro"}
        </p>
        {selectedServices.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Duração total dos serviços: {totalDuration} minutos
          </p>
        )}
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
              const available = slots.includes(time);
              const isSelected = selectedTime === time;
              
              // Disable if not available or if time is before now (for today)
              let disabled = !available;
              if (isToday) {
                const [h, m] = time.split(":").map(Number);
                const slotDate = new Date(date);
                slotDate.setHours(h, m, 0, 0);
                if (slotDate < now) {
                  disabled = true;
                }
              }
              
              let variant: any = 'outline';
              let extraClass = '';
              if (disabled) {
                // Disabled (past or unavailable for the duration): gray/destructive
                variant = 'destructive';
                extraClass = 'opacity-60 cursor-not-allowed';
              } else if (isSelected) {
                variant = 'default';
                extraClass = 'ring-2 ring-primary ring-offset-2 bg-primary text-white';
              }
              
              return (
                <Button
                  key={time}
                  variant={variant}
                  onClick={() => !disabled && onTimeSelect(time)}
                  className={`w-full ${extraClass}`}
                  disabled={disabled}
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

