
// src/components/SearchDropdown.tsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react"; 
import { Input } from "./ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { debounce } from "lodash"; // Using lodash for debouncing

// Interface for combined search results from API
export interface SearchResult {
  id: string; 
  title: string;
  type: "service" | "services" | "company" | "professional"; // Allow both for compatibility
  subtitle?: string; 
  category?: string;
  directBooking?: boolean; // Flag for services that can be booked directly
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
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced function to update the search query after user stops typing
  const debouncedSetQuery = useCallback(
    debounce((query: string) => {
      setDebouncedQuery(query);
    }, 400), // 400ms debounce delay
    []
  );

  // Handle input change with immediate UI update but debounced API calls
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value); // Update UI immediately
    debouncedSetQuery(value); // Debounce actual search query
  };

  // Effect to trigger API fetch when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // TODO: Implement this API endpoint in the backend
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar sugestões`);
        }
        const data: SearchResult[] = await response.json(); // Assuming API returns SearchResult[]
        setSearchResults(data ?? []); // Handle null/undefined response
      } catch (err: any) {
        console.error("Erro ao buscar sugestões:", err);
        setError(err.message || "Erro ao buscar sugestões.");
        setSearchResults([]); // Clear results on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10" />
          <Input
            placeholder="Buscar serviços, profissionais..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-10 w-full bg-gray-50 border-gray-200 focus:bg-white h-9 text-sm"
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 animate-spin z-10" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <Command>
          <CommandList>
            {debouncedQuery.trim() && isLoading && (
              <div className="p-3 text-sm text-gray-500 flex items-center justify-center space-x-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Carregando sugestões...</span>
              </div>
            )}
            
            {!isLoading && error && (
              <div className="p-3 text-sm text-red-600">{error}</div>
            )}
            
            {!isLoading && !error && debouncedQuery.trim() && searchResults.length === 0 && (
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            )}

            {debouncedQuery.trim() && !isLoading && !error && searchResults.length > 0 && (
              <CommandGroup heading="Resultados rápidos">
                {searchResults.map((result) => (
                  <CommandItem
                    key={`${result.type}-${result.id}`}
                    onSelect={() => handleSelect(result)}
                    className="flex flex-col items-start py-3 cursor-pointer"
                  >
                    <div className="flex items-center w-full">
                      <span className="font-medium truncate" title={result.title}>{result.title}</span>
                      <div className="ml-auto flex items-center gap-2">
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {result.type === "company" ? "Empresa" :
                           result.type === "professional" ? "Profissional" :
                           "Serviço"}
                        </Badge>
                        {result.directBooking && (
                          <Badge variant="default" className="bg-green-600 text-xs">
                            Agendar
                          </Badge>
                        )}
                      </div>
                    </div>
                    {result.subtitle && (
                      <span className="text-sm text-gray-500 truncate" title={result.subtitle}>{result.subtitle}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {debouncedQuery.trim() && !isLoading && (
              <CommandItem
                onSelect={handleSearch}
                className="border-t border-gray-100 py-3 text-[#4664EA] font-medium cursor-pointer"
              >
                Ver todos os resultados para "{debouncedQuery}"
              </CommandItem>
            )}

            {!debouncedQuery.trim() && (
              <CommandGroup heading="Categorias populares">
                <div className="flex flex-wrap gap-2 p-3">
                  {popularCategories.map((category) => {
                    // Make sure to extract name as a string
                    const categoryName = typeof category.name === 'string' ? category.name : 'Categoria';
                    
                    return (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="hover:bg-gray-100 cursor-pointer px-3 py-1.5"
                        onClick={() => handleCategorySelect(category)}
                      >
                        {categoryName}
                        <span className="ml-1.5 text-xs text-gray-500">
                          {category.type === "company" ? "Empresa" : "Serviço"}
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
