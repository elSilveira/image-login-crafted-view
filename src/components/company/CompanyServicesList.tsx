// src/components/company/CompanyServicesList.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePagination } from "@/components/services/ServicePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// Removed mock imports
// import { services } from "@/lib/mock-services";
// import { mockCompany } from "@/lib/mock-company";

// Re-using definitions (ideally share types)
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
  // Add professional relation if needed
  professionals?: { id: string; name: string }[];
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
  // Get the first professional's name if available
  const professionalName = apiService.professionals && apiService.professionals.length > 0
    ? apiService.professionals[0].name
    : undefined;
  const professionalId = apiService.professionals && apiService.professionals.length > 0
    ? apiService.professionals[0].id
    : undefined;

  return {
    id: apiService.id,
    name: apiService.name,
    category: apiService.category.name,
    company: apiService.company.name,
    professional: professionalName,
    image: apiService.image,
    rating: parseFloat(averageRating.toFixed(1)),
    reviews: reviewCount,
    price: formattedPrice,
    duration: apiService.duration,
    company_id: apiService.companyId,
    professional_id: professionalId,
    description: apiService.description,
    // Availability needs to be determined differently, maybe via a separate API call or logic
    availability: "Consultar",
  };
};

interface CompanyServicesListProps {
  companyId: string | undefined;
  searchTerm: string;
  category: string;
  sortBy: string;
  ratingFilter: number[];
  priceRange: string;
  // availabilityFilter: string; // Availability filter removed for now
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const CompanyServicesList = ({
  companyId,
  searchTerm,
  category,
  sortBy,
  ratingFilter,
  priceRange,
  // availabilityFilter, // Removed
  currentPage,
  setCurrentPage,
}: CompanyServicesListProps) => {
  const [allCompanyServices, setAllCompanyServices] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch services for the specific company
  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      setAllCompanyServices([]);
      setError("ID da empresa não fornecido.");
      return;
    }

    const fetchCompanyServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Consider adding filters/sort to query params if backend supports it
        const queryParams = new URLSearchParams({
          companyId: companyId,
          include: "category,company,professionals,_count=reviews" // Include relations
          // Add other potential query params like limit=100 if needed
        });

        const response = await fetch(`/api/services?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar serviços da empresa`);
        }

        // Assuming API returns { data: [...] } structure if paginated, or array directly
        // Adjust based on actual API response structure
        const result = await response.json();
        const data: ApiService[] = Array.isArray(result) ? result : result.data ?? [];

        if (!data) {
          throw new Error("Resposta inválida da API de serviços");
        }

        const adaptedData = data.map(adaptApiService);
        setAllCompanyServices(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar serviços da empresa:", err);
        setError(err.message || "Ocorreu um erro inesperado ao carregar os serviços.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyServices();

  }, [companyId]);

  // Memoized filtering and sorting (client-side for now)
  const processedServices = useMemo(() => {
    let filtered = allCompanyServices.filter((service) => {
      // Null checks
      const name = service.name?.toLowerCase() ?? "";
      const cat = service.category?.toLowerCase() ?? "";
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch =
        !searchTerm ||
        name.includes(searchTermLower) ||
        cat.includes(searchTermLower);

      const matchesCategory =
        category === "Todas categorias" || service.category === category;

      const matchesRating = (service.rating ?? 0) >= ratingFilter[0];

      const priceValue = service.price ? parseFloat(service.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;
      const matchesPriceRange =
        priceRange === "Qualquer preço" ||
        (priceRange === "Até R$100" && priceValue <= 100) ||
        (priceRange === "R$100 a R$200" && priceValue >= 100 && priceValue <= 200) ||
        (priceRange === "R$200 a R$300" && priceValue >= 200 && priceValue <= 300) ||
        (priceRange === "Acima de R$300" && priceValue > 300);

      // Availability filter removed
      // const matchesAvailability = ...

      return matchesSearch && matchesCategory && matchesRating && matchesPriceRange;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      const priceA = a.price ? parseFloat(a.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;
      const priceB = b.price ? parseFloat(b.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;
      const durationA = a.duration ? parseInt(a.duration.replace(/\D/g, "")) : 0; // Basic duration parsing
      const durationB = b.duration ? parseInt(b.duration.replace(/\D/g, "")) : 0;

      switch (sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "reviews":
          return (b.reviews ?? 0) - (a.reviews ?? 0);
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "duration-asc":
          return durationA - durationB;
        case "duration-desc":
          return durationB - durationA;
        default: // Default sort (e.g., by name or rating)
          return (b.rating ?? 0) - (a.rating ?? 0);
      }
    });

    return sorted;

  }, [allCompanyServices, searchTerm, category, sortBy, ratingFilter, priceRange]);

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(processedServices.length / itemsPerPage);
  const paginatedServices = processedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4"><Skeleton className="h-7 w-1/2" /></h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
        </div>
        <div className="mt-6">
            <Skeleton className="h-10 w-1/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
       <Alert variant="destructive" className="my-6">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Erro ao Carregar Serviços</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (processedServices.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Nenhum serviço encontrado</h3>
        <p className="text-gray-500">
          Tente ajustar seus filtros ou verifique se a empresa cadastrou serviços.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Serviços Disponíveis ({processedServices.length})</h2>
      <div className="space-y-6">
        {paginatedServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      {totalPages > 1 && (
        <ServicePagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

