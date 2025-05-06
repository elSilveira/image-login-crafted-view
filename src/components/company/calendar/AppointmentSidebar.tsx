// src/components/company/calendar/AppointmentSidebar.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale"; // Import locale for formatting
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Removed mock import
// import { mockTodayAppointments } from "./mock-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarPlus, Clock, User, Briefcase, Check, X, Terminal, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Define the structure expected from the API for an appointment
interface ApiAppointment {
  id: string;
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string | null;
  userId: string;
  professionalId: string;
  serviceId: string;
  companyId: string;
  // Include related data needed for display
  user?: { id: string; name: string | null };
  professional?: { id: string; name: string };
  service?: { id: string; name: string };
}

// Define the structure needed for display
interface DisplayAppointment {
  id: string;
  start: Date;
  end: Date;
  status: ApiAppointment["status"];
  serviceName: string;
  clientName: string;
  staffName: string;
}

// Adapt API appointment data
const adaptApiAppointment = (apiAppt: ApiAppointment): DisplayAppointment => ({
  id: apiAppt.id,
  start: new Date(apiAppt.startTime),
  end: new Date(apiAppt.endTime),
  status: apiAppt.status,
  serviceName: apiAppt.service?.name ?? "Serviço não encontrado",
  clientName: apiAppt.user?.name ?? "Cliente não encontrado",
  staffName: apiAppt.professional?.name ?? "Profissional não encontrado",
});

interface AppointmentSidebarProps {
    companyId: string; // Assuming companyId is available in the context/page
    // Add props for opening modals if needed
    // onNewAppointmentClick: () => void;
    // onBlockTimeClick: () => void;
}

export const AppointmentSidebar = ({ companyId }: AppointmentSidebarProps) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null); // Store ID of appointment being updated
  const [error, setError] = useState<string | null>(null);

  const todayDate = new Date();
  const todayStart = startOfDay(todayDate).toISOString();
  const todayEnd = endOfDay(todayDate).toISOString();

  // Fetch today's appointments
  useEffect(() => {
    if (!companyId) {
        setError("ID da empresa não fornecido.");
        setIsLoading(false);
        return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          companyId: companyId,
          dateFrom: todayStart.substring(0, 10), // YYYY-MM-DD
          dateTo: todayEnd.substring(0, 10),     // YYYY-MM-DD
          include: "user,professional,service", // Include related data
          // Add limit if needed, e.g., limit: "50"
          // Add sort if needed, e.g., sort: "startTime_asc"
        });

        const response = await fetch(`/api/appointments?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar agendamentos`);
        }
        // Assuming API returns { data: [...] } structure
        const result = await response.json();
        const data: ApiAppointment[] = result.data ?? [];

        if (!data) {
          throw new Error("Resposta inválida da API de agendamentos");
        }

        const adaptedData = data.map(adaptApiAppointment);
        // Sort by start time client-side if not done by API
        adaptedData.sort((a, b) => a.start.getTime() - b.start.getTime());
        setAppointments(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(err.message || "Erro ao carregar agendamentos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [companyId, todayStart, todayEnd]); // Re-fetch if companyId changes

  // Function to handle status update (Confirm/Cancel)
  const handleUpdateStatus = async (appointmentId: string, newStatus: "CONFIRMED" | "CANCELLED") => {
    setIsUpdatingStatus(appointmentId);
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Add auth headers
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        let errorMsg = `Erro ao ${newStatus === "CONFIRMED" ? "confirmar" : "cancelar"} agendamento`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (e) { /* ignore */ }
        throw new Error(errorMsg);
      }

      // Update the appointment list locally
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      toast({ title: "Sucesso", description: `Agendamento ${newStatus === "CONFIRMED" ? "confirmado" : "cancelado"}.` });

    } catch (err: any) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err);
      toast({ variant: "destructive", title: "Erro", description: err.message || "Falha ao atualizar status." });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Agendamentos de Hoje</CardTitle>
          <CardDescription>
            {format(todayDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Button className="w-full mb-4" disabled> {/* TODO: Implement onNewAppointmentClick */}
            <CalendarPlus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>

          {isLoading && (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {!isLoading && error && (
            <Alert variant="destructive" className="my-4">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1"> {/* Added scroll */} 
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm truncate" title={appointment.serviceName}>{appointment.serviceName}</h4>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>
                            {format(appointment.start, "HH:mm")} -
                            {format(appointment.end, "HH:mm")}
                          </span>
                        </div>
                      </div>

                      {/* Show buttons only for PENDING status */} 
                      {appointment.status === "PENDING" && (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-green-600 hover:text-green-700"
                            onClick={() => handleUpdateStatus(appointment.id, "CONFIRMED")}
                            disabled={isUpdatingStatus === appointment.id}
                            title="Confirmar"
                          >
                            {isUpdatingStatus === appointment.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <Check className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-600 hover:text-red-700"
                            onClick={() => handleUpdateStatus(appointment.id, "CANCELLED")}
                            disabled={isUpdatingStatus === appointment.id}
                            title="Cancelar"
                          >
                             {isUpdatingStatus === appointment.id ? <Loader2 className="h-3 w-3 animate-spin"/> : <X className="h-3 w-3" />}
                          </Button>
                        </div>
                      )}
                      {/* Optionally display other statuses */} 
                       {appointment.status === "CONFIRMED" && <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">Confirmado</Badge>}
                       {appointment.status === "COMPLETED" && <Badge variant="outline" className="text-xs text-green-600 border-green-600">Concluído</Badge>}
                       {appointment.status === "CANCELLED" && <Badge variant="destructive" className="text-xs">Cancelado</Badge>}
                       {appointment.status === "NO_SHOW" && <Badge variant="destructive" className="text-xs">Não Compareceu</Badge>}
                    </div>

                    <div className="mt-2 flex items-center text-xs text-muted-foreground truncate">
                      <User className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span title={appointment.clientName}>{appointment.clientName}</span>
                    </div>

                    <div className="mt-1 flex items-center text-xs text-muted-foreground truncate">
                      <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span title={appointment.staffName}>{appointment.staffName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground text-sm py-6">
                  Não há agendamentos para hoje
                </div>
              )}
            </div>
          )}
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
          <Button variant="outline" className="w-full" disabled> {/* TODO: Implement onBlockTimeClick */}
            <Clock className="mr-2 h-4 w-4" />
            Bloquear Horário
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

