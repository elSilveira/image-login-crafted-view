import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to generate time slots every N minutes (copied from BookingTimeSlots)
export function generateTimeSlots(start: string, end: string, interval: number) {
  const times: string[] = [];
  let [sh, sm] = start.split(":").map(Number);
  let [eh, em] = end.split(":").map(Number);
  const current = new Date();
  current.setHours(sh, sm, 0, 0);
  const endDate = new Date();
  endDate.setHours(eh, em, 0, 0);
  while (current <= endDate) {
    times.push(
      current.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
    current.setMinutes(current.getMinutes() + interval);
  }
  return times;
}

// Utility to get available slots for a date, given appointments, schedule, and total duration
export function getAvailableSlotsForDate({
  date,
  appointments,
  serviceSchedule,
  totalDuration,
}: {
  date: Date;
  appointments: Array<any>; // More flexible typing to handle different appointment formats
  serviceSchedule: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  totalDuration: number;
}): string[] {
  if (!date || !serviceSchedule) return [];
  
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  
  const dayKey = days[date.getDay()];
  const slotDef = serviceSchedule.find((s) => s.dayOfWeek === dayKey);
  
  if (!slotDef) return [];
  
  const allSlots = generateTimeSlots(slotDef.startTime, slotDef.endTime, 30);
  
  return allSlots.filter((time) => {
    try {
      const [hours, minutes] = time.split(":").map(Number);
      const slotDateTime = new Date(date);
      slotDateTime.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(slotDateTime.getTime());
      endDateTime.setMinutes(endDateTime.getMinutes() + totalDuration);
      
      // Check for conflicts with existing appointments
      for (const appointment of appointments) {
        try {
          // Handle appointment with standard startTime/endTime
          if (appointment.startTime) {
            let appointmentStart, appointmentEnd;
            
            try {
              appointmentStart = new Date(appointment.startTime);
              
              // Determine appointment end time
              if (appointment.endTime) {
                appointmentEnd = new Date(appointment.endTime);
              } else if (appointment.duration) {
                // If we have a duration but no endTime, calculate it
                appointmentEnd = new Date(appointmentStart.getTime() + 
                  parseDurationToMinutes(appointment.duration) * 60000);
              } else if (Array.isArray(appointment.services) && appointment.services.length > 0) {
                // Calculate from services
                let servicesTotalDuration = 0;
                for (const svc of appointment.services) {
                  servicesTotalDuration += parseDurationToMinutes(
                    svc.duration || svc.service?.duration || 30
                  );
                }
                appointmentEnd = new Date(
                  appointmentStart.getTime() + servicesTotalDuration * 60000
                );
              } else if (appointment.service?.duration) {
                // Single service duration
                const serviceDuration = parseDurationToMinutes(appointment.service.duration);
                appointmentEnd = new Date(
                  appointmentStart.getTime() + serviceDuration * 60000
                );
              } else {
                // Default to 30min if no duration info found
                appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60000);
              }
              
              // Check for overlap
              if (
                (slotDateTime <= appointmentEnd && endDateTime >= appointmentStart) ||
                (appointmentStart <= endDateTime && appointmentEnd >= slotDateTime)
              ) {
                return false;
              }
            } catch (err) {
              console.error("Error processing appointment times:", appointment);
              // Skip this appointment if dates are invalid
              continue;
            }
          }
        } catch (err) {
          console.error("Error checking appointment:", appointment);
          // Skip problematic appointment
          continue;
        }
      }
      
      // Check if service would exceed work day
      if (serviceSchedule) {
        const slotDef = serviceSchedule.find((s) => s.dayOfWeek === dayKey);
        if (slotDef) {
          const [endHours, endMinutes] = slotDef.endTime.split(":").map(Number);
          const workDayEnd = new Date(date);
          workDayEnd.setHours(endHours, endMinutes, 0, 0);
          
          if (endDateTime > workDayEnd) {
            return false;
          }
        }
      }
      
      return true;
    } catch (err) {
      console.error("Error checking availability for slot:", time, err);
      return false;
    }
  });
}

/**
 * Format a duration in minutes to a human-readable format
 * @param duration Duration in minutes or string format
 * @returns Formatted string like "1h 30min", "45min", or "2h"
 */
export function formatDuration(duration?: number | string): string {
  if (duration === undefined || duration === null) return "N/A";

  let minutes: number;

  if (typeof duration === "string") {
    if (!duration.trim()) return "N/A";

    // First try to parse as a numeric string
    minutes = parseInt(duration, 10);

    // If not a direct number, try parsing with regex
    if (isNaN(minutes)) {
      minutes = parseDurationToMinutes(duration);
    }
  } else {
    minutes = duration;
  }

  if (isNaN(minutes) || minutes < 0) return "N/A";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h > 0 && m > 0) {
    return `${h}h ${m}min`;
  } else if (h > 0) {
    return `${h}h`;
  } else if (m > 0) {
    return `${m}min`;
  } else {
    return "N/A";
  }
}

/**
 * Parse a duration string to minutes
 * Handles formats like "30min", "1h", "1h 30min", "90" etc.
 * @param duration Duration string or object with duration property
 * @returns Number of minutes
 */
export function parseDurationToMinutes(
  duration: string | number | any
): number {
  // Handle undefined, null or empty
  if (!duration) return 0;

  // Direct number value
  if (typeof duration === "number") {
    return duration > 0 ? duration : 0;
  }

  // Handle service objects that contain duration property
  if (typeof duration === "object" && duration !== null) {
    if ("duration" in duration && duration.duration !== undefined) {
      return parseDurationToMinutes(duration.duration);
    }
    return 0;
  }

  // Handle string values
  if (typeof duration === "string") {
    try {
      // Handle empty strings
      if (!duration.trim()) return 0;

      // Try direct numeric string conversion
      if (!isNaN(parseInt(duration))) {
        const parsed = parseInt(duration, 10);
        return parsed > 0 && parsed <= 1440 ? parsed : 0;
      }

      // Parse duration format like '1h30min'
      const minMatch = duration.match(/(\d+)\s*min/);
      const hourMatch = duration.match(/(\d+)\s*h/);
      const min = minMatch ? parseInt(minMatch[1], 10) : 0;
      const hour = hourMatch ? parseInt(hourMatch[1], 10) : 0;

      // If no patterns matched, try as plain number (e.g., "75")
      if (!min && !hour) {
        const onlyNum = duration.match(/(\d+)/);
        if (onlyNum) return parseInt(onlyNum[1], 10);
      }

      // Reasonable limit check (24h max)
      const totalMinutes = hour * 60 + min;
      return totalMinutes >= 0 && totalMinutes <= 1440 ? totalMinutes : 0;
    } catch (err) {
      console.error("Error parsing duration string:", duration);
      return 0;
    }
  }

  return 0;
}
