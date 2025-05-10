import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { AddServiceDialog } from "./AddServiceDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getMyProfessionalServices, removeServiceFromProfessional } from "@/lib/api-services";
import { ServiceItem, ProfessionalService } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const ProfessionalServicesForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const professionalId = user?.professionalProfileId || "";
  
  const { data: services, isLoading, isError, refetch, error } = useQuery({
    queryKey: ["myProfessionalServices"],
    queryFn: () => getMyProfessionalServices(),
    enabled: true,
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

  const handleRemoveService = async (serviceId: string) => {
    if (!professionalId) {
      toast({
        title: "Erro",
        description: "É necessário ter um perfil profissional para remover serviços.",
        variant: "destructive",
      });
      return;
    }

    try {
      await removeServiceFromProfessional(professionalId, serviceId);
      refetch();
      setHasUnsavedChanges(true);
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido do seu perfil com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao remover serviço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o serviço. Tente novamente.",
        variant: "destructive",
      });
    }
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

  if (!professionalId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          É necessário criar um perfil profissional para gerenciar serviços.
        </p>
      </div>
    );
  }

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
        <button
          onClick={handleCancel}
          className="bg-muted text-foreground px-4 py-2 rounded text-sm font-medium border"
        >
          Cancelar Edição
        </button>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-iazi-primary hover:bg-iazi-primary-hover text-white px-4 py-2 rounded text-sm font-medium"
        >
          Adicionar Serviço
        </button>
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
              onEdit={() => {/* Implementar edição futuramente */}}
            />
          ))}
        </div>
      )}

      <AddServiceDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddService={handleServiceAdded}
        professionalId={professionalId}
      />
      <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Descartar alterações?</DialogTitle>
          </DialogHeader>
          <p>Você fez alterações nos serviços. Se cancelar agora, perderá todas as mudanças não salvas.</p>
          <DialogFooter>
            <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 rounded border">Continuar editando</button>
            <button onClick={confirmCancel} className="px-4 py-2 rounded bg-destructive text-white">Descartar alterações</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
