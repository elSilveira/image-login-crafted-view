
import React, { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SearchTabsProps {
  viewType: string;
  onTabChange: (value: string) => void;
  serviceCount: number;
  companyCount: number;
  professionalCount?: number; // Added professional count
  sortBy: string;
  onSortChange: (value: string) => void;
  children: ReactNode;
}

export function SearchTabs({ 
  viewType, 
  onTabChange, 
  serviceCount, 
  companyCount,
  professionalCount = 0, // Default to 0 if not provided
  sortBy, 
  onSortChange, 
  children 
}: SearchTabsProps) {
  return (
    <div className="mb-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs 
          defaultValue={viewType} 
          value={viewType} 
          onValueChange={onTabChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none relative">
              Todos
              <Badge className="ml-1 bg-gray-200 text-gray-700 hover:bg-gray-200">
                {serviceCount + companyCount + professionalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="service" className="flex-1 sm:flex-none relative">
              Serviços
              <Badge className="ml-1 bg-gray-200 text-gray-700 hover:bg-gray-200">
                {serviceCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="professional" className="flex-1 sm:flex-none relative">
              Profissionais
              <Badge className="ml-1 bg-gray-200 text-gray-700 hover:bg-gray-200">
                {professionalCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex-1 sm:flex-none relative">
              Empresas
              <Badge className="ml-1 bg-gray-200 text-gray-700 hover:bg-gray-200">
                {companyCount}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full sm:w-auto">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-[180px] text-sm">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Melhor avaliados</SelectItem>
              <SelectItem value="reviews">Mais avaliados</SelectItem>
              <SelectItem value="price-asc">Preço: Menor para maior</SelectItem>
              <SelectItem value="price-desc">Preço: Maior para menor</SelectItem>
              <SelectItem value="duration-asc">Duração: Mais rápido</SelectItem>
              <SelectItem value="availability">Disponibilidade</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs content */}
      {children}
    </div>
  );
}
