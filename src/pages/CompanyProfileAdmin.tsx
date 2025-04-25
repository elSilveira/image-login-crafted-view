
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyProfileForm } from "@/components/company/admin/CompanyProfileForm";

const CompanyProfileAdmin: React.FC = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Perfil da Empresa</h1>
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-iazi-border">
          <CompanyProfileForm />
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyProfileAdmin;
