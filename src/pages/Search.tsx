
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CompanyCard } from "@/components/search/CompanyCard";
import { SearchCategories } from "@/components/search/SearchCategories";
import { SearchTabs } from "@/components/search/SearchTabs";
import { ServicePagination } from "@/components/services/ServicePagination";
import { EmptyResults } from "@/components/search/EmptyResults";
import { TabsContent } from "@/components/ui/tabs";
import { professionals } from "./Professionals";
import { services } from "@/lib/mock-services";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";
  const typeFilter = searchParams.get("type") || "all";
  const highlightId = searchParams.get("highlight") || null;
  
  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState<string>(typeFilter);
  const [sortBy, setSortBy] = useState("rating");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFilter);

  useEffect(() => {
    setViewType(typeFilter);
    setSelectedCategory(categoryFilter);
  }, [typeFilter, categoryFilter]);

  const updateFilters = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    
    setSearchParams(newSearchParams);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = !searchTerm || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.professional.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = !selectedCategory || 
      service.category.toLowerCase() === selectedCategory.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });

  const filteredCompanies = professionals.filter((company) => {
    const matchesSearch = !searchTerm || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      company.professionals.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = !selectedCategory || 
      company.specialty.toLowerCase() === selectedCategory.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });

  const serviceCategories = [...new Set(services.map(service => service.category))];
  const companyCategories = [...new Set(professionals.map(company => company.specialty))];
  const allCategories = [...new Set([...serviceCategories, ...companyCategories])].sort();

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "price-asc") {
      return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
    } else if (sortBy === "price-desc") {
      return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
    }
    return 0;
  });

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const itemsPerPage = 4;
  const totalServices = sortedServices.length;
  const totalCompanies = sortedCompanies.length;
  const totalItems = viewType === "all" ? totalServices + totalCompanies : 
                     viewType === "service" ? totalServices : totalCompanies;
                     
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  
  const paginatedServices = sortedServices.slice(
    viewType === "all" ? startIdx : 0, 
    viewType === "all" ? Math.min(endIdx, totalServices) : itemsPerPage
  );
  
  const paginatedCompanies = sortedCompanies.slice(
    viewType === "all" ? Math.max(0, startIdx - totalServices) : startIdx, 
    viewType === "all" ? Math.max(0, endIdx - totalServices) : endIdx
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category: category });
    setCurrentPage(1);
  };

  const handleTabChange = (value: string) => {
    setViewType(value);
    updateFilters({ type: value });
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {searchTerm ? (
            <h1 className="text-3xl font-bold mb-2">Resultados para "{searchTerm}"</h1>
          ) : categoryFilter ? (
            <h1 className="text-3xl font-bold mb-2">{categoryFilter}</h1>
          ) : (
            <h1 className="text-3xl font-bold mb-2">Explorar</h1>
          )}
          
          <p className="text-gray-600 mb-8">
            {searchTerm || categoryFilter ? 
              `Encontramos ${filteredServices.length + filteredCompanies.length} resultados` : 
              'Explore empresas e serviços disponíveis'}
          </p>

          <SearchCategories 
            selectedCategory={selectedCategory}
            allCategories={allCategories}
            onCategoryChange={handleCategoryChange}
          />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <SearchTabs
              viewType={viewType}
              onTabChange={handleTabChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              serviceCount={filteredServices.length}
              companyCount={filteredCompanies.length}
            >
              <TabsContent value="all">
                {paginatedServices.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Serviços</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedServices.map(service => (
                        <ServiceCard 
                          key={service.id}
                          service={service}
                          isHighlighted={highlightId === service.id.toString()}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {paginatedCompanies.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Empresas</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedCompanies.map(company => (
                        <CompanyCard 
                          key={company.id}
                          company={company}
                          isHighlighted={highlightId === company.id.toString()}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="service">
                <div className="grid grid-cols-1 gap-4">
                  {sortedServices.slice(startIdx, endIdx).map(service => (
                    <ServiceCard 
                      key={service.id}
                      service={service}
                      isHighlighted={highlightId === service.id.toString()}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="company">
                <div className="grid grid-cols-1 gap-4">
                  {sortedCompanies.slice(startIdx, endIdx).map(company => (
                    <CompanyCard 
                      key={company.id}
                      company={company}
                      isHighlighted={highlightId === company.id.toString()}
                    />
                  ))}
                </div>
              </TabsContent>
            </SearchTabs>
          </div>

          {totalPages > 1 && (
            <ServicePagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}

          {filteredServices.length === 0 && filteredCompanies.length === 0 && (
            <EmptyResults />
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;
