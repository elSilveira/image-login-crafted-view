"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation } from "react-router-dom";
import { fetchProfessionalAppointments } from "@/lib/api";
import { format, addMinutes } from "date-fns";
import { Loader2, AlertCircle, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseDurationToMinutes, formatDuration } from "@/lib/utils";

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
    return selectedServices.reduce((sum, service) => {
      const duration = parseDurationToMinutes(service.duration || 0);
      return sum + duration;
    }, 0);
  }, [selectedServices]);

  // Format date for API query (YYYY-MM-DD)
  const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
  
  // Build a detailed query key that contains all relevant information
  // This ensures the component updates whenever any important factor changes
  const queryKey = React.useMemo(() => {
    const servicesData = selectedServices.map(s => ({ id: s.id, duration: s.duration }));
    return ["appointments", professionalId, formattedDate, JSON.stringify(servicesData)];
  }, [professionalId, formattedDate, selectedServices]);
  
  // Fetch all appointments for the selected professional and date
  const { data: appointmentsData, isLoading, isError, error } = useQuery<any, Error>({
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
  
  // Enhanced logging for debugging
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Appointment data for date:', formattedDate, {
        count: appointments.length,
        professionalId,
        selectedServices: selectedServices.map(s => ({
          id: s.id, 
          name: s.name, 
          duration: s.duration,
          formattedDuration: formatDuration(s.duration)
        })),
        totalDuration,
        formattedTotalDuration: formatDuration(totalDuration),
        appointments: appointments
      });
    }
    
    // Check if there's any structural issues with appointments
    if (appointments.length > 0) {
      appointments.forEach((appt: any, index: number) => {
        if (!appt.startTime) {
          console.warn(`Appointment #${index} is missing startTime:`, appt);
        }
        if (Array.isArray(appt.services) && appt.services.length > 0) {
          console.log(`Appointment #${index} has ${appt.services.length} services`);
        } else if (appt.service) {
          console.log(`Appointment #${index} has single service:`, appt.service);
        } else {
          console.warn(`Appointment #${index} has no service information:`, appt);
        }
      });
    }
  }, [appointments, formattedDate, professionalId, selectedServices, totalDuration]);

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
        console.error('Invalid date provided to slot filter:', date);
        return false; // Consider slot unavailable if we have an invalid date
      }
      
      // Parse the time slot and create date objects for the selected date with the slot time
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        console.error('Invalid time format:', time);
        return false; // Skip invalid time formats
      }
      
      const slotDateTime = new Date(date);
      slotDateTime.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on total duration of all services
      const endDateTime = addMinutes(slotDateTime, totalDuration);
      
      // Safely log information about this time slot
      try {
        if (process.env.NODE_ENV !== 'production' && !isNaN(endDateTime.getTime())) {
          console.log(`Checking slot ${time} (end: ${format(endDateTime, 'HH:mm')}) - Duration: ${totalDuration} minutes`);
        }
      } catch (err) {
        console.error('Error logging slot time:', err);
        // Continue execution - this is just for logging
      }
      
      // Check if this time slot is already booked or overlaps with any appointment
      for (const appointment of appointments) {
        // Parse appointment dates with timezone handling
        const apptStartString = appointment.startTime;
        const apptEndString = appointment.endTime || appointment.startTime;
        
        // Create dates in local timezone with the same date part as the slot
        // Adding try/catch to handle invalid date strings
        let apptStartDate, apptEndDate;
        
        try {
          apptStartDate = new Date(apptStartString);
          if (isNaN(apptStartDate.getTime())) {
            console.error('Invalid start time detected:', apptStartString);
            continue; // Skip this appointment if the date is invalid
          }
          
          apptEndDate = new Date(apptEndString);
          if (isNaN(apptEndDate.getTime())) {
            console.error('Invalid end time detected:', apptEndString);
            apptEndDate = new Date(apptStartDate); // Fallback to start date if end date is invalid
          }
        } catch (err) {
          console.error('Error parsing appointment dates:', err);
          continue; // Skip this appointment
        }
        
        // Calculate appointment duration based on available data
        let apptDuration = 0;
        
        try {
          // Case 1: Multi-service appointment with services array
          if (Array.isArray(appointment.services) && appointment.services.length > 0) {
            // Log what we found for debugging
            console.log(`Appointment has ${appointment.services.length} services array`, 
              appointment.services.map((s: any) => ({
                id: s.id || s.service?.id,
                name: s.name || s.service?.name,
                duration: s.duration || s.service?.duration,
                formattedDuration: formatDuration(s.duration || s.service?.duration)
              }))
            );
            
            for (const s of appointment.services) {
              // Try to get duration from different possible paths
              let serviceDuration = 0;
              
              // Check all possible duration locations in service object
              if (s.duration) {
                serviceDuration = parseDurationToMinutes(s.duration);
              } else if (s.service?.duration) {
                serviceDuration = parseDurationToMinutes(s.service.duration);
              } else if (typeof s === 'object' && 'id' in s) {
                // If we have a service ID, try to match it in selected services
                const matchingService = selectedServices.find(selected => selected.id === s.id);
                if (matchingService?.duration) {
                  serviceDuration = parseDurationToMinutes(matchingService.duration);
                }
              }
              
              if (serviceDuration <= 0) {
                console.warn('Service with zero/invalid duration:', s);
                serviceDuration = 30; // Default to 30 minutes if no valid duration found
              }
              
              apptDuration += serviceDuration;
            }
          } 
          // Case 2: Single service in appointment.service
          else if (appointment.service) {
            console.log('Appointment has single service:', appointment.service, 
              formatDuration(appointment.service.duration));
            apptDuration = parseDurationToMinutes(appointment.service.duration);
          }
          // Case 3: Direct duration property
          else if (appointment.duration) {
            console.log('Appointment has direct duration:', appointment.duration, 
              formatDuration(appointment.duration));
            apptDuration = parseDurationToMinutes(appointment.duration);
          }
          // Case 4: Time difference between start and end
          else if (appointment.startTime && appointment.endTime) {
            const start = new Date(appointment.startTime);
            const end = new Date(appointment.endTime);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              apptDuration = Math.round((end.getTime() - start.getTime()) / 60000);
              console.log('Calculated duration from time difference:', apptDuration);
            }
          }
        } catch (err) {
          console.error('Error calculating appointment duration:', err);
        }
        
        // Apply the calculated duration to get the end time
        if (apptDuration > 0) {
          console.log(`Calculated appointment duration: ${apptDuration} minutes (${formatDuration(apptDuration)})`);
          apptEndDate = new Date(apptStartDate.getTime() + apptDuration * 60000);
        } else {
          console.warn('Could not determine appointment duration, using default of 30 minutes', appointment);
          apptEndDate = new Date(apptStartDate.getTime() + 30 * 60000);
        }
        
        // Format times for comparison and logging
        let slotTimeStr, slotEndTimeStr, apptStartTimeStr, apptEndTimeStr;
        
        try {
          // Validate all date objects before formatting
          if (isNaN(slotDateTime.getTime()) || isNaN(endDateTime.getTime()) || 
              isNaN(apptStartDate.getTime()) || isNaN(apptEndDate.getTime())) {
            console.error('Invalid date objects before formatting:', { 
              slotDateTime: slotDateTime ? slotDateTime.toString() : 'undefined', 
              endDateTime: endDateTime ? endDateTime.toString() : 'undefined',
              apptStartDate: apptStartDate ? apptStartDate.toString() : 'undefined', 
              apptEndDate: apptEndDate ? apptEndDate.toString() : 'undefined' 
            });
            continue; // Skip this appointment
          }
          
          // Wrap each format call in its own try/catch to prevent any single failure from crashing
          try {
            slotTimeStr = format(slotDateTime, 'HH:mm');
          } catch (formatErr) {
            console.error('Error formatting slotDateTime:', formatErr);
            slotTimeStr = 'invalid';
          }
          
          try {
            slotEndTimeStr = format(endDateTime, 'HH:mm');
          } catch (formatErr) {
            console.error('Error formatting endDateTime:', formatErr);
            slotEndTimeStr = 'invalid';
          }
          
          try {
            apptStartTimeStr = format(apptStartDate, 'HH:mm');
          } catch (formatErr) {
            console.error('Error formatting apptStartDate:', formatErr);
            apptStartTimeStr = 'invalid';
          }
          
          try {
            apptEndTimeStr = format(apptEndDate, 'HH:mm');
          } catch (formatErr) {
            console.error('Error formatting apptEndDate:', formatErr);
            apptEndTimeStr = 'invalid';
          }
          
          // If any of the time strings are invalid, skip this appointment
          if (slotTimeStr === 'invalid' || slotEndTimeStr === 'invalid' || 
              apptStartTimeStr === 'invalid' || apptEndTimeStr === 'invalid') {
            console.error('Could not format one or more times, skipping appointment check');
            continue;
          }
        } catch (err) {
          console.error('Error formatting times for comparison:', err);
          continue; // Skip this appointment if we can't properly format dates
        }
        
        // Check for time overlap regardless of date
        let isOverlapping = false;
        
        try {
          const slotTimeMinutes = hours * 60 + minutes;
          const slotEndMinutes = slotTimeMinutes + totalDuration;
          
          // Validate appointment date objects before accessing methods
          if (isNaN(apptStartDate.getTime()) || isNaN(apptEndDate.getTime())) {
            console.error('Invalid appointment date after earlier validation:', { 
              apptStartDate, 
              apptEndDate,
              apptStartString,
              apptEndString 
            });
            continue; // Skip this appointment
          }
          
          const apptStartMinutes = apptStartDate.getHours() * 60 + apptStartDate.getMinutes();
          const apptEndMinutes = apptEndDate.getHours() * 60 + apptEndDate.getMinutes();
          
          // Validate minute values
          if (apptStartMinutes < 0 || apptStartMinutes >= 24 * 60 || 
              apptEndMinutes < 0 || apptEndMinutes >= 24 * 60) {
            console.error('Invalid appointment minutes calculated:', { 
              apptStartMinutes, 
              apptEndMinutes 
            });
            continue; // Skip this appointment
          }
          
          isOverlapping = (
            (slotTimeMinutes < apptEndMinutes && slotEndMinutes > apptStartMinutes) ||
            (apptStartMinutes < slotEndMinutes && apptEndMinutes > slotTimeMinutes)
          );
          
          // Log any conflicts for debugging
          if (isOverlapping) {
            console.log(`Slot ${slotTimeStr}-${slotEndTimeStr} conflicts with appointment ${apptStartTimeStr}-${apptEndTimeStr}`);
            return false;
          }
        } catch (err) {
          console.error('Error comparing time slots:', err);
          continue; // Skip this appointment
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
      // If any error occurs during availability checking, mark the slot as unavailable
      console.error(`Error checking availability for slot ${time}:`, error);
      return false;
    }
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
            Duração total dos serviços: {formatDuration(totalDuration)}
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
                const slotDate = new Date(date!);
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
                extraClass = 'opacity-60 cursor-not-allowed relative';
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
                  <span className="flex items-center justify-center w-full">
                    {time}
                    {disabled && (
                      <span className="flex items-center ml-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3 mr-1" />Indisponível
                      </span>
                    )}
                  </span>
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

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedTime || isLoading || isError}>
          {isRescheduling ? "Confirmar Reagendamento" : "Próximo"}
        </Button>
      </div>
    </div>
  );
};

// Helper to normalize a date to local time, preserving only hours and minutes
function normalizeTimeForComparison(dateStr: string): { hours: number, minutes: number } {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.error('Invalid date string in normalizeTimeForComparison:', dateStr);
      return { hours: 0, minutes: 0 };
    }
    return {
      hours: date.getHours(),
      minutes: date.getMinutes()
    };
  } catch (err) {
    console.error('Error in normalizeTimeForComparison:', err);
    return { hours: 0, minutes: 0 };
  }
}

export default BookingTimeSlots;