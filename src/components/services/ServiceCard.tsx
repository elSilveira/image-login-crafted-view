"use client";

import { Link } from "react-router-dom";
import { Clock, Trash, PauseCircle, Pencil, Star, MapPin, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServiceCardProps {
  service: {
    id: number | string;    name?: string;
    category?: string | { id?: string | number; name?: string; categoryName?: string };
    company?: string | { id?: string | number; name?: string } | null;
    professional?: string | { id?: string | number; name?: string; image?: string };
    // New property from API
    profissional?: {
      id: string;
      name: string;
      role?: string;
      rating?: number;
      image?: string;
      hasMultiServiceSupport?: boolean;
      price?: string;
    };
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
    // Professional services might have categoryName instead of category.name
    if (typeof category.categoryName === "string" && category.categoryName.trim() !== "") return category.categoryName;
    if (typeof category.name === "string" && category.name.trim() !== "") return category.name;
    if (category.id !== undefined) return String(category.id);
  }
  return "Categoria não informada";
}

// Helper to format price as BRL
function formatPriceBRL(price: string | number | undefined): string {
  if (typeof price === "number") {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  if (typeof price === "string") {
    const parsed = parseFloat(price.replace(/[^0-9,\.]/g, '').replace(',', '.'));
    if (!isNaN(parsed)) {
      return parsed.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  }
  return "Preço não informado";
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
        className={`h-4 w-4 ${i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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

  // Debug log for profissional data
  if (process.env.NODE_ENV !== 'production' && service.profissional) {
    console.log('Service with profissional data:', {
      serviceId: service.id,
      serviceName: service.name,
      profissional: service.profissional
    });
  }

  // Safely get service properties with fallbacks
  const serviceId = service.id?.toString() ?? "";
  const serviceName = service.name || "Serviço não informado";
  const serviceDescription = service.description || "Sem descrição disponível";
  const servicePrice = formatPriceBRL(service.price);
  const serviceDuration = typeof service.duration === "string" ? service.duration : "Duração não informada";
  const serviceCategory = getCategoryLabel(service.category);
  const serviceType = service.type || "Serviço";

  // Company information
  const companyName = typeof service.company === "string" ? service.company :
    service.company?.name || "Empresa não informada";
  const companyId = typeof service.company === "object" && service.company?.id ?
    service.company.id : service.company_id;
  // Professional information - first try the new profissional format, then fall back to legacy professional format
  const profissionalFromAPI = service.profissional;
  const professionalName = profissionalFromAPI?.name ||
    (typeof service.professional === "string" ? service.professional :
      service.professional?.name || (service.professional_id ? undefined : null));
  const professionalId = profissionalFromAPI?.id ||
    (typeof service.professional === "object" && service.professional?.id ?
      service.professional.id : service.professional_id);
  const professionalImage = profissionalFromAPI?.image ||
    (typeof service.professional === "object" ? service.professional?.image : undefined);
  const professionalRole = profissionalFromAPI?.role;

  // Rating information
  const serviceRating = typeof service.rating === "number" ? service.rating : 0;
  const serviceReviews = typeof service.reviews === "number" ? service.reviews : 0;

  // Address and distance (try to get from service.address, or fallback to company.address if not present)
  let displayAddress = null;
  let displayDistance = null;
  if (service.address) {
    if (typeof service.address === "string") {
      displayAddress = service.address;
    } else if (typeof service.address === "object" && service.address !== null) {
      displayAddress = service.address.fullAddress || service.address.city;
      displayDistance = service.address.distance !== undefined ?
        (typeof service.address.distance === "number" ?
          `${service.address.distance.toFixed(1)} km` : service.address.distance) :
        null;
    }
  } else if (service.company && typeof service.company === "object" && 'address' in service.company && service.company.address) {
    const compAddr = service.company.address as any;
    displayAddress = compAddr.fullAddress || compAddr.city;
  }

  // Get service initials for avatar fallback (safely)
  const serviceInitials = serviceName ? serviceName.substring(0, 2).toUpperCase() : "SV";

  // For compact mode
  if (compact) {
    return (
      <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${isHighlighted ? "border-l-4 border-l-[#4664EA] ring-1 ring-[#4664EA]" : ""
        }`}>
        <CardContent className="p-3">          <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={professionalImage || service.image} alt={professionalName || serviceName} />
            <AvatarFallback className="bg-sky-100 text-sky-700">
              {professionalName ? professionalName.substring(0, 2).toUpperCase() : serviceInitials}
            </AvatarFallback>
          </Avatar><div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold truncate">{serviceName}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{servicePrice}</span>
              <span>•</span>
              <span>{serviceDuration}</span>
            </div>
            {professionalName && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                {professionalImage ? (
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={professionalImage} alt={professionalName} />
                    <AvatarFallback className="bg-sky-50 text-sky-700 text-[10px]">
                      {professionalName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : null}
                <span className="truncate">{professionalName}</span>
              </div>
            )}
          </div>            <Button size="sm" variant="default" className="h-8" asChild>
            <Link to={professionalId ? `/booking/service/${serviceId}?professional=${professionalId}` : `/booking/service/${serviceId}`}>
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
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 border-l-4 ${isHighlighted ? "border-l-[#4664EA] ring-2 ring-[#4664EA]" : "border-l-sky-500"
      }`}>
      <CardContent className="p-0">        <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-[#f8f9ff]">
          {/* If we have professional data, show it prominently */}
          {service.profissional ? (
            <>
              <Avatar className="h-20 w-20 mb-3 border-2 border-[#eef1ff] shadow-sm">
                <AvatarImage src={professionalImage || service.image} alt={professionalName || serviceName} />
                <AvatarFallback className="bg-sky-100 text-sky-700 text-lg">
                  {professionalName ? professionalName.substring(0, 2).toUpperCase() : serviceInitials}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold text-sm text-center mb-1">{professionalName}</h4>
              {professionalRole && (
                <div className="text-xs text-gray-500 text-center mb-2">{professionalRole}</div>
              )}
              <div className="flex items-center gap-1 mb-1">
                {service.profissional.rating ? renderStars(service.profissional.rating) : renderStars(serviceRating)}
              </div>
              <div className="text-sm text-center">
                <span className="font-semibold">{(service.profissional.rating || serviceRating).toFixed(1)}</span>
                <span className="text-gray-500"> ({serviceReviews} avaliações)</span>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="md:w-3/4 p-6">            <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">{serviceName}</h3>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-gray-50">
                {serviceCategory}
              </Badge>
              <Badge variant="secondary" className="bg-sky-100 text-sky-700 border-none">
                {serviceType}
              </Badge>
              {service.profissional && (
                <Badge variant="outline" className="bg-[#f0f4ff] text-[#4664EA] border-[#e1e7ff]">
                  Profissional Disponível
                </Badge>
              )}
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
            )}              {professionalName && (
              <div className="flex items-center text-sm text-gray-600">
                {professionalId ? (
                  <Link to={`/professional/${professionalId}`} className="hover:text-iazi-primary font-medium">
                    Ver perfil
                  </Link>
                ) : (
                  <span className="font-medium">{professionalName}</span>
                )}
                {professionalRole && (
                  <span className="ml-1 text-gray-400 text-xs">({professionalRole})</span>
                )}
                {service.profissional?.rating !== undefined && service.profissional.rating > 0 && (
                  <span className="ml-2 flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-0.5" />
                    <span className="text-xs">{service.profissional.rating.toFixed(1)}</span>
                  </span>
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
                </Button>                  <Button size="sm" className="flex-1" asChild>
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
