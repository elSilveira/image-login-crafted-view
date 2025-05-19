
import React, { ReactNode } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SearchTabsProps {
  viewType: string;
  onTabChange: (value: string) => void;
  serviceCount: number;
  companyCount: number;
  professionalCount?: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  children: ReactNode;
}

export function SearchTabs({ 
  viewType, 
  onTabChange, 
  serviceCount, 
  companyCount,
  professionalCount = 0,
  sortBy, 
  onSortChange, 
  children 
}: SearchTabsProps) {
  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
        <TabsList className="w-full sm:w-auto bg-gray-100 p-1 rounded-md">
          <TabsTrigger 
            value="all" 
            className={`flex-1 sm:flex-none relative ${viewType === 'all' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-primary'}`}
            onClick={() => onTabChange('all')}
          >
            Todos
            <Badge className="ml-1 bg-iazi-rosa-1 text-iazi-text hover:bg-iazi-rosa-2 text-xs">
              {serviceCount + companyCount + professionalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="service" 
            className={`flex-1 sm:flex-none relative ${viewType === 'service' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-primary'}`}
            onClick={() => onTabChange('service')}
          >
            Serviços
            <Badge className="ml-1 bg-iazi-rosa-1 text-iazi-text hover:bg-iazi-rosa-2 text-xs">
              {serviceCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="professional" 
            className={`flex-1 sm:flex-none relative ${viewType === 'professional' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-primary'}`}
            onClick={() => onTabChange('professional')}
          >
            Profissionais
            <Badge className="ml-1 bg-iazi-rosa-1 text-iazi-text hover:bg-iazi-rosa-2 text-xs">
              {professionalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="company" 
            className={`flex-1 sm:flex-none relative ${viewType === 'company' ? 'bg-white shadow-sm text-primary' : 'text-gray-600 hover:text-primary'}`}
            onClick={() => onTabChange('company')}
          >
            Empresas
            <Badge className="ml-1 bg-iazi-rosa-1 text-iazi-text hover:bg-iazi-rosa-2 text-xs">
              {companyCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <div className="w-full sm:w-auto">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full sm:w-44 bg-white border-gray-200 h-9 text-sm">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Melhor avaliação</SelectItem>
              <SelectItem value="reviews">Mais avaliações</SelectItem>
              <SelectItem value="price-asc">Menor preço</SelectItem>
              <SelectItem value="price-desc">Maior preço</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Render the tab contents */}
      {children}
    </div>
  );
}
