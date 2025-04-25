
import React from "react";
import { format, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { AppointmentType } from "./types";
import { AppointmentCard } from "./AppointmentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ListCalendarViewProps {
  date: Date;
  appointments: AppointmentType[];
}

export const ListCalendarView: React.FC<ListCalendarViewProps> = ({ date, appointments }) => {
  // Filter for today's appointments
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.start);
    return isWithinInterval(appointmentDate, {
      start: todayStart,
      end: todayEnd
    });
  });
  
  // Filter for upcoming appointments (not including today)
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.start);
    return appointmentDate > todayEnd;
  });
  
  // Sort appointments by start time
  const sortedTodayAppointments = [...todayAppointments].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  
  const sortedUpcomingAppointments = [...upcomingAppointments].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return (
    <div className="border rounded-md overflow-hidden">
      <Tabs defaultValue="today">
        <TabsList className="w-full">
          <TabsTrigger value="today" className="flex-1">
            Hoje
            <span className="ml-2 text-xs bg-primary/20 rounded-full px-2 py-0.5">
              {todayAppointments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex-1">
            Próximos
            <span className="ml-2 text-xs bg-primary/20 rounded-full px-2 py-0.5">
              {upcomingAppointments.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            Todos
            <span className="ml-2 text-xs bg-primary/20 rounded-full px-2 py-0.5">
              {appointments.length}
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="p-0">
          <div className="divide-y">
            {sortedTodayAppointments.length > 0 ? (
              sortedTodayAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  view="list" 
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Não há agendamentos para hoje
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="upcoming" className="p-0">
          <div className="divide-y">
            {sortedUpcomingAppointments.length > 0 ? (
              sortedUpcomingAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  view="list" 
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Não há próximos agendamentos
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="p-0">
          <div className="divide-y">
            {appointments.length > 0 ? (
              appointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  view="list" 
                />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Não há agendamentos registrados
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
