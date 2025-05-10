
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { ProfessionalServicesForm } from "@/components/company/admin/services/ProfessionalServicesForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ProfessionalServicesAdmin = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalProfileId;
  
  if (!professionalId) {
    return (
      <CompanyLayout>
        <div className="space-y-6 w-full">
          <h1 className="text-2xl font-semibold">Serviços Profissionais</h1>
          <Alert variant="destructive">
            <AlertTitle>Perfil profissional necessário</AlertTitle>
            <AlertDescription>
              É necessário criar um perfil profissional antes de cadastrar serviços.
              Por favor, crie seu perfil profissional primeiro.
            </AlertDescription>
          </Alert>
        </div>
      </CompanyLayout>
    );
  }
  
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Serviços Profissionais</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Gerenciamento de serviços profissionais</AlertTitle>
          <AlertDescription>
            Aqui você pode gerenciar seus serviços profissionais que serão oferecidos independentemente
            da empresa. Estes serviços estão vinculados ao seu perfil profissional.
          </AlertDescription>
        </Alert>
        
        <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
          <ProfessionalServicesForm />
        </div>
      </div>
    </CompanyLayout>
  );
};

export default ProfessionalServicesAdmin;
