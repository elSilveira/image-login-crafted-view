import React, { useState } from "react";
import { CalendarView } from "@/components/company/calendar/CalendarView";
import { CalendarViewSelector } from "@/components/company/calendar/CalendarViewSelector";
import { CalendarFilters } from "@/components/company/calendar/CalendarFilters";
import { AppointmentSidebar } from "@/components/company/calendar/AppointmentSidebar";
import { ViewType, FilterType } from "@/components/company/calendar/types";
import { useAuth } from "@/contexts/AuthContext";

const ProfessionalCalendarContent = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId || "";
  
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [selectedResource, setSelectedResource] = useState<string>("all");
  const [filters, setFilters] = useState<FilterType>({
    status: "all",
    service: "all",
    staff: professionalId, // Default to current professional
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
              <CalendarViewSelector 
                selectedView={selectedView} 
                onViewChange={setSelectedView}
                selectedStaff={professionalId} // Fixed to current professional
                onStaffChange={() => {}} // No-op since professional can't change staff
                selectedResource={selectedResource}
                onResourceChange={setSelectedResource}
                disableStaffSelection={true} // Disable staff selection for professionals
              />
              
              <CalendarFilters filters={filters} onFilterChange={setFilters} />
            </div>
            
            <CalendarView 
              viewType={selectedView}
              staffFilter={professionalId} // Always filter by current professional
              filters={{...filters, staff: professionalId}} // Ensure staff filter is always the current professional
              companyId={user?.companyId || ""} // Pass company ID if professional belongs to a company
            />
          </div>
        </div>
        
        <div className="w-full lg:w-80">
          <AppointmentSidebar />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCalendarContent;
