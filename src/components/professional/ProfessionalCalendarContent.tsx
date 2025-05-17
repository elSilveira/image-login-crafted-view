
import React, { useState } from "react";
import { ViewType, FilterType } from "@/components/company/calendar/types";
import { useAuth } from "@/contexts/AuthContext";
import ProfessionalCalendarView from "./ProfessionalCalendarView";
import ProfessionalAppointmentSidebar from "./ProfessionalAppointmentSidebar";
import ProfessionalCalendarViewSelector from "./ProfessionalCalendarViewSelector";
import ProfessionalCalendarFilters from "./ProfessionalCalendarFilters";

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
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Calendário</h2>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <ProfessionalCalendarViewSelector 
            selectedView={selectedView} 
            onViewChange={setSelectedView}
          />
          
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
