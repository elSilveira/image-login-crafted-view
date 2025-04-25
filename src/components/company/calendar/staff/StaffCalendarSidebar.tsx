
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { StaffMember, AppointmentStatus } from "@/components/company/calendar/types";
import { mockAppointments } from "@/components/company/calendar/mock-data";
import { BarChart, CalendarPlus, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface StaffCalendarSidebarProps {
  staffMember: StaffMember;
}

export const StaffCalendarSidebar: React.FC<StaffCalendarSidebarProps> = ({
  staffMember,
}) => {
  const today = new Date();
  
  // Filter appointments for this staff member
  const staffAppointments = mockAppointments.filter(
    appointment => appointment.staffId === staffMember.id
  );
  
  // Get today's appointments
  const todayAppointments = staffAppointments.filter(appointment => 
    format(new Date(appointment.start), 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
  );
  
  // Calculate statistics
  const totalAppointments = todayAppointments.length;
  const completedAppointments = todayAppointments.filter(
    appointment => appointment.status === 'completed'
  ).length;
  const completionPercentage = totalAppointments > 0 
    ? Math.round((completedAppointments / totalAppointments) * 100) 
    : 0;
  
  // Next appointment
  const nextAppointment = todayAppointments.find(
    appointment => new Date(appointment.start) > today && 
    (appointment.status === 'confirmed' || appointment.status === 'pending')
  );
  
  // Get status color
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Current Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Status Atual</CardTitle>
          <CardDescription>
            {format(today, "dd 'de' MMMM, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <div>Serviços completados</div>
            <div className="font-medium">{completedAppointments}/{totalAppointments}</div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <Button variant="outline" size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Marcar Próximo como Concluído
          </Button>
        </CardFooter>
      </Card>
      
      {/* Next Appointment Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Próximo Agendamento</CardTitle>
        </CardHeader>
        <CardContent>
          {nextAppointment ? (
            <div className="border rounded-lg p-3">
              <div className="flex justify-between">
                <h4 className="font-medium">{nextAppointment.serviceName}</h4>
                <Badge variant="outline" className={getStatusColor(nextAppointment.status)}>
                  {nextAppointment.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Cliente: {nextAppointment.clientName}
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                <span>
                  {format(new Date(nextAppointment.start), "HH:mm")} - 
                  {format(new Date(nextAppointment.end), "HH:mm")}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
                <Button size="sm" variant="outline" className="w-full">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6">
              Não há mais agendamentos para hoje
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Productivity Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Produtividade</CardTitle>
          <CardDescription>
            Este mês
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <div>Serviços realizados</div>
            <div className="font-medium">42</div>
          </div>
          <div className="flex justify-between">
            <div>Tempo médio</div>
            <div className="font-medium">45 min</div>
          </div>
          <div className="flex justify-between">
            <div>Avaliação média</div>
            <div className="font-medium">4.8/5</div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full">
            <BarChart className="mr-2 h-4 w-4" />
            Ver estatísticas detalhadas
          </Button>
        </CardFooter>
      </Card>
      
      {/* Availability Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Disponibilidade</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Solicitar Folga ou Ausência
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
