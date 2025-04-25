
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyCalendarContent } from "@/components/company/calendar/CompanyCalendarContent";

const CompanyCalendar = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Agenda da Empresa</h1>
        <CompanyCalendarContent />
      </div>
    </CompanyLayout>
  );
};

export default CompanyCalendar;
