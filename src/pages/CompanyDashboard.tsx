
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyDashboardContent } from "@/components/company/admin/CompanyDashboardContent";

const CompanyDashboard = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <CompanyDashboardContent />
      </div>
    </CompanyLayout>
  );
};

export default CompanyDashboard;
