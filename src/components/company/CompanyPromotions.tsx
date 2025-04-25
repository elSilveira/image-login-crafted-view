
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { services } from "@/lib/mock-services";

interface CompanyPromotionsProps {
  companyId: string | undefined;
}

// Mock promotions data - in a real app, this would be fetched from an API
const mockPromotions = [
  {
    id: 1,
    serviceId: 1,
    title: "Promoção de Limpeza de Pele",
    description: "20% de desconto para agendamentos feitos para terças e quintas.",
    originalPrice: "R$180",
    discountedPrice: "R$144",
    discountPercentage: 20,
    validUntil: "30/05/2025",
    companyId: "clinica-dermabem-123"
  },
  {
    id: 2,
    serviceId: 3,
    title: "Corte + Hidratação com Desconto",
    description: "15% de desconto em pacotes de corte com hidratação.",
    originalPrice: "R$120",
    discountedPrice: "R$102",
    discountPercentage: 15,
    validUntil: "15/06/2025",
    companyId: "bella-hair-studio-112"
  },
  {
    id: 3,
    serviceId: 2,
    title: "Pacote de Quiropraxia",
    description: "10% de desconto para pacotes com 5 sessões.",
    originalPrice: "R$750",
    discountedPrice: "R$675",
    discountPercentage: 10,
    validUntil: "20/07/2025",
    companyId: "fisiosaude-789"
  }
];

export const CompanyPromotions = ({ companyId }: CompanyPromotionsProps) => {
  // Filter promotions to get those belonging to the company
  const companyPromotions = mockPromotions.filter(promo => promo.companyId === companyId);
  
  if (companyPromotions.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Promoções</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companyPromotions.map(promotion => {
          // Find the associated service
          const service = services.find(s => s.id === promotion.serviceId);
          
          if (!service) return null;
          
          return (
            <Card key={promotion.id} className="overflow-hidden border-2 border-iazi-rosa-2">
              <div className="relative">
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={promotion.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute top-2 right-2 bg-iazi-rosa-escuro text-white">
                  {promotion.discountPercentage}% OFF
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <h3 className="font-semibold text-lg mb-1">{promotion.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{promotion.description}</p>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">{service.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm line-through text-gray-500">{promotion.originalPrice}</span>
                    <span className="font-bold text-lg text-iazi-primary">{promotion.discountedPrice}</span>
                  </div>
                  
                  <div className="mt-auto pt-2">
                    <p className="text-xs text-gray-500 mb-3">Válido até: {promotion.validUntil}</p>
                    <Button asChild className="w-full">
                      <Link to={`/booking/${service.id}`}>Agendar com Desconto</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
