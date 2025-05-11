import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchCategories } from "@/lib/api";
import { createService, addServiceToProfessional, addServiceToMe } from "@/lib/api-services";
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
  persistImmediately?: boolean; // NEW: if false, do not persist to backend
}

export const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  isOpen,
  onClose,
  onAddService,
  professionalId,
  persistImmediately = true, // default true for backward compatibility
}) => {
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [servicePrice, setServicePrice] = useState<number | undefined>(undefined);
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [serviceSchedule, setServiceSchedule] = useState([
    { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "17:00" }
  ]);
  const { user } = useAuth();

  // Fetch all available services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    enabled: isOpen && activeTab === "existing",
  });

  // Map API services to ServiceItem shape expected by ExistingServicesList
  const serviceList = Array.isArray(services?.data) ? services.data : Array.isArray(services) ? services : [];
  const mappedServices = serviceList.map((service: any) => ({
    id: service.id,
    name: service.name,
    description: service.description || "",
    price: service.price,
    duration: service.duration,
    categoryId: service.categoryId || service.category?.id,
    categoryName: service.categoryName || service.category?.name || "",
    image: service.image,
  }));

  // Fetch categories for the new service form
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    enabled: isOpen && activeTab === "new",
  });

  const handleAddExistingService = async () => {
    if (!selectedService) return;
    try {
      let price = servicePrice;
      if (typeof price === 'string') {
        const priceStr = (price as string).replace(/\s/g, '').replace(',', '.');
        price = Number(priceStr);
      } else if (typeof price !== 'number') {
        price = Number(price ?? 0);
      }
      if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        toast.error("Informe um valor válido para o preço (ex: 100 ou 100.00)");
        return;
      }
      if (persistImmediately) {
        const payload = {
          serviceId: selectedService.id,
          price,
          description: serviceDescription,
          duration: selectedService.duration,
          schedule: serviceSchedule,
        };
        if (professionalId === 'me') {
          await addServiceToMe(payload);
        } else {
          await addServiceToProfessional(professionalId, payload);
        }
        toast.success("Serviço adicionado ao profissional com sucesso!");
      }
      onAddService({ ...selectedService, price, duration: selectedService.duration });
      handleClose();
    } catch (error) {
      toast.error("Erro ao adicionar serviço ao profissional");
      console.error(error);
    }
  };

  // Utilitário para validar se a imagem é válida (string não vazia)
  function validImage(image: any): string | undefined {
    if (typeof image === 'string' && image.trim() !== '') return image;
    return undefined;
  }

  const handleAddNewService = async (newService: ServiceItem) => {
    try {
      let price = newService.price;
      if (typeof price === 'string') {
        const priceStr = (price as string).replace(/\s/g, '').replace(',', '.');
        price = Number(priceStr);
      } else if (typeof price !== 'number') {
        price = Number(price ?? 0);
      }
      if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        toast.error("Informe um valor válido para o preço (ex: 100 ou 100.00)");
        return;
      }
      if (persistImmediately) {
        const payload = {
          name: newService.name,
          description: newService.description,
          price,
          duration: typeof newService.duration === 'string' ? Number(newService.duration) : newService.duration,
          categoryId: String(newService.categoryId),
          ...(validImage(newService.image) && { image: validImage(newService.image) })
        };
        const createdService = await createService(payload);
        // Collect schedule and description for the professional-service link
        const profServicePayload = {
          serviceId: createdService.id,
          price,
          description: newService.description || '',
          schedule: serviceSchedule,
        };
        if (professionalId === 'me') {
          await addServiceToMe(profServicePayload);
        } else {
          await addServiceToProfessional(professionalId, profServicePayload);
        }
        toast.success("Serviço criado e adicionado ao profissional com sucesso!");
        onAddService({ ...newService, id: createdService.id, price });
      } else {
        onAddService({ ...newService, price });
      }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              <>
                <ExistingServicesList 
                  services={mappedServices}
                  selectedService={selectedService}
                  onSelectService={setSelectedService}
                  servicePrice={servicePrice}
                  onPriceChange={setServicePrice}
                />
                {selectedService && (
                  <div className="mt-4">
                    <label className="block font-medium mb-1">Descrição do serviço</label>
                    <textarea
                      className="w-full border rounded p-2"
                      value={serviceDescription}
                      onChange={e => setServiceDescription(e.target.value)}
                      placeholder="Descrição personalizada para este profissional (opcional)"
                      rows={2}
                    />
                  </div>
                )}
                {selectedService && (
                  <div className="mt-4">
                    <label className="block font-medium mb-1">Duração (minutos)</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full border rounded p-2"
                      value={selectedService.duration ?? ''}
                      onChange={e => {
                        const value = Number(e.target.value);
                        setSelectedService(prev => prev ? { ...prev, duration: value } : null);
                      }}
                      placeholder="Ex: 60"
                    />
                  </div>
                )}
                {selectedService && (
                  <div className="mt-4">
                    <label className="block font-medium mb-1">Horários do serviço</label>
                    {serviceSchedule.map((slot, idx) => (
                      <div key={idx} className="flex gap-2 mb-2 items-center">
                        <select
                          className="border rounded p-1"
                          value={slot.dayOfWeek}
                          onChange={e => {
                            const newSchedule = [...serviceSchedule];
                            newSchedule[idx].dayOfWeek = e.target.value;
                            setServiceSchedule(newSchedule);
                          }}
                        >
                          <option value="MONDAY">Segunda-feira</option>
                          <option value="TUESDAY">Terça-feira</option>
                          <option value="WEDNESDAY">Quarta-feira</option>
                          <option value="THURSDAY">Quinta-feira</option>
                          <option value="FRIDAY">Sexta-feira</option>
                          <option value="SATURDAY">Sábado</option>
                          <option value="SUNDAY">Domingo</option>
                        </select>
                        <input
                          type="time"
                          className="border rounded p-1"
                          value={slot.startTime}
                          onChange={e => {
                            const newSchedule = [...serviceSchedule];
                            newSchedule[idx].startTime = e.target.value;
                            setServiceSchedule(newSchedule);
                          }}
                        />
                        <span>-</span>
                        <input
                          type="time"
                          className="border rounded p-1"
                          value={slot.endTime}
                          onChange={e => {
                            const newSchedule = [...serviceSchedule];
                            newSchedule[idx].endTime = e.target.value;
                            setServiceSchedule(newSchedule);
                          }}
                        />
                        <button
                          type="button"
                          className="ml-2 text-red-500"
                          onClick={() => {
                            setServiceSchedule(serviceSchedule.filter((_, i) => i !== idx));
                          }}
                        >Remover</button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 bg-primary text-white rounded"
                      onClick={() => {
                        // List of all days
                        const allDays = [
                          "MONDAY",
                          "TUESDAY",
                          "WEDNESDAY",
                          "THURSDAY",
                          "FRIDAY",
                          "SATURDAY",
                          "SUNDAY"
                        ];
                        // Find next available day not already selected
                        const usedDays = serviceSchedule.map(s => s.dayOfWeek);
                        const nextDay = allDays.find(day => !usedDays.includes(day));
                        setServiceSchedule([
                          ...serviceSchedule,
                          {
                            dayOfWeek: nextDay || "MONDAY",
                            startTime: "09:00",
                            endTime: "17:00"
                          }
                        ]);
                      }}
                      disabled={serviceSchedule.length >= 7}
                    >Adicionar horário</button>
                  </div>
                )}
              </>
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
