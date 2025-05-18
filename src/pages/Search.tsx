
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
import { AlertCircle, Loader2 } from "lucide-react";
import { ProfessionalQuickCard } from "@/components/home/ProfessionalQuickCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { Loading, LoadingInline, PageLoading } from "@/components/ui/loading";
import { PageContainer } from "@/components/ui/page-container";

// Interfaces
interface Service { 
  id: string; 
  name: string; 
  // Support both traditional category and professional_services category format
  category?: string | { id?: number; name?: string; categoryName?: string }; 
  categoryName?: string; // Direct categoryName field in professional_services
  company: { id: string; name: string } | null; 
  rating: number; 
  price: string | number; // Support both string and number formats
  image?: string; 
  reviews?: number; 
  duration?: string | number; // Support both string and number formats
  availability?: string; 
  company_id?: string; 
  professional_id?: string;
  // Professional can be in different formats
  professional?: string | { id: string; name: string; image?: string };
  profissional?: { 
    id: string; 
    name: string; 
    role?: string; 
    rating?: number; 
    image?: string; 
    hasMultiServiceSupport?: boolean;
    price?: string;
  };
  // Fields related to professional_services
  service?: {
    id: string;
    name: string;
    categoryId?: string | number;
    categoryName?: string;
    description?: string;
  };
  serviceId?: string;
  schedule?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}
interface Company { id: string; name: string; specialty: string; rating: number; services?: string[]; professionals?: string[]; professional_ids?: number[]; image?: string; reviews?: number; availability?: string; address?: any; }
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
  const [showFilters, setShowFilters] = useState(false);

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
        // Request professional_services instead of services
        useProfessionalServices: true,
      };
      const result = await fetchSearchResults(params);
      console.log('Search API response structure:', {
        hasServices: !!result.services,
        hasServicesByProfessional: !!result.servicesByProfessional,
        hasProfessionalServices: !!result.professional_services,
        professionals: Array.isArray(result.professionals) ? result.professionals.length : 'N/A',
        companies: Array.isArray(result.companies) ? result.companies.length : 'N/A'
      });
      
      return result;
    },
    enabled: ["all", "service", "professional", "company"].includes(viewType),
  });  
  
  // Use the new structure directly, with fallbacks for backward compatibility
  const professionals = searchApiResponse?.professionals || [];
  // Prioritize professional_services, then fall back to servicesByProfessional or services
  const services = searchApiResponse?.professional_services || searchApiResponse?.servicesByProfessional || searchApiResponse?.services || [];
  const companies = searchApiResponse?.companies || [];

  // Debug: Log the structure of professional_services if available
  if (process.env.NODE_ENV !== 'production' && searchApiResponse?.professional_services) {
    if (searchApiResponse.professional_services.length > 0) {
      const sampleService = searchApiResponse.professional_services[0];
      console.log('Debug - professional_services sample structure:', {
        id: sampleService.id,
        name: sampleService.name,
        service: sampleService.service ? {
          id: sampleService.service.id,
          name: sampleService.service.name
        } : 'No service property',
        category: typeof sampleService.category === 'object' ? {
          id: sampleService.category?.id,
          name: sampleService.category?.name,
          categoryName: sampleService.category?.categoryName
        } : sampleService.category,
        categoryName: sampleService.categoryName,
        price: sampleService.price,
        duration: sampleService.duration,
        professional: sampleService.professional,
        profissional: sampleService.profissional
      });
    } else {
      console.log('Debug - No professional_services available');
    }
  }

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
      // Handle both category structures (professional_services vs regular services)
      (service.category && service.category.name && service.category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.category && service.category.categoryName && service.category.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.categoryName && service.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (service.company && service.company.name && service.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory || selectedCategory === "Todas categorias" ||
      (service.category && service.category.name === selectedCategory) ||
      (service.category && service.category.categoryName === selectedCategory) ||
      (service.categoryName === selectedCategory);
    const matchesRating = (service.rating ?? 0) >= ratingFilter[0];    
    
    // Handle price for both traditional services and professional_services
    let priceString = service.price;
    if (typeof priceString !== 'string' && typeof priceString !== 'undefined') {
      priceString = String(priceString);
    }
    // Parse the price with more robust checking
    const priceValue = priceString ? 
      parseFloat(String(priceString).replace(/[^0-9,\.]/g, "").replace(",", ".")) : 0;
    
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
  // Mostrar loading de página inteira durante o carregamento inicial
  if (isAnyLoading && !searchApiResponse) {
    return (
      <div className="min-h-screen bg-[#F4F3F2]">
        <Navigation />
        <main className="container mx-auto pt-16 pb-12">
          <PageContainer>
            <PageLoading>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <Skeleton className="h-8 w-1/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-8" />
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={`skeleton-${index}`} className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
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
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <Skeleton className="h-10 w-52" />
              </div>
            </PageLoading>
          </PageContainer>
        </main>
      </div>
    );
  }

  // Function to render loading skeletons for specific content types
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
    ))  );
    
  // Enhanced loading skeletons that are more visible and consistent
  const renderEnhancedLoadingSkeletons = (count: number, type: 'service' | 'company' | 'professional') => (
    <div className="space-y-4">
      <Loading 
        text={type === 'service' ? 'Carregando serviços...' : 
              type === 'company' ? 'Carregando empresas...' : 
              'Carregando profissionais...'}
        size="md"
      />
      {renderLoadingSkeletons(count, type)}
    </div>
  );
  
  // Function to render content or empty state for a specific type
  const renderTypedContent = (isLoading: boolean, isError: boolean, data: any[], type: 'service' | 'company' | 'professional') => {
    if (isLoading) return renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, type);
    if (isError) return null;
    if (data.length === 0) return null; // Não renderiza a área se não houver resultados
    
    if (type === 'service') {
      return (
        <div className={`grid grid-cols-1 gap-4`}>
          {data.map(service => {
            // Process service data to ensure compatibility with ServiceCard
            // For professional_services, adapt the data structure if needed
            const adaptedService = {
              ...service,
              // If it's a professional_service with a service property, adapt the name
              name: service?.name || service?.service?.name || "Serviço sem nome",
              // Use categoryName if available directly or from service object
              category: service?.category || 
                (service?.categoryName ? { name: service?.categoryName } : 
                  (service?.service?.categoryName ? { name: service?.service?.categoryName } : undefined)),
            };
            
            return (
              <ServiceCard 
                key={service?.id ?? Math.random()} 
                service={adaptedService || {}} 
                isHighlighted={highlightId === (service?.id?.toString?.() ?? "")} 
              />
            );
          })}
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
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <main className="container mx-auto pt-16 pb-12">
        <PageContainer>
          {/* Header with improved styling */}
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
            {searchTerm ? (
              <h1 className="text-2xl font-bold mb-2 text-iazi-text">Resultados para "{searchTerm}"</h1>
            ) : categoryFilter ? (
              <h1 className="text-2xl font-bold mb-2 text-iazi-text">{categoryFilter}</h1>
            ) : (
              <h1 className="text-2xl font-bold mb-2 text-iazi-text">Explorar</h1>
            )}
            
            <div className="text-gray-600">
              {isAnyLoading ? (
                <LoadingInline text="Buscando resultados..." />
              ) : isAnyError ? (
                "Erro ao buscar resultados."
              ) : searchTerm || categoryFilter ? (
                `Encontramos ${totalItems} resultados`
              ) : (
                'Explore empresas e serviços disponíveis'
              )}
            </div>
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
                  {/* Compact filter toggle with nicer styling */}
                  <div className="mb-4 flex justify-end">
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1 bg-white/80 px-4 py-2 rounded-full shadow-sm"
                    >
                      {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                    </button>
                  </div>
                  
                  {/* Conditionally render filters */}
                  {showFilters && (
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
                  )}
                  
                  <TabsContent value="all">
                    <div className="space-y-6">
                      {/* Serviços section */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-5 text-iazi-text border-b pb-2">Serviços</h2>
                        {isLoadingSearch ? renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, 'service') : 
                         isErrorSearch ? (
                          <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro ao buscar serviços</AlertTitle>
                            <AlertDescription>Tente novamente ou refine sua busca.</AlertDescription>
                          </Alert>
                         ) :
                         paginatedServices.length === 0 ? (
                          <div className="py-4 text-center text-muted-foreground">
                            Nenhum serviço encontrado para esta busca.
                          </div>
                         ) : 
                         renderTypedContent(false, false, paginatedServices, 'service')}
                      </div>
                      
                      {/* Profissionais section */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-5 text-iazi-text border-b pb-2">Profissionais</h2>
                        {isLoadingSearch ? renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, 'professional') : 
                         isErrorSearch ? (
                          <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro ao buscar profissionais</AlertTitle>
                            <AlertDescription>Tente novamente ou refine sua busca.</AlertDescription>
                          </Alert>
                         ) :
                         paginatedProfessionals.length === 0 ? (
                          <div className="py-4 text-center text-muted-foreground">
                            Nenhum profissional encontrado para esta busca.
                          </div>
                         ) : 
                         renderTypedContent(false, false, paginatedProfessionals, 'professional')}
                      </div>

                      {/* Empresas section */}
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-semibold mb-5 text-iazi-text border-b pb-2">Empresas</h2>
                        {isLoadingSearch ? renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, 'company') : 
                         isErrorSearch ? (
                          <Alert variant="destructive" className="my-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro ao buscar empresas</AlertTitle>
                            <AlertDescription>Tente novamente ou refine sua busca.</AlertDescription>
                          </Alert>
                         ) :
                         paginatedCompanies.length === 0 ? (
                          <div className="py-4 text-center text-muted-foreground">
                            Nenhuma empresa encontrada para esta busca.
                          </div>
                         ) : 
                         renderTypedContent(false, false, paginatedCompanies, 'company')}
                      </div>
                      
                      {/* Global empty state if all sections are empty and not in loading/error state */}
                      {!isAnyLoading && !isAnyError &&
                        paginatedServices.length === 0 &&
                        paginatedCompanies.length === 0 &&
                        paginatedProfessionals.length === 0 && (
                          <div className="mt-8">
                            <EmptyResults />
                          </div>
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="service">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      {isLoadingSearch ? renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, 'service') : 
                       isErrorSearch ? (
                        <Alert variant="destructive" className="my-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Erro ao buscar serviços</AlertTitle>
                          <AlertDescription>Tente novamente ou refine sua busca.</AlertDescription>
                        </Alert>
                       ) :
                       paginatedServices.length === 0 ? (
                        <EmptyResults />
                       ) : 
                       renderTypedContent(false, false, paginatedServices, 'service')}
                    </div>
                    
                    {/* Pagination for services */}
                    {!isLoadingSearch && !isErrorSearch && totalPagesServices > 1 && (
                      <div className="mt-6 flex justify-center">
                        <ServicePagination
                          currentPage={currentPage}
                          totalPages={totalPagesServices}
                          setCurrentPage={handlePageChange}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="company">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      {isLoadingSearch ? renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, 'company') : 
                       isErrorSearch ? (
                        <Alert variant="destructive" className="my-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Erro ao buscar empresas</AlertTitle>
                          <AlertDescription>Tente novamente ou refine sua busca.</AlertDescription>
                        </Alert>
                       ) :
                       paginatedCompanies.length === 0 ? (
                        <EmptyResults />
                       ) : 
                       renderTypedContent(false, false, paginatedCompanies, 'company')}
                    </div>
                    
                    {/* Pagination for companies */}
                    {!isLoadingSearch && !isErrorSearch && totalPagesCompanies > 1 && (
                      <div className="mt-6 flex justify-center">
                        <ServicePagination
                          currentPage={currentPage}
                          totalPages={totalPagesCompanies}
                          setCurrentPage={handlePageChange}
                        />
                      </div>
                    )}
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
                      
                      {isLoadingSearch ? renderEnhancedLoadingSkeletons(ITEMS_PER_PAGE, 'professional') : 
                       isErrorSearch ? (
                        <Alert variant="destructive" className="my-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Erro ao buscar profissionais</AlertTitle>
                          <AlertDescription>Tente novamente ou refine sua busca.</AlertDescription>
                        </Alert>
                       ) :
                       paginatedProfessionals.length === 0 ? (
                        <EmptyResults />
                       ) : 
                       renderTypedContent(false, false, paginatedProfessionals, 'professional')}
                    </div>
                    
                    {/* Pagination for professionals */}
                    {!isLoadingSearch && !isErrorSearch && totalPagesProfessionals > 1 && (
                      <div className="mt-6 flex justify-center">
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

          {/* Pagination for all tabs except "all" */}
          {viewType !== "all" && !isAnyLoading && !isAnyError && totalPages > 0 && (
            <div className="mt-8 flex justify-center">
              <ServicePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={handlePageChange}
              />
            </div>
          )}

          {/* Final Check: If nothing rendered (e.g., category error blocked tabs), show generic empty/error */} 
          {isErrorCategories && <EmptyResults />}
        </PageContainer>
      </main>
    </div>
  );
};

export default Search;
