
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
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          <ProfessionalCalendarViewSelector 
            selectedView={selectedView}
            onViewChange={setSelectedView}
          />
        </div>
        
        <ProfessionalCalendarFilters 
          filters={filters} 
          onFilterChange={setFilters}
          professionalId={professionalId}
        />
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-2 sm:p-4 space-y-4">
        <ProfessionalCalendarView 
          viewType={selectedView}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default ProfessionalCalendarContent;
