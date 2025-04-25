
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const PortfolioSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfólio</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Imagem
        </Button>
      </CardContent>
    </Card>
  );
};
