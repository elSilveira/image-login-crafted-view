
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyCalendarContent } from "@/components/company/calendar/CompanyCalendarContent";

const CompanyCalendar = () => {
  return (
    <CompanyLayout>
      <h1 className="text-2xl font-semibold">Agenda da Empresa</h1>
      <CompanyCalendarContent />
    </CompanyLayout>
  );
};

export default CompanyCalendar;
