
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyCalendarContent } from "@/components/company/calendar/CompanyCalendarContent";

const CompanyCalendar = () => {
  return (
    <CompanyLayout>
      <CompanyCalendarContent />
    </CompanyLayout>
  );
};

export default CompanyCalendar;
