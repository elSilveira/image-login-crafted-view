
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { StaffList } from "@/components/company/staff/StaffList";

const CompanyStaff = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
        </div>
        <StaffList />
      </div>
    </CompanyLayout>
  );
};

export default CompanyStaff;
