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
        
        console.log("API Response:", result);
        
        // Ensure we have valid data
        if (!result) {
          console.warn("No result from fetchAppointments");
          return [];
        }
        
        // Check if we have a data property (common in paginated responses)
        if (result.data && Array.isArray(result.data)) {
          console.log("Using result.data (paginated response):", result.data);
          return result.data;
        }
        
        // If result is already an array, use it
        if (Array.isArray(result)) {
          console.log("Result is already an array:", result);
          return result;
        }
        
        console.warn("Unexpected response format:", result);
        return [];
      } catch (err) {
        console.error("Error fetching appointments:", err);
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

  // Debug: Log appointments data and errors
  useEffect(() => {
    console.log("Appointments data in component:", appointments);
    
    if (isError) {
      console.error("Error in ProfessionalBookings query:", error);
    }
    
    if (appointments) {
      if (appointments.length === 0) {
        console.warn("Empty appointments array received in ProfessionalBookings");
      } else {
        console.log("First appointment in ProfessionalBookings:", appointments[0]);
      }
    }
  }, [appointments, isError, error]);

  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Meus Agendamentos</h1>
      
      <Tabs defaultValue="upcoming" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="upcoming">Agendamentos Ativos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados/Ausentes</TabsTrigger>
        </TabsList>
        
        {isLoading ? (
          <Card className="w-full">
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
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
      
      {/* Debug overlay - only visible in development */}
      {import.meta.env.DEV && (
        <>
          <ProfessionalIdDebugger />
          <DebugOverlay 
            data={{ 
              activeTab,
              appointmentsLength: appointments?.length || 0,
              showActions: true,
              mockDataEnabled: localStorage.getItem('useMockAppointmentsData') === 'true',
              firstAppointment: appointments && appointments.length > 0 ? {
                id: appointments[0].id,
                status: appointments[0].status,
                services: appointments[0].services,
                service: appointments[0].service,
                startTime: appointments[0].startTime,
                user: appointments[0].user
              } : null
            }} 
            title="Appointments Debug"
          />
        </>
      )}
    </div>
  );
};

export default ProfessionalBookings;
