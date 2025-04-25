
import React from "react";
import { format, addHours, startOfDay, isSameDay } from "date-fns";
import { AppointmentType } from "./types";
import { AppointmentCard } from "./AppointmentCard";

interface DayCalendarViewProps {
  date: Date;
  appointments: AppointmentType[];
}

export const DayCalendarView: React.FC<DayCalendarViewProps> = ({ date, appointments }) => {
  // Filter appointments for this specific day
  const dayAppointments = appointments.filter(appointment => 
    isSameDay(new Date(appointment.start), date)
  );
  
  // Generate time slots for the day (from 8:00 to 20:00)
  const timeSlots = [];
  const startTime = 8;
  const endTime = 20;
  
  for (let hour = startTime; hour <= endTime; hour++) {
    timeSlots.push(addHours(startOfDay(date), hour));
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 text-center font-medium">
        {format(date, "EEEE, d MMMM yyyy")}
      </div>
      <div className="divide-y">
        {timeSlots.map((time, index) => {
          const slotAppointments = dayAppointments.filter(appointment => 
            format(new Date(appointment.start), "HH") === format(time, "HH")
          );
          
          return (
            <div key={index} className="flex">
              <div className="w-16 p-2 border-r text-center text-sm">
                {format(time, "HH:mm")}
              </div>
              <div className="flex-1 min-h-[60px] p-1 relative">
                {slotAppointments.map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} view="day" />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
