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
import { fetchServices, fetchCompanies, fetchCategories, fetchSearchResults } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For error state
import { AlertCircle } from "lucide-react";
import { ProfessionalCard } from "@/components/home/ProfessionalCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [professionalTipo, setProfessionalTipo] = useState<"all" | "only-linked" | "only-unlinked">("all");

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
  // Extract category names and handle invalid data
  const categoryNames = actualCategoriesArray.map(cat => {
    if (typeof cat === 'object' && cat !== null && 'name' in cat && typeof cat.name === 'string') {
      return cat.name;
    }
    console.warn('[Search.tsx] Unexpected category item format or missing name:', cat);
    return 'Categoria'; // Return a default name for invalid items
  });
  
  console.log("[Search Final Categories Query]:", { isLoadingCategories, isErrorCategories, errorCategories: errorCategories?.message, dataLength: actualCategoriesArray.length });

  // Fetch Services (now via professionals/all-services?tipo=only-linked)
  const { data: searchApiResponse, isLoading: isLoadingSearch, isError: isErrorSearch, error: errorSearch } = useQuery<any, Error>({
    queryKey: ["search-api", searchTerm, selectedCategory, sortBy, currentPage, viewType, professionalTipo],
    queryFn: async () => {
      if (viewType !== "all" && viewType !== "service" && viewType !== "professional" && viewType !== "company") return {};
      const params: any = {
        q: searchTerm,
        category: selectedCategory,
        sort: sortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        type: viewType,
        professionalTipo,
      };
      return await fetchSearchResults(params);
    },
    enabled: viewType === "all" || viewType === "service" || viewType === "professional" || viewType === "company",
  });

  // Use the new structure directly
  const professionals = searchApiResponse?.professionals || [];
  const services = searchApiResponse?.services || [];
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
    return matchesSearch && matchesCategory;
  });
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  const professionalsPerPage = ITEMS_PER_PAGE;
  const totalProfessionals = sortedProfessionals.length;
  const totalPagesProfessionals = Math.ceil(totalProfessionals / professionalsPerPage);
  const paginatedProfessionals = sortedProfessionals.slice((currentPage - 1) * professionalsPerPage, currentPage * professionalsPerPage);

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
    return matchesSearch && matchesCategory;
  });
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  const servicesPerPage = ITEMS_PER_PAGE;
  const totalServices = sortedServices.length;
  const totalPagesServices = Math.ceil(totalServices / servicesPerPage);
  const paginatedServices = sortedServices.slice((currentPage - 1) * servicesPerPage, currentPage * servicesPerPage);

  // Companies tab
  const filteredCompanies = companies.filter((company: any) => {
    const matchesSearch =
      !searchTerm ||
      (company.name && company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      !selectedCategory || selectedCategory === "Todas categorias" ||
      (company.categories && company.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });
  const companiesPerPage = ITEMS_PER_PAGE;
  const totalCompanies = sortedCompanies.length;
  const totalPagesCompanies = Math.ceil(totalCompanies / companiesPerPage);
  const paginatedCompanies = sortedCompanies.slice((currentPage - 1) * companiesPerPage, currentPage * companiesPerPage);

  // Combine loading and error states
  const isAnyLoading = isLoadingCategories || (isLoadingSearch && (viewType === 'all' || viewType === 'service' || viewType === 'professional' || viewType === 'company'));
  const isAnyError = isErrorCategories || (isErrorSearch && (viewType === 'all' || viewType === 'service' || viewType === 'professional' || viewType === 'company'));
  const combinedErrorMessages = [
      isErrorCategories ? `Categories: ${errorCategories?.message}` : null,
      isErrorSearch ? `Search: ${errorSearch?.message}` : null
  ].filter(Boolean).join("; ");
  console.log("[Search Final Combined State]:", { isAnyLoading, isAnyError, combinedErrorMessages });

  // --- Data Processing (use fetched data) ---
  const totalItems = viewType === "all" ? totalServices + totalCompanies :
                     viewType === "service" ? totalServices : totalCompanies;
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
    if (type === 'service') {
      if (isLoading) return renderLoadingSkeletons(ITEMS_PER_PAGE, type);
      if (isError) return null;
      if (data.length === 0) return <EmptyResults />;
      return (
        <div className={`grid grid-cols-1 gap-4`}>
          {data.map(service => (
            <div key={service?.id ?? Math.random()}>
              <ServiceCard service={service || {}} isHighlighted={highlightId === (service?.id?.toString?.() ?? "")} />
              {/* Optionally, show professionals for this service */}
              {Array.isArray(service?.professionals) && service.professionals.length > 0 && (
                <div className="mt-2 ml-4">
                  <div className="font-semibold text-xs text-gray-500 mb-1">Profissionais que oferecem este serviço:</div>
                  <div className="flex flex-wrap gap-2">
                    {service.professionals.map((link: any) => (
                      link?.professional && link.professional.id ? (
                        <ProfessionalCard
                          key={link.professional.id}
                          id={link.professional.id}
                          name={link.professional.name ?? "Profissional não informado"}
                          rating={link.professional.rating ?? 0}
                          image={link.professional.image || null}
                        />
                      ) : null
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    if (type === 'company') {
      if (isLoading) return renderLoadingSkeletons(ITEMS_PER_PAGE, type);
      if (isError) return null;
      if (data.length === 0) return <EmptyResults />;
      return (
        <div className={`grid grid-cols-1 gap-4`}>
          {data.map(item => (
            <CompanyCard key={item.id} company={item} isHighlighted={highlightId === item.id.toString()} />
          ))}
        </div>
      );
    }
    return null;
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
                    {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedServices, 'service')}
                  </div>
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Profissionais</h2>
                    {isLoadingSearch ? renderLoadingSkeletons(ITEMS_PER_PAGE, 'service') :
                      isErrorSearch ? null :
                      paginatedProfessionals.length === 0 ? <EmptyResults /> :
                      <div className="space-y-6">
                        {paginatedProfessionals.map((pro: any) => (
                          pro?.id ? (
                            <div key={pro.id} className="border rounded-lg bg-white shadow-sm p-5">
                              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <ProfessionalCard
                                  id={pro.id}
                                  name={pro.name ?? "Profissional não informado"}
                                  rating={pro.rating ?? 0}
                                  image={pro.image || null}
                                />
                                <div className="flex-1">
                                  {pro.company && pro.company.name && (
                                    <div className="mb-2 text-sm text-gray-600">
                                      <span className="font-semibold">Empresa:</span> {pro.company.name}
                                    </div>
                                  )}
                                  {Array.isArray(pro.services) && pro.services.length > 0 ? (
                                    <div>
                                      <div className="font-semibold text-sm mb-1">Serviços vinculados:</div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {pro.services.map((link: any) => (
                                          link?.service && link.service.id ? (
                                            <ServiceCard key={link.service.id} service={{
                                              ...link.service,
                                              price: link.price ?? link.service.price,
                                              professional: pro,
                                              company: link.service.company || pro.company,
                                              schedule: link.schedule,
                                              description: link.description ?? link.service.description,
                                            }} />
                                          ) : null
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="italic text-gray-400 text-sm">Nenhum serviço vinculado.</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : null
                        ))}
                      </div>
                    }
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Empresas</h2>
                    {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedCompanies, 'company')}
                  </div>
                  {/* Combined Empty State for 'all' tab */}
                  {!isAnyLoading && !isAnyError && paginatedServices.length === 0 && paginatedCompanies.length === 0 && paginatedProfessionals.length === 0 && <EmptyResults />}
                </TabsContent>

                <TabsContent value="service">
                  {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedServices, 'service')}
                </TabsContent>
                
                <TabsContent value="company">
                  {renderTypedContent(isLoadingSearch, isErrorSearch, paginatedCompanies, 'company')}
                </TabsContent>

                <TabsContent value="professional">
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
                  {isLoadingSearch ? (
                    renderLoadingSkeletons(ITEMS_PER_PAGE, "service")
                  ) : isErrorSearch ? (
                    <Alert variant="destructive" className="my-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erro ao Carregar Profissionais</AlertTitle>
                      <AlertDescription>
                        Não foi possível buscar os profissionais. Tente novamente mais tarde.
                        {errorSearch && <p className="text-xs mt-2">Detalhes: {errorSearch.message}</p>}
                      </AlertDescription>
                    </Alert>
                  ) : paginatedProfessionals.length === 0 ? (
                    <EmptyResults />
                  ) : (
                    <div className="space-y-6">
                      {paginatedProfessionals.map((pro: any) => (
                        pro?.id ? (
                          <div key={pro.id} className="border rounded-lg bg-white shadow-sm p-5">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                              <ProfessionalCard
                                id={pro.id}
                                name={pro.name ?? "Profissional não informado"}
                                rating={pro.rating ?? 0}
                                image={pro.image || null}
                              />
                              <div className="flex-1">
                                {pro.company && pro.company.name && (
                                  <div className="mb-2 text-sm text-gray-600">
                                    <span className="font-semibold">Empresa:</span> {pro.company.name}
                                  </div>
                                )}
                                {Array.isArray(pro.services) && pro.services.length > 0 ? (
                                  <div>
                                    <div className="font-semibold text-sm mb-1">Serviços vinculados:</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                      {pro.services.map((link: any) => (
                                        link?.service && link.service.id ? (
                                          <ServiceCard key={link.service.id} service={{
                                            ...link.service,
                                            price: link.price ?? link.service.price,
                                            professional: pro,
                                            company: link.service.company || pro.company,
                                            schedule: link.schedule,
                                            description: link.description ?? link.service.description,
                                          }} />
                                        ) : null
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="italic text-gray-400 text-sm">Nenhum serviço vinculado.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  )}
                  {/* Pagination for professionals */}
                  {!isLoadingSearch && !isErrorSearch && totalPagesProfessionals > 1 && (
                    <ServicePagination
                      currentPage={currentPage}
                      totalPages={totalPagesProfessionals}
                      setCurrentPage={handlePageChange}
                    />
                  )}
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
