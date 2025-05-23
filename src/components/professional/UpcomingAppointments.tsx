import React from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AppointmentType {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  service: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
  };
}

interface UpcomingAppointmentsProps {
  appointments: AppointmentType[];
  isLoading: boolean;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ 
  appointments, 
  isLoading 
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Próximos Agendamentos</h3>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-iazi-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Carregando agendamentos...</span>
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">Nenhum agendamento próximo</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{appointment.service?.name || 'Serviço não disponível'}</p>
                <p className="text-sm text-muted-foreground">
                  {format(parseISO(appointment.startTime), "eee, dd/MM 'às' HH:mm", { locale: ptBR })}
                </p>
                <p className="text-xs text-muted-foreground">{appointment.user?.name || 'Cliente não identificado'}</p>
              </div>
              <Badge 
                variant="outline" 
                className={appointment.status.toLowerCase() === "pending" ? 
                  'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }
              >
                {appointment.status.toLowerCase() === "pending" ? 'Pendente' : 'Confirmado'}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default UpcomingAppointments; 