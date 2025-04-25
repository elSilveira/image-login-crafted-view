
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyProfileForm } from "@/components/company/admin/CompanyProfileForm";

const CompanyProfileAdmin = () => {
  return (
    <CompanyLayout>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Perfil da Empresa</h1>
        <CompanyProfileForm />
      </div>
    </CompanyLayout>
  );
};

export default CompanyProfileAdmin;
