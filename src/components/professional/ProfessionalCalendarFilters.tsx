
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterType } from "@/components/company/calendar/types";
import { fetchServices } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ProfessionalCalendarFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  professionalId: string;
}

// Define status options
const statusLabels: Record<string, string> = {
  "all": "Todos os Status",
  "pending": "Pendentes",
  "confirmed": "Confirmados",
  "in-progress": "Em Andamento",
  "completed": "Concluídos",
  "cancelled": "Cancelados",
  "no-show": "Não Compareceu",
};

const ProfessionalCalendarFilters: React.FC<ProfessionalCalendarFiltersProps> = ({
  filters,
  onFilterChange,
  professionalId,
}) => {
  // Fetch services for this professional
  const { data: services } = useQuery({
    queryKey: ["professionalServices", professionalId],
    queryFn: async () => {
      try {
        const response = await fetchServices({ professionalId });
        return response.data || [];
      } catch (error) {
        console.error("Error fetching services:", error);
        return [];
      }
    },
    enabled: !!professionalId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value,
    });
  };
  
  const handleServiceChange = (value: string) => {
    onFilterChange({
      ...filters,
      service: value,
      serviceId: value,
    });
  };
  
  // Check if any filter is active
  const hasActiveFilters = filters.status !== "all" || filters.service !== "all";
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.service !== "all") count++;
    return count;
  };
  
  // Get current filter labels for display
  const getCurrentStatusLabel = () => {
    return statusLabels[filters.status] || "Todos os Status";
  };
  
  const getCurrentServiceLabel = () => {
    if (filters.service === "all") return "Todos os Serviços";
    const service = services?.find((s: any) => s.id === filters.service);
    return service?.name || "Serviço Selecionado";
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 items-center">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              {countActiveFilters()}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 bg-background">
        {/* Status Filter */} 
        <DropdownMenuLabel>Filtros de Agendamento</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Status: {getCurrentStatusLabel()}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-background">
              <DropdownMenuCheckboxItem
                checked={filters.status === "all"}
                onCheckedChange={() => handleStatusChange("all")}
              >
                Todos os Status
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.status === "pending"}
                onCheckedChange={() => handleStatusChange("pending")}
              >
                Pendentes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status === "confirmed"}
                onCheckedChange={() => handleStatusChange("confirmed")}
              >
                Confirmados
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status === "in-progress"}
                onCheckedChange={() => handleStatusChange("in-progress")}
              >
                Em Andamento
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status === "completed"}
                onCheckedChange={() => handleStatusChange("completed")}
              >
                Concluídos
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status === "cancelled"}
                onCheckedChange={() => handleStatusChange("cancelled")}
              >
                Cancelados
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.status === "no-show"}
                onCheckedChange={() => handleStatusChange("no-show")}
              >
                Não Compareceu
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        
        {/* Service Filter */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Serviço: {getCurrentServiceLabel()}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-background">
              <DropdownMenuCheckboxItem
                checked={filters.service === "all"}
                onCheckedChange={() => handleServiceChange("all")}
              >
                Todos os Serviços
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              {services?.map((service: any) => (
                <DropdownMenuCheckboxItem
                  key={service.id}
                  checked={filters.service === service.id}
                  onCheckedChange={() => handleServiceChange(service.id)}
                >
                  {service.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfessionalCalendarFilters;
