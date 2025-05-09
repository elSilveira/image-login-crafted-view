
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchCategories } from "@/lib/api";
import { ExistingServicesList } from "./ExistingServicesList";
import { CreateServiceForm } from "./CreateServiceForm";
import { ServiceItem } from "./types";
import { Loader2 } from "lucide-react";

interface AddServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (service: ServiceItem) => void;
}

export const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onClose,
  onAddService,
}) => {
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [servicePrice, setServicePrice] = useState<number | undefined>(undefined);

  // Fetch all available services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    enabled: isOpen && activeTab === "existing",
  });

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
        price: servicePrice
      };
      onAddService(serviceWithPrice);
      handleClose();
    }
  };

  const handleAddNewService = (newService: ServiceItem) => {
    onAddService(newService);
    handleClose();
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
                services={services || []}
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
