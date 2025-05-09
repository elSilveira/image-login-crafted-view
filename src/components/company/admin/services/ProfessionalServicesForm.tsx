
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { AddServiceDialog } from "./AddServiceDialog";
import { useAuth } from "@/contexts/AuthContext";
import { getProfessionalServices, removeServiceFromProfessional } from "@/lib/api-services";
import { ServiceItem, ProfessionalService } from "./types";

export const ProfessionalServicesForm: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const professionalId = user?.professionalProfileId || "";
  
  const {
    data: services,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["professionalServices", professionalId],
    queryFn: () => getProfessionalServices(professionalId),
    enabled: !!professionalId,
  });

  const handleServiceAdded = () => {
    refetch();
    setIsAddDialogOpen(false);
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
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onServiceAdded={handleServiceAdded}
        professionalId={professionalId}
      />
    </div>
  );
};
