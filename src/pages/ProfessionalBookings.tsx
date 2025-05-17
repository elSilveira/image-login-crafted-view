
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAppointments } from "@/lib/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfessionalBookingsList from "@/components/professional/ProfessionalBookingsList";
import ProfessionalIdDebugger from "@/components/professional/ProfessionalIdDebugger";
import DebugOverlay from "@/components/Debug/DebugOverlay";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";
import { PageContainer } from "@/components/ui/page-container";

// Status map for the tabs - following the APPOINTMENT_STATUS documentation
// Using uppercase status values as required by the API
const statusGroups = {
  upcoming: ["PENDING", "CONFIRMED", "IN_PROGRESS", "IN-PROGRESS", "INPROGRESS"],
  completed: ["COMPLETED"],
  cancelled: ["CANCELLED", "NO_SHOW", "NO-SHOW", "NOSHOW"],
};

const ProfessionalBookings = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId || "";
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Disable mock data to use real API
  useEffect(() => {
    localStorage.removeItem('useMockAppointmentsData');
  }, []);

  // Fetch appointments based on professional ID and status
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ["professionalBookings", professionalId, activeTab],
    queryFn: async () => {
      try {
        // Get status filter based on active tab
        const statusFilter = statusGroups[activeTab as keyof typeof statusGroups];
        
        const result = await fetchAppointments({
          professionalId,
          status: statusFilter.join(","),
          include: "user,service,services.service",
          sort: activeTab === "upcoming" ? "startTime_asc" : "startTime_desc",
        });
        
        // Ensure we have valid data
        if (!result) {
          return [];
        }
        
        // Check if we have a data property (common in paginated responses)
        if (result.data && Array.isArray(result.data)) {
          return result.data;
        }
        
        // If result is already an array, use it
        if (Array.isArray(result)) {
          return result;
        }
        
        return [];
      } catch (err) {
        throw err;
      }
    },
    enabled: !!professionalId,
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold">Meus Agendamentos</h1>
      
      <Tabs defaultValue="upcoming" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="upcoming">Agendamentos Ativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados/Ausentes</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <Card className="w-full">
            <Loading text="Carregando agendamentos..." size="md" className="h-40" />
          </Card>
        ) : isError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Erro ao carregar agendamentos."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <TabsContent value="upcoming" className="mt-0 w-full">
              <ProfessionalBookingsList 
                appointments={appointments || []} 
                showActions={true}
                emptyMessage="Você não tem agendamentos ativos (pendentes, confirmados ou em andamento)."
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0 w-full">
              <ProfessionalBookingsList 
                appointments={appointments || []} 
                showActions={true}
                emptyMessage="Você não tem agendamentos concluídos."
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0 w-full">
              <ProfessionalBookingsList 
                appointments={appointments || []} 
                showActions={true}
                emptyMessage="Você não tem agendamentos cancelados ou marcados como 'não compareceu'."
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </PageContainer>
  );
};

export default ProfessionalBookings;
