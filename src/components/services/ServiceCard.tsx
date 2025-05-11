
"use client";

import { Link } from "react-router-dom";
import { Clock, Trash, PauseCircle, Pencil } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServiceCardProps {
  service: {
    id: number | string; 
    name?: string;
    category?: string;
    company?: string | { id?: string | number; name?: string }; 
    professional?: string | { id?: string | number; name?: string }; 
    image?: string;
    rating?: number;
    reviews?: number;
    price?: string;
    duration?: string;
    availability?: string;
    company_id?: string | number;
    professional_id?: string | number;
    description?: string;
  };
  isHighlighted?: boolean;
  onEdit?: () => void;
  onPause?: () => void;
  onDelete?: () => void;
}

export const ServiceCard = ({ 
  service, 
  isHighlighted = false, 
  onEdit,
  onPause,
  onDelete
}: ServiceCardProps) => {
  if (!service || typeof service.id === "undefined") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 p-4">
        <p className="text-red-500">Erro: Dados do serviço inválidos ou incompletos.</p>
      </Card>
    ); 
  }

  // Safely get service properties with fallbacks
  const serviceId = service.id.toString();
  const serviceName = service.name || "Serviço não informado";
  const serviceDescription = service.description || "Sem descrição disponível";
  const servicePrice = typeof service.price === "string" ? service.price : "Preço não informado";
  const serviceDuration = typeof service.duration === "string" ? service.duration : "Duração não informada";
  
  // Get service initials for avatar fallback (safely)
  const serviceInitials = serviceName ? serviceName.substring(0, 2).toUpperCase() : "SV";

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
      isHighlighted ? "border-[#4664EA]" : ""
    }`}>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <Avatar className="h-16 w-16 flex-shrink-0">
            <AvatarImage src={service.image} alt={serviceName} />
            <AvatarFallback className="bg-sky-100 text-sky-700 text-lg">
              {serviceInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col flex-grow">
            <h3 className="text-lg font-semibold mb-1">{serviceName}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{serviceDescription}</p>
            
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              {serviceDuration && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" /> 
                  <span>{serviceDuration}</span>
                </div>
              )}
              {servicePrice && (
                <div className="text-sm font-medium text-iazi-primary">
                  {servicePrice}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 justify-end border-t pt-4">
          {onPause && (
            <Button variant="outline" size="sm" onClick={onPause}>
              <PauseCircle className="h-4 w-4 mr-1" />
              Pausar
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash className="h-4 w-4 mr-1" />
              Deletar
            </Button>
          )}
          {!onEdit && !onPause && !onDelete && (
            <Button className="flex-1" asChild>
              <Link to={`/service/${serviceId}`}>Ver detalhes</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
