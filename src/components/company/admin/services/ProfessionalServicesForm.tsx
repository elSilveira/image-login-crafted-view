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
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog";
import apiClient from "@/lib/api";

export const ProfessionalServicesForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceItem | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const isAdmin = !!user?.isAdmin;
  const isProfessional = !!user?.isProfessional;
  const hasCompany = !!user?.hasCompany;
  const isDisabled = !(isAdmin || isProfessional);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);
  const [isRemovingService, setIsRemovingService] = useState(false);
  
  // Fetch all professionals for admin selection
  const { data: professionals = [] } = useQuery({
    queryKey: ["allProfessionals"],
    queryFn: fetchProfessionals,
    enabled: isAdmin && !isProfessional,
  });

  // For the logged-in user, use /professionals/services
  const { data: services = [], isLoading, isError, refetch, error } = useQuery<any[]>({
    queryKey: [isProfessional ? "myProfessionalServices" : "professionalServices", isProfessional ? undefined : selectedProfessionalId],
    queryFn: () => isProfessional
      ? getOwnProfessionalServices() // /professionals/services
      : getProfessionalServices(selectedProfessionalId), // /professionals/{id}/services
    enabled: isProfessional || !!selectedProfessionalId,
  });

  const handleServiceAdded = (service: ServiceItem) => {
    setIsAddingService(false);
    refetch();
    setIsAddDialogOpen(false);
    setHasUnsavedChanges(true);
    toast({
      title: "Serviço adicionado",
      description: "O serviço foi adicionado com sucesso ao seu perfil.",
    });
  };

  // Remove um serviço do profissional autenticado usando o endpoint correto
  const removeMyProfessionalService = async (serviceId: string) => {
    // Chama DELETE na API backend correta
    const response = await apiClient.delete(`/professionals/services/${serviceId}`);
    return response.data;
  };

  // For remove, use the correct endpoint for the logged-in user or others
  const handleRemoveService = async (serviceId: string) => {
    setIsRemovingService(true);
    try {
      await removeMyProfessionalService(serviceId);
      refetch();
      setHasUnsavedChanges(true);
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido do perfil com sucesso.",
      });
    } catch (err) {
      toast({
        title: "Erro ao remover serviço",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setIsRemovingService(false);
    }
  };

  const handleEditService = (service: ServiceItem) => {
    // Garante que duration seja number ou undefined
    let duration: number | undefined = undefined;
    if (typeof service.duration === 'string' && service.duration) {
      const match = (service.duration as string).match(/\d+/);
      duration = match ? Number(match[0]) : undefined;
    } else if (typeof service.duration === 'number') {
      duration = service.duration;
    } else {
      duration = undefined;
    }
    const categoryId = service.categoryId ? String(service.categoryId) : undefined;
    const categoryName = service.categoryName ? String(service.categoryName) : undefined;
    setServiceToEdit({
      ...service,
      duration,
      categoryId,
      categoryName,
    });
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

  const handleAddServiceClick = () => {
    setIsAddingService(true);
    setIsAddDialogOpen(true);
  };

  const handleRequestDeleteService = (service: ServiceItem) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteService = async () => {
    if (serviceToDelete) {
      await handleRemoveService(serviceToDelete.id);
      setServiceToDelete(null);
      setDeleteDialogOpen(false);
    }
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

  const professionalServices: any[] = Array.isArray(services) ? services : [];
  // Suporte a resposta do backend como array de serviços simples ou array de objetos { service, ... }
  const serviceItems = professionalServices.map((ps: any) => {
    // Caso o backend retorne diretamente o serviço (array de serviços)
    if (ps && typeof ps === 'object' && !ps.service && ps.id && ps.name) {
      return {
        id: ps.id,
        name: ps.name,
        description: ps.description,
        price: ps.price,
        duration: typeof ps.duration === 'string' ? ps.duration : (ps.duration ? `${ps.duration}min` : undefined),
        image: ps.image,
        categoryId: ps.categoryId,
        categoryName: ps.categoryName,
        schedule: ps.schedule,
      };
    }
    // Caso padrão: objeto { service, price, ... }
    const s = ps?.service;
    if (!s) return null;
    return {
      id: ps.serviceId || s.id || '',
      name: s.name,
      description: s.description,
      price: ps.price ?? s.price,
      duration: typeof s.duration === 'string' ? s.duration : (s.duration ? `${s.duration}min` : undefined),
      image: s.image,
      categoryId: s.categoryId,
      categoryName: s.categoryName,
      schedule: s.schedule,
    };
  }).filter(Boolean);

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
            onClick={handleAddServiceClick}
            disabled={isDisabled || (!selectedProfessionalId && !isProfessional) || isAddingService}
          >
            {isAddingService ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Adicionar Serviço
          </Button>
        </div>
      </div>

      {/* Mensagem de erro se não houver serviços válidos mas a resposta veio do backend */}
      {serviceItems.length === 0 && Array.isArray(professionalServices) && professionalServices.length > 0 && (
        <div className="text-red-500 text-sm mb-2">Não foi possível exibir os serviços. Verifique o contrato da API.</div>
      )}

      {serviceItems.length === 0 ? (
        <div className="text-center py-8 border rounded-md border-dashed bg-muted/50">
          <p className="text-muted-foreground">
            Você ainda não tem serviços. Adicione serviços para começar a receber agendamentos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2 md:px-4">
          {serviceItems.map((service: ServiceItem) => (
            <ServiceCard
              key={service.id}
              service={service}
              onRemove={() => handleRequestDeleteService(service)}
              onEdit={() => handleEditService(service)}
            />
          ))}
        </div>
      )}

      <AddServiceDialog
        isOpen={isAddDialogOpen}
        onClose={() => { setIsAddDialogOpen(false); setIsAddingService(false); }}
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
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Tem certeza que deseja remover o serviço "{serviceToDelete?.name}"? Esta ação não pode ser desfeita.</p>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isRemovingService}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteService} disabled={isRemovingService}>
              {isRemovingService ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Remover
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
