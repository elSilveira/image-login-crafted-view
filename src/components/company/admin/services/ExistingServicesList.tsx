import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServiceItem } from "./types";
import { Check, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ExistingServicesListProps {
  services: ServiceItem[];
  selectedService: ServiceItem | null;
  onSelectService: (service: ServiceItem) => void;
  servicePrice?: number;
  onPriceChange: (price?: number) => void;
}

export const ExistingServicesList: React.FC<ExistingServicesListProps> = ({
  services,
  selectedService,
  onSelectService,
  servicePrice,
  onPriceChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (service.categoryName && service.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Pesquisar serviços..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {filteredServices.length > 0 ? (
        <>
          <ScrollArea className="h-[350px] rounded-md border">
            <div className="p-4 grid grid-cols-1 gap-2">
              {filteredServices.map((service) => (
                <div 
                  key={service.id} 
                  className={`p-3 rounded-md cursor-pointer flex items-center justify-between ${
                    selectedService?.id === service.id 
                      ? "bg-primary/10 border-primary/20 border" 
                      : "hover:bg-accent border border-transparent"
                  }`}
                  onClick={() => onSelectService(service)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectService(service);
                    }
                  }}
                  aria-selected={selectedService?.id === service.id}
                  style={{ outline: selectedService?.id === service.id ? '2px solid var(--primary)' : undefined }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{service.name}</span>
                    {service.categoryName && (
                      <span className="text-xs text-muted-foreground">
                        Categoria: {service.categoryName}
                      </span>
                    )}
                    {service.description && (
                      <span className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {service.description}
                      </span>
                    )}
                  </div>
                  {selectedService?.id === service.id && (
                    <Check className="h-5 w-5 text-primary pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {selectedService && (
            <div className="mt-4 p-4 border rounded-md bg-muted/30">
              <h4 className="font-medium mb-2">Configurar preço para {selectedService.name}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="100.00"
                    value={servicePrice || ""}
                    onChange={(e) => onPriceChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          Nenhum serviço encontrado com "{searchQuery}"
        </div>
      )}
    </div>
  );
};
