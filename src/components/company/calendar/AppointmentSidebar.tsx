
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { mockTodayAppointments } from "./mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarPlus, Clock, User, Briefcase, Check, X } from "lucide-react";

export const AppointmentSidebar = () => {
  const todayDate = new Date();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Agendamentos de Hoje</CardTitle>
          <CardDescription>
            {format(todayDate, "dd 'de' MMMM, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Button className="w-full mb-4">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
          
          <div className="space-y-3">
            {mockTodayAppointments.length > 0 ? (
              mockTodayAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-sm">{appointment.serviceName}</h4>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          {format(new Date(appointment.start), "HH:mm")} - 
                          {format(new Date(appointment.end), "HH:mm")}
                        </span>
                      </div>
                    </div>
                    
                    {appointment.status === "pending" && (
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    <span>{appointment.clientName}</span>
                  </div>
                  
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3 mr-1" />
                    <span>{appointment.staffName}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground text-sm py-6">
                Não há agendamentos para hoje
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Adicionar Bloqueio</CardTitle>
          <CardDescription>
            Bloqueie horários para intervalo ou indisponibilidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <Clock className="mr-2 h-4 w-4" />
            Bloquear Horário
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
