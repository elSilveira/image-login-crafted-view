// src/components/company/CompanyFeaturedServices.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// Removed: import { services } from "@/lib/mock-services";

// Re-using definitions from Services.tsx for clarity (ideally share types)
interface ApiService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  categoryId: number;
  category: { id: number; name: string; icon?: string | null };
  image?: string | null;
  companyId: string;
  company: { id: string; name: string };
  reviews?: { rating: number }[];
  _count?: { reviews: number };
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

interface CompanyFeaturedServicesProps {
  companyId: string | undefined;
}

export const CompanyFeaturedServices = ({ companyId }: CompanyFeaturedServicesProps) => {
  const [featuredServices, setFeaturedServices] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      setFeaturedServices([]);
      // Optionally set an error or just show nothing
      // setError("ID da empresa não fornecido.");
      return;
    }

    const fetchFeaturedServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch top 3 services by rating for this company
        const queryParams = new URLSearchParams({
          companyId: companyId,
          sort: "rating_desc", // Assuming backend supports this sort key
          limit: "3",
          include: "category,company,_count=reviews" // Include necessary relations
        });

        const response = await fetch(`/api/services?${queryParams.toString()}`, {
           method: "GET",
           headers: {
             "Content-Type": "application/json",
           },
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar serviços em destaque`);
        }

        const result = await response.json();
        const data: ApiService[] = result.data; // Assuming pagination structure { data: [...] }

        if (!data) {
          throw new Error("Resposta inválida da API de serviços");
        }

        const adaptedData = data.map(adaptApiService);
        setFeaturedServices(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar serviços em destaque:", err);
        setError(err.message || "Ocorreu um erro inesperado ao carregar serviços em destaque.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();

  }, [companyId]); // Re-fetch if companyId changes

  // Don't render the section if loading, error, or no services
  if (isLoading) {
     return (
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Serviços em Destaque</h2>
        <div className="grid grid-cols-1 gap-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    // Optionally render an error message, or just hide the section
    console.error("Featured Services Error:", error);
    // return (
    //   <Alert variant="destructive" className="mb-8">
    //     <Terminal className="h-4 w-4" />
    //     <AlertTitle>Erro</AlertTitle>
    //     <AlertDescription>{error}</AlertDescription>
    //   </Alert>
    // );
    return null;
  }

  if (featuredServices.length === 0) {
    return null; // Don't render the section if no featured services
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Serviços em Destaque</h2>
      <div className="grid grid-cols-1 gap-6">
        {featuredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

