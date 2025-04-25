
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarView } from "@/components/company/calendar/CalendarView";
import { ViewType, FilterType, StaffMember } from "@/components/company/calendar/types";
import { StaffCalendarHeader } from "./StaffCalendarHeader";
import { StaffCalendarSelector } from "./StaffCalendarSelector";
import { StaffCalendarSidebar } from "./StaffCalendarSidebar";
import { mockStaff } from "@/components/company/calendar/mock-data";

interface StaffCalendarContentProps {
  staffId: string;
}

export const StaffCalendarContent: React.FC<StaffCalendarContentProps> = ({ staffId }) => {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [selectedResource, setSelectedResource] = useState<string>("all");
  const [filters, setFilters] = useState<FilterType>({
    status: "all",
    service: "all",
    staff: staffId,
  });
  
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  
  // Find the staff member from mock data
  useEffect(() => {
    const staff = mockStaff.find(s => s.id === staffId);
    if (staff) {
      setStaffMember(staff);
      setFilters(prev => ({ ...prev, staff: staffId }));
    }
  }, [staffId]);
  
  if (!staffMember) {
    return <div className="p-4">Staff member not found</div>;
  }

  return (
    <div className="space-y-6">
      <StaffCalendarHeader staffMember={staffMember} />
      
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <StaffCalendarSelector 
                selectedView={selectedView} 
                onViewChange={setSelectedView}
                selectedResource={selectedResource}
                onResourceChange={setSelectedResource}
              />
            </div>
            
            <CalendarView 
              viewType={selectedView}
              staffFilter={staffId}
              resourceFilter={selectedResource}
              filters={filters}
            />
          </div>
        </div>
        
        <div className="w-full lg:w-80">
          <StaffCalendarSidebar staffMember={staffMember} />
        </div>
      </div>
    </div>
  );
};
