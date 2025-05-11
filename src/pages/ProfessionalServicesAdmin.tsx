import React from "react";
import { ProfessionalServicesForm } from "@/components/company/admin/services/ProfessionalServicesForm";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";

const ProfessionalServicesAdmin = () => {
  const { user } = useAuth();

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">Serviços Profissionais</h1>
        <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
          <ProfessionalServicesForm />
        </div>
      </div>
    </>
  );
};

export default ProfessionalServicesAdmin;
