
import React from "react";
import { CompanyLayout } from "@/components/company/admin/CompanyLayout";
import { CompanyProfileForm } from "@/components/company/admin/CompanyProfileForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, Briefcase, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CompanyProfileAdmin: React.FC = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalProfileId;
  const companyId = user?.companyProfileId;
  
  return (
    <CompanyLayout>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gerenciamento da Empresa</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/company/my-company/professional-services">
                <Briefcase className="mr-2 h-4 w-4" />
                Serviços Profissionais
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/company/my-company/services">
                <ClipboardList className="mr-2 h-4 w-4" />
                Serviços da Empresa
              </Link>
            </Button>
            <Button asChild>
              <Link to="/company/my-company/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Agendamentos
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:w-auto md:inline-flex">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
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
        </Tabs>
      </div>
    </CompanyLayout>
  );
};

export default CompanyProfileAdmin;
