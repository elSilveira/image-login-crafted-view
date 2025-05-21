import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Users, CreditCard, Calendar, Loader2, AlertCircle } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  fetchProfessionalDashboardStats,
  fetchUpcomingAppointments,
  fetchPopularServices
} from "@/lib/api";

// Tipo para as estatísticas do dashboard
interface DashboardStats {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  currentMonthAppointments: number;
  previousMonthAppointments: number;
  currentMonthNewClients: number;
  previousMonthNewClients: number;
}

// Tipo para os agendamentos
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

// Tipo para serviços populares
interface PopularServiceType {
  id: string;
  name: string;
  appointmentCount: number;
  rating: number;
}

const ProfessionalDashboard = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId;
  
  // Estados para armazenar os dados
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [popularServices, setPopularServices] = useState<PopularServiceType[]>([]);
  
  // Estados de carregamento e erro
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Função para calcular a variação percentual
  const calculatePercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };
  
  // Buscar estatísticas do dashboard
  useEffect(() => {
    const fetchStats = async () => {
      if (!professionalId) {
        setError("ID do profissional não disponível");
        setIsLoadingStats(false);
        return;
      }
      
      try {
        const data = await fetchProfessionalDashboardStats(professionalId);
        setStats(data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
        setError("Erro ao carregar estatísticas do dashboard");
      } finally {
        setIsLoadingStats(false);
      }
    };
    
    fetchStats();
  }, [professionalId]);
  
  // Buscar próximos agendamentos
  useEffect(() => {
    const fetchNextAppointments = async () => {
      if (!professionalId) {
        setIsLoadingAppointments(false);
        return;
      }
      
      try {
        const data = await fetchUpcomingAppointments(professionalId);
        setAppointments(data);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
      } finally {
        setIsLoadingAppointments(false);
      }
    };
    
    fetchNextAppointments();
  }, [professionalId]);
  
  // Buscar serviços populares
  useEffect(() => {
    const fetchServices = async () => {
      if (!professionalId) {
        setIsLoadingServices(false);
        return;
      }
      
      try {
        const data = await fetchPopularServices(professionalId);
        setPopularServices(data);
      } catch (err) {
        console.error("Erro ao buscar serviços populares:", err);
      } finally {
        setIsLoadingServices(false);
      }
    };
    
    fetchServices();
  }, [professionalId]);
  
  // Verificar se todos os dados foram carregados
  const isLoading = isLoadingStats || isLoadingAppointments || isLoadingServices;
  
  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-iazi-primary" />
          <span className="ml-2 text-muted-foreground">Carregando dados do dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-tight">Faturamento</h3>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                R$ {stats?.currentMonthRevenue.toLocaleString('pt-BR') || '0'}
              </div>
              {stats && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`inline-flex items-center ${
                    calculatePercentageChange(stats.currentMonthRevenue, stats.previousMonthRevenue) >= 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}>
                    {calculatePercentageChange(stats.currentMonthRevenue, stats.previousMonthRevenue) >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(calculatePercentageChange(stats.currentMonthRevenue, stats.previousMonthRevenue))}%
                  </span>{" "}
                  em relação ao mês passado
                </p>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-tight">Agendamentos</h3>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {stats?.currentMonthAppointments || '0'}
              </div>
              {stats && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`inline-flex items-center ${
                    calculatePercentageChange(stats.currentMonthAppointments, stats.previousMonthAppointments) >= 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}>
                    {calculatePercentageChange(stats.currentMonthAppointments, stats.previousMonthAppointments) >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(calculatePercentageChange(stats.currentMonthAppointments, stats.previousMonthAppointments))}%
                  </span>{" "}
                  em relação ao mês passado
                </p>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium tracking-tight">Novos Clientes</h3>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">
                {stats?.currentMonthNewClients || '0'}
              </div>
              {stats && (
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={`inline-flex items-center ${
                    calculatePercentageChange(stats.currentMonthNewClients, stats.previousMonthNewClients) >= 0
                      ? 'text-emerald-500'
                      : 'text-rose-500'
                  }`}>
                    {calculatePercentageChange(stats.currentMonthNewClients, stats.previousMonthNewClients) >= 0 ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(calculatePercentageChange(stats.currentMonthNewClients, stats.previousMonthNewClients))}%
                  </span>{" "}
                  em relação ao mês passado
                </p>
              )}
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Próximos Agendamentos</h3>
              {isLoadingAppointments ? (
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
                        <p className="font-medium">{appointment.service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(appointment.startTime), "eee, dd/MM 'às' HH:mm", { locale: ptBR })}
                        </p>
                        <p className="text-xs text-muted-foreground">{appointment.user.name}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={appointment.status === "pending" ? 
                          'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {appointment.status === "pending" ? 'Pendente' : 'Confirmado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Serviços Populares</h3>
              {isLoadingServices ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-iazi-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Carregando serviços...</span>
                </div>
              ) : popularServices.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Nenhum serviço disponível</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Agendamentos</TableHead>
                      <TableHead>Avaliação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularServices.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.appointmentCount}</TableCell>
                        <TableCell>{service.rating.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
