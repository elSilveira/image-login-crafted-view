// src/components/RelatedServices.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// Removed: // import { services } from "@/lib/mock-services"; // Removed

// Assuming ApiService and adaptApiService are defined elsewhere or passed
// Re-using definitions from Services.tsx for clarity (ideally share types)
interface ApiService {
  id: string;
  name: string;
  description: string;
  price: string; 
  duration: string; 
  categoryId: number;
  category: { 
    id: number;
    name: string;
    icon?: string | null;
  };
  image?: string | null;
  companyId: string;
  company: { 
    id: string;
    name: string;
  };
  reviews?: { rating: number }[];
  _count?: { 
    reviews: number;
  };
}

interface ServiceCardData {
  id: string; 
  name: string;
  category: string;
  company: string;
  professional?: string; 
  image?: string | null;
  rating: number;
  reviews: number;
  price: string; 
  duration: string;
  availability?: string; 
  company_id: string;
  professional_id?: string; 
  description: string;
}

const adaptApiService = (apiService: ApiService): ServiceCardData => {
  const averageRating = apiService.reviews && apiService.reviews.length > 0
    ? apiService.reviews.reduce((sum, review) => sum + review.rating, 0) / apiService.reviews.length
    : 0;
  const reviewCount = apiService._count?.reviews ?? 0;
  const formattedPrice = `R$${parseFloat(apiService.price).toFixed(2).replace(".", ",")}`;

  return {
    id: apiService.id,
    name: apiService.name,
    category: apiService.category.name,
    company: apiService.company.name,
    image: apiService.image,
    rating: parseFloat(averageRating.toFixed(1)),
    reviews: reviewCount,
    price: formattedPrice,
    duration: apiService.duration,
    company_id: apiService.companyId,
    description: apiService.description,
  };
};


interface RelatedServicesProps {
  currentServiceId?: string; // Changed to string ID
  categoryId?: number;       // Need category ID to fetch related services
  companyId?: string;        // Or company ID
}

const RelatedServices = ({ currentServiceId, categoryId, companyId }: RelatedServicesProps) => {
  const [relatedServices, setRelatedServices] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId && !companyId) {
      // Cannot fetch related services without context
      setIsLoading(false);
      // Optionally set an error or just show nothing
      // setError("Contexto (categoria ou empresa) não fornecido para buscar serviços relacionados.");
      setRelatedServices([]); // Ensure it's empty
      return;
    }

    const fetchRelatedServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build query params based on available context
        const queryParams = new URLSearchParams();
        if (categoryId) {
          queryParams.append("category", categoryId.toString());
        }
        if (companyId) {
          // If both category and company are provided, category might be more relevant for "related"
          // Or adjust logic as needed. For now, prioritize category if available.
          if (!categoryId) {
             queryParams.append("companyId", companyId);
          }
        }
        queryParams.append("limit", "5"); // Fetch a few more to filter out the current one
        queryParams.append("include", "category,company"); // Include necessary relations

        const response = await fetch(`/api/services?${queryParams.toString()}`, {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar serviços relacionados`);
        }

        const result = await response.json();
        const data: ApiService[] = result.data; // Assuming pagination structure { data: [...] }

        if (!data) {
          throw new Error("Resposta inválida da API de serviços");
        }

        // Adapt and filter out the current service, limit to 2
        const adaptedAndFiltered = data
          .filter(service => service.id !== currentServiceId)
          .map(adaptApiService)
          .slice(0, 2);

        setRelatedServices(adaptedAndFiltered);

      } catch (err: any) {
        console.error("Erro ao buscar serviços relacionados:", err);
        setError(err.message || "Ocorreu um erro inesperado ao carregar serviços relacionados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedServices();

  }, [currentServiceId, categoryId, companyId]); // Re-fetch if context changes

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  // Do not show error state prominently, maybe just log it or show nothing
  if (error) {
     console.error("Related Services Error:", error);
     // return (
     //   <Alert variant="destructive" className="mt-6">
     //     <Terminal className="h-4 w-4" />
     //     <AlertTitle>Erro</AlertTitle>
     //     <AlertDescription>{error}</AlertDescription>
     //   </Alert>
     // );
     return null; // Or render nothing
  }

  if (relatedServices.length === 0) {
    // Optionally render a message or nothing if no related services found
    // return <p className="text-sm text-muted-foreground">Nenhum serviço relacionado encontrado.</p>;
    return null;
  }

  return (
    <div className="space-y-4">
      {relatedServices.map((service) => (
        <Link key={service.id} to={`/service/${service.id}`}>
          <Card className="hover:bg-accent transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {service.image ? (
                  <img
                    src={service.image} // Add null check if image is optional
                    alt={service.name ?? "Serviço"}
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    {/* Placeholder Icon */} 
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="font-medium truncate" title={service.name}>{service.name ?? "Serviço sem nome"}</div>
                  <div className="text-sm text-muted-foreground">
                    {/* Handle potential null price */} 
                    {service.price ? `A partir de ${service.price}` : "Preço não disponível"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RelatedServices;

