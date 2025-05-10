
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const CompanyServicesForm: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Serviços da Empresa</h2>
        <Button className="bg-iazi-primary hover:bg-iazi-primary-hover text-white">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Serviço da Empresa
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Esta é a área de gerenciamento de serviços da sua empresa. Aqui você pode cadastrar, editar e 
            excluir serviços oferecidos pela empresa, que podem ser executados por diferentes profissionais.
          </p>
          <p className="text-muted-foreground mt-2">
            Diferente dos serviços profissionais que são vinculados a um profissional específico, 
            os serviços da empresa podem ser atribuídos a qualquer profissional da equipe.
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Começar a adicionar serviços
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
