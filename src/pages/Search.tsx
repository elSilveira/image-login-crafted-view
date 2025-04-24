
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Star, Filter, ChevronDown, MoreHorizontal } from "lucide-react";
import { popularCategories } from "@/components/SearchDropdown";
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

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

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

  const renderServiceCard = (service: any) => {
    const serviceId = service.id.toString();
    return (
      <Card key={serviceId} className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
        highlightId && serviceId === highlightId ? "ring-2 ring-[#4664EA]" : ""
      }`}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-gray-50">
              <div className="h-24 w-24 mb-3 rounded-md overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(service.rating)}
              </div>
              <div className="text-sm text-center">
                <span className="font-semibold">{service.rating}</span>
                <span className="text-gray-500"> ({service.reviews})</span>
              </div>
            </div>
            
            <div className="md:w-3/4 p-6">
              <h3 className="text-lg font-playfair font-semibold mb-1 text-iazi-text">{service.name}</h3>
              <p className="text-[#4664EA] text-sm font-inter mb-2">{service.category}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline" className="bg-gray-50">
                  {service.duration}
                </Badge>
                <Badge variant="outline" className="bg-gray-50">
                  {service.price}
                </Badge>
              </div>
              
              <Link 
                to={`/professional/${service.company_id}`}
                className="text-sm text-gray-600 hover:text-iazi-primary font-inter mb-3 block"
              >
                <span className="font-medium">Empresa:</span> {service.company}
              </Link>
              
              <Link
                to={`/professional/${service.professional_id}`}
                className="text-sm text-gray-600 hover:text-iazi-primary font-inter mb-3 block"
              >
                <span className="font-medium">Profissional:</span> {service.professional}
              </Link>
              
              <div className="flex items-center text-sm text-gray-500 mb-4 font-inter">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Disponível: {service.availability}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/service/${service.id}`}>
                    Ver detalhes
                  </Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link to={`/booking/${service.id}`}>Agendar</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCompanyCard = (company: any) => {
    const companyId = company.id.toString();
    return (
      <Card key={companyId} className={`overflow-hidden hover:shadow-md transition-shadow duration-300 ${
        highlightId && companyId === highlightId ? "ring-2 ring-[#4664EA]" : ""
      }`}>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-gray-50">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage src={company.image} alt={company.name} />
                <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(company.rating)}
              </div>
              <div className="text-sm text-center">
                <span className="font-semibold">{company.rating}</span>
                <span className="text-gray-500"> ({company.reviews})</span>
              </div>
            </div>
            
            <div className="md:w-3/4 p-6">
              <h3 className="text-lg font-playfair font-semibold mb-1 text-iazi-text">{company.name}</h3>
              <p className="text-[#4664EA] text-sm font-inter mb-2">{company.specialty}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {company.services && company.services.slice(0, 3).map((service: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-gray-50">
                    {service}
                  </Badge>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 font-inter mb-3">
                <span className="font-medium">Profissionais:</span>{" "}
                {company.professionals && company.professionals.map((prof: string, index: number) => (
                  <Link
                    key={index}
                    to={`/professional/${company.professional_ids && company.professional_ids[index] ? company.professional_ids[index] : index}`}
                    className="hover:text-iazi-primary"
                  >
                    {prof}{index < company.professionals.length - 1 ? ", " : ""}
                  </Link>
                ))}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 mb-4 font-inter">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Disponível: {company.availability}</span>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/professional/${company.id}`}>
                    Ver detalhes
                  </Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link to={`/booking/company/${company.id}`}>Agendar</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
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

          <div className="mb-6">
            <h2 className="font-medium mb-3">Categorias populares</h2>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={!selectedCategory ? "default" : "outline"} 
                className="px-3 py-1.5 cursor-pointer"
                onClick={() => handleCategoryChange("")}
              >
                Todas
              </Badge>
              {allCategories.map((category, index) => (
                <Badge 
                  key={index}
                  variant={selectedCategory === category ? "default" : "outline"} 
                  className="px-3 py-1.5 cursor-pointer"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <Tabs defaultValue={viewType} value={viewType} onValueChange={handleTabChange} className="w-full">
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({filteredServices.length + filteredCompanies.length})
                </TabsTrigger>
                <TabsTrigger value="service">
                  Serviços ({filteredServices.length})
                </TabsTrigger>
                <TabsTrigger value="company">
                  Empresas ({filteredCompanies.length})
                </TabsTrigger>
              </TabsList>

              <div className="flex justify-between items-center mt-6 mb-4">
                <div className="mt-4 sm:mt-0">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Melhor avaliação</SelectItem>
                      {viewType !== "company" && (
                        <>
                          <SelectItem value="price-asc">Menor preço</SelectItem>
                          <SelectItem value="price-desc">Maior preço</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="all">
                {paginatedServices.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Serviços</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedServices.map(service => renderServiceCard(service))}
                    </div>
                  </div>
                )}

                {paginatedCompanies.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Empresas</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {paginatedCompanies.map(company => renderCompanyCard(company))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="service">
                <div className="grid grid-cols-1 gap-4">
                  {sortedServices.slice(startIdx, endIdx).map(service => renderServiceCard(service))}
                </div>
              </TabsContent>
              
              <TabsContent value="company">
                <div className="grid grid-cols-1 gap-4">
                  {sortedCompanies.slice(startIdx, endIdx).map(company => renderCompanyCard(company))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {totalPages > 5 && (
                  <PaginationItem>
                    <MoreHorizontal className="h-4 w-4 mx-2" />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {filteredServices.length === 0 && filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Nenhum resultado encontrado</p>
              <p className="text-gray-400 mt-2">
                Tente ajustar sua pesquisa ou filtros para encontrar o que procura
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Search;
