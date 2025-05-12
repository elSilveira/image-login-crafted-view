import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Clock } from "lucide-react";
import { ServiceItem } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: ServiceItem;
  onRemove: () => void;
  onEdit?: () => void;
}

// Helper function to format price
const formatPrice = (price: string | number | undefined): string => {
  if (price === undefined || price === null) return "Não definido";
  
  if (typeof price === 'number') {
    return `R$ ${price.toFixed(2)}`;
  }
  
  // If it's a string, try to convert to number if possible
  const numPrice = parseFloat(price.toString());
  if (!isNaN(numPrice)) {
    return `R$ ${numPrice.toFixed(2)}`;
  }
  
  return price.toString(); // Just return the string if it's not a valid number
};

// Helper function to get a safe category label
const getCategoryLabel = (category: any): string => {
  if (!category) return 'Categoria';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') {
    if (typeof category.name === 'string' && category.name.trim() !== '') return category.name;
    if (category.id !== undefined) return String(category.id);
  }
  return 'Categoria';
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onRemove,
  onEdit
}) => {
  // Get service initials for avatar fallback
  const serviceInitials = service.name ? service.name.substring(0, 2).toUpperCase() : "SV";
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={service.image} alt={service.name} />
            <AvatarFallback className="bg-sky-100 text-sky-700 text-lg">
              {serviceInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {service.description || "Sem descrição disponível"}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              {service.duration && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {typeof service.duration === 'number'
                      ? `${service.duration} min`
                      : service.duration}
                  </span>
                </div>
              )}
              {service.price !== undefined && (
                <div className="text-sm font-medium text-iazi-primary">
                  {formatPrice(service.price)}
                </div>
              )}
              {/* Category badge: robustly support backend contract */}
              {service.categoryName && (
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(service.categoryName)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 justify-end border-t pt-4">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-1" /> Editar
            </Button>
          )}
          {onRemove && (
            <Button variant="destructive" size="sm" onClick={onRemove}>
              <Trash className="h-4 w-4 mr-1" /> Remover
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
