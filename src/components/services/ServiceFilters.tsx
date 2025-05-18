
import { useState } from "react";
import { Calendar, ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface ServiceFiltersProps {
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

export const categories = [
  "Todas categorias",
  "Tratamento Facial",
  "Fisioterapia",
  "Cabelo",
  "Fitness",
  "Nutrição",
  "Odontologia",
  "Massagem",
  "Estética",
  "Unhas",
];

export const priceRanges = [
  "Qualquer preço",
  "Até R$100",
  "R$100 a R$200",
  "R$200 a R$300",
  "Acima de R$300",
];

export const availabilityOptions = [
  "Qualquer data",
  "Hoje",
  "Amanhã",
  "Esta semana",
  "Próxima semana",
];

export const ServiceFilters = ({
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
}: ServiceFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Buscar por nome, categoria ou empresa..." 
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
            <SelectItem value="rating">Melhor avaliação</SelectItem>
            <SelectItem value="reviews">Mais avaliações</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-4 flex justify-center">
        <Button 
          variant="ghost" 
          className="text-sm text-gray-600 flex items-center gap-1"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? 'Ocultar filtros avançados' : 'Mostrar filtros avançados'}
          {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {showAdvancedFilters && (
        <div className="flex flex-col md:flex-row gap-6 pt-4 mt-4 border-t border-gray-100">
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
      )}
    </div>
  );
};
