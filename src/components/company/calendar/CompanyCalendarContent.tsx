
import React, { useState } from "react";
import { CalendarView } from "@/components/company/calendar/CalendarView";
import { CalendarViewSelector } from "@/components/company/calendar/CalendarViewSelector";
import { CalendarFilters } from "@/components/company/calendar/CalendarFilters";
import { AppointmentSidebar } from "@/components/company/calendar/AppointmentSidebar";
import { ViewType, FilterType, AppointmentType, StaffMember } from "@/components/company/calendar/types";

export const CompanyCalendarContent = () => {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<string>("all");
  const [filters, setFilters] = useState<FilterType>({
    status: "all",
    serviceId: "all", // Corrigido para serviceId
    staff: "all",
  });
  
  // Adicionando um mock ID de empresa para evitar erros
  const mockCompanyId = "company-123";
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Agenda da Empresa</h1>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <CalendarViewSelector 
                selectedView={selectedView} 
                onViewChange={setSelectedView}
                selectedStaff={selectedStaff}
                onStaffChange={setSelectedStaff}
              />
              
              <CalendarFilters 
                filters={filters} 
                onFilterChange={setFilters}
                companyId={mockCompanyId}
              />
            </div>
            
            <CalendarView 
              viewType={selectedView}
              staffFilter={selectedStaff}
              filters={filters}
              companyId={mockCompanyId}
            />
          </div>
        </div>
        
        <div className="w-full lg:w-80">
          <AppointmentSidebar companyId={mockCompanyId} />
        </div>
      </div>
    </div>
  );
};
