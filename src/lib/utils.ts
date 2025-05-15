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
  appointments: Array<{ startTime: string; endTime?: string }>;
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
    const [hours, minutes] = time.split(":").map(Number);
    const slotDateTime = new Date(date);
    slotDateTime.setHours(hours, minutes, 0, 0);
    const endDateTime = new Date(slotDateTime.getTime());
    endDateTime.setMinutes(endDateTime.getMinutes() + totalDuration);
    for (const appointment of appointments) {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(
        appointment.endTime || appointment.startTime
      );
      if (
        (slotDateTime <= appointmentEnd && endDateTime >= appointmentStart) ||
        (appointmentStart <= endDateTime && appointmentEnd >= slotDateTime)
      ) {
        return false;
      }
    }
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
  });
}
