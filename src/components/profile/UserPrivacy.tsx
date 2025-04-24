
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export const UserPrivacy = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacidade e Segurança</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Alterar Senha</h3>
          <Button variant="outline" className="w-full sm:w-auto">
            Alterar senha
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Exclusão de Conta</h3>
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              A exclusão da conta é permanente e não pode ser desfeita. Todos os seus dados serão apagados.
            </AlertDescription>
          </Alert>
          <Button variant="destructive">Excluir minha conta</Button>
        </div>
      </CardContent>
    </Card>
  );
};
