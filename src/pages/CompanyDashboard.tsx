
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyDashboardContent } from "@/components/company/admin/CompanyDashboardContent";

const CompanyDashboard = () => {
  return (
    <CompanyLayout>
      <CompanyDashboardContent />
    </CompanyLayout>
  );
};

export default CompanyDashboard;
