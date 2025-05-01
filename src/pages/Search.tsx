"use client"; // Ensure client-side rendering for hooks

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CompanyCard } from "@/components/search/CompanyCard";
import { SearchCategories } from "@/components/search/SearchCategories";
import { SearchTabs } from "@/components/search/SearchTabs";
import { ServicePagination } from "@/components/services/ServicePagination";
import { EmptyResults } from "@/components/search/EmptyResults";
import { TabsContent } from "@/components/ui/tabs";
import { fetchServices, fetchCompanies, fetchProfessionals, fetchCategories } from "@/lib/api"; // Import API functions
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error state
import { AlertCircle } from "lucide-react";

// Define interfaces for API data (adjust based on actual API response)
interface Service {
  id: string;
  name: string;
  category: string;
  company: { id: string; name: string }; // Assuming company is an object
  professional?: { id: string; name: string }; // Optional professional
  rating: number;
  price: string; // Or number, adjust as needed
  // Add other relevant fields
}

interface Company {
  id: string;
  name: string;
  specialty: string; // Or category
  services: string[]; // Or Service[]
  professionals: string[]; // Or Professional[]
  rating: number;
  // Add other relevant fields
}

// Assuming Professional has a similar structure if needed for search results
// interface Professional { ... }

const ITEMS_PER_PAGE = 4;

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const typeFilter = searchParams.get("type") || "all";
  const highlightId = searchParams.get("highlight") || null;
  const pageParam = searchParams.get("page") || "1";

  const [currentPage, setCurrentPage] = useState(parseInt(pageParam, 10) || 1);
  const [viewType, setViewType] = useState<string>(typeFilter);
  const [sortBy, setSortBy] = useState("rating"); // Default sort
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter);

  useEffect(() => {
    setViewType(typeFilter);
    setSelectedCategory(categoryFilter);
    setCurrentPage(parseInt(pageParam, 10) || 1);
  }, [typeFilter, categoryFilter, pageParam]);

  const updateFilters = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    // Reset page to 1 when filters change, except when changing page itself
    if (!params.page) {
        newSearchParams.set("page", "1");
    }
    setSearchParams(newSearchParams);
  };

  // --- Fetching Data with React Query ---
  const queryParams = {
    q: searchTerm,
    category: selectedCategory,
    sort: sortBy,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  // Fetch Categories
  const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery<string[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity, // Categories don't change often
  });
  const allCategories = categoriesData || [];

  // Fetch Services
  const { data: servicesData, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useQuery<Service[], Error>({
    queryKey: ["services", queryParams],
    queryFn: () => fetchServices(queryParams),
    enabled: viewType === "all" || viewType === "service",
  });

  // Fetch Companies (or Professionals, adjust based on backend structure)
  // Assuming fetchCompanies returns company data
  const { data: companiesData, isLoading: isLoadingCompanies, isError: isErrorCompanies, error: errorCompanies } = useQuery<Company[], Error>({
    queryKey: ["companies", queryParams],
    queryFn: () => fetchCompanies(queryParams),
    enabled: viewType === "all" || viewType === "company",
  });

  // Combine loading and error states
  const isLoading = isLoadingCategories || isLoadingServices || isLoadingCompanies;
  const isError = isErrorCategories || isErrorServices || isErrorCompanies;
  const errorMessages = [errorServices, errorCompanies].filter(Boolean).map((e: any) => e.message).join("; ");

  // --- Data Processing (use fetched data) ---
  const services = servicesData || [];
  const companies = companiesData || [];

  // TODO: Backend should ideally handle total counts and pagination info
  // For now, assuming the fetched data is the paginated result
  // We need total counts from the backend to calculate totalPages correctly.
  // Placeholder for total counts - replace with actual data from API response
  const totalServices = services.length; // This is WRONG, needs total count from API
  const totalCompanies = companies.length; // This is WRONG, needs total count from API
  const totalItems = viewType === "all" ? totalServices + totalCompanies : // Approximation
                     viewType === "service" ? totalServices : totalCompanies;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1; // Approximation

  const handleCategoryChange = (category: string) => {
    updateFilters({ category: category, page: "1" });
  };

  const handleTabChange = (value: string) => {
    updateFilters({ type: value, page: "1" });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sort: value, page: "1" }); // Assuming backend supports 'sort' param
  };

  const handlePageChange = (page: number) => {
    updateFilters({ page: page.toString() });
  };

  // --- Rendering Logic ---

  const renderLoadingSkeletons = (count: number, type: 'service' | 'company') => (
    Array.from({ length: count }).map((_, index) => (
      <div key={`skeleton-${type}-${index}`} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex space-x-4">
          <Skeleton className="h-24 w-24 rounded-md" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-2/4 mt-2" />
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */} 
          {searchTerm ? (
            <h1 className="text-3xl font-bold mb-2">Resultados para "{searchTerm}"</h1>
          ) : categoryFilter ? (
            <h1 className="text-3xl font-bold mb-2">{categoryFilter}</h1>
          ) : (
            <h1 className="text-3xl font-bold mb-2">Explorar</h1>
          )}
          <p className="text-gray-600 mb-8">
            {isLoading ? <Skeleton className="h-4 w-48" /> : 
             isError ? "Erro ao buscar resultados." : 
             searchTerm || categoryFilter ? 
              `Encontramos ${totalItems} resultados` : // Use approximate totalItems
              'Explore empresas e serviços disponíveis'}
          </p>

          {/* Categories */} 
          {isLoadingCategories ? <Skeleton className="h-8 w-full mb-6" /> : 
           !isErrorCategories && allCategories.length > 0 && (
            <SearchCategories 
              selectedCategory={selectedCategory}
              allCategories={allCategories}
              onCategoryChange={handleCategoryChange}
            />
          )}

          {/* Tabs and Results */} 
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <SearchTabs
              viewType={viewType}
              onTabChange={handleTabChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              // Pass counts based on fetched data length (approximation)
              serviceCount={services.length} 
              companyCount={companies.length}
            >
              {/* Error Display */} 
              {isError && (
                <Alert variant="destructive" className="my-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro ao Carregar Resultados</AlertTitle>
                  <AlertDescription>
                    Não foi possível buscar os resultados. Tente novamente mais tarde.
                    {errorMessages && <p className="text-xs mt-2">Detalhes: {errorMessages}</p>}
                  </AlertDescription>
                </Alert>
              )}

              {/* Content Tabs */} 
              <TabsContent value="all">
                {isLoading ? renderLoadingSkeletons(ITEMS_PER_PAGE / 2, 'service') : 
                 !isErrorServices && services.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Serviços</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {services.map(service => (
                        <ServiceCard 
                          key={service.id}
                          service={service as any} // Cast needed if interface mismatch
                          isHighlighted={highlightId === service.id.toString()}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {isLoading ? renderLoadingSkeletons(ITEMS_PER_PAGE / 2, 'company') : 
                 !isErrorCompanies && companies.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Empresas</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {companies.map(company => (
                        <CompanyCard 
                          key={company.id}
                          company={company as any} // Cast needed if interface mismatch
                          isHighlighted={highlightId === company.id.toString()}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="service">
                {isLoading ? renderLoadingSkeletons(ITEMS_PER_PAGE, 'service') : 
                 !isErrorServices && services.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {services.map(service => (
                      <ServiceCard 
                        key={service.id}
                        service={service as any} // Cast needed if interface mismatch
                        isHighlighted={highlightId === service.id.toString()}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="company">
                {isLoading ? renderLoadingSkeletons(ITEMS_PER_PAGE, 'company') : 
                 !isErrorCompanies && companies.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {companies.map(company => (
                      <CompanyCard 
                        key={company.id}
                        company={company as any} // Cast needed if interface mismatch
                        isHighlighted={highlightId === company.id.toString()}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </SearchTabs>
          </div>

          {/* Pagination */} 
          {!isLoading && !isError && totalPages > 1 && (
            <ServicePagination
              currentPage={currentPage}
              totalPages={totalPages} // Use approximate totalPages
              setCurrentPage={handlePageChange}
            />
          )}

          {/* Empty Results */} 
          {!isLoading && !isError && services.length === 0 && companies.length === 0 && (
            <EmptyResults />
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;

