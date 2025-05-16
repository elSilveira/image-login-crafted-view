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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fetchServices, fetchCompanies, fetchCategories, fetchSearchResults } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error state
import { AlertCircle } from "lucide-react";
import { ProfessionalQuickCard } from "@/components/home/ProfessionalQuickCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceFilters } from "@/components/services/ServiceFilters";

// Interfaces
interface Service { 
  id: string; 
  name: string; 
  category: string | { id?: number; name?: string }; 
  company: { id: string; name: string } | null; 
  rating: number; 
  price: string; 
  image?: string; 
  reviews?: number; 
  duration?: string; 
  availability?: string; 
  company_id?: string; 
  professional_id?: string; 
  professional?: string | { id: string; name: string };
  profissional?: { 
    id: string; 
    name: string; 
    role?: string; 
    rating?: number; 
    image?: string; 
    hasMultiServiceSupport?: boolean;
    price?: string;
  };
}
interface Company { id: string; name: string; specialty: string; rating: number; /* Add other fields CompanyCard expects */ services?: string[]; professionals?: string[]; professional_ids?: number[]; image?: string; reviews?: number; availability?: string; address?: any; /* address can be an object */ }
interface Category { id: number; name: string; icon: string; createdAt: string; updatedAt: string; }

const ITEMS_PER_PAGE = 4;

const priceRanges = [
  "Qualquer preço",
  "Até R$100",
  "R$100 a R$200",
  "R$200 a R$300",
  "Acima de R$300",
];

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
  const [professionalTipo, setProfessionalTipo] = useState<"all" | "only-linked" | "only-unlinked">("all");
  const [priceRange, setPriceRange] = useState("Qualquer preço");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");

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
  
  // Fetch Categories
  const { data: categoriesApiResponse, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useQuery<{ data: Category[], pagination?: any } | Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
  const actualCategoriesArray = Array.isArray(categoriesApiResponse) 
    ? categoriesApiResponse 
    : categoriesApiResponse?.data || [];
  // Extract category names and handle invalid data
  const categoryNames = actualCategoriesArray.map(cat => {
    if (typeof cat === 'object' && cat !== null && 'name' in cat && typeof cat.name === 'string') {
      return cat.name;
    }
    console.warn('[Search.tsx] Unexpected category item format or missing name:', cat);
    return 'Categoria'; // Return a default name for invalid items
  });
  
  // Map viewType to API type param (services, companies, professionals, all)
  const getApiType = (viewType: string) => {
    if (viewType === "service") return "services";
    if (viewType === "company") return "companies";
    if (viewType === "professional") return "professionals";
    return viewType;
  };
  // Fetch Search Results
  const { data: searchApiResponse, isLoading: isLoadingSearch, isError: isErrorSearch, error: errorSearch } = useQuery<any, Error>({
    queryKey: ["search-api", searchTerm, selectedCategory, sortBy, currentPage, viewType, professionalTipo],
    queryFn: async () => {
      const apiType = getApiType(viewType);
      if (apiType !== "all" && apiType !== "services" && apiType !== "professionals" && apiType !== "companies") return {};
      const params: any = {
        q: searchTerm,
        category: selectedCategory,
        sort: sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: apiType,
        professionalTipo,
      };
      const result = await fetchSearchResults(params);
      
      // Log the structure of the response to help with debugging the format change
      console.log('Search API response structure:', {
        hasServices: !!result.services,
        hasServicesByProfessional: !!result.servicesByProfessional,
        professionals: Array.isArray(result.professionals) ? result.professionals.length : 'N/A',
        companies: Array.isArray(result.companies) ? result.companies.length : 'N/A'
      });
      
      return result;
    },
    enabled: ["all", "service", "professional", "company"].includes(viewType),
  });
  // Use the new structure directly, with fallbacks for backward compatibility
  const professionals = searchApiResponse?.professionals || [];
  // Handle both new 'servicesByProfessional' and legacy 'services' response formats
  const services = searchApiResponse?.servicesByProfessional || searchApiResponse?.services || [];
  const companies = searchApiResponse?.companies || [];

  // --- Filtering, Sorting, and Pagination ---
  // Professionals tab
  const filteredProfessionals = professionals.filter((pro: any) => {
    const matchesSearch =
      !searchTerm ||
      (pro.name && pro.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pro.role && pro.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory || selectedCategory === "Todas categorias" ||
      (pro.services && pro.services.some((s: any) => s.service?.category?.name === selectedCategory));
    const matchesRating = (pro.rating ?? 0) >= ratingFilter[0];
    return matchesSearch && matchesCategory && matchesRating;
  });
  
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  
  const professionalsPerPage = ITEMS_PER_PAGE;
  const totalProfessionals = sortedProfessionals.length;
  const totalPagesProfessionals = Math.ceil(totalProfessionals / professionalsPerPage);
  const paginatedProfessionals = sortedProfessionals.slice(
    (currentPage - 1) * professionalsPerPage, 
    currentPage * professionalsPerPage
  );

  // Services tab
  const filteredServices = services.filter((service: any) => {
    const matchesSearch =
      !searchTerm ||
      (service.name && service.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.category && service.category.name && service.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.company && service.company.name && service.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory || selectedCategory === "Todas categorias" ||
      (service.category && service.category.name === selectedCategory);
    const matchesRating = (service.rating ?? 0) >= ratingFilter[0];
    const priceValue = service.price ? parseFloat(service.price.replace(/[^0-9,]/g, ".").replace(",", ".")) : 0;
    const matchesPriceRange =
      priceRange === "Qualquer preço" ||
      (priceRange === "Até R$100" && priceValue <= 100) ||
      (priceRange === "R$100 a R$200" && priceValue >= 100 && priceValue <= 200) ||
      (priceRange === "R$200 a R$300" && priceValue >= 200 && priceValue <= 300) ||
      (priceRange === "Acima de R$300" && priceValue > 300);
    // Availability filter can be implemented if service.availability exists
    return matchesSearch && matchesCategory && matchesRating && matchesPriceRange;
  });
  
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  
  const servicesPerPage = ITEMS_PER_PAGE;
  const totalServices = sortedServices.length;
  const totalPagesServices = Math.ceil(totalServices / servicesPerPage);
  const paginatedServices = sortedServices.slice(
    (currentPage - 1) * servicesPerPage, 
    currentPage * servicesPerPage
  );

  // Companies tab
  const filteredCompanies = companies.filter((company: any) => {
    const matchesSearch =
      !searchTerm ||
      (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory || selectedCategory === "Todas categorias" ||
      (company.categories && company.categories.includes(selectedCategory));
    const matchesRating = (company.rating ?? 0) >= ratingFilter[0];
    return matchesSearch && matchesCategory && matchesRating;
  });
  
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  
  const companiesPerPage = ITEMS_PER_PAGE;
  const totalCompanies = sortedCompanies.length;
  const totalPagesCompanies = Math.ceil(totalCompanies / companiesPerPage);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * companiesPerPage, 
    currentPage * companiesPerPage
  );

  // Combine loading and error states
  const isAnyLoading = isLoadingCategories || (isLoadingSearch && (viewType === 'all' || viewType === 'service' || viewType === 'professional' || viewType === 'company'));
  const isAnyError = isErrorCategories || (isErrorSearch && (viewType === 'all' || viewType === 'service' || viewType === 'professional' || viewType === 'company'));
  const combinedErrorMessages = [
      isErrorCategories ? `Categories: ${errorCategories?.message}` : null,
      isErrorSearch ? `Search: ${errorSearch?.message}` : null
  ].filter(Boolean).join("; ");

  // --- Data Processing (use fetched data) ---
  const totalItems = viewType === "all" ? totalServices + totalCompanies + totalProfessionals :
                     viewType === "service" ? totalServices : 
                     viewType === "professional" ? totalProfessionals : totalCompanies;
  
  const totalPages = viewType === "all" ? Math.max(totalPagesServices, totalPagesCompanies, totalPagesProfessionals) :
                     viewType === "service" ? totalPagesServices : 
                     viewType === "professional" ? totalPagesProfessionals : totalPagesCompanies;

  const handleCategoryChange = (category: string) => {
    updateFilters({ category: category, page: "1" });
  };

  // When changing tabs, always use singular for UI, but map to plural for API
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

  const renderLoadingSkeletons = (count: number, type: 'service' | 'company' | 'professional') => (
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
  const renderTypedContent = (isLoading: boolean, isError: boolean, data: any[], type: 'service' | 'company' | 'professional') => {
    if (isLoading) return renderLoadingSkeletons(ITEMS_PER_PAGE, type);
    if (isError) return null;
    if (data.length === 0) return null; // Não renderiza a área se não houver resultados

    if (type === 'service') {
      return (
        <div className={`grid grid-cols-1 gap-4`}>
          {data.map(service => (
            <ServiceCard 
              key={service?.id ?? Math.random()} 
              service={service || {}} 
              isHighlighted={highlightId === (service?.id?.toString?.() ?? "")} 
            />
          ))}
        </div>
      );
    }
    if (type === 'company') {
      return (
        <div className={`grid grid-cols-1 gap-6`}>
          {data.map(item => (
            <CompanyCard key={item.id} company={item} isHighlighted={highlightId === item.id.toString()} />
          ))}
        </div>
      );
    }
    if (type === 'professional') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map(pro => (
            <ProfessionalQuickCard
              key={pro.id}
              id={pro.id}
              name={pro.name || "Profissional"}
              image={pro.image}
              rating={pro.rating}
              services={pro.services}
              company={pro.company}
              role={pro.role}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          {searchTerm ? (
            <h1 className="text-3xl font-bold mb-2">Resultados para "{searchTerm}"</h1>
          ) : categoryFilter ? (
            <h1 className="text-3xl font-bold mb-2">{categoryFilter}</h1>
          ) : (
            <h1 className="text-3xl font-bold mb-2">Explorar</h1>
          )}          <div className="text-gray-600 mb-8">
            {isAnyLoading ? <Skeleton className="h-4 w-48" /> : 
             isAnyError ? "Erro ao buscar resultados." : 
             searchTerm || categoryFilter ? 
              `Encontramos ${totalItems} resultados` : 
              'Explore empresas e serviços disponíveis'}
          </div>

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
            <div>
              <Tabs defaultValue={viewType} value={viewType} onValueChange={handleTabChange}>
                <SearchTabs
                  viewType={viewType}
                  onTabChange={handleTabChange}
                  sortBy={sortBy}
                  onSortChange={handleSortChange}
                  serviceCount={totalServices} 
                  companyCount={totalCompanies}
                  professionalCount={totalProfessionals}
                >
                  {/* Filtros avançados abaixo das abas */}
                  <div className="mb-6">
                    <ServiceFilters
                      searchTerm={searchTerm}
                      setSearchTerm={v => updateFilters({ q: v })}
                      category={selectedCategory}
                      setCategory={v => updateFilters({ category: v })}
                      sortBy={sortBy}
                      setSortBy={v => handleSortChange(v)}
                      ratingFilter={ratingFilter}
                      setRatingFilter={setRatingFilter}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      availabilityFilter={availabilityFilter}
                      setAvailabilityFilter={setAvailabilityFilter}
                    />
                  </div>
                  <TabsContent value="all">
                    <div className="space-y-10">
                      {paginatedServices.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h2 className="text-xl font-semibold mb-5 text-[#1A1F2C] border-b pb-2">Serviços</h2>
                          {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedServices, 'service')}
                        </div>
                      )}
                      {paginatedProfessionals.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h2 className="text-xl font-semibold mb-5 text-[#1A1F2C] border-b pb-2">Profissionais</h2>
                          {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedProfessionals, 'professional')}
                        </div>
                      )}
                      {paginatedCompanies.length > 0 && (
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <h2 className="text-xl font-semibold mb-5 text-[#1A1F2C] border-b pb-2">Empresas</h2>
                          {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedCompanies, 'company')}
                        </div>
                      )}
                      {/* Empty state se todas as áreas estiverem vazias */}
                      {!isAnyLoading && !isAnyError &&
                        paginatedServices.length === 0 &&
                        paginatedCompanies.length === 0 &&
                        paginatedProfessionals.length === 0 &&
                        <EmptyResults />}
                    </div>
                  </TabsContent>

                  <TabsContent value="service">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedServices, 'service')}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="company">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedCompanies, 'company')}
                    </div>
                  </TabsContent>

                  <TabsContent value="professional">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="mb-4 flex items-center gap-4">
                        <label className="font-medium text-sm">Profissionais:</label>
                        <Select value={professionalTipo} onValueChange={v => setProfessionalTipo(v as any)}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por vínculo de serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="only-linked">Apenas com serviços</SelectItem>
                            <SelectItem value="only-unlinked">Apenas sem serviços</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedProfessionals, 'professional')}
                    </div>
                    
                    {/* Pagination for professionals */}
                    {!isLoadingSearch && !isErrorSearch && totalPagesProfessionals > 1 && (
                      <div className="mt-6">
                        <ServicePagination
                          currentPage={currentPage}
                          totalPages={totalPagesProfessionals}
                          setCurrentPage={handlePageChange}
                        />
                      </div>
                    )}
                  </TabsContent>
                </SearchTabs>
              </Tabs>
            </div>
          )}

          {/* Pagination */}
          {!isAnyLoading && !isAnyError && totalPages > 0 && (
            <div className="mt-8">
              <ServicePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={handlePageChange}
              />
            </div>
          )}

          {/* Final Check: If nothing rendered (e.g., category error blocked tabs), show generic empty/error */} 
          {isErrorCategories && <EmptyResults />} 
        </div>
      </main>
    </div>
  );
};

export default Search;
