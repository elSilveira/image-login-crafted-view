
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyDashboardContent } from "@/components/company/admin/CompanyDashboardContent";

const CompanyDashboard = () => {
  return (
    <CompanyLayout>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <CompanyDashboardContent />
    </CompanyLayout>
  );
};

export default CompanyDashboard;
