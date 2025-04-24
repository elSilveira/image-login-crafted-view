
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { professionals } from "@/pages/Professionals";
import { services } from "@/pages/Services";

export interface SearchResult {
  id: string | number;
  title: string;
  type: "service" | "company";
  subtitle: string;
}

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
    })),
    ...services.map((service) => ({
      id: service.id,
      title: service.name,
      type: "service" as const,
      subtitle: `${service.category} • ${service.company}`,
    })),
  ];

  // Filter results based on search query
  const filteredResults = searchResults.filter((result) =>
    result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 results for dropdown

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    if (result.type === "service") {
      navigate(`/services?highlight=${result.id}`);
    } else {
      navigate(`/professionals?highlight=${result.id}`);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar serviços ou empresas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
            onClick={() => setOpen(true)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            {filteredResults.length > 0 && (
              <>
                <CommandGroup heading="Resultados rápidos">
                  {filteredResults.map((result) => (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleSelect(result)}
                      className="flex flex-col items-start py-3"
                    >
                      <span className="font-medium">{result.title}</span>
                      <span className="text-sm text-gray-500">{result.subtitle}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandItem
                  onSelect={handleSearch}
                  className="border-t border-gray-100 py-3 text-[#4664EA] font-medium"
                >
                  Ver todos os resultados para "{searchQuery}"
                </CommandItem>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
