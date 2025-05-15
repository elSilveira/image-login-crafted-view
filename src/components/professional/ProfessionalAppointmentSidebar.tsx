import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  CalendarPlus, 
  Clock, 
  User, 
  Briefcase, 
  Check, 
  X, 
  Terminal, 
  Loader2,
  Calendar
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import apiClient from "@/lib/api";
import { API_BASE_URL } from "@/lib/api-config";

// Define the structure expected from the API for an appointment
interface ApiAppointment {
  id: string;
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  status: "confirmed" | "pending" | "in-progress" | "completed" | "cancelled" | "no-show";
  notes?: string | null;
  userId: string;
  professionalId: string;
  serviceId: string;
  companyId: string;
  // Include related data needed for display
  user?: { id: string; name: string | null; email?: string; phone?: string };
  professional?: { id: string; name: string };
  service?: { id: string; name: string; duration?: string; price?: number };
}

// Define the structure needed for display
interface DisplayAppointment {
  id: string;
  start: Date;
  end: Date;
  status: ApiAppointment["status"];
  serviceName: string;
  clientName: string;
  notes?: string;
  duration?: string;
  price?: number;
}

// Adapt API appointment data for display
const adaptApiAppointment = (apiAppt: ApiAppointment): DisplayAppointment => ({
  id: apiAppt.id,
  start: new Date(apiAppt.startTime),
  end: new Date(apiAppt.endTime),
  status: apiAppt.status,
  serviceName: apiAppt.service?.name ?? "Serviço não encontrado",
  clientName: apiAppt.user?.name ?? "Cliente não encontrado",
  notes: apiAppt.notes || undefined,
  duration: apiAppt.service?.duration,
  price: apiAppt.service?.price
});

interface ProfessionalAppointmentSidebarProps {
  // Optionally add props for opening modals if needed
}

const ProfessionalAppointmentSidebar = ({}: ProfessionalAppointmentSidebarProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const professionalId = user?.professionalId;
  
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null); // Store ID of appointment being updated
  const [error, setError] = useState<string | null>(null);

  const todayDate = new Date();
  const todayStart = startOfDay(todayDate).toISOString();
  const todayEnd = endOfDay(todayDate).toISOString();

  // Fetch today's appointments for the professional
  useEffect(() => {
    if (!professionalId) {
      setError("ID do profissional não disponível.");
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {        const queryParams = new URLSearchParams({
          professionalId: professionalId,
          dateFrom: todayStart.substring(0, 10), // YYYY-MM-DD
          dateTo: todayEnd.substring(0, 10),     // YYYY-MM-DD
          include: "user,service", // Include related data
          sort: "startTime_asc"    // Sort by start time
        });

        const response = await apiClient.get(`/appointments?${queryParams.toString()}`);
        const result = response.data;
        const data: ApiAppointment[] = result.data ?? [];
        
        if (!data) {
          throw new Error("Resposta inválida da API");
        }
        
        const adaptedData = data.map(adaptApiAppointment);
        setAppointments(adaptedData);
      } catch (err: any) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(err.message || "Erro ao carregar agendamentos.");
        setAppointments([]); // Clear appointments on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [professionalId, todayStart, todayEnd]);

  // Update appointment status (confirm/complete/cancel)
  const updateAppointmentStatus = async (appointmentId: string, newStatus: ApiAppointment["status"]) => {
    if (isUpdatingStatus) return; // Prevent multiple simultaneous updates
    
    setIsUpdatingStatus(appointmentId);      try {
      // Use proper API endpoint with 3002 port via apiClient
      const response = await apiClient.patch(`/appointments/${appointmentId}/status`, { 
        status: newStatus 
      });

      const result = response.data;
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appt => 
          appt.id === appointmentId 
            ? { ...appt, status: newStatus } 
            : appt
        )
      );

      toast({
        title: "Status atualizado",
        description: `O agendamento foi marcado como "${
          newStatus === 'confirmed' ? 'confirmado' : 
          newStatus === 'completed' ? 'concluído' : 
          newStatus === 'cancelled' ? 'cancelado' : 
          newStatus === 'in-progress' ? 'em andamento' : 
          newStatus
        }"`,
        variant: "default"
      });

    } catch (error: any) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o status do agendamento.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingStatus(null);
    }
  };
  // Get status badge style
  const getStatusBadge = (status: ApiAppointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">Em andamento</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-800">Concluído</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      case "no-show":
        return <Badge className="bg-gray-100 text-gray-800">Não compareceu</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const renderAppointmentActions = (appointment: DisplayAppointment) => {
    // Show different actions based on current status
    switch (appointment.status) {
      case "pending":
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
              onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
              disabled={isUpdatingStatus === appointment.id}
            >
              {isUpdatingStatus === appointment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
              Confirmar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
              disabled={isUpdatingStatus === appointment.id}
            >
              {isUpdatingStatus === appointment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
              Cancelar
            </Button>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
              onClick={() => updateAppointmentStatus(appointment.id, "in-progress")}
              disabled={isUpdatingStatus === appointment.id}
            >
              {isUpdatingStatus === appointment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4 mr-1" />}
              Iniciar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
              disabled={isUpdatingStatus === appointment.id}
            >
              {isUpdatingStatus === appointment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
              Cancelar
            </Button>
          </div>
        );
      case "in-progress":
        return (
          <div className="flex">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800"
              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
              disabled={isUpdatingStatus === appointment.id}
            >
              {isUpdatingStatus === appointment.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
              Concluir
            </Button>
          </div>
        );
      case "completed":
      case "cancelled":
      case "no-show":
        // No actions for these statuses
        return null;
      default:
        return null;
    }
  };

  // Render the component
  return (
    <Card className="bg-card h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Agendamentos de hoje
        </CardTitle>
        <CardDescription>
          {format(todayDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : appointments.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Não há agendamentos para hoje.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-md p-3 bg-background">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{appointment.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(appointment.start, "HH:mm")} - {format(appointment.end, "HH:mm")}
                    </p>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm">{appointment.clientName}</span>
                </div>
                
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {appointment.notes}
                  </p>
                )}
                
                {renderAppointmentActions(appointment)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfessionalAppointmentSidebar;
