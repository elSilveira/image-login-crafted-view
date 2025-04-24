
import React from "react";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { Download, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const ExportSettings = () => {
  return (
    <SettingsSection
      title="Exportar e Excluir"
      description="Exporte seus dados ou solicite a exclusão da sua conta."
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium font-playfair text-iazi-text">Exportar Dados</h3>
          <p className="text-muted-foreground">
            Você pode fazer o download de todos os seus dados pessoais armazenados em nossa plataforma.
          </p>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar meus dados
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium font-playfair text-iazi-text">Exclusão da Conta</h3>
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados serão apagados.
            </AlertDescription>
          </Alert>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Excluir minha conta
          </Button>
        </div>
      </div>
    </SettingsSection>
  );
};
