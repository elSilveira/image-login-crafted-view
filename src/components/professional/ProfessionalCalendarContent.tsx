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
    staff: professionalId, // Default to current professional, though not used for filtering
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minha Agenda</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
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
        
        <div className="w-full lg:w-80">
          <ProfessionalAppointmentSidebar />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCalendarContent;
