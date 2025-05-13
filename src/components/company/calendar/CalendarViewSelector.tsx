// src/components/company/calendar/CalendarViewSelector.tsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ViewType } from "./types";
import { Calendar, LayoutGrid, List, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Removed mock imports
// import { mockStaff, mockResources } from "./mock-data";

// Define Staff (Professional) structure from API (simplified)
interface ApiProfessional {
  id: string;
  name: string;
}

// Define Resource structure if implemented later
// interface ApiResource {
//   id: string;
//   name: string;
// }

interface CalendarViewSelectorProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedStaff: string; // professionalId or "all"
  onStaffChange: (staffId: string) => void;
  // selectedResource: string;
  // onResourceChange: (resourceId: string) => void;
  companyId: string; // Need companyId to fetch staff/resources
}

export const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  selectedView,
  onViewChange,
  selectedStaff,
  onStaffChange,
  // selectedResource,
  // onResourceChange,
  companyId,
}) => {
  const [staffList, setStaffList] = useState<ApiProfessional[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState<boolean>(false);
  const [errorStaff, setErrorStaff] = useState<string | null>(null);

  // const [resources, setResources] = useState<ApiResource[]>([]);
  // const [isLoadingResources, setIsLoadingResources] = useState<boolean>(false);
  // const [errorResources, setErrorResources] = useState<string | null>(null);

  // Fetch staff (professionals)
  useEffect(() => {
    if (!companyId) return;

    const fetchStaff = async () => {
      setIsLoadingStaff(true);
      setErrorStaff(null);
      try {        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3003/api"}/professionals?companyId=${companyId}&select=id,name&limit=100`);
        if (!response.ok) {
          throw new Error("Falha ao buscar profissionais");
        }
        const result = await response.json();
        const data: ApiProfessional[] = Array.isArray(result) ? result : result.data ?? [];
        setStaffList(data);
      } catch (err: any) {
        setErrorStaff(err.message || "Erro ao carregar profissionais");
      } finally {
        setIsLoadingStaff(false);
      }
    };

    fetchStaff();
  }, [companyId]);

  // Fetch resources (if implemented)
  // useEffect(() => {
  //   if (!companyId) return;
  //   // Fetch resources logic here...
  // }, [companyId]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      {/* View Type Buttons */} 
      <div className="flex items-center space-x-1 border rounded-md p-1">
        <Button
          variant={selectedView === "day" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("day")}
          className="h-8"
          title="Dia"
        >
          <Calendar className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Dia</span>
        </Button>
        <Button
          variant={selectedView === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("week")}
          className="h-8"
          title="Semana"
        >
          <LayoutGrid className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Semana</span>
        </Button>
        <Button
          variant={selectedView === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("month")}
          className="h-8"
          title="Mês"
        >
          <Calendar className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Mês</span>
        </Button>
        <Button
          variant={selectedView === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("list")}
          className="h-8"
          title="Lista"
        >
          <List className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Lista</span>
        </Button>
      </div>

      {/* Filter Selects */} 
      <div className="flex gap-2">
        {/* Staff (Professional) Filter */} 
        <Select value={selectedStaff} onValueChange={onStaffChange} disabled={isLoadingStaff}>
          <SelectTrigger className="w-[160px] sm:w-[180px] h-9">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <SelectValue placeholder="Todos os profissionais" />
          </SelectTrigger>
          <SelectContent>
            {errorStaff && <SelectItem value="error" disabled>{errorStaff}</SelectItem>}
            {isLoadingStaff && <SelectItem value="loading" disabled>Carregando...</SelectItem>}
            <SelectItem value="all">Todos os profissionais</SelectItem>
            {!isLoadingStaff && !errorStaff && staffList.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Resource Filter (Removed for now) */} 
        {/* <Select value={selectedResource} onValueChange={onResourceChange} disabled={isLoadingResources}>
          <SelectTrigger className="w-[140px] sm:w-[180px] h-9">
            <SelectValue placeholder="Todos os recursos" />
          </SelectTrigger>
          <SelectContent>
            {errorResources && <SelectItem value="error" disabled>{errorResources}</SelectItem>}
            {isLoadingResources && <SelectItem value="loading" disabled>Carregando...</SelectItem>}
            <SelectItem value="all">Todos os recursos</SelectItem>
            {!isLoadingResources && !errorResources && resources.map(resource => (
              <SelectItem key={resource.id} value={resource.id}>
                {resource.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </div>
    </div>
  );
};

