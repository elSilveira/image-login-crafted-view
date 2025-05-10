
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchCategories } from "@/lib/api";
import { createService, addServiceToProfessional } from "@/lib/api-services";
import { ExistingServicesList } from "./ExistingServicesList";
import { CreateServiceForm } from "./CreateServiceForm";
import { ServiceItem } from "./types";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (service: ServiceItem) => void;
  professionalId: string;
}

export const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onClose,
  onAddService,
  professionalId,
}) => {
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [servicePrice, setServicePrice] = useState<number | undefined>(undefined);
  const { user } = useAuth();

  // Fetch all available services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    enabled: isOpen && activeTab === "existing",
  });

  // Map API services to ServiceItem shape expected by ExistingServicesList
  const mappedServices = Array.isArray(services)
    ? services.map((service: any) => ({
        id: service.id,
        name: service.name,
        description: service.description || "",
        price: service.price,
        duration: service.duration,
        categoryId: service.categoryId || service.category?.id,
        categoryName: service.categoryName || service.category?.name || "",
        image: service.image,
      }))
    : [];

  // Fetch categories for the new service form
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: isOpen && activeTab === "new",
  });

  const handleAddExistingService = () => {
    if (selectedService) {
      const serviceWithPrice = {
        ...selectedService,
        price: typeof servicePrice === 'string' ? Number(servicePrice) : servicePrice
      };
      onAddService(serviceWithPrice);
      handleClose();
    }
  };

  // Utilitário para validar se a imagem é válida (string não vazia)
  function validImage(image: any): string | undefined {
    if (typeof image === 'string' && image.trim() !== '') return image;
    return undefined;
  }

  const handleAddNewService = async (newService: ServiceItem) => {
    try {
      // Corrige para garantir que o valor enviado para o backend é sempre um número válido
      let price = newService.price;
      if (typeof price === 'string') {
        price = price.replace(/\s/g, '').replace(',', '.');
        price = Number(price);
      } else if (typeof price !== 'number') {
        price = Number(price ?? 0);
      }
      if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        toast.error("Informe um valor válido para o preço (ex: 100 ou 100.00)");
        return;
      }
      const payload = {
        name: newService.name,
        description: newService.description,
        price,
        duration: typeof newService.duration === 'string' ? Number(newService.duration) : newService.duration,
        categoryId: String(newService.categoryId),
        ...(validImage(newService.image) && { image: validImage(newService.image) })
      };
      const createdService = await createService(payload);
      await addServiceToProfessional(professionalId, {
        serviceId: createdService.id,
        price,
      });
      toast.success("Serviço criado e adicionado ao profissional com sucesso!");
      onAddService({ ...newService, id: createdService.id, price });
      handleClose();
    } catch (error) {
      toast.error("Erro ao criar e adicionar serviço ao profissional");
      console.error(error);
    }
  };

  const handleClose = () => {
    setSelectedService(null);
    setServicePrice(undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Serviço</DialogTitle>
          <DialogDescription>
            Selecione um serviço existente ou crie um novo para adicionar à sua empresa.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Serviços Existentes</TabsTrigger>
            <TabsTrigger value="new">Criar Novo Serviço</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="py-4">
            {isLoadingServices ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ExistingServicesList 
                services={mappedServices}
                selectedService={selectedService}
                onSelectService={setSelectedService}
                servicePrice={servicePrice}
                onPriceChange={setServicePrice}
              />
            )}
          </TabsContent>
          
          <TabsContent value="new" className="py-4">
            <CreateServiceForm 
              categories={categories || []}
              onSubmit={handleAddNewService}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === "existing" && (
            <Button 
              onClick={handleAddExistingService} 
              disabled={!selectedService}
            >
              Adicionar Serviço Selecionado
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
