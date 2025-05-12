
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
  type: "service" | "company" | "professional"; 
  subtitle?: string; 
  category?: string;
  directBooking?: boolean; // Flag for services that can be booked directly
}

// Popular categories (assuming static for now)
export const popularCategories = [
  { id: 1, name: "Tratamento Facial", type: "service" },
  { id: 2, name: "Fisioterapia", type: "service" },
  { id: 3, name: "Clínica Dermatológica", type: "company" },
  { id: 4, name: "Salão de Beleza", type: "company" },
  { id: 5, name: "Cabelo", type: "service" },
  { id: 6, name: "Consultório Nutricional", type: "company" },
  { id: 7, name: "Odontologia", type: "service" },
  { id: 8, name: "Fitness", type: "service" },
];

export function SearchDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced function to fetch search results
  const debouncedFetchResults = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // TODO: Implement this API endpoint in the backend
        // Example: /api/search/suggestions?q={query}&limit=5
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}&limit=5`);
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
    }, 300), // 300ms debounce delay
    []
  );

  // Effect to trigger debounced fetch when searchQuery changes
  useEffect(() => {
    debouncedFetchResults(searchQuery);
  }, [searchQuery, debouncedFetchResults]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    // Navigate based on result type with optimized paths for booking
    if (result.type === "service" && result.directBooking) {
      navigate(`/booking/service/${result.id}`); // Direct booking for eligible services
    } else if (result.type === "service") {
      navigate(`/service/${result.id}`);
    } else if (result.type === "professional") {
      navigate(`/professional/${result.id}`);
    } else if (result.type === "company") {
      navigate(`/company/${result.id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(result.title)}&type=${result.type}&highlight=${result.id}`);
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
    navigate(`/search?category=${encodeURIComponent(categoryName)}&type=${category.type}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10" />
          {isLoading && (
             <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 animate-spin z-10" />
          )}
          <Input
            placeholder="Buscar serviços, profissionais..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 w-full bg-gray-50 border-gray-200 focus:bg-white h-9 text-sm"
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="end">
        <Command>
          <CommandList>
            {isLoading && !searchQuery.trim() && (
                <div className="p-3 text-sm text-gray-500">Carregando...</div>
            )}
            {!isLoading && error && (
                <div className="p-3 text-sm text-red-600">{error}</div>
            )}
            {!isLoading && !error && searchQuery.trim() && searchResults.length === 0 && (
                <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            )}

            {searchQuery.trim() && !isLoading && !error && searchResults.length > 0 && (
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

            {searchQuery.trim() && !isLoading && (
                 <CommandItem
                  onSelect={handleSearch}
                  className="border-t border-gray-100 py-3 text-[#4664EA] font-medium cursor-pointer"
                >
                  Ver todos os resultados para "{searchQuery}"
                </CommandItem>
            )}

            {!searchQuery.trim() && (
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
