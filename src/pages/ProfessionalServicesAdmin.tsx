
import React from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfessionalServicesForm } from "@/components/company/admin/services/ProfessionalServicesForm";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Briefcase } from "lucide-react";

const ProfessionalServicesAdmin = () => {
  const { user } = useAuth();
  
  return (
    <PageContainer>
      <div className="space-y-6 w-full">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-iazi-primary" />
          <h1 className="text-2xl font-semibold">Serviços Profissionais</h1>
        </div>
        
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Gerenciamento de serviços</AlertTitle>
          <AlertDescription>
            Cadastre os serviços que você oferece como profissional. Você poderá definir preços, duração e disponibilidade para cada um deles.
          </AlertDescription>
        </Alert>
        
        <Card className="border-iazi-border">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="text-lg">Meus Serviços</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ProfessionalServicesForm />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ProfessionalServicesAdmin;
