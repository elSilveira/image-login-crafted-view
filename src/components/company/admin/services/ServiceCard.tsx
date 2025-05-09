
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { ServiceItem } from "./types";

interface ServiceCardProps {
  service: ServiceItem;
  onRemove: () => void;
  onEdit?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onRemove,
  onEdit
}) => {
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <div className="text-sm text-muted-foreground mb-2">
          {service.description || "Sem descrição"}
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span>Preço:</span>
            <span className="font-medium">
              {service.price ? `R$ ${service.price.toFixed(2)}` : "Não definido"}
            </span>
          </div>
          {service.duration && (
            <div className="flex justify-between text-sm">
              <span>Duração:</span>
              <span className="font-medium">{service.duration} min</span>
            </div>
          )}
          {service.categoryName && (
            <div className="flex justify-between text-sm">
              <span>Categoria:</span>
              <span className="font-medium">{service.categoryName}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        {onEdit && (
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={onRemove}>
          <Trash className="h-4 w-4 mr-1" /> Remover
        </Button>
      </CardFooter>
    </Card>
  );
};
