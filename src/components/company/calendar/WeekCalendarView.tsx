
import React from "react";
import { format, addDays, startOfWeek, isSameDay, addHours, startOfDay } from "date-fns";
import { AppointmentType } from "./types";
import { AppointmentCard } from "./AppointmentCard";
import { ptBR } from "date-fns/locale";

interface WeekCalendarViewProps {
  date: Date;
  appointments: AppointmentType[];
}

export const WeekCalendarView: React.FC<WeekCalendarViewProps> = ({ date, appointments }) => {
  // Get the start of the week (Monday)
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  
  // Generate days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Generate time slots
  const timeSlots = [];
  const startTime = 8;
  const endTime = 20;
  
  for (let hour = startTime; hour <= endTime; hour++) {
    timeSlots.push(addHours(startOfDay(date), hour));
  }
  
  return (
    <div className="border rounded-md overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div>
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`p-2 text-center font-medium ${
                isSameDay(day, new Date()) ? "bg-primary/10" : "bg-muted"
              }`}
            >
              <div>{format(day, "EEE", { locale: ptBR })}</div>
              <div>{format(day, "dd")}</div>
            </div>
          ))}
        </div>
        
        {/* Time slots */}
        {timeSlots.map((time, timeIndex) => (
          <div key={timeIndex} className="grid grid-cols-8 border-b">
            <div className="p-2 border-r text-center text-sm">
              {format(time, "HH:mm")}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const cellDate = addHours(startOfDay(day), format(time, "H") as unknown as number);
              const cellAppointments = appointments.filter(appointment => {
                const appointmentStart = new Date(appointment.start);
                return isSameDay(appointmentStart, day) && 
                       format(appointmentStart, "HH") === format(time, "HH");
              });
              
              return (
                <div key={dayIndex} className="min-h-[60px] p-1 relative border-r">
                  {cellAppointments.map(appointment => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      view="week" 
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
