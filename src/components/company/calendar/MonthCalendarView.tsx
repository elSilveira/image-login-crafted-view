
import React from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { AppointmentType } from "./types";
import { AppointmentCard } from "./AppointmentCard";
import { ptBR } from "date-fns/locale";

interface MonthCalendarViewProps {
  date: Date;
  appointments: AppointmentType[];
}

export const MonthCalendarView: React.FC<MonthCalendarViewProps> = ({ date, appointments }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const rows = [];
  let days = [];
  let day = startDate;
  
  // Create array of weeks and days
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }
  
  return (
    <div className="border rounded-md overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 bg-muted">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((dayName, index) => (
          <div key={index} className="p-2 text-center font-medium">
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="divide-y">
        {rows.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 divide-x">
            {week.map((day, dayIndex) => {
              const dayAppointments = appointments.filter(appointment => 
                isSameDay(new Date(appointment.start), day)
              );
              
              return (
                <div 
                  key={dayIndex} 
                  className={`min-h-[100px] p-1 ${
                    !isSameMonth(day, monthStart) ? "bg-muted/50" : ""
                  } ${isSameDay(day, new Date()) ? "bg-primary/10" : ""}`}
                >
                  <div className="text-right text-sm p-1">
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        view="month" 
                      />
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-muted-foreground px-1">
                        +{dayAppointments.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
