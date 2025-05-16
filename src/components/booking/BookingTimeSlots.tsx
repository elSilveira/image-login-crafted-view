
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { fetchProfessionalAppointments } from "@/lib/api";
import { format, addMinutes } from "date-fns";
import { Loader2, AlertCircle, Lock, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseDurationToMinutes, formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Utility to generate time slots every N minutes
const generateTimeSlots = (start: string, end: string, interval: number) => {
  try {
    const times: string[] = [];
    let [sh, sm] = start.split(':').map(Number);
    let [eh, em] = end.split(':').map(Number);
    
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) {
      console.error('Invalid time format in schedule:', { start, end });
      return [];
    }
    
    const current = new Date(); 
    current.setHours(sh, sm, 0, 0);
    
    const endDate = new Date(); 
    endDate.setHours(eh, em, 0, 0);
    
    while (current <= endDate) {
      times.push(format(current, 'HH:mm'));
      current.setMinutes(current.getMinutes() + interval);
    }
    return times;
  } catch (error) {
    console.error('Error generating time slots:', error);
    return [];
  }
};

interface BookingTimeSlotsProps {
  date: Date | undefined;
  selectedTime: string | undefined;
  onTimeSelect: (time: string) => void;
  onNext: () => void;
  professionalId: string;
  serviceId?: string;
  serviceSchedule?: Array<{ dayOfWeek: string; startTime: string; endTime: string }>;
  selectedServices: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
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
    return selectedServices.reduce((sum, service) => {
      const duration = parseDurationToMinutes(service.duration || 0);
      return sum + duration;
    }, 0);
  }, [selectedServices]);

  // Format date for API query (YYYY-MM-DD)
  const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
  
  // Build a detailed query key that contains all relevant information
  const queryKey = React.useMemo(() => {
    const servicesData = selectedServices.map(s => ({ id: s.id, duration: s.duration }));
    return ["appointments", professionalId, formattedDate, JSON.stringify(servicesData)];
  }, [professionalId, formattedDate, selectedServices]);
  
  // Fetch all appointments for the selected professional and date
  const { data: appointmentsData, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn: () => fetchProfessionalAppointments(professionalId, formattedDate!, formattedDate!),
    enabled: !!formattedDate && !!professionalId && selectedServices.length > 0,
    staleTime: 5 * 60 * 1000,
  });
  
  // Process appointments data to ensure consistent structure
  const appointments = React.useMemo(() => {
    if (!appointmentsData?.data) return [];
    
    try {
      return appointmentsData.data.map((appt: any) => {
        // Ensure each appointment has the expected fields
        return {
          ...appt,
          // Normalize startTime and endTime format
          startTime: appt.startTime || appt.date,
          endTime: appt.endTime || appt.date,
          // Ensure services array exists
          services: Array.isArray(appt.services) ? appt.services : 
                  (appt.service ? [appt.service] : [])
        };
      });
    } catch (err) {
      console.error('Error processing appointment data:', err);
      return [];
    }
  }, [appointmentsData]);

  // Determine schedule for the selected date based on serviceSchedule
  let allSlots: string[] = [];
  if (date && serviceSchedule) {
    try {
      const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
      const dayKey = days[date.getDay()];
      const slotDef = serviceSchedule.find(s => s.dayOfWeek === dayKey);
      if (slotDef) {
        allSlots = generateTimeSlots(slotDef.startTime, slotDef.endTime, 30);
      }
    } catch (err) {
      console.error('Error determining schedule for date:', err);
    }
  }
  
  // Mark slots as unavailable if they conflict with existing appointments
  // or don't have enough time for the total duration of all services
  const slots = allSlots.filter(time => {
    try {
      // Validate that date is a valid Date object before proceeding
      if (!date || isNaN(date.getTime())) {
        return false;
      }
      
      // Parse the time slot and create date objects for the selected date
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        return false;
      }
      
      const slotDateTime = new Date(date);
      slotDateTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on total duration of all services
      const endDateTime = addMinutes(slotDateTime, totalDuration);
      
      // Check if this time slot is already booked or overlaps with any appointment
      for (const appointment of appointments) {
        try {
          // Parse appointment dates and handle invalid dates
          let apptStartDate = new Date(appointment.startTime);
          let apptEndDate = new Date(appointment.endTime || appointment.startTime);
          
          if (isNaN(apptStartDate.getTime()) || isNaN(apptEndDate.getTime())) {
            continue;
          }
          
          // Calculate appointment duration based on available data
          let apptDuration = 0;
          
          if (Array.isArray(appointment.services) && appointment.services.length > 0) {
            for (const s of appointment.services) {
              let serviceDuration = 0;
              
              if (s.duration) {
                serviceDuration = parseDurationToMinutes(s.duration);
              } else if (s.service?.duration) {
                serviceDuration = parseDurationToMinutes(s.service.duration);
              } else {
                serviceDuration = 30; // Default
              }
              
              apptDuration += serviceDuration;
            }
          } else if (appointment.service) {
            apptDuration = parseDurationToMinutes(appointment.service.duration);
          } else if (appointment.duration) {
            apptDuration = parseDurationToMinutes(appointment.duration);
          } else if (appointment.startTime && appointment.endTime) {
            const start = new Date(appointment.startTime);
            const end = new Date(appointment.endTime);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              apptDuration = Math.round((end.getTime() - start.getTime()) / 60000);
            }
          }
          
          // Apply the calculated duration to get the end time
          if (apptDuration > 0) {
            apptEndDate = new Date(apptStartDate.getTime() + apptDuration * 60000);
          } else {
            apptEndDate = new Date(apptStartDate.getTime() + 30 * 60000);
          }
          
          // Check for time overlap regardless of date
          const slotTimeMinutes = hours * 60 + minutes;
          const slotEndMinutes = slotTimeMinutes + totalDuration;
          
          const apptStartMinutes = apptStartDate.getHours() * 60 + apptStartDate.getMinutes();
          const apptEndMinutes = apptEndDate.getHours() * 60 + apptEndDate.getMinutes();
          
          const isOverlapping = (
            (slotTimeMinutes < apptEndMinutes && slotEndMinutes > apptStartMinutes) ||
            (apptStartMinutes < slotEndMinutes && apptEndMinutes > slotTimeMinutes)
          );
          
          if (isOverlapping) {
            return false;
          }
        } catch (err) {
          continue;
        }
      }
      
      // Check if the slot's end time exceeds the work day
      if (serviceSchedule) {
        const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
        const dayKey = days[date.getDay()];
        const slotDef = serviceSchedule.find(s => s.dayOfWeek === dayKey);
        
        if (slotDef) {
          const [endHours, endMinutes] = slotDef.endTime.split(':').map(Number);
          const workDayEnd = new Date(date);
          workDayEnd.setHours(endHours, endMinutes, 0, 0);
          
          // If the service would end after the workday, it's not available
          if (endDateTime > workDayEnd) {
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error(`Error checking availability for slot ${time}:`, error);
      return false;
    }
  });

  // Get current time for comparison
  const now = new Date();
  const isToday = date && now.toDateString() === date.toDateString();

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium">
          <Clock className="mr-2 h-5 w-5 text-iazi-primary" />
          Escolha um horário
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6 pt-2">
        <div>
          <p className="text-muted-foreground text-sm mb-4">
            {date ? `Horários disponíveis para ${format(date, "dd/MM/yyyy")}` : "Selecione uma data primeiro"}
            {selectedServices.length > 0 && (
              <span className="block text-xs font-medium mt-1 text-iazi-primary">
                Duração: {formatDuration(totalDuration)}
              </span>
            )}
          </p>

          <ScrollArea className="h-[250px] rounded-md border p-4">
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
                </AlertDescription>
              </Alert>
            )}
            {!isLoading && !isError && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {allSlots.map((time) => {
                  const available = slots.includes(time);
                  const isSelected = selectedTime === time;
                  // Disable if not available or if time is before now (for today)
                  let disabled = !available;
                  if (isToday) {
                    const [h, m] = time.split(":").map(Number);
                    const slotDate = new Date(date!);
                    slotDate.setHours(h, m, 0, 0);
                    if (slotDate < now) {
                      disabled = true;
                    }
                  }
                  
                  let className = "w-full transition-all text-center ";
                  
                  if (disabled) {
                    className += "bg-gray-100 text-muted-foreground opacity-60 cursor-not-allowed";
                  } else if (isSelected) {
                    className += "bg-iazi-primary text-white ring-2 ring-iazi-primary ring-offset-2";
                  } else {
                    className += "bg-white border hover:bg-muted/50";
                  }
                  
                  return (
                    <Button
                      key={time}
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => !disabled && onTimeSelect(time)}
                      className={className}
                      disabled={disabled}
                    >
                      {time}
                    </Button>
                  );
                })}
              </div>
            )}
            {!isLoading && !isError && slots && slots.length === 0 && date && (
              <p className="text-center text-muted-foreground py-10">Nenhum horário disponível para esta data.</p>
            )}
            {!date && (
               <p className="text-center text-muted-foreground py-10">Selecione uma data para ver os horários.</p>
            )}
          </ScrollArea>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={onNext} 
              disabled={!selectedTime || isLoading || isError}
              className="bg-iazi-primary hover:bg-iazi-primary/90"
            >
              {isRescheduling ? "Confirmar Reagendamento" : "Próximo"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingTimeSlots;
