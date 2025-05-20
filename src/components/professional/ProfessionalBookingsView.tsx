import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAppointments } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfessionalBookingsList from "@/components/professional/ProfessionalBookingsList";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Loading, LoadingInline } from "@/components/ui/loading";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Status map for the tabs and dropdown
const statusGroups = {
  upcoming: ["PENDING", "CONFIRMED", "IN_PROGRESS", "IN-PROGRESS", "INPROGRESS"],
  completed: ["COMPLETED"],
  cancelled: ["CANCELLED", "NO_SHOW", "NO-SHOW", "NOSHOW"],
};

const statusLabels = {
  upcoming: "Ativos",
  completed: "Concluídos",
  cancelled: "Cancelados"
};

export const ProfessionalBookingsView = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId || "";
  const [activeTab, setActiveTab] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of appointments to show per page
  
  // Check if we're on mobile
  const isMobile = !useMediaQuery("(min-width: 640px)");

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
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Get count of appointments
  const appointmentCount = appointments?.length || 0;
  
  // Calculate pagination
  const totalPages = Math.ceil(appointmentCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, appointmentCount);
  
  // Get current page appointments
  const currentAppointments = appointments?.slice(startIndex, endIndex) || [];
  
  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Meus Agendamentos</h2>
        
        {isMobile && (
          <Select 
            value={activeTab} 
            onValueChange={handleTabChange}
          >
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <span>{statusLabels[activeTab as keyof typeof statusLabels]}</span>
                {!isLoading && appointments && (
                  <Badge variant="secondary" className="ml-1">
                    {appointmentCount}
                  </Badge>
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Ativos</SelectItem>
              <SelectItem value="completed">Concluídos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
        {!isMobile && (
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full mb-4 whitespace-nowrap">
            <TabsTrigger value="upcoming" className="flex items-center gap-2 flex-1">
              <span>Ativos</span>
              {!isLoading && appointments && (
                <Badge variant="outline" className="bg-primary/10 ml-1">
                  {appointments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2 flex-1">
              <span>Concluídos</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2 flex-1">
              <span>Cancelados</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}      
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
        </Alert>      ) : (
        <div className="w-full">
          <ProfessionalBookingsList 
            appointments={currentAppointments} 
            showActions={activeTab === "upcoming" || activeTab === "completed"}
            emptyMessage={`Você não tem agendamentos ${
              activeTab === "upcoming" ? "ativos" : 
              activeTab === "completed" ? "concluídos" : "cancelados"
            }.`}
            compact={true}
          />
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
