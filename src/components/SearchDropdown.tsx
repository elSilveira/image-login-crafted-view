import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowRight } from "lucide-react"; 
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { SearchInputDebounced } from "./search/SearchInputDebounced";
import { getQuickBookingOptions } from "@/api/search";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Interface for combined search results from API
export interface SearchResult {
  id: string; 
  title: string;
  type: "service" | "services" | "company" | "professional"; // Allow both for compatibility
  subtitle?: string; 
  category?: string;
  directBooking?: boolean; // Flag for services that can be booked directly
  imageUrl?: string;
}

// Popular categories (assuming static for now)
export const popularCategories = [
  { id: 1, name: "Tratamento Facial", type: "services" },
  { id: 2, name: "Fisioterapia", type: "services" },
  { id: 3, name: "Clínica Dermatológica", type: "company" },
  { id: 4, name: "Salão de Beleza", type: "company" },
  { id: 5, name: "Cabelo", type: "services" },
  { id: 6, name: "Consultório Nutricional", type: "company" },
  { id: 7, name: "Odontologia", type: "services" },
  { id: 8, name: "Fitness", type: "services" },
];

export function SearchDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to trigger API fetch when query changes (using debounce from SearchInputDebounced)
  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Use our API function to get quick booking options
      const results = await getQuickBookingOptions(value);
      
      // Transform results to match SearchResult interface
      const formattedResults: SearchResult[] = results.map(item => ({
        id: item.id,
        title: item.name,
        type: item.type,
        subtitle: item.subtitle,
        category: item.category,
        directBooking: item.directBooking,
        imageUrl: item.imageUrl
      }));
      
      setSearchResults(formattedResults);
    } catch (err: any) {
      console.error("Error fetching search suggestions:", err);
      setError(err.message || "Erro ao buscar sugestões.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    // Map both 'service' and 'services' to the correct navigation
    const type = result.type === "service" ? "services" : result.type;
    if (type === "services" && result.directBooking) {
      navigate(`/booking/service/${result.id}`); // Direct booking for eligible services
    } else if (type === "services") {
      navigate(`/service/${result.id}`);
    } else if (type === "professional") {
      navigate(`/professional/${result.id}`);
    } else if (type === "company") {
      navigate(`/company/${result.id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(result.title)}&type=${type}&highlight=${result.id}`);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
    }
  };

  const handleCategorySelect = (category: typeof popularCategories[0]) => {
    setOpen(false);
    // Make sure to extract the name as a string
    const categoryName = typeof category.name === 'string' ? category.name : '';
    // Always use 'services' for service categories
    const type = category.type === "service" ? "services" : category.type;
    navigate(`/search?category=${encodeURIComponent(categoryName)}&type=${type}`);
  };

  // Group results by type for better categorization
  const groupedResults = {
    services: searchResults.filter(result => 
      result.type === "service" || result.type === "services"
    ),
    professionals: searchResults.filter(result => 
      result.type === "professional"
    ),
    companies: searchResults.filter(result => 
      result.type === "company"
    )
  };

  const hasResults = searchResults.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full max-w-md">
          <SearchInputDebounced
            value={searchQuery}
            onChange={handleSearchChange}
            isLoading={isLoading}
            placeholder="Buscar serviços, profissionais..."
            className="w-full bg-white border-gray-200 focus:border-iazi-primary rounded-full"
            delay={400}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 rounded-lg border-gray-200 shadow-lg" align="start">
        <Command className="rounded-lg">
          <CommandList>
            {searchQuery.trim() && isLoading && (
              <div className="p-3 text-sm text-gray-500 flex items-center justify-center space-x-2">
                <Loader2 className="animate-spin h-4 w-4 text-iazi-primary" />
                <span>Carregando sugestões...</span>
              </div>
            )}
            
            {!isLoading && error && (
              <div className="p-3 text-sm text-red-600">{error}</div>
            )}
            
            {!isLoading && !error && searchQuery.trim() && !hasResults && (
              <CommandEmpty className="p-3 text-gray-500">
                Nenhum resultado encontrado para "{searchQuery}"
              </CommandEmpty>
            )}

            {/* Services section - only show if results exist */}
            {groupedResults.services.length > 0 && (
              <CommandGroup heading="Serviços" className="px-2">
                {groupedResults.services.map((result) => (
                  <CommandItem
                    key={`service-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="flex items-start gap-3 py-2 cursor-pointer rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-md overflow-hidden bg-gray-100">
                      {result.imageUrl ? (
                        <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-iazi-primary/10 text-iazi-primary text-xs font-medium">
                          Serv
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm truncate" title={result.title}>{result.title}</span>
                        {result.directBooking && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">
                            Agendar
                          </Badge>
                        )}
                      </div>
                      {result.subtitle && (
                        <span className="text-xs text-gray-500 truncate" title={result.subtitle}>{result.subtitle}</span>
                      )}
                      {result.category && (
                        <span className="text-xs text-gray-400 truncate mt-0.5" title={result.category}>{result.category}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Professionals section - only show if results exist */}
            {groupedResults.professionals.length > 0 && (
              <CommandGroup heading="Profissionais" className="px-2">
                {groupedResults.professionals.map((result) => (
                  <CommandItem
                    key={`professional-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="flex items-start gap-3 py-2 cursor-pointer rounded-md hover:bg-gray-50"
                  >
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      {result.imageUrl ? (
                        <AvatarImage src={result.imageUrl} alt={result.title} />
                      ) : (
                        <AvatarFallback className="bg-iazi-primary/10 text-iazi-primary">
                          {result.title.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-sm truncate" title={result.title}>{result.title}</span>
                      </div>
                      {result.subtitle && (
                        <span className="text-xs text-gray-500 truncate" title={result.subtitle}>{result.subtitle}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Companies section - only show if results exist */}
            {groupedResults.companies.length > 0 && (
              <CommandGroup heading="Empresas" className="px-2">
                {groupedResults.companies.map((result) => (
                  <CommandItem
                    key={`company-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="flex items-start gap-3 py-2 cursor-pointer rounded-md hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 w-9 h-9 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                      {result.imageUrl ? (
                        <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs font-medium">
                          {result.title.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <span className="font-medium text-sm truncate" title={result.title}>{result.title}</span>
                      </div>
                      {result.subtitle && (
                        <span className="text-xs text-gray-500 truncate" title={result.subtitle}>{result.subtitle}</span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchQuery.trim() && !isLoading && (
              <div className="p-2 border-t border-gray-100">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between text-iazi-primary hover:text-iazi-primary-hover hover:bg-iazi-primary/5 py-1.5 h-auto"
                  onClick={handleSearch}
                >
                  <span>Ver todos os resultados</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {!searchQuery.trim() && (
              <CommandGroup heading="Categorias populares" className="px-2">
                <div className="flex flex-wrap gap-2 p-2">
                  {popularCategories.map((category) => (
                    <Badge
                      key={category.id}
                      variant="outline"
                      className="hover:bg-gray-50 cursor-pointer px-2 py-1 transition-colors border-gray-200"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                      <span className="ml-1 text-xs text-gray-400">
                        {category.type === "company" ? "Empresa" : "Serviço"}
                      </span>
                    </Badge>
                  ))}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
