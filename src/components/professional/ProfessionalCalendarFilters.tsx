// src/components/professional/ProfessionalCalendarFilters.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FilterType } from "@/components/company/calendar/types";
import { Filter, Check } from "lucide-react";
import apiClient from "@/lib/api";
import { API_BASE_URL } from "@/lib/api-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define Service structure from API (simplified)
interface ApiService {
  id: string;
  name: string;
}

interface ProfessionalCalendarFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  professionalId: string; // Need professionalId to fetch services
}

// Map status keys to labels based on backend specifications
const statusLabels: Record<string, string> = {
  all: "Todos os status",
  confirmed: "Confirmados",
  pending: "Pendentes",
  "in-progress": "Em andamento",
  completed: "Concluídos",
  cancelled: "Cancelados",
  "no-show": "Não Compareceu",
};

const statusOptions: string[] = [
  "all", "pending", "confirmed", "in-progress", "completed", "cancelled", "no-show"
];

const ProfessionalCalendarFilters: React.FC<ProfessionalCalendarFiltersProps> = ({
  filters,
  onFilterChange,
  professionalId,
}) => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  // Determine active filters count for button label
  const activeFilterCount = Object.values(filters).filter((value) => value !== "all").length;

  // Fetch professional's services
  useEffect(() => {
    if (!professionalId) return;

    const fetchServices = async () => {
      setIsLoadingServices(true);
      setErrorServices(null);
      try {        const response = await apiClient.get(`/professionals/${professionalId}/services`);
        const result = response.data;
        const data: ApiService[] = result.data ?? [];
        setServices(data);
      } catch (err: any) {
        console.error("Erro ao buscar serviços:", err);
        setErrorServices(err.message || "Erro ao carregar serviços");
        setServices([]);
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, [professionalId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 flex items-center"
        >
          <Filter className="h-3.5 w-3.5 mr-1" />
          Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Status Filters */}
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Status
        </DropdownMenuLabel>
        {statusOptions.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={filters.status === status}
            onCheckedChange={() => {
              onFilterChange({
                ...filters,
                status: status
              });
            }}
          >
            {statusLabels[status]}
            {filters.status === status && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuCheckboxItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Service Filters */}
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Serviço
        </DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={filters.service === "all"}
          onCheckedChange={() => {
            onFilterChange({
              ...filters,
              service: "all",
            });
          }}
        >
          Todos os serviços
          {filters.service === "all" && (
            <Check className="ml-auto h-4 w-4" />
          )}
        </DropdownMenuCheckboxItem>
        
        {isLoadingServices ? (
          <div className="px-2 py-1 text-sm">Carregando serviços...</div>
        ) : errorServices ? (
          <div className="px-2 py-1 text-sm text-destructive">{errorServices}</div>
        ) : (
          services.map((service) => (
            <DropdownMenuCheckboxItem
              key={service.id}
              checked={filters.service === service.id}
              onCheckedChange={() => {
                onFilterChange({
                  ...filters,
                  service: service.id,
                });
              }}
            >
              {service.name}
              {filters.service === service.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfessionalCalendarFilters;
