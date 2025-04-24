
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UserPaymentMethods = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Métodos de Pagamento</CardTitle>
        <Button className="bg-iazi-primary hover:bg-iazi-primary-hover">Adicionar Cartão</Button>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          Nenhum método de pagamento cadastrado
        </div>
      </CardContent>
    </Card>
  );
};
