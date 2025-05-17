
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAppointments } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ProfessionalBookingsList from "@/components/professional/ProfessionalBookingsList";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle, CalendarDays, CheckCircle, XCircle, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMediaQuery } from "@/hooks/use-media-query";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
  };

  // Get count of appointments
  const appointmentCount = appointments?.length || 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Meus Agendamentos</h2>
        
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2 items-center">
                <Filter className="h-4 w-4" />
                {statusLabels[activeTab as keyof typeof statusLabels]}
                <Badge variant="secondary" className="ml-1">
                  {appointmentCount}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleTabChange("upcoming")} className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Ativos</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("completed")} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Concluídos</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTabChange("cancelled")} className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                <span>Cancelados</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {!isMobile && (
        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="flex w-full mb-4 overflow-x-auto no-scrollbar">
            <TabsTrigger value="upcoming" className="flex items-center gap-2 flex-1">
              <CalendarDays className="h-4 w-4" />
              <span>Ativos</span>
              {!isLoading && appointments && (
                <Badge variant="outline" className="bg-primary/10 ml-1">
                  {appointments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2 flex-1">
              <CheckCircle className="h-4 w-4" />
              <span>Concluídos</span>
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="flex items-center gap-2 flex-1">
              <XCircle className="h-4 w-4" />
              <span>Cancelados</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}
      
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
        <div className="w-full">
          <ProfessionalBookingsList 
            appointments={appointments || []} 
            showActions={activeTab === "upcoming"}
            emptyMessage={`Você não tem agendamentos ${
              activeTab === "upcoming" ? "ativos" : 
              activeTab === "completed" ? "concluídos" : "cancelados"
            }.`}
            compact={true}
          />
        </div>
      )}
    </div>
  );
};
