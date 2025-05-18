
import React from "react";
import Navigation from "@/components/Navigation";
import { CompanyRegisterForm } from "@/components/company/CompanyRegisterForm";
import { PageContainer } from "@/components/ui/page-container";

const CompanyRegister = () => {
  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-16">
        <PageContainer>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-6 text-iazi-text border-b pb-4">Registre sua Empresa</h1>
            <CompanyRegisterForm />
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default CompanyRegister;
