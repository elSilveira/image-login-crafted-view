import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAppointments } from "@/lib/api";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DebugBookingsList from "@/components/professional/DebugBookingsList";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample static data for testing
const staticAppointments = [
  {
    id: "static-1",
    startTime: "2025-05-20T09:00:00.000Z",
    endTime: "2025-05-20T10:00:00.000Z",
    status: "pending",
    service: {
      id: "s1",
      name: "Static Test Service 1",
      duration: 60
    },
    user: {
      id: "u1",
      name: "Static User 1"
    }
  },
  {
    id: "static-2",
    startTime: "2025-05-21T14:00:00.000Z",
    endTime: "2025-05-21T15:30:00.000Z",
    status: "confirmed",
    services: [
      {
        service: {
          id: "s2",
          name: "Static Test Service 2",
          duration: 90
        }
      }
    ],
    user: {
      id: "u2",
      name: "Static User 2"
    }
  }
];

// Status map for the tabs
const statusGroups = {
  upcoming: ["pending", "confirmed"],
  completed: ["completed"],
  cancelled: ["cancelled", "no-show"],
};

const DebugBookingsPage = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId || "";
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showStaticData, setShowStaticData] = useState(false);

  // Fetch appointments based on professional ID and status
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ["debugBookings", professionalId, activeTab],
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
        
        console.log('Debug - API Response:', result);
        
        // Ensure we have valid data
        if (!result) {
          console.warn('Debug - No result from fetchAppointments');
          return [];
        }
        
        // Check if we have a data property (common in paginated responses)
        if (result.data && Array.isArray(result.data)) {
          console.log('Debug - Using result.data (paginated response):', result.data);
          return result.data;
        }
        
        // If result is already an array, use it
        if (Array.isArray(result)) {
          console.log('Debug - Result is already an array:', result);
          return result;
        }
        
        console.warn('Debug - Unexpected response format:', result);
        return [];
      } catch (err) {
        console.error('Debug - Error fetching appointments:', err);
        throw err;
      }
    },
    enabled: !!professionalId && !showStaticData,
    staleTime: 1 * 60 * 1000, // 1 minute cache
  });

  // Toggle between static and API data
  const handleToggleDataSource = () => {
    setShowStaticData(!showStaticData);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Debug: Log appointments data
  useEffect(() => {
    console.log('Debug - Appointments data in component:', appointments);
    console.log('Debug - Static data enabled:', showStaticData);
    console.log('Debug - User:', user);
    console.log('Debug - ProfessionalId:', professionalId);
  }, [appointments, showStaticData, user, professionalId]);

  // Determine which data to show
  const dataToShow = showStaticData ? staticAppointments : appointments;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Debug Agendamentos</h1>
        <button 
          onClick={handleToggleDataSource} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showStaticData ? "Usar Dados da API" : "Usar Dados Estáticos"}
        </button>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded-md mb-6">
        <p className="font-bold">Modo Debug</p>
        <p><strong>Fonte de dados:</strong> {showStaticData ? "Dados estáticos" : "API"}</p>
        <p><strong>ID do profissional:</strong> {professionalId || "Não definido"}</p>
        <p><strong>Tab ativa:</strong> {activeTab}</p>
        <p><strong>Usuário logado:</strong> {user ? "Sim" : "Não"}</p>
      </div>
      
      <Tabs defaultValue="upcoming" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
        </TabsList>
        
        {!showStaticData && isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !showStaticData && isError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : "Erro ao carregar agendamentos."}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <TabsContent value="upcoming" className="mt-0">
              <DebugBookingsList 
                appointments={dataToShow || []} 
                showActions={true}
                emptyMessage="Você não tem agendamentos próximos."
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              <DebugBookingsList 
                appointments={dataToShow || []} 
                showActions={false}
                emptyMessage="Você não tem agendamentos concluídos."
              />
            </TabsContent>
            
            <TabsContent value="cancelled" className="mt-0">
              <DebugBookingsList 
                appointments={dataToShow || []} 
                showActions={false}
                emptyMessage="Você não tem agendamentos cancelados."
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default DebugBookingsPage;
