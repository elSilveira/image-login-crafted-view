import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { AddServiceDialog } from "./AddServiceDialog";
import EditServiceDialog from "./EditServiceDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getOwnProfessionalServices, getProfessionalServices, removeServiceFromProfessional, fetchProfessionals } from "@/lib/api-services";
import { ServiceItem, ProfessionalService } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const ProfessionalServicesForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);
  const isAdmin = !!user?.isAdmin;
  const isProfessional = !!user?.isProfessional;
  const hasCompany = !!user?.hasCompany;
  const isDisabled = !(isAdmin || isProfessional);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  
  // Fetch all professionals for admin selection
  const { data: professionals = [] } = useQuery({
    queryKey: ["allProfessionals"],
    queryFn: fetchProfessionals,
    enabled: isAdmin && !isProfessional,
  });

  // For the logged-in user, use /professionals/services
  const { data: services, isLoading, isError, refetch, error } = useQuery({
    queryKey: [isProfessional ? "myProfessionalServices" : "professionalServices", isProfessional ? undefined : selectedProfessionalId],
    queryFn: () => isProfessional
      ? getOwnProfessionalServices() // /professionals/services
      : getProfessionalServices(selectedProfessionalId), // /professionals/{id}/services
    enabled: isProfessional || !!selectedProfessionalId,
  });

  const handleServiceAdded = (service: ServiceItem) => {
    refetch();
    setIsAddDialogOpen(false);
    setHasUnsavedChanges(true);
    toast({
      title: "Serviço adicionado",
      description: "O serviço foi adicionado com sucesso ao seu perfil.",
    });
  };

  // For remove, use the correct endpoint for the logged-in user or others
  const handleRemoveService = async (serviceId: string) => {
    if (isProfessional) {
      await removeServiceFromProfessional(undefined, serviceId); // undefined triggers /professionals/services
    } else if (selectedProfessionalId) {
      await removeServiceFromProfessional(selectedProfessionalId, serviceId);
    } else {
      toast({
        title: "Erro",
        description: "Selecione um profissional para remover serviços.",
        variant: "destructive",
      });
      return;
    }
    refetch();
    setHasUnsavedChanges(true);
    toast({
      title: "Serviço removido",
      description: "O serviço foi removido do perfil com sucesso.",
    });
  };

  const handleEditService = (service: ServiceItem) => {
    setServiceToEdit(service);
    setEditDialogOpen(true);
  };

  const handleSaveEditedService = async (updatedService: ServiceItem) => {
    // Call backend to update price (if needed)
    // For now, just simulate and refetch
    // TODO: Implement updateServiceForProfessional API call
    setEditDialogOpen(false);
    setServiceToEdit(null);
    setHasUnsavedChanges(true);
    toast({ title: "Serviço atualizado", description: "O serviço foi atualizado com sucesso." });
    refetch();
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelConfirm(true);
    } else {
      // Redirecionar ou fechar normalmente
      // Exemplo: window.history.back();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    setHasUnsavedChanges(false);
    // Redirecionar ou fechar normalmente
    // Exemplo: window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">
          Ocorreu um erro ao carregar seus serviços: {error instanceof Error ? error.message : "Erro desconhecido"}
        </p>
      </div>
    );
  }

  const professionalServices = services || [];
  const serviceItems = professionalServices.map((ps: ProfessionalService) => ({
    ...ps.service,
    price: ps.price,
    id: ps.serviceId
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Meus Serviços</h2>
        {isAdmin && !isProfessional && (
          <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecione um profissional" />
            </SelectTrigger>
            <SelectContent>
              {professionals.map((prof: any) => (
                <SelectItem key={prof.id} value={prof.id}>{prof.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isDisabled}
          >
            Cancelar Edição
          </Button>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={isDisabled || (!selectedProfessionalId && !isProfessional)}
          >
            Adicionar Serviço
          </Button>
        </div>
      </div>

      {serviceItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md border-dashed bg-muted/50">
          <p className="text-muted-foreground">
            Você ainda não tem serviços. Adicione serviços para começar a receber agendamentos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {serviceItems.map((service: ServiceItem) => (
            <ServiceCard
              key={service.id}
              service={service}
              onRemove={() => handleRemoveService(service.id)}
              onEdit={() => handleEditService(service)}
            />
          ))}
        </div>
      )}

      <AddServiceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddService={handleServiceAdded}
        professionalId={isAdmin && !isProfessional ? selectedProfessionalId : 'me'}
      />
      {serviceToEdit && (
        <EditServiceDialog
          isOpen={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          service={serviceToEdit}
          onSave={handleSaveEditedService}
        />
      )}
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descartar alterações?</DialogTitle>
          </DialogHeader>
          <p>Você fez alterações nos serviços. Se cancelar agora, perderá todas as mudanças não salvas.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelConfirm(false)}>Continuar editando</Button>
            <Button variant="destructive" onClick={confirmCancel}>Descartar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
