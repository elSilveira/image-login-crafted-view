
import React from "react";
import { useParams } from "react-router-dom";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { StaffCalendarContent } from "@/components/company/calendar/staff/StaffCalendarContent";

const StaffCalendar = () => {
  const { staffId } = useParams<{ staffId: string }>();
  
  return (
    <CompanyLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Agenda do Funcionário</h1>
        <StaffCalendarContent staffId={staffId || ""} />
      </div>
    </CompanyLayout>
  );
};

export default StaffCalendar;
