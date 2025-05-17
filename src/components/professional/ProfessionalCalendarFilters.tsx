
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterType } from "@/components/company/calendar/types";
import { fetchServices } from "@/lib/api";

interface ProfessionalCalendarFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
  professionalId: string;
}

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
  
  return (
    <div className="flex flex-wrap gap-3">
      <Select value={filters.status} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="confirmed">Confirmados</SelectItem>
          <SelectItem value="in-progress">Em Andamento</SelectItem>
          <SelectItem value="completed">Concluídos</SelectItem>
          <SelectItem value="cancelled">Cancelados</SelectItem>
          <SelectItem value="no-show">Não Compareceu</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={filters.service} onValueChange={handleServiceChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Serviços</SelectItem>
          {services?.map((service: any) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProfessionalCalendarFilters;
