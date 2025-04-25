
import React from "react";
import { Button } from "@/components/ui/button";
import { FilterType } from "./types";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockServices } from "./mock-data";

interface CalendarFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleStatusChange = (status: string) => {
    onFilterChange({ ...filters, status });
  };
  
  const handleServiceChange = (service: string) => {
    onFilterChange({ ...filters, service });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "all": return "Todos os status";
      case "confirmed": return "Confirmados";
      case "pending": return "Pendentes";
      case "in-progress": return "Em andamento";
      case "completed": return "Concluídos";
      case "cancelled": return "Cancelados";
      default: return status;
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status do Agendamento</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.status === "all"}
            onCheckedChange={() => handleStatusChange("all")}
          >
            Todos os status
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status === "confirmed"}
            onCheckedChange={() => handleStatusChange("confirmed")}
          >
            Confirmados
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status === "pending"}
            onCheckedChange={() => handleStatusChange("pending")}
          >
            Pendentes
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status === "in-progress"}
            onCheckedChange={() => handleStatusChange("in-progress")}
          >
            Em andamento
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
          
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Serviços</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={filters.service === "all"}
            onCheckedChange={() => handleServiceChange("all")}
          >
            Todos os serviços
          </DropdownMenuCheckboxItem>
          {mockServices.map(service => (
            <DropdownMenuCheckboxItem
              key={service.id}
              checked={filters.service === service.id}
              onCheckedChange={() => handleServiceChange(service.id)}
            >
              {service.name}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
