
import React from "react";
import { Link } from "react-router-dom";
import { Star, Search, Filter, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { categories, priceRanges, availabilityOptions } from "@/components/services/ServiceFilters";

interface CompanyServicesHeaderProps {
  companyId: string | undefined;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  ratingFilter: number[];
  setRatingFilter: (value: number[]) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (value: string) => void;
}

// Mock company data - in a real app, this would be fetched from an API
const mockCompanyData = {
  "bella-hair-studio-112": {
    id: "bella-hair-studio-112",
    name: "Bella Hair Studio",
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035",
    logo: "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
    rating: 4.8,
    reviews: 124,
    category: "Salão de Beleza",
    description: "Salão de beleza especializado em cortes modernos, coloração e tratamentos capilares.",
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 3456-7890"
  },
  "clinica-dermabem-123": {
    id: "clinica-dermabem-123",
    name: "Clínica DermaBem",
    coverImage: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250",
    logo: "https://images.unsplash.com/photo-1629909613654-28e377c37b09",
    rating: 4.9,
    reviews: 87,
    category: "Clínica Dermatológica",
    description: "Clínica especializada em tratamentos dermatológicos estéticos e terapêuticos.",
    address: "Av. Paulista, 1000 - Bela Vista",
    phone: "(11) 2345-6789"
  },
  "fisiosaude-789": {
    id: "fisiosaude-789",
    name: "FisioSaúde",
    coverImage: "https://images.unsplash.com/photo-1574689049597-7272571aeb7c",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    rating: 4.7,
    reviews: 56,
    category: "Centro de Fisioterapia",
    description: "Centro especializado em fisioterapia, quiropraxia e reabilitação física.",
    address: "Rua Augusta, 500 - Consolação",
    phone: "(11) 4567-8901"
  }
};

export function CompanyServicesHeader({
  companyId,
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  sortBy,
  setSortBy,
  ratingFilter,
  setRatingFilter,
  priceRange,
  setPriceRange,
  availabilityFilter,
  setAvailabilityFilter
}: CompanyServicesHeaderProps) {
  // Find company by ID or use default mock data
  const company = companyId && mockCompanyData[companyId as keyof typeof mockCompanyData]
    ? mockCompanyData[companyId as keyof typeof mockCompanyData]
    : mockCompanyData["bella-hair-studio-112"];

  return (
    <div className="space-y-6">
      {/* Company Banner */}
      <div className="relative h-52 rounded-lg overflow-hidden">
        <img
          src={company.coverImage}
          alt={company.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
          <div className="h-20 w-20 rounded-lg overflow-hidden bg-white border-4 border-white shadow-md">
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-white">
            <Badge className="bg-white/20 text-white mb-1">{company.category}</Badge>
            <h1 className="text-2xl font-bold mb-0 text-white">{company.name}</h1>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.floor(company.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm">
                {company.rating} ({company.reviews} avaliações)
              </span>
            </div>
          </div>
          <div className="ml-auto">
            <Button variant="outline" className="bg-white text-iazi-text hover:bg-gray-100">
              Contatar Empresa
            </Button>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <p className="text-muted-foreground">{company.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Endereço:</span>
              <span>{company.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Telefone:</span>
              <span>{company.phone}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search & Filters */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input 
              placeholder="Buscar serviços..." 
              className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularidade</SelectItem>
              <SelectItem value="rating">Melhor avaliação</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="duration-asc">Menor duração</SelectItem>
              <SelectItem value="duration-desc">Maior duração</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row gap-6 pt-4 border-t border-gray-100">
          <div className="w-full md:w-1/3">
            <label className="flex items-center text-sm font-medium mb-2">
              <Filter className="h-4 w-4 mr-2" />
              Avaliação mínima: {ratingFilter[0]}+ estrelas
            </label>
            <Slider
              defaultValue={[0]}
              max={5}
              step={0.5}
              value={ratingFilter}
              onValueChange={setRatingFilter}
              className="py-2"
            />
          </div>

          <div className="w-full md:w-1/3">
            <label className="flex items-center text-sm font-medium mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Disponibilidade
            </label>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer data" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/3">
            <label className="flex items-center text-sm font-medium mb-2">
              <Filter className="h-4 w-4 mr-2" />
              Faixa de preço
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger>
                <SelectValue placeholder="Qualquer preço" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
