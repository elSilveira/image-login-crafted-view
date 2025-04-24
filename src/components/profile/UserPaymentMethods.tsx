
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const UserPaymentMethods = () => {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between border-b">
        <CardTitle className="font-playfair text-2xl text-iazi-text">Métodos de Pagamento</CardTitle>
        <Button className="bg-iazi-primary hover:bg-iazi-primary-hover font-lato">
          Adicionar Cartão
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center py-8 text-muted-foreground font-lato">
          Nenhum método de pagamento cadastrado
        </div>
      </CardContent>
    </Card>
  );
};
