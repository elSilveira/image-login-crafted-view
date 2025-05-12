// src/components/company/CompanyServicesHeader.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { fetchCompanyDetails, fetchCategories } from "@/lib/api";

interface CompanyServicesHeaderProps {
  companyId: string | undefined;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  category: string;
  setCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  ratingFilter: number[];
  setRatingFilter: (rating: number[]) => void;
  priceRange: string;
  setPriceRange: (price: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (availability: string) => void;
}

interface CompanyDetails {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  // Add other fields as needed
}

interface Category {
  id: number;
  name: string;
  icon?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const CompanyServicesHeader = ({
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
  setAvailabilityFilter,
}: CompanyServicesHeaderProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempRatingFilter, setTempRatingFilter] = useState<number[]>(ratingFilter);
  const [tempPriceRange, setTempPriceRange] = useState<string>(priceRange);
  const [tempAvailability, setTempAvailability] = useState<string>(availabilityFilter);

  // Fetch company details
  const {
    data: company,
    isLoading: isLoadingCompany,
    isError: isErrorCompany,
    error: errorCompany,
  } = useQuery<CompanyDetails, Error>({
    queryKey: ["company", companyId],
    queryFn: () => fetchCompanyDetails(companyId as string),
    enabled: !!companyId,
  });

  // Fetch categories for the dropdown
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity, // Categories don't change often
  });

  // Extract category names from the API response
  const categoryNames = categoriesData
    ? ["Todas categorias", ...categoriesData.map(cat => {
        // Ensure we're extracting the name as a string
        if (typeof cat === 'object' && cat !== null && 'name' in cat && typeof cat.name === 'string') {
          return cat.name;
        }
        console.warn('[CompanyServicesHeader] Invalid category format:', cat);
        return 'Categoria';
      })]
    : ["Todas categorias"];

  // Apply filters from the sheet
  const applyFilters = () => {
    setRatingFilter(tempRatingFilter);
    setPriceRange(tempPriceRange);
    setAvailabilityFilter(tempAvailability);
    setIsFilterOpen(false);
  };

  // Reset filters to default values
  const resetFilters = () => {
    setTempRatingFilter([0]);
    setTempPriceRange("Qualquer preço");
    setTempAvailability("Qualquer data");
  };

  // Format rating for display
  const formatRating = (rating: number) => {
    return rating === 0 ? "Qualquer" : `${rating}+ estrelas`;
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  // Handle sort selection
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Check if any filters are active
  const hasActiveFilters = ratingFilter[0] > 0 || priceRange !== "Qualquer preço" || availabilityFilter !== "Qualquer data";

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Company Header */}
      {isLoadingCompany ? (
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ) : isErrorCompany ? (
        <Alert variant="destructive" className="mb-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Empresa</AlertTitle>
          <AlertDescription>
            {errorCompany?.message || "Não foi possível carregar os detalhes da empresa."}
          </AlertDescription>
        </Alert>
      ) : company ? (
        <div className="flex items-center space-x-4 mb-6">
          {company.logo ? (
            <img
              src={company.logo}
              alt={company.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl font-semibold">
                {company.name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            {company.rating !== undefined && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{company.rating.toFixed(1)}</span>
                {company.reviewCount !== undefined && (
                  <span className="text-gray-500 text-sm ml-1">
                    ({company.reviewCount} avaliações)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">
          {/* Category Dropdown */}
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCategories ? (
                <div className="p-2">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : isErrorCategories ? (
                <div className="p-2 text-sm text-red-500">
                  Erro ao carregar categorias
                </div>
              ) : (
                categoryNames.map((catName, index) => (
                  <SelectItem key={index} value={catName}>
                    {catName}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Mais populares</SelectItem>
              <SelectItem value="rating">Melhor avaliados</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
              <SelectItem value="duration-asc">Menor duração</SelectItem>
              <SelectItem value="duration-desc">Maior duração</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter Button and Sheet */}
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant={hasActiveFilters ? "default" : "outline"}
                className="gap-2"
              >
                Filtros
                {hasActiveFilters && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-white text-primary">
                    {(ratingFilter[0] > 0 ? 1 : 0) +
                      (priceRange !== "Qualquer preço" ? 1 : 0) +
                      (availabilityFilter !== "Qualquer data" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Refine sua busca por serviços
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Rating Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Avaliação mínima</h3>
                  <div className="mb-2">
                    <Slider
                      value={tempRatingFilter}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={setTempRatingFilter}
                      className="py-4"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatRating(tempRatingFilter[0])}
                  </p>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Faixa de preço</h3>
                  <Select
                    value={tempPriceRange}
                    onValueChange={setTempPriceRange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a faixa de preço" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qualquer preço">Qualquer preço</SelectItem>
                      <SelectItem value="Até R$100">Até R$100</SelectItem>
                      <SelectItem value="R$100 a R$200">R$100 a R$200</SelectItem>
                      <SelectItem value="R$200 a R$300">R$200 a R$300</SelectItem>
                      <SelectItem value="Acima de R$300">Acima de R$300</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Availability Filter */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Disponibilidade</h3>
                  <Select
                    value={tempAvailability}
                    onValueChange={setTempAvailability}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione a disponibilidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Qualquer data">Qualquer data</SelectItem>
                      <SelectItem value="Hoje">Hoje</SelectItem>
                      <SelectItem value="Amanhã">Amanhã</SelectItem>
                      <SelectItem value="Esta semana">Esta semana</SelectItem>
                      <SelectItem value="Este mês">Este mês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter className="flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full sm:w-auto"
                >
                  Limpar filtros
                </Button>
                <SheetClose asChild>
                  <Button onClick={applyFilters} className="w-full sm:w-auto">
                    Aplicar filtros
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              {ratingFilter[0] > 0 && (
                <Badge
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {formatRating(ratingFilter[0])}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setRatingFilter([0])}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remover filtro</span>
                  </Button>
                </Badge>
              )}

              {priceRange !== "Qualquer preço" && (
                <Badge
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {priceRange}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setPriceRange("Qualquer preço")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remover filtro</span>
                  </Button>
                </Badge>
              )}

              {availabilityFilter !== "Qualquer data" && (
                <Badge
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1"
                >
                  {availabilityFilter}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => setAvailabilityFilter("Qualquer data")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remover filtro</span>
                  </Button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-sm h-7 px-2 text-gray-500"
                onClick={() => {
                  setRatingFilter([0]);
                  setPriceRange("Qualquer preço");
                  setAvailabilityFilter("Qualquer data");
                }}
              >
                Limpar todos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
