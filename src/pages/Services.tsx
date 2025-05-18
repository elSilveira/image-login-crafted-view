
// src/pages/Services.tsx
import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePagination } from "@/components/services/ServicePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Loading, PageLoading } from "@/components/ui/loading";

// Define the structure of a Service object fetched from the API (based on schema.prisma)
interface ApiService {
  id: string;
  name: string;
  description: string;
  price: string; // Prisma Decimal is often serialized as string
  duration: string; // e.g., "45min", "1h"
  categoryId: number;
  category: { // Assuming category is included in the fetch
    id: number;
    name: string;
    icon?: string | null;
  };
  image?: string | null;
  companyId: string;
  company: { // Assuming company is included
    id: string;
    name: string;
    // Add other company fields if needed
  };
  // Add other fields as needed based on actual API response
  reviews?: { rating: number }[]; // Assuming reviews might be included for average rating
  _count?: { // Assuming review count might be included
    reviews: number;
  };
}

// Define the structure expected by ServiceCard
interface ServiceCardData {
  id: number | string;
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

// Adapt API service data to the format needed by ServiceCard
const adaptApiService = (apiService: ApiService): ServiceCardData => {
  const averageRating = Array.isArray(apiService.reviews) && apiService.reviews.length > 0
    ? apiService.reviews.reduce((sum, review) => sum + review.rating, 0) / apiService.reviews.length
    : 0;
  const reviewCount = apiService._count?.reviews ?? 0;
  const formattedPrice = apiService.price ? `R$${parseFloat(apiService.price).toFixed(2).replace('.', ',')}` : "Preço não informado";

  return {
    id: apiService.id ?? "",
    name: apiService.name || "Serviço não informado",
    category: apiService.category?.name || "Categoria não informada",
    company: apiService.company?.name || "Empresa não informada",
    professional: undefined, // Not available in this API, fallback to undefined
    image: apiService.image || undefined,
    rating: typeof averageRating === 'number' && !isNaN(averageRating) ? parseFloat(averageRating.toFixed(1)) : 0,
    reviews: typeof reviewCount === 'number' ? reviewCount : 0,
    price: formattedPrice,
    duration: apiService.duration || "Duração não informada",
    availability: undefined, // Not available in this API, fallback to undefined
    company_id: apiService.companyId || "",
    professional_id: undefined, // Not available in this API, fallback to undefined
    description: apiService.description || "",
  };
};

const Services = () => {
  const [allServices, setAllServices] = useState<ServiceCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas categorias");
  const [sortBy, setSortBy] = useState("rating");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [priceRange, setPriceRange] = useState("Qualquer preço");
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Adjust API endpoint and include query params for potential server-side filtering/sorting
        const response = await fetch("/api/services?include=category,company,_count=reviews", { // Example include
           method: "GET",
           headers: {
             "Content-Type": "application/json",
             // Add auth headers if needed
           },
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar serviços`);
        }

        const data: ApiService[] = await response.json();

        if (!data) {
          throw new Error("Resposta inválida da API de serviços");
        }

        // Adapt data before setting state
        const adaptedData = data.map(adaptApiService);
        setAllServices(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar serviços:", err);
        setError(err.message || "Ocorreu um erro inesperado ao carregar os serviços.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
    // TODO: Fetch categories for the filter dropdown

  }, []);

  // Memoized filtering and sorting logic
  const processedServices = useMemo(() => {
    let filtered = allServices.filter((service) => {
      // Null checks for safety
      const name = service.name?.toLowerCase() ?? "";
      const cat = service.category?.toLowerCase() ?? "";
      const comp = service.company?.toLowerCase() ?? "";
      // const prof = service.professional?.toLowerCase() ?? "";
      const searchTermLower = searchTerm.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        name.includes(searchTermLower) ||
        cat.includes(searchTermLower) ||
        comp.includes(searchTermLower);
        // prof.includes(searchTermLower);

      const matchesCategory =
        category === "Todas categorias" || service.category === category;

      const matchesRating = (service.rating ?? 0) >= ratingFilter[0];

      // Price filtering (requires parsing the formatted string back to number)
      const priceValue = service.price ? parseFloat(service.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;
      const matchesPriceRange =
        priceRange === "Qualquer preço" ||
        (priceRange === "Até R$100" && priceValue <= 100) ||
        (priceRange === "R$100 a R$200" && priceValue >= 100 && priceValue <= 200) ||
        (priceRange === "R$200 a R$300" && priceValue >= 200 && priceValue <= 300) ||
        (priceRange === "Acima de R$300" && priceValue > 300);

      // Availability filter removed for now
      // const matchesAvailability = ...

      return matchesSearch && matchesCategory && matchesRating && matchesPriceRange;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      const priceA = a.price ? parseFloat(a.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;
      const priceB = b.price ? parseFloat(b.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;

      if (sortBy === "rating") {
        return (b.rating ?? 0) - (a.rating ?? 0);
      } else if (sortBy === "reviews") {
        return (b.reviews ?? 0) - (a.reviews ?? 0);
      } else if (sortBy === "price-asc") {
        return priceA - priceB;
      } else if (sortBy === "price-desc") {
        return priceB - priceA;
      }
      return (b.rating ?? 0) - (a.rating ?? 0); // Default sort
    });

    return sorted;

  }, [allServices, searchTerm, category, sortBy, ratingFilter, priceRange]);

  // Pagination logic
  const servicesPerPage = 4;
  const totalPages = Math.ceil(processedServices.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = processedServices.slice(indexOfFirstService, indexOfLastService);

  const handleDeleteService = (serviceId: string | number) => {
    // Implementation would go here - API call to delete the service
    console.log("Delete service:", serviceId);
    // After successful deletion, refresh the services list
  };

  const handleEditService = (serviceId: string | number) => {
    // Implementation would go here - navigate to edit page or open dialog
    console.log("Edit service:", serviceId);
  };

  const handlePauseService = (serviceId: string | number) => {
    // Implementation would go here - API call to pause the service
    console.log("Pause service:", serviceId);
  };  // Render logic
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F3F2]">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="container-padding mt-0 pt-0">
            <PageLoading>
              <Skeleton className="h-8 w-1/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              {/* Skeleton for filters */}
              <Skeleton className="h-16 w-full rounded-lg mb-6" />
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton className="h-6 w-36 mb-6" />
                <div className="space-y-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                      <Skeleton className="h-24 w-24 rounded-md" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                        <div className="flex justify-between mt-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Skeleton for pagination */}
                <div className="flex justify-center mt-8">
                  <Skeleton className="h-10 w-1/3" />
                </div>
              </div>
            </PageLoading>
          </div>
        </main>
      </div>
    );
  }  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F3F2]">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="container-padding mt-0 pt-0">
            <h1 className="text-2xl font-bold">Explorar Serviços</h1>
            <p className="text-gray-600 mb-6">
              Encontre os melhores serviços disponíveis na plataforma
            </p>
            
            <Alert variant="destructive" className="mb-6">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar Serviços</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </main>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="container-padding mt-0 pt-0">
          <h1 className="text-2xl font-bold">Explorar Serviços</h1>
          <p className="text-gray-600 mb-6">
            Encontre os melhores serviços disponíveis na plataforma
          </p>

          <ServiceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            category={category}
            setCategory={setCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            availabilityFilter={availabilityFilter}
            setAvailabilityFilter={setAvailabilityFilter}
          />

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-gray-600 mb-4">
              <p>
                <span className="font-semibold">{processedServices.length}</span> serviços encontrados
              </p>
            </div>

            {processedServices.length === 0 ? (
              <div className="text-center text-gray-500 mt-10 py-16">
                <p>Nenhum serviço encontrado com os filtros aplicados.</p>
                <p className="mt-2 text-sm">Tente ajustar seus filtros ou buscar por outros termos.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {currentServices.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service}
                      onEdit={() => handleEditService(service.id)}
                      onPause={() => handlePauseService(service.id)}
                      onDelete={() => handleDeleteService(service.id)}
                    />
                  ))}
                </div>

                <ServicePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
