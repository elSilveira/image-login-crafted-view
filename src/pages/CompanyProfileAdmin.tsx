
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyProfileForm } from "@/components/company/admin/CompanyProfileForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfessionalServicesForm } from "@/components/company/admin/services/ProfessionalServicesForm";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyProfileAdmin: React.FC = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gerenciamento da Empresa</h1>
          <Button asChild>
            <Link to="/company/my-company/services/new">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Serviço
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-iazi-border">
              <CompanyProfileForm />
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-iazi-border">
              <ProfessionalServicesForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyProfileAdmin;
