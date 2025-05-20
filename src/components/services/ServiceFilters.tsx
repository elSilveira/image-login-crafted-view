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
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Buscar por nome, categoria ou empresa..." 
            className="pl-10 w-full bg-gray-50 border-iazi-border focus:bg-white focus:border-iazi-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-48 bg-white border-iazi-border">
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
          <SelectTrigger className="w-full md:w-48 bg-white border-iazi-border">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Melhor avaliação</SelectItem>
            <SelectItem value="price_asc">Menor preço</SelectItem>
            <SelectItem value="price_desc">Maior preço</SelectItem>
            <SelectItem value="name_asc">Nome A-Z</SelectItem>
            <SelectItem value="name_desc">Nome Z-A</SelectItem>
            <SelectItem value="recent">Mais recentes</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="w-full md:w-auto flex items-center gap-2 border-iazi-border hover:bg-gray-50"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Filter className="h-4 w-4" />
          {showAdvancedFilters ? 'Ocultar filtros' : 'Filtros'}
          {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-iazi-border">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-iazi-text">
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

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-iazi-text">
              <Calendar className="h-4 w-4 mr-2" />
              Disponibilidade
            </label>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="bg-white border-iazi-border">
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

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-iazi-text">
              <Filter className="h-4 w-4 mr-2" />
              Faixa de preço
            </label>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-white border-iazi-border">
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
