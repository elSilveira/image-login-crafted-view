// src/components/company/calendar/staff/StaffCalendarSidebar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { format, startOfDay, endOfDay, isToday, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { StaffMember, AppointmentStatus } from "@/components/company/calendar/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Removed mock import
// import { mockAppointments } from "@/components/company/calendar/mock-data";
import { BarChart, CalendarPlus, Clock, CheckCircle, XCircle, Terminal, Loader2 } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

// Re-use types (ideally share)
interface ApiAppointment {
  id: string;
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  status: AppointmentStatus;
  userId: string;
  professionalId: string;
  serviceId: string;
  companyId: string;
  user?: { id: string; name: string | null };
  service?: { id: string; name: string };
}

interface DisplayAppointment {
  id: string;
  start: Date;
  end: Date;
  status: ApiAppointment["status"];
  serviceName: string;
  clientName: string;
}

const adaptApiAppointment = (apiAppt: ApiAppointment): DisplayAppointment => ({
  id: apiAppt.id,
  start: new Date(apiAppt.startTime),
  end: new Date(apiAppt.endTime),
  status: apiAppt.status,
  serviceName: apiAppt.service?.name ?? "N/A",
  clientName: apiAppt.user?.name ?? "N/A",
});

interface StaffCalendarSidebarProps {
  staffMember: StaffMember;
  companyId: string;
}

export const StaffCalendarSidebar: React.FC<StaffCalendarSidebarProps> = ({
  staffMember,
  companyId,
}) => {
  const { toast } = useToast();
  const [todayAppointments, setTodayAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null); // Track appointment being updated
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const todayStart = startOfDay(today).toISOString();
  const todayEnd = endOfDay(today).toISOString();

  // Fetch today's appointments for this staff member
  useEffect(() => {
    if (!staffMember.id || !companyId) {
        setError("ID do profissional ou empresa não fornecido.");
        setIsLoading(false);
        return;
    }

    const fetchTodayAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          companyId: companyId,
          professionalId: staffMember.id,
          dateFrom: todayStart.substring(0, 10),
          dateTo: todayEnd.substring(0, 10),
          include: "user,service", // Include user and service for display
          limit: "100", // Fetch all for the day
        });

        const response = await fetch(`/api/appointments?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar agendamentos de hoje`);
        }
        const result = await response.json();
        const data: ApiAppointment[] = result.data ?? [];

        if (!data) {
          throw new Error("Resposta inválida da API");
        }

        const adaptedData = data.map(adaptApiAppointment);
        // Sort by start time
        adaptedData.sort((a, b) => a.start.getTime() - b.start.getTime());
        setTodayAppointments(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar agendamentos de hoje:", err);
        setError(err.message || "Erro ao carregar agendamentos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayAppointments();
  }, [staffMember.id, companyId, todayStart, todayEnd]);

  // Calculate statistics based on fetched data
  const stats = useMemo(() => {
    const total = todayAppointments.length;
    const completed = todayAppointments.filter(a => a.status === "COMPLETED").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const next = todayAppointments.find(
      a => a.start > today && (a.status === "CONFIRMED" || a.status === "PENDING")
    );
    return { total, completed, percentage, next };
  }, [todayAppointments, today]);

  // Function to handle status update (e.g., Start, Complete, Cancel)
  const handleUpdateStatus = async (appointmentId: string, newStatus: AppointmentStatus) => {
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
        let errorMsg = `Erro ao atualizar status para ${newStatus}`;
        try {
            const errorData = await response.json();
            errorMsg = errorData.message || errorMsg;
        } catch (e) { /* ignore */ }
        throw new Error(errorMsg);
      }

      // Update the appointment list locally
      setTodayAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );
      toast({ title: "Sucesso", description: `Status do agendamento atualizado para ${newStatus}.` });

    } catch (err: any) {
      console.error(`Erro ao atualizar status para ${newStatus}:`, err);
      toast({ variant: "destructive", title: "Erro", description: err.message || "Falha ao atualizar status." });
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Get status color (simplified)
  const getStatusBadgeVariant = (status: AppointmentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "CONFIRMED": return "default"; // Or a specific color like blue
      case "PENDING": return "secondary"; // Yellowish
      case "COMPLETED": return "outline"; // Greenish/Purplish
      case "CANCELLED":
      case "NO_SHOW": return "destructive"; // Red
      default: return "outline";
    }
  };

  const getStatusLabel = (status: AppointmentStatus): string => {
      const labels: Record<AppointmentStatus, string> = {
          PENDING: "Pendente",
          CONFIRMED: "Confirmado",
          COMPLETED: "Concluído",
          CANCELLED: "Cancelado",
          NO_SHOW: "Não Compareceu"
      };
      return labels[status] || status;
  }

  return (
    <div className="space-y-4">
      {/* Loading/Error State for the whole sidebar */} 
      {isLoading && (
          <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
          </div>
      )}
      {error && (
          <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar Dados</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
          </Alert>
      )}

      {!isLoading && !error && (
        <>
          {/* Current Status Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status de Hoje</CardTitle>
              <CardDescription>
                {format(today, "dd MMMM, yyyy", { locale: ptBR })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <div>Serviços concluídos</div>
                <div className="font-medium">{stats.completed}/{stats.total}</div>
              </div>
              <Progress value={stats.percentage} className="h-2" />
            </CardContent>
            {/* Footer might be removed or repurposed */}
            {/* <CardFooter className="pt-0 flex justify-between">
              <Button variant="outline" size="sm" disabled>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar Próximo como Concluído
              </Button>
            </CardFooter> */}
          </Card>

          {/* Next Appointment Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Próximo Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.next ? (
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm truncate" title={stats.next.serviceName}>{stats.next.serviceName}</h4>
                    <Badge variant={getStatusBadgeVariant(stats.next.status)} className="text-xs">
                      {getStatusLabel(stats.next.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 truncate" title={stats.next.clientName}>
                    Cliente: {stats.next.clientName}
                  </div>
                  <div className="flex items-center mt-2 text-sm">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>
                      {format(stats.next.start, "HH:mm")} -
                      {format(stats.next.end, "HH:mm")}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {/* Example buttons - adjust logic as needed */}
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleUpdateStatus(stats.next!.id, "COMPLETED")} // Example: Mark as completed
                      disabled={isUpdatingStatus === stats.next.id}
                    >
                      {isUpdatingStatus === stats.next.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                      Concluir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleUpdateStatus(stats.next!.id, "CANCELLED")} // Example: Cancel
                      disabled={isUpdatingStatus === stats.next.id}
                    >
                      {isUpdatingStatus === stats.next.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <XCircle className="mr-2 h-4 w-4" />}
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-6">
                  Não há mais agendamentos para hoje
                </div>
              )}
            </CardContent>
          </Card>

          {/* Productivity Card (Placeholder/Future) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Produtividade</CardTitle>
              <CardDescription>
                (Em breve)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              Estatísticas mensais aparecerão aqui.
              {/* <div className="flex justify-between">
                <div>Serviços realizados</div>
                <div className="font-medium">--</div>
              </div>
              <div className="flex justify-between">
                <div>Avaliação média</div>
                <div className="font-medium">--</div>
              </div> */}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full" disabled>
                <BarChart className="mr-2 h-4 w-4" />
                Ver estatísticas detalhadas
              </Button>
            </CardFooter>
          </Card>

          {/* Availability Actions (Placeholder/Future) */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                <CalendarPlus className="mr-2 h-4 w-4" />
                Gerenciar Folgas / Bloqueios
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

