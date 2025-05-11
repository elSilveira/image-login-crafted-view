"use client";

import { Link } from "react-router-dom";
import { Star, Calendar, User, Briefcase, MapPin } from "lucide-react"; 
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
    // Potentially missing fields that might be causing issues if accessed directly
    description?: string; // Example of a field that might be expected but not always present
  };
  isHighlighted?: boolean;
}

const renderStars = (rating?: number) => {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    // console.warn("[ServiceCard] Invalid rating value:", rating);
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

export const ServiceCard = ({ service, isHighlighted = false }: ServiceCardProps) => {
  // Detailed logging of the received service prop
  // console.log("[ServiceCard] Rendering with service data:", JSON.stringify(service, null, 2));

  if (!service || typeof service.id === "undefined") {
    console.warn("[ServiceCard] Received invalid or incomplete service data. ID is missing. Service:", service);
    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 p-4">
            <p className="text-red-500">Erro: Dados do serviço inválidos ou incompletos.</p>
        </Card>
    ); 
  }

  const serviceId = service.id.toString();
  const serviceName = service.name || "Serviço não informado";
  const serviceDescription = service.description || "";
  const serviceCategory = typeof service.category === "string" ? service.category : "Categoria não informada";
  const serviceImage = typeof service.image === "string" ? service.image : ""; 
  const serviceRating = typeof service.rating === "number" ? parseFloat(service.rating.toFixed(1)) : 0;
  const serviceReviews = typeof service.reviews === "number" ? service.reviews : 0;
  const servicePrice = typeof service.price === "string" ? service.price : "Preço não informado";
  const serviceDuration = typeof service.duration === "string" ? service.duration : "Duração não informada";
  const serviceAvailability = typeof service.availability === "string" ? service.availability : "Disponibilidade não informada";
  
  const companyName = typeof service.company === "string" 
                        ? service.company 
                        : (typeof service.company === "object" && service.company !== null && typeof service.company.name === "string") 
                          ? service.company.name 
                          : "Empresa não informada";
  const companyId = typeof service.company_id !== "undefined" 
                      ? service.company_id.toString() 
                      : (typeof service.company === "object" && service.company !== null && typeof service.company.id !== "undefined") 
                        ? service.company.id.toString()
                        : "#";

  const professionalName = typeof service.professional === "string" 
                             ? service.professional 
                             : (typeof service.professional === "object" && service.professional !== null && typeof service.professional.name === "string") 
                               ? service.professional.name 
                               : "Profissional não informado";
  const professionalId = typeof service.professional_id !== "undefined" 
                           ? service.professional_id.toString() 
                           : (typeof service.professional === "object" && service.professional !== null && typeof service.professional.id !== "undefined") 
                             ? service.professional.id.toString()
                             : "#";

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
      isHighlighted ? "ring-2 ring-[#4664EA]" : ""
    }`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-gray-50">
            <Avatar className="h-24 w-24 mb-3 border-2 border-gray-200 shadow-sm">
              <AvatarImage src={serviceImage} alt={serviceName} />
              <AvatarFallback className="bg-sky-100 text-sky-700">
                <Briefcase className="h-8 w-8" /> 
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="md:w-3/4 p-6 flex flex-col gap-2">
            <h3 className="text-lg font-playfair font-semibold text-iazi-text mb-1">{serviceName}</h3>
            {serviceDescription && (
              <p className="text-gray-700 text-sm mb-2 line-clamp-2">{serviceDescription}</p>
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-iazi-primary text-base">{servicePrice}</span>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/service/${serviceId}`}>
                  Ver detalhes
                </Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to={`/booking/${serviceId}`}>Agendar</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

