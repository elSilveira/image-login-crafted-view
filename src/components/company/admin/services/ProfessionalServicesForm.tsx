
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchCompanyServices, updateCompanyDetails } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCard } from "@/components/company/admin/services/ServiceCard";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddServiceDialog } from "@/components/company/admin/services/AddServiceDialog";
import { toast } from "sonner";
import { ServiceItem } from "@/components/company/admin/services/types";

export const ProfessionalServicesForm: React.FC = () => {
  const { user } = useAuth();
  const companyId = user?.companyId;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  
  // Fetch company services
  const { data: companyServices, isLoading: isLoadingCompanyServices, refetch: refetchCompanyServices } = useQuery({
    queryKey: ["companyServices", companyId],
    queryFn: () => fetchCompanyServices(companyId!),
    enabled: !!companyId,
  });

  // Handle adding a service to the company
  const handleAddService = async (service: ServiceItem) => {
    try {
      // Add service to local state first for immediate UI update
      setSelectedServices((prev) => [...prev, service]);
      
      // Call API to update company services
      if (companyId) {
        await updateCompanyDetails(companyId, {
          services: [...selectedServices, service].map(s => ({
            id: s.id,
            price: s.price
          }))
        });
        
        toast.success("Serviço adicionado com sucesso!");
        refetchCompanyServices();
      }
    } catch (error) {
      toast.error("Erro ao adicionar serviço");
      console.error("Error adding service:", error);
    }
  };

  // Handle removing a service from the company
  const handleRemoveService = async (serviceId: string) => {
    try {
      // Remove service from local state first for immediate UI update
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId));
      
      // Call API to update company services
      if (companyId) {
        await updateCompanyDetails(companyId, {
          services: selectedServices
            .filter((s) => s.id !== serviceId)
            .map(s => ({
              id: s.id,
              price: s.price
            }))
        });
        
        toast.success("Serviço removido com sucesso!");
        refetchCompanyServices();
      }
    } catch (error) {
      toast.error("Erro ao remover serviço");
      console.error("Error removing service:", error);
    }
  };

  // When component loads, set selected services from company services
  React.useEffect(() => {
    if (companyServices) {
      setSelectedServices(companyServices);
    }
  }, [companyServices]);

  if (isLoadingCompanyServices) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Serviços Oferecidos</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          variant="default"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Serviço
        </Button>
      </div>

      {selectedServices.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground">Nenhum serviço adicionado ainda.</p>
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                variant="outline" 
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Serviço
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedServices.map((service) => (
            <ServiceCard 
              key={service.id}
              service={service}
              onRemove={() => handleRemoveService(service.id)}
            />
          ))}
        </div>
      )}

      {/* Dialog para adicionar novo serviço */}
      <AddServiceDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onAddService={handleAddService}
      />
    </div>
  );
};
