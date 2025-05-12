
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
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
        isHighlighted ? "ring-2 ring-[#9b87f5]" : "border-0 shadow"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Company Logo & Rating Section */}
          <div className="md:w-1/4 p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#f1f0fb] to-white">
            <Avatar className="h-24 w-24 mb-3 border-2 border-white shadow-sm">
              <AvatarImage src={companyImage} alt={companyName} />
              <AvatarFallback className="bg-[#9b87f5] text-white">
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
          
          {/* Company Details Section */}
          <div className="md:w-3/4 p-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#1A1F2C]">{companyName}</h3>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge className="bg-[#9b87f5] text-white hover:bg-[#7E69AB]">
                    {companyType}
                  </Badge>
                  {companySpecialty && companySpecialty !== companyType && (
                    <Badge variant="outline" className="bg-[#F1F0FB] text-[#7E69AB] border-[#D6BCFA]">
                      {companySpecialty}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {displayAddress !== "Endereço não informado" && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <MapPin className="h-4 w-4 mr-2 text-[#8E9196]" />
                <span>{displayAddress}</span>
                {displayDistance && (
                  <Badge variant="outline" className="ml-2 text-xs py-0 h-5 bg-[#F1F0FB] text-[#7E69AB] border-[#D6BCFA]">
                    {displayDistance}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Services Section */}
            {Array.isArray(company.services) && company.services.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#1A1F2C] mb-2">Serviços principais:</p>
                <div className="flex flex-wrap gap-2">
                  {company.services.slice(0, 3).map((service, i) => (
                    <Badge key={`service-${i}`} variant="outline" className="bg-white border-[#D6BCFA] text-[#7E69AB]">
                      {getServiceName(service)}
                    </Badge>
                  ))}
                  {company.services.length > 3 && (
                    <Badge variant="outline" className="bg-white border-[#D6BCFA] text-[#7E69AB]">
                      +{company.services.length - 3} mais
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Professionals Section */}
            {Array.isArray(company.professionals) && company.professionals.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#1A1F2C] mb-2">Profissionais:</p>
                <div className="flex flex-wrap gap-2">
                  {company.professionals.slice(0, 5).map((prof, index) => {
                    const profId = getProfessionalId(prof, index);
                    const profName = getProfessionalName(prof);
                    return profId !== "#" ? (
                      <Badge key={`prof-${index}`} variant="secondary" className="bg-[#F1F0FB] text-[#7E69AB]">
                        <Link
                          to={`/professional/${profId}`}
                          className="hover:text-[#9b87f5]"
                        >
                          {profName}
                        </Link>
                      </Badge>
                    ) : (
                      <Badge key={`prof-${index}`} variant="secondary" className="bg-[#F1F0FB] text-[#7E69AB]">
                        {profName}
                      </Badge>
                    );
                  })}
                  {company.professionals.length > 5 && (
                    <Badge variant="secondary" className="bg-[#F1F0FB] text-[#7E69AB]">
                      +{company.professionals.length - 5} mais
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Availability Info */}
            {companyAvailability && 
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <Calendar className="h-4 w-4 mr-2 text-[#8E9196]" />
                <span>Disponível: {companyAvailability}</span>
              </div>
            }
            
            {/* Action Buttons */}
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
              <Button variant="outline" className="flex-1 border-[#D6BCFA] text-[#7E69AB] hover:bg-[#F1F0FB] hover:text-[#7E69AB]" asChild>
                <Link to={`/company/${companyId}`}>
                  Ver detalhes
                </Link>
              </Button>
              <Button className="flex-1 bg-[#9b87f5] hover:bg-[#7E69AB] text-white" asChild>
                <Link to={`/booking/company/${companyId}`}> 
                  <Calendar className="h-4 w-4 mr-2" />
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
