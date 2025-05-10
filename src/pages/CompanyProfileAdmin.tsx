
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyProfileForm } from "@/components/company/admin/CompanyProfileForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalServicesForm } from "@/components/company/admin/services/ProfessionalServicesForm";
import { Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ServiceAvailabilityForm } from "@/components/company/admin/services/ServiceAvailabilityForm";

const CompanyProfileAdmin: React.FC = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalProfileId;
  
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gerenciamento da Empresa</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/company/my-company/services">
                <Calendar className="mr-2 h-4 w-4" />
                Gerenciar Serviços e Horários
              </Link>
            </Button>
            <Button asChild>
              <Link to="/company/my-company/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Serviço
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="services">Meus Serviços</TabsTrigger>
            <TabsTrigger value="availability">Horários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-iazi-border">
              {user?.companyProfileId ? (
                <CompanyProfileForm companyId={user.companyProfileId} />
              ) : (
                <Alert>
                  <AlertTitle>Perfil de empresa necessário</AlertTitle>
                  <AlertDescription>
                    É necessário criar um perfil de empresa para gerenciar seus dados.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-iazi-border">
              <ProfessionalServicesForm />
            </div>
          </TabsContent>
          
          <TabsContent value="availability">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-iazi-border">
              {professionalId ? (
                <ServiceAvailabilityForm professionalId={professionalId} />
              ) : (
                <Alert>
                  <AlertTitle>Perfil profissional necessário</AlertTitle>
                  <AlertDescription>
                    É necessário criar um perfil profissional para gerenciar horários.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyProfileAdmin;
