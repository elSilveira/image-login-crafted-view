
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { ProfessionalServicesForm } from "@/components/company/admin/services/ProfessionalServicesForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceAvailabilityForm } from "@/components/company/admin/services/ServiceAvailabilityForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const CompanyServicesAdmin = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalProfileId;
  
  if (!professionalId) {
    return (
      <CompanyLayout>
        <div className="space-y-6 w-full">
          <h1 className="text-2xl font-semibold">Gerenciar Serviços</h1>
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
        <h1 className="text-2xl font-semibold">Gerenciar Serviços</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Novo fluxo de cadastro de serviços</AlertTitle>
          <AlertDescription>
            Agora você pode cadastrar seus serviços e definir horários específicos para cada um deles nesta área,
            separada do seu perfil profissional. Isso facilita a gestão e permite maior flexibilidade.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Meus Serviços</TabsTrigger>
            <TabsTrigger value="availability">Horários por Serviço</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
              <ProfessionalServicesForm />
            </div>
          </TabsContent>
          
          <TabsContent value="availability">
            <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
              <ServiceAvailabilityForm professionalId={professionalId} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyServicesAdmin;
