// src/components/company/CompanyPromotions.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Star, Clock, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Removed mock imports
// import { services } from "@/lib/mock-services";

interface CompanyPromotionsProps {
  companyId: string | undefined;
}

// Define the structure expected from the API for a promotion
// Assuming the API includes basic service details needed for the card
interface ApiPromotion {
  id: string; // Use string ID from DB
  serviceId: string;
  title: string;
  description: string;
  originalPrice: string; // Prisma Decimal serialized as string
  discountedPrice: string; // Prisma Decimal serialized as string
  discountPercentage: number;
  validUntil: string; // ISO Date string or formatted string
  companyId: string;
  service: { // Assuming service details are included
    id: string;
    name: string;
    image?: string | null;
    rating?: number | null; // Assuming average rating might be included
    duration?: string | null;
  };
  // Add other fields if needed
}

// Define the structure needed by the promotion card
interface PromotionCardData extends ApiPromotion {
  // Potentially add formatted fields if needed
  formattedValidUntil?: string;
}

// Adapt API promotion data (simple adaptation for now)
const adaptApiPromotion = (apiPromotion: ApiPromotion): PromotionCardData => {
  // Example: Format date if needed
  let formattedDate = apiPromotion.validUntil;
  try {
    formattedDate = new Date(apiPromotion.validUntil).toLocaleDateString("pt-BR");
  } catch (e) { /* Keep original string if parsing fails */ }

  return {
    ...apiPromotion,
    formattedValidUntil: formattedDate,
    // Ensure service object exists, provide defaults if not
    service: apiPromotion.service ?? { id: apiPromotion.serviceId, name: "Serviço não encontrado" },
  };
};

export const CompanyPromotions = ({ companyId }: CompanyPromotionsProps) => {
  const [promotions, setPromotions] = useState<PromotionCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      setPromotions([]);
      return;
    }

    const fetchPromotions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Implement this API endpoint in the backend
        // Example: /api/promotions?companyId={companyId}&include=service
        const response = await fetch(`/api/promotions?companyId=${companyId}&include=service`);

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar promoções`);
        }

        // Assuming API returns an array directly, adjust if it's paginated { data: [...] }
        const data: ApiPromotion[] = await response.json();

        if (!data) {
          throw new Error("Resposta inválida da API de promoções");
        }

        const adaptedData = data.map(adaptApiPromotion);
        setPromotions(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar promoções:", err);
        setError(err.message || "Ocorreu um erro inesperado ao carregar as promoções.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();

  }, [companyId]);

  if (isLoading) {
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Promoções</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Do not render the section if error or no promotions
  if (error) {
    console.error("Promotions Error:", error);
    // Optionally show an error message within the component area
    // return (
    //   <Alert variant="destructive" className="mb-8">
    //      <Terminal className="h-4 w-4" />
    //      <AlertTitle>Erro ao Carregar Promoções</AlertTitle>
    //      <AlertDescription>{error}</AlertDescription>
    //   </Alert>
    // );
    return null;
  }

  if (promotions.length === 0) {
    return null; // Don't render the section if no promotions
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Promoções</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promotion => {
          const service = promotion.service; // Use included service data

          // Basic check for essential service data
          if (!service || !service.id) return null;

          // Format prices (assuming they are string representations of numbers)
          const formattedOriginalPrice = `R$${parseFloat(promotion.originalPrice).toFixed(2).replace(".", ",")}`;
          const formattedDiscountedPrice = `R$${parseFloat(promotion.discountedPrice).toFixed(2).replace(".", ",")}`;

          return (
            <Card key={promotion.id} className="overflow-hidden border-2 border-iazi-rosa-2 flex flex-col">
              <div className="relative">
                <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={promotion.title ?? "Promoção"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">Sem imagem</span>
                  )}
                </div>
                {promotion.discountPercentage > 0 && (
                    <Badge className="absolute top-2 right-2 bg-iazi-rosa-escuro text-white">
                    {promotion.discountPercentage}% OFF
                    </Badge>
                )}
              </div>
              <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-1 truncate" title={promotion.title}>{promotion.title ?? "Promoção sem título"}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{promotion.description ?? "Sem descrição"}</p>

                <div className="flex items-center gap-4 mb-3 text-sm">
                  {service.rating !== null && service.rating !== undefined && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>{service.rating.toFixed(1)}</span>
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {promotion.discountPercentage > 0 && (
                     <span className="text-sm line-through text-gray-500">{formattedOriginalPrice}</span>
                  )}
                  <span className="font-bold text-lg text-iazi-primary">{formattedDiscountedPrice}</span>
                </div>

                <div className="mt-auto pt-2">
                  {promotion.formattedValidUntil && (
                     <p className="text-xs text-gray-500 mb-3">Válido até: {promotion.formattedValidUntil}</p>
                  )}
                  <Button asChild className="w-full">
                    {/* Link to booking page for the specific service */}
                    <Link to={`/booking/${service.id}`}>Agendar com Desconto</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

