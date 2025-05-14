"use client";

import { Link } from "react-router-dom";
import { Clock, Trash, PauseCircle, Pencil, Star, MapPin, User, Calendar } from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServiceCardProps {
  service: {
    id: number | string; 
    name?: string;
    category?: string | { id?: string | number; name?: string }; 
    company?: string | { id?: string | number; name?: string }; 
    professional?: string | { id?: string | number; name?: string }; 
    image?: string;
    rating?: number;
    reviews?: number;
    price?: string | number;
    duration?: string;
    availability?: string;
    company_id?: string | number;
    professional_id?: string | number;
    description?: string;
    type?: string;
    address?: string | { fullAddress?: string; city?: string; distance?: number | string };
    canBookDirect?: boolean; // Flag for services that can be booked directly
  };
  isHighlighted?: boolean;
  onEdit?: () => void;
  onPause?: () => void;
  onDelete?: () => void;
  compact?: boolean; // Option for a more compact display
}

// Helper to safely extract a string label from category (string or object)
function getCategoryLabel(category: any): string {
  if (!category) return "Categoria não informada";
  if (typeof category === "string") return category;
  if (typeof category === "object" && category !== null) {
    if (typeof category.name === "string" && category.name.trim() !== "") return category.name;
    if (category.id !== undefined) return String(category.id);
  }
  return "Categoria não informada";
}

const renderStars = (rating?: number) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    return null;
  }
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${
          i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    );
  }
  return stars;
};

export const ServiceCard = ({ 
  service, 
  isHighlighted = false, 
  onEdit,
  onPause,
  onDelete,
  compact = false
}: ServiceCardProps) => {
  if (!service || typeof service.id === "undefined") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 p-4">
        <p className="text-red-500">Erro: Dados do serviço inválidos ou incompletos.</p>
      </Card>
    ); 
  }

  // Safely get service properties with fallbacks
  const serviceId = service.id?.toString() ?? "";
  const serviceName = service.name || "Serviço não informado";
  const serviceDescription = service.description || "Sem descrição disponível";
  const servicePrice = typeof service.price === "string" ? service.price :
    typeof service.price === "number" ? `R$ ${service.price.toFixed(2)}` :
    "Preço não informado";
  const serviceDuration = typeof service.duration === "string" ? service.duration : "Duração não informada";
  const serviceCategory = getCategoryLabel(service.category);
  const serviceType = service.type || "Serviço";

  // Company information
  const companyName = typeof service.company === "string" ? service.company :
    service.company?.name || "Empresa não informada";
  const companyId = typeof service.company === "object" && service.company?.id ?
    service.company.id : service.company_id;

  // Professional information
  const professionalName = typeof service.professional === "string" ? service.professional :
    service.professional?.name || null;
  const professionalId = typeof service.professional === "object" && service.professional?.id ?
    service.professional.id : service.professional_id;

  // Rating information
  const serviceRating = typeof service.rating === "number" ? service.rating : 0;
  const serviceReviews = typeof service.reviews === "number" ? service.reviews : 0;

  // Address and distance
  let displayAddress = null;
  let displayDistance = null;
  if (typeof service.address === "string") {
    displayAddress = service.address;
  } else if (typeof service.address === "object" && service.address !== null) {
    displayAddress = service.address.fullAddress || service.address.city;
    displayDistance = service.address.distance !== undefined ?
      (typeof service.address.distance === "number" ?
        `${service.address.distance.toFixed(1)} km` : service.address.distance) :
      null;
  }

  // Get service initials for avatar fallback (safely)
  const serviceInitials = serviceName ? serviceName.substring(0, 2).toUpperCase() : "SV";

  // For compact mode
  if (compact) {
    return (
      <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
        isHighlighted ? "border-l-4 border-l-[#4664EA] ring-1 ring-[#4664EA]" : ""
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={service.image} alt={serviceName} />
              <AvatarFallback className="bg-sky-100 text-sky-700">{serviceInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate">{serviceName}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{servicePrice}</span>
                <span>•</span>
                <span>{serviceDuration}</span>
              </div>
            </div>
            <Button size="sm" variant="default" className="h-8" asChild>
              <Link to={`/booking/service/${serviceId}`}>
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Agendar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 border-l-4 ${
      isHighlighted ? "border-l-[#4664EA] ring-2 ring-[#4664EA]" : "border-l-sky-500"
    }`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-[#f8f9ff]">
            <Avatar className="h-20 w-20 mb-3 border-2 border-[#eef1ff] shadow-sm">
              <AvatarImage src={service.image} alt={serviceName} />
              <AvatarFallback className="bg-sky-100 text-sky-700 text-lg">
                {serviceInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(serviceRating)}
            </div>
            <div className="text-sm text-center">
              <span className="font-semibold">{serviceRating.toFixed(1)}</span>
              <span className="text-gray-500"> ({serviceReviews} avaliações)</span>
            </div>
          </div>
          
          <div className="md:w-3/4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{serviceName}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-gray-50">
                    {serviceCategory}
                  </Badge>
                  <Badge variant="secondary" className="bg-sky-100 text-sky-700 border-none">
                    {serviceType}
                  </Badge>
                </div>
              </div>
              <div className="text-lg font-medium text-iazi-primary">
                {servicePrice}
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {serviceDescription}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 my-3">
              {serviceDuration && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" /> 
                  <span>{serviceDuration}</span>
                </div>
              )}
              
              {professionalName && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  {professionalId ? (
                    <Link to={`/professional/${professionalId}`} className="hover:text-iazi-primary">
                      {professionalName}
                    </Link>
                  ) : (
                    <span>{professionalName}</span>
                  )}
                </div>
              )}
              
              {companyName && companyId && (
                <div className="flex items-center text-sm text-gray-600">
                  <Link to={`/company/${companyId}`} className="hover:text-iazi-primary">
                    {companyName}
                  </Link>
                </div>
              )}
              
              {displayAddress && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{displayAddress}</span>
                  {displayDistance && (
                    <Badge variant="outline" className="ml-1 text-xs py-0 h-5">
                      {displayDistance}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 border-t pt-4">
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
                  Remover
                </Button>
              )}
              {!onEdit && !onPause && !onDelete && (
                <>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/service/${serviceId}`}>Ver detalhes</Link>
                  </Button>
                  <Button size="sm" className="flex-1" asChild>
                    <Link to={professionalId ? `/booking/${serviceId}?professional=${professionalId}` : `/booking/${serviceId}`}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Agendar agora
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
