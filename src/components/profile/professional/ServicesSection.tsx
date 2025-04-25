
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ServicesSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Oferecidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo Serviço
        </Button>
      </CardContent>
    </Card>
  );
};
