
import React, { useState } from "react";
import { ViewType, FilterType } from "@/components/company/calendar/types";
import { useAuth } from "@/contexts/AuthContext";
import ProfessionalCalendarView from "./ProfessionalCalendarView";
import ProfessionalAppointmentSidebar from "./ProfessionalAppointmentSidebar";
import ProfessionalCalendarViewSelector from "./ProfessionalCalendarViewSelector";
import ProfessionalCalendarFilters from "./ProfessionalCalendarFilters";
import { Button } from "@/components/ui/button";
import { Calendar, Grid, List } from "lucide-react";

const ProfessionalCalendarContent = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId || "";
  
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [filters, setFilters] = useState<FilterType>({
    status: "all",
    service: "all",
    serviceId: "all",
    staff: professionalId,
  });
  
  // Simplified view selector that uses icons for better UX
  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Minha Agenda</h2>
        
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <Button
            variant={selectedView === "day" ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleViewChange("day")}
            className="rounded-md"
            title="Visualização diária"
          >
            <Calendar className="h-4 w-4 mr-1" /> 
            <span className="hidden sm:inline">Dia</span>
          </Button>
          <Button
            variant={selectedView === "week" ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleViewChange("week")}
            className="rounded-md"
            title="Visualização semanal"
          >
            <Grid className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Semana</span>
          </Button>
          <Button
            variant={selectedView === "month" ? "default" : "ghost"} 
            size="sm"
            onClick={() => handleViewChange("month")}
            className="rounded-md"
            title="Visualização mensal"
          >
            <Calendar className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Mês</span>
          </Button>
          <Button
            variant={selectedView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewChange("list")}
            className="rounded-md"
            title="Visualização em lista"
          >
            <List className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Lista</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <ProfessionalCalendarFilters 
            filters={filters} 
            onFilterChange={setFilters}
            professionalId={professionalId}
          />
        </div>
        
        <ProfessionalCalendarView 
          viewType={selectedView}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default ProfessionalCalendarContent;
