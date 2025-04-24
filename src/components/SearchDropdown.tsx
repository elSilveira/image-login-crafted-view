
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import { professionals } from "@/pages/Professionals";
import { services } from "@/lib/mock-services";

export interface SearchResult {
  id: string | number;
  title: string;
  type: "service" | "company";
  subtitle: string;
  category?: string;
}

// Categorias populares
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

  // Convert professionals and services to searchable results
  const searchResults: SearchResult[] = [
    ...professionals.map((prof) => ({
      id: prof.id,
      title: prof.name,
      type: "company" as const,
      subtitle: prof.specialty,
      category: prof.specialty,
    })),
    ...services.map((service) => ({
      id: service.id,
      title: service.name,
      type: "service" as const,
      subtitle: `${service.company} • ${service.professional}`,
      category: service.category,
    })),
  ];

  // Filter results based on search query
  const filteredResults = searchResults.filter((result) =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 results for dropdown

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${result.type}&highlight=${result.id}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
    }
  };

  const handleCategorySelect = (category: typeof popularCategories[0]) => {
    setOpen(false);
    navigate(`/search?category=${encodeURIComponent(category.name)}&type=${category.type}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white h-9 text-sm"
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
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {searchQuery.trim() ? (
              <>
                {filteredResults.length > 0 && (
                  <CommandGroup heading="Resultados rápidos">
                    {filteredResults.map((result) => (
                      <CommandItem
                        key={`${result.type}-${result.id}`}
                        onSelect={() => handleSelect(result)}
                        className="flex flex-col items-start py-3"
                      >
                        <div className="flex items-center w-full">
                          <span className="font-medium">{result.title}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {result.type === "company" ? "Empresa" : "Serviço"}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{result.subtitle}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                <CommandItem
                  onSelect={handleSearch}
                  className="border-t border-gray-100 py-3 text-[#4664EA] font-medium"
                >
                  Ver todos os resultados para "{searchQuery}"
                </CommandItem>
              </>
            ) : (
              <CommandGroup heading="Categorias populares">
                <div className="flex flex-wrap gap-2 p-3">
                  {popularCategories.map((category) => (
                    <Badge 
                      key={category.id}
                      variant="outline" 
                      className="hover:bg-gray-100 cursor-pointer px-3 py-1.5"
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category.name}
                      <span className="ml-1.5 text-xs text-gray-500">
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
