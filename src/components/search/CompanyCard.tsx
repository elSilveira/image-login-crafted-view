
"use client";

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Briefcase, Star, User, MapPin } from "lucide-react";

interface CompanyCardProps {
  company: {
    id: number | string;
    name?: string;
    specialty?: string;
    services?: string[] | { id?: string | number; name?: string }[];
    professionals?: string[] | { id?: string | number; name?: string }[];
    professional_ids?: (number | string)[];
    image?: string;
    rating?: number;
    reviews?: number;
    availability?: string;
    address?: string | { 
      street?: string; 
      city?: string; 
      zip?: string; 
      country?: string; 
      fullAddress?: string;
      distance?: number | string;
    };
    type?: string;
    category?: string;
  };
  isHighlighted?: boolean;
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

export const CompanyCard = ({ company, isHighlighted = false }: CompanyCardProps) => {
  if (!company || typeof company.id === "undefined") {
    console.warn("[CompanyCard] Received invalid company data:", company);
    return null;
  }

  const companyId = company.id.toString();
  const companyName = company.name || "Empresa não informada";
  const companySpecialty = company.specialty || company.category || "Especialidade não informada";
  const companyImage = company.image || "";
  const companyRating = typeof company.rating === "number" ? company.rating : 0;
  const companyReviews = typeof company.reviews === "number" ? company.reviews : 0;
  const companyAvailability = company.availability || "Disponibilidade não informada";
  const companyType = company.type || "Empresa";

  // Address and distance handling
  let displayAddress = "Endereço não informado";
  let displayDistance = null;
  
  if (typeof company.address === "string") {
    displayAddress = company.address;
  } else if (typeof company.address === "object" && company.address !== null) {
    const addr = company.address;
    if (addr.fullAddress) displayAddress = addr.fullAddress;
    else if (addr.street && addr.city) displayAddress = `${addr.street}, ${addr.city}`;
    else if (addr.city) displayAddress = addr.city;
    
    // Handle distance if available
    if (addr.distance !== undefined) {
      displayDistance = typeof addr.distance === "number" ? 
                       `${addr.distance.toFixed(1)} km` : addr.distance;
    }
  }

  const getServiceName = (service: string | { id?: string | number; name?: string }): string => {
    if (typeof service === "string") return service;
    return service?.name || "Serviço não especificado";
  };

  const getProfessionalName = (prof: string | { id?: string | number; name?: string }): string => {
    if (typeof prof === "string") return prof;
    return prof?.name || "Profissional não especificado";
  };

  const getProfessionalId = (prof: string | { id?: string | number; name?: string }, index: number): string => {
    if (company.professional_ids && company.professional_ids[index]) {
        return company.professional_ids[index].toString();
    }
    if (typeof prof !== "string" && prof?.id) {
        return prof.id.toString();
    }
    return "#";
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#4664EA] ${
      isHighlighted ? "ring-2 ring-[#4664EA]" : ""
    }`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-[#f8f9ff]">
            <Avatar className="h-24 w-24 mb-3 border-2 border-[#eef1ff] shadow-sm">
              <AvatarImage src={companyImage} alt={companyName} />
              <AvatarFallback className="bg-[#4664EA] text-white">
                <Briefcase className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(companyRating)}
            </div>
            <div className="text-sm text-center">
              <span className="font-semibold">{companyRating.toFixed(1)}</span>
              <span className="text-gray-500"> ({companyReviews} avaliações)</span>
            </div>
          </div>
          
          <div className="md:w-3/4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-iazi-text">{companyName}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#eef1ff] text-[#4664EA] hover:bg-[#e5eaff]">
                    {companyType}
                  </Badge>
                  {companySpecialty && companySpecialty !== companyType && (
                    <Badge variant="outline" className="bg-gray-50">
                      {companySpecialty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {displayAddress !== "Endereço não informado" && (
              <div className="flex items-center text-sm text-gray-500 mb-3 font-inter">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <span>{displayAddress}</span>
                {displayDistance && (
                  <Badge variant="outline" className="ml-2 text-xs py-0 h-5">
                    {displayDistance}
                  </Badge>
                )}
              </div>
            )}
            
            {Array.isArray(company.services) && company.services.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-medium mb-1">Serviços principais:</p>
                <div className="flex flex-wrap gap-2">
                  {company.services.slice(0, 3).map((service, i) => (
                    <Badge key={`service-${i}`} variant="outline" className="bg-gray-50">
                      {getServiceName(service)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {Array.isArray(company.professionals) && company.professionals.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-medium mb-1">Profissionais:</p>
                <div className="flex flex-wrap gap-1">
                  {company.professionals.map((prof, index) => {
                    const profId = getProfessionalId(prof, index);
                    const profName = getProfessionalName(prof);
                    return profId !== "#" ? (
                      <Badge key={`prof-${index}`} variant="secondary" className="bg-gray-100">
                        <Link
                          to={`/professional/${profId}`}
                          className="hover:text-iazi-primary"
                        >
                          {profName}
                        </Link>
                      </Badge>
                    ) : (
                      <Badge key={`prof-${index}`} variant="secondary" className="bg-gray-100">
                        {profName}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            
            {companyAvailability && 
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Disponível: {companyAvailability}</span>
              </div>
            }
            
            <div className="flex gap-2 mt-4 border-t pt-4">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/company/${companyId}`}>
                  Ver detalhes
                </Link>
              </Button>
              <Button className="flex-1 bg-[#4664EA] hover:bg-[#3a52c7]" asChild>
                <Link to={`/booking/company/${companyId}`}> 
                  <User className="h-4 w-4 mr-1" />
                  Agendar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
