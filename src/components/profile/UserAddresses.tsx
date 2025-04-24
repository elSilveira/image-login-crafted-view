
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const UserAddresses = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Meus Endereços</CardTitle>
        <Button className="bg-iazi-primary hover:bg-iazi-primary-hover">Adicionar Endereço</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { id: 1, title: "Casa", street: "Rua das Flores, 123", neighborhood: "Jardim Europa", city: "São Paulo", state: "SP" },
          { id: 2, title: "Trabalho", street: "Av. Paulista, 1000", neighborhood: "Bela Vista", city: "São Paulo", state: "SP" },
        ].map((address) => (
          <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h3 className="font-medium">{address.title}</h3>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.neighborhood}, {address.city} - {address.state}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button size="icon" variant="outline">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
