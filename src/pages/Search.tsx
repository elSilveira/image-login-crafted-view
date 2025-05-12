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
import { fetchServices, fetchCompanies, fetchCategories } from "@/lib/api"; // Import API functions
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error state
import { AlertCircle } from "lucide-react";

// Interfaces
interface Service { id: string; name: string; category: string; company: { id: string; name: string }; rating: number; price: string; /* Add other fields ServiceCard expects */ image?: string; reviews?: number; duration?: string; availability?: string; company_id?: string; professional_id?: string; professional?: string; }
interface Company { id: string; name: string; specialty: string; rating: number; /* Add other fields CompanyCard expects */ services?: string[]; professionals?: string[]; professional_ids?: number[]; image?: string; reviews?: number; availability?: string; address?: any; /* address can be an object */ }
interface Category { id: number; name: string; icon: string; createdAt: string; updatedAt: string; }

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
    console.log("[Search Final Effect] Updating state from URL params:", { typeFilter, categoryFilter, pageParam });
    setViewType(typeFilter);
    setSelectedCategory(categoryFilter);
    setCurrentPage(parseInt(pageParam, 10) || 1);
  }, [typeFilter, categoryFilter, pageParam]);

  const updateFilters = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) { newSearchParams.set(key, value); } else { newSearchParams.delete(key); }
    });
    if (!params.page) { newSearchParams.set("page", "1"); }
    console.log("[Search Final UpdateFilters] Setting new params:", newSearchParams.toString());
    setSearchParams(newSearchParams);
  };

  // --- Fetching Data with React Query ---
  const queryParams = { q: searchTerm, category: selectedCategory, sort: sortBy, page: currentPage, limit: ITEMS_PER_PAGE };
  console.log("[Search Final QueryParams]:", queryParams);

  // Fetch Categories
  const { data: categoriesApiResponse, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useQuery<{ data: Category[], pagination?: any } | Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  const actualCategoriesArray = Array.isArray(categoriesApiResponse) 
    ? categoriesApiResponse 
    : categoriesApiResponse?.data || [];
  // Fixed: Properly extract category names and handle invalid data
  const categoryNames = actualCategoriesArray.map(cat => {
    if (typeof cat === 'object' && cat !== null && typeof cat.name === 'string') {
      return cat.name;
    }
    console.warn('[Search.tsx] Unexpected category item format or missing name:', cat);
    return null; // Return null for invalid items
  }).filter(Boolean) as string[]; // Filter out nulls and assert as string[]
  
  console.log("[Search Final Categories Query]:", { isLoadingCategories, isErrorCategories, errorCategories: errorCategories?.message, dataLength: actualCategoriesArray.length });

  // Fetch Services
  const { data: servicesApiResponse, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useQuery<{ data: Service[], pagination: any }, Error>({
    queryKey: ["services", queryParams],
    queryFn: () => fetchServices(queryParams),
    enabled: viewType === "all" || viewType === "service",
  });
  const services = servicesApiResponse?.data || [];
  const servicesPagination = servicesApiResponse?.pagination;
  console.log("[Search Final Services Query]:", { isLoadingServices, isErrorServices, errorServices: errorServices?.message, dataLength: services.length });

  // Fetch Companies
  const { data: companiesApiResponse, isLoading: isLoadingCompanies, isError: isErrorCompanies, error: errorCompanies } = useQuery<{ data: Company[], pagination: any }, Error>({
    queryKey: ["companies", queryParams],
    queryFn: () => fetchCompanies(queryParams),
    enabled: viewType === "all" || viewType === "company",
  });
  const companies = companiesApiResponse?.data || [];
  const companiesPagination = companiesApiResponse?.pagination;
  console.log("[Search Final Companies Query]:", { isLoadingCompanies, isErrorCompanies, errorCompanies: errorCompanies?.message, dataLength: companies.length });

  // Combine loading and error states
  const isAnyLoading = isLoadingCategories || (isLoadingServices && (viewType === 'all' || viewType === 'service')) || (isLoadingCompanies && (viewType === 'all' || viewType === 'company'));
  const isAnyError = isErrorCategories || (isErrorServices && (viewType === 'all' || viewType === 'service')) || (isErrorCompanies && (viewType === 'all' || viewType === 'company'));
  const combinedErrorMessages = [
      isErrorCategories ? `Categories: ${errorCategories?.message}` : null,
      isErrorServices ? `Services: ${errorServices?.message}` : null,
      isErrorCompanies ? `Companies: ${errorCompanies?.message}` : null
  ].filter(Boolean).join("; ");
  console.log("[Search Final Combined State]:", { isAnyLoading, isAnyError, combinedErrorMessages });

  // --- Data Processing (use fetched data) ---
  const totalServices = servicesPagination?.totalItems ?? 0;
  const totalCompanies = companiesPagination?.totalItems ?? 0;
  const totalItems = viewType === "all" ? totalServices + totalCompanies :
                     viewType === "service" ? totalServices : totalCompanies;
  const totalPagesServices = servicesPagination?.totalPages ?? Math.ceil(totalServices / ITEMS_PER_PAGE);
  const totalPagesCompanies = companiesPagination?.totalPages ?? Math.ceil(totalCompanies / ITEMS_PER_PAGE);
  const totalPages = viewType === "all" ? Math.max(totalPagesServices, totalPagesCompanies) :
                     viewType === "service" ? totalPagesServices : totalPagesCompanies;
  console.log("[Search Final Pagination Info]:", { totalServices, totalCompanies, totalItems, totalPages });

  const handleCategoryChange = (category: string) => {
    updateFilters({ category: category, page: "1" });
  };

  const handleTabChange = (value: string) => {
    updateFilters({ type: value, page: "1" });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sort: value, page: "1" });
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

  // Function to render content or empty state for a specific type
  const renderTypedContent = (isLoading: boolean, isError: boolean, data: any[], type: 'service' | 'company') => {
    console.log(`[Search Final renderTypedContent - ${type}]:`, { isLoading, isError, dataLength: data.length });
    if (isLoading) {
      return renderLoadingSkeletons(ITEMS_PER_PAGE, type);
    }
    if (isError) {
        return null; // Global error alert will be shown
    }
    if (data.length === 0) {
      return <EmptyResults />; 
    }
    return (
      <div className={`grid grid-cols-1 gap-4`}>
        {type === 'service' && data.map(item => (
          <ServiceCard key={item.id} service={item as Service} isHighlighted={highlightId === item.id.toString()} />
        ))}
        {type === 'company' && data.map(item => (
          <CompanyCard key={item.id} company={item as Company} isHighlighted={highlightId === item.id.toString()} />
        ))}
      </div>
    );
  };

  console.log("[Search Final] Rendering complete component...");

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
            {isAnyLoading ? <Skeleton className="h-4 w-48" /> : 
             isAnyError ? "Erro ao buscar resultados." : 
             searchTerm || categoryFilter ? 
              `Encontramos ${totalItems} resultados` : 
              'Explore empresas e serviços disponíveis'}
          </p>

          {/* Categories */}
          {isLoadingCategories ? <Skeleton className="h-8 w-full mb-6" /> : 
           isErrorCategories ? 
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro ao Carregar Categorias</AlertTitle>
                <AlertDescription>
                    Não foi possível buscar as categorias. Tente novamente mais tarde.
                    {errorCategories && <p className="text-xs mt-2">Detalhes: {errorCategories.message}</p>}
                </AlertDescription>
            </Alert> : 
           categoryNames.length > 0 ? (
            <SearchCategories 
              selectedCategory={selectedCategory}
              allCategories={categoryNames} 
              onCategoryChange={handleCategoryChange}
            />
          ) : (
            <p className="text-gray-500 mb-6">Nenhuma categoria encontrada.</p>
          )}

          {/* Global Error Display (if not category error) */}
          {isAnyError && !isErrorCategories && (
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao Carregar Resultados</AlertTitle>
              <AlertDescription>
                Não foi possível buscar os resultados. Tente novamente mais tarde.
                {combinedErrorMessages && <p className="text-xs mt-2">Detalhes: {combinedErrorMessages}</p>}
              </AlertDescription>
            </Alert>
          )}

          {/* Tabs and Results - Only render if categories loaded successfully */}
          {!isErrorCategories && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <SearchTabs
                viewType={viewType}
                onTabChange={handleTabChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                serviceCount={totalServices} 
                companyCount={totalCompanies}
              >
                {/* Content Tabs */}
                <TabsContent value="all">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Serviços</h2>
                    {renderTypedContent(isLoadingServices, isErrorServices, services, 'service')}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Empresas</h2>
                    {renderTypedContent(isLoadingCompanies, isErrorCompanies, companies, 'company')}
                  </div>
                  {/* Combined Empty State for 'all' tab */}                  {!isAnyLoading && !isAnyError && services.length === 0 && companies.length === 0 && <EmptyResults />}
                </TabsContent>

                <TabsContent value="service">
                  {renderTypedContent(isLoadingServices, isErrorServices, services, 'service')}
                </TabsContent>
                
                <TabsContent value="company">
                  {renderTypedContent(isLoadingCompanies, isErrorCompanies, companies, 'company')}
                </TabsContent>
              </SearchTabs>
            </div>
          )}

          {/* Pagination */}
          {!isAnyLoading && !isAnyError && totalPages > 0 && (
            <ServicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={handlePageChange}
            />
          )}

          {/* Final Check: If nothing rendered (e.g., category error blocked tabs), show generic empty/error */} 
          {isErrorCategories && <EmptyResults />} 
          
        </div>
      </main>
    </div>
  );
};

export default Search;
