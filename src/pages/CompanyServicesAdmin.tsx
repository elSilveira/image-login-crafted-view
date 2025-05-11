import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceAvailabilityForm } from "@/components/company/admin/services/ServiceAvailabilityForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

// Import a placeholder for company services (you would create this component later)
import { CompanyServicesForm } from "@/components/company/admin/services/CompanyServicesForm";

const CompanyServicesAdmin = () => {
  const { user } = useAuth();
  // const companyId = user?.companyProfileId;
  
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Serviços da Empresa</h1>
        
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Gerenciamento de serviços da empresa</AlertTitle>
          <AlertDescription>
            Aqui você pode cadastrar serviços oferecidos pela sua empresa e definir 
            horários específicos para cada um deles.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Serviços da Empresa</TabsTrigger>
            <TabsTrigger value="availability">Horários por Serviço</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
              <CompanyServicesForm />
            </div>
          </TabsContent>
          
          <TabsContent value="availability">
            <div className="bg-white rounded-lg border border-iazi-border p-6 space-y-6">
              <ServiceAvailabilityForm professionalId={""} /> {/* TODO: Refactor to use backend-fetched professionalId if needed */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyServicesAdmin;
