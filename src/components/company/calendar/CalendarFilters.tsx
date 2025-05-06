// src/components/company/calendar/CalendarFilters.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FilterType, AppointmentStatus } from "./types"; // Assuming types are defined
import { Filter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
// Removed: import { mockServices } from "./mock-data";

// Define Service structure from API (simplified)
interface ApiService {
  id: string;
  name: string;
}

interface CalendarFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  companyId: string; // Need companyId to fetch services
}

// Map status keys to labels
const statusLabels: Record<AppointmentStatus | "all", string> = {
  all: "Todos os status",
  CONFIRMED: "Confirmados",
  PENDING: "Pendentes",
  // IN_PROGRESS: "Em andamento", // Assuming IN_PROGRESS is not a standard status
  COMPLETED: "Concluídos",
  CANCELLED: "Cancelados",
  NO_SHOW: "Não Compareceu",
};

const statusOptions: (AppointmentStatus | "all")[] = [
    "all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"
];

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFilterChange,
  companyId,
}) => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [errorServices, setErrorServices] = useState<string | null>(null);

  // Fetch services for the filter dropdown
  useEffect(() => {
    if (!companyId) return;

    const fetchServices = async () => {
      setIsLoadingServices(true);
      setErrorServices(null);
      try {
        // Fetch only necessary fields (id, name) for the company
        const response = await fetch(`/api/services?companyId=${companyId}&select=id,name&limit=100`); // Fetch basic service list
        if (!response.ok) {
          throw new Error("Falha ao buscar serviços");
        }
        // Assuming API returns { data: [...] } or array directly
        const result = await response.json();
        const data: ApiService[] = Array.isArray(result) ? result : result.data ?? [];
        setServices(data);
      } catch (err: any) {
        setErrorServices(err.message || "Erro ao carregar serviços");
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, [companyId]);

  const handleStatusChange = (status: AppointmentStatus | "all") => {
    onFilterChange({ ...filters, status });
  };

  const handleServiceChange = (serviceId: string | "all") => {
    onFilterChange({ ...filters, serviceId });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {/* Indicate active filters */} 
            {(filters.status !== "all" || filters.serviceId !== "all") && (
                <span className="ml-2 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Status Filter */} 
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                <span>Status: {statusLabels[filters.status]}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuLabel>Status do Agendamento</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {statusOptions.map(status => (
                        <DropdownMenuCheckboxItem
                            key={status}
                            checked={filters.status === status}
                            onCheckedChange={() => handleStatusChange(status)}
                        >
                            {statusLabels[status]}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          {/* Service Filter */} 
          <DropdownMenuSub>
             <DropdownMenuSubTrigger>
                <span>Serviço: {filters.serviceId === "all" ? "Todos" : services.find(s => s.id === filters.serviceId)?.name ?? "Todos"}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuLabel>Serviços</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={filters.serviceId === "all"}
                        onCheckedChange={() => handleServiceChange("all")}
                        disabled={isLoadingServices}
                    >
                        Todos os serviços
                    </DropdownMenuCheckboxItem>
                    {isLoadingServices && <DropdownMenuLabel>Carregando...</DropdownMenuLabel>}
                    {errorServices && <DropdownMenuLabel className="text-red-600">{errorServices}</DropdownMenuLabel>}
                    {!isLoadingServices && !errorServices && services.map(service => (
                        <DropdownMenuCheckboxItem
                        key={service.id}
                        checked={filters.serviceId === service.id}
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
    </div>
  );
};

