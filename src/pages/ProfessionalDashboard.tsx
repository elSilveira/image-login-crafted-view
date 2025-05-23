import React, { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchProfessionalDashboardStats,
  fetchUpcomingAppointments,
  fetchPopularServices
} from "@/lib/api";
import { DashboardStats as DashboardStatsType } from "@/api/types";
import { DashboardStats } from "@/components/professional/DashboardStats";
import { UpcomingAppointments } from "@/components/professional/UpcomingAppointments";
import { PopularServices } from "@/components/professional/PopularServices";

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
  const [stats, setStats] = useState<DashboardStatsType | null>(null);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [popularServices, setPopularServices] = useState<PopularServiceType[]>([]);
  
  // Estados de carregamento e erro
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
          <DashboardStats stats={stats} isLoading={isLoadingStats} />

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <UpcomingAppointments 
              appointments={appointments} 
              isLoading={isLoadingAppointments} 
            />
            
            <PopularServices 
              services={popularServices} 
              isLoading={isLoadingServices} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfessionalDashboard;
