import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAppointments } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ReviewForm from "./ReviewForm";
import { format } from "date-fns";
import { pt } from 'date-fns/locale';
import { useAuth } from "@/contexts/AuthContext";

const PendingReviews = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  // Referência para controlar se o componente está montado
  const isMounted = useRef(true);

  // Buscar agendamentos concluídos que ainda não foram avaliados
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ["pendingReviews"],
    queryFn: async () => {
      const params = {
        status: "COMPLETED", // Buscar apenas agendamentos concluídos
        isReviewed: false, // Filtrar apenas os não avaliados
        limit: 10, // Limitar resultados
        sort: "startTime_desc", // Mais recentes primeiro
        include: "professional,service,services" // Incluir dados do profissional e serviço
      };
      
      const data = await fetchAppointments(params);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user,
    retry: 3, // Limitar o número de tentativas
    retryDelay: 2000, // Atraso entre tentativas (2 segundos)
    // Evitar atualização infinita 
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Função para lidar com o clique no botão de avaliar
  const handleReviewClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsReviewDialogOpen(true);
  };

  // Função chamada após sucesso na avaliação
  const handleReviewSuccess = () => {
    setIsReviewDialogOpen(false);
    // Invalidar a query para recarregar os dados
    queryClient.invalidateQueries({ queryKey: ["pendingReviews"] });
  };

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-iazi-primary" />
        <span className="ml-2 text-muted-foreground">Carregando serviços pendentes...</span>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="p-4 flex flex-col items-center text-center text-destructive">
          <AlertCircle className="h-6 w-6 mb-2" />
          <p className="text-sm">
            Erro ao carregar serviços pendentes. {error instanceof Error ? error.message : "Tente novamente mais tarde."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Se não houver agendamentos pendentes de avaliação
  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Não há serviços pendentes de avaliação
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment: any) => {
        const serviceName = appointment.service?.name || 
                          (appointment.services && appointment.services.length > 0 
                            ? appointment.services[0].name || "Serviço" 
                            : "Serviço");
        
        const professionalName = appointment.professional?.name || "Profissional";
        const startTime = new Date(appointment.startTime);
        
        return (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2 font-playfair text-iazi-text">{serviceName}</h3>
                  <p className="text-muted-foreground font-inter mb-2">com {professionalName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-inter">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(startTime, "PPP 'às' HH:mm", { locale: pt })}
                    </span>
                  </div>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto font-inter"
                    onClick={() => handleReviewClick(appointment)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Avaliar Serviço
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Modal de avaliação */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Avaliar Serviço</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <ReviewForm
              serviceId={selectedAppointment.serviceId}
              professionalId={selectedAppointment.professionalId}
              appointmentId={selectedAppointment.id}
              onClose={() => setIsReviewDialogOpen(false)}
              onSuccess={handleReviewSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingReviews;
