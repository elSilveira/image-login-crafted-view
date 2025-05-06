// src/pages/Services.tsx
import { useState, useEffect, useMemo } from "react";
import Navigation from "@/components/Navigation";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePagination } from "@/components/services/ServicePagination";
// Removed: import { services, specialties, availabilityOptions } from "@/lib/mock-services";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/library"; // Import Decimal type if needed for comparison

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
  // Add professional relation if needed/included
  reviews?: { rating: number }[]; // Assuming reviews might be included for average rating
  _count?: { // Assuming review count might be included
    reviews: number;
  };
  // Add other fields as needed based on actual API response
}

// Define the structure expected by ServiceCard (based on mock-services)
interface ServiceCardData {
  id: number | string; // Allow string ID from API
  name: string;
  category: string;
  company: string;
  professional?: string; // Optional, might not be directly available
  image?: string | null;
  rating: number;
  reviews: number;
  price: string; // Keep as string for display, but handle Decimal for sorting/filtering
  duration: string;
  availability?: string; // Optional, might not be directly available
  company_id: string;
  professional_id?: string; // Optional
  description: string;
}

// Adapt API service data to the format needed by ServiceCard and filtering logic
const adaptApiService = (apiService: ApiService): ServiceCardData => {
  // Calculate average rating and review count (example)
  const averageRating = apiService.reviews && apiService.reviews.length > 0
    ? apiService.reviews.reduce((sum, review) => sum + review.rating, 0) / apiService.reviews.length
    : 0;
  const reviewCount = apiService._count?.reviews ?? 0;

  // Format price string (example: assuming API returns a number string)
  const formattedPrice = `R$${parseFloat(apiService.price).toFixed(2).replace(".", ",")}`;

  return {
    id: apiService.id,
    name: apiService.name,
    category: apiService.category.name,
    company: apiService.company.name,
    // professional: apiService.professionals?.[0]?.name ?? "N/A", // Example if professionals included
    image: apiService.image,
    rating: parseFloat(averageRating.toFixed(1)), // Format rating
    reviews: reviewCount,
    price: formattedPrice, // Use formatted price string
    duration: apiService.duration, // Use duration directly
    // availability: "Consultar", // Placeholder as availability is complex
    company_id: apiService.companyId,
    // professional_id: apiService.professionals?.[0]?.id, // Example
    description: apiService.description,
  };
};

const Services = () => {
  const [allServices, setAllServices] = useState<ServiceCardData[]>([]); // Store adapted data
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas categorias"); // TODO: Fetch categories for filter
  const [sortBy, setSortBy] = useState("rating");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [priceRange, setPriceRange] = useState("Qualquer preço");
  // const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data"); // Removed for now
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

  // Render logic
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
          <Skeleton className="h-8 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          {/* Skeleton for filters */}
          <Skeleton className="h-20 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          {/* Skeleton for pagination */}
          <Skeleton className="h-10 w-1/3 mx-auto" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 pt-24 pb-12">
           <Alert variant="destructive" className="mt-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar Serviços</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Serviços</h1>
        <p className="text-gray-600 mb-8">
          Encontre os melhores serviços disponíveis na plataforma
        </p>

        <ServiceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory} // TODO: Pass fetched categories here
          // specialties={fetchedCategories} // Pass fetched categories
          sortBy={sortBy}
          setSortBy={setSortBy}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          // availabilityFilter={availabilityFilter} // Removed
          // setAvailabilityFilter={setAvailabilityFilter} // Removed
          // availabilityOptions={[]} // Removed
        />

        <div className="text-gray-600 mb-4">
          <p>
            <span className="font-semibold">{processedServices.length}</span> serviços encontrados
          </p>
        </div>

        {processedServices.length === 0 ? (
           <div className="text-center text-gray-500 mt-10">
            <p>Nenhum serviço encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {currentServices.map((service) => (
                // Ensure ServiceCard handles potential undefined/null values gracefully
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <ServicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Services;

