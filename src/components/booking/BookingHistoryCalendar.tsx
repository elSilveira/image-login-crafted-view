
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BookingHistoryCalendarProps {
  status: "scheduled" | "completed" | "cancelled";
}

const BookingHistoryCalendar = ({ status }: BookingHistoryCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Mock data - in a real app this would come from an API
  const appointments = [
    {
      id: 1,
      service: "Corte de Cabelo Masculino",
      professional: "João Silva",
      date: "2025-05-15",
      time: "14:00",
      price: 80,
      status: "scheduled",
    },
    {
      id: 2,
      service: "Barba",
      professional: "João Silva",
      date: "2025-05-10",
      time: "15:30",
      price: 40,
      status: "scheduled",
    },
    {
      id: 3,
      service: "Coloração",
      professional: "Maria Santos",
      date: "2025-03-25",
      time: "10:00",
      price: 150,
      status: "completed",
    },
    {
      id: 4,
      service: "Manicure",
      professional: "Ana Oliveira",
      date: "2025-03-20",
      time: "16:00",
      price: 60,
      status: "completed",
    },
    {
      id: 5,
      service: "Pedicure",
      professional: "Ana Oliveira",
      date: "2025-03-15",
      time: "09:00",
      price: 80,
      status: "cancelled",
    }
  ].filter(appointment => appointment.status === status);
  
  // Function to check if a date has appointments
  const hasAppointment = (date: Date) => {
    return appointments.some(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getDate() === date.getDate() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getFullYear() === date.getFullYear();
    });
  };
  
  // Function to get appointments for the selected date
  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.getDate() === selectedDate.getDate() &&
             aptDate.getMonth() === selectedDate.getMonth() &&
             aptDate.getFullYear() === selectedDate.getFullYear();
    });
  };
  
  const selectedDateAppointments = getAppointmentsForSelectedDate();
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasAppointment: appointments.map(apt => new Date(apt.date)),
            }}
            modifiersStyles={{
              hasAppointment: { 
                backgroundColor: "rgb(229, 168, 169, 0.15)", 
                fontWeight: "bold",
                color: "#cc6677" 
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">
            {selectedDate ? (
              <>
                Agendamentos em{" "}
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </>
            ) : (
              "Selecione uma data"
            )}
          </h3>
          
          <ScrollArea className="h-[300px] pr-4">
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDateAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="p-3 border rounded-md hover:bg-iazi-background-alt transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{apt.service}</p>
                        <p className="text-sm text-muted-foreground">com {apt.professional}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                      <Badge className={
                        apt.status === "scheduled" ? "bg-iazi-primary" : 
                        apt.status === "completed" ? "bg-green-500" : 
                        "bg-red-500"
                      }>
                        {apt.status === "scheduled" ? "Agendado" : 
                         apt.status === "completed" ? "Concluído" : 
                         "Cancelado"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                {selectedDate ? "Nenhum agendamento nesta data" : "Selecione uma data para ver os agendamentos"}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistoryCalendar;
