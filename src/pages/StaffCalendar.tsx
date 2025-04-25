
import React from "react";
import { useParams } from "react-router-dom";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { StaffCalendarContent } from "@/components/company/calendar/staff/StaffCalendarContent";

const StaffCalendar = () => {
  const { staffId } = useParams<{ staffId: string }>();
  
  return (
    <CompanyLayout>
      <StaffCalendarContent staffId={staffId || ""} />
    </CompanyLayout>
  );
};

export default StaffCalendar;
