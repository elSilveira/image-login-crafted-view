import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Calendar, User, CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ProfessionalRescheduleModal from "./ProfessionalRescheduleModal";
import AppointmentDetailsModal from "../booking/AppointmentDetailsModal";
import AppointmentReviewDialog from "../reviews/AppointmentReviewDialog";
import { AppointmentReviewStatus } from "@/types/reviews";
import { mapApiStatusToInternal } from "@/lib/api-services";

// This follows the API's APPOINTMENT_STATUS documentation
const STATUS_COLORS = {
  "PENDING": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "CONFIRMED": "bg-blue-100 text-blue-800 border-blue-300",
  "IN_PROGRESS": "bg-purple-100 text-purple-800 border-purple-300", 
  "INPROGRESS": "bg-purple-100 text-purple-800 border-purple-300",
  "IN-PROGRESS": "bg-purple-100 text-purple-800 border-purple-300", 
  "COMPLETED": "bg-green-100 text-green-800 border-green-300",
  "CANCELLED": "bg-red-100 text-red-800 border-red-300",
  "NO_SHOW": "bg-orange-100 text-orange-800 border-orange-300", 
  "NOSHOW": "bg-orange-100 text-orange-800 border-orange-300",
  "NO-SHOW": "bg-orange-100 text-orange-800 border-orange-300"
};

const STATUS_LABELS = {
  "PENDING": "Pendente",
  "CONFIRMED": "Confirmado",
  "IN_PROGRESS": "Em Andamento",
  "INPROGRESS": "Em Andamento",
  "IN-PROGRESS": "Em Andamento",
  "COMPLETED": "Concluído",
  "CANCELLED": "Cancelado", 
  "NO_SHOW": "Não Compareceu",
  "NOSHOW": "Não Compareceu",
  "NO-SHOW": "Não Compareceu"
};

interface ProfessionalBookingsListProps {
  appointments: any[];
  showActions?: boolean;
  emptyMessage?: string;
  compact?: boolean; // New prop for compact view
}

const ProfessionalBookingsList: React.FC<ProfessionalBookingsListProps> = ({ 
  appointments, 
  showActions = false,
  emptyMessage = "Nenhum agendamento encontrado.",
  compact = false
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    setIsUpdating(prev => ({ ...prev, [appointmentId]: true }));

    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      
      // Success toast
      toast({
        title: "Status atualizado",
        description: `Agendamento ${STATUS_LABELS[newStatus as keyof typeof STATUS_LABELS].toLowerCase()} com sucesso.`,
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["professionalBookings"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    } catch (error: any) {
      // Error toast
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(prev => ({ ...prev, [appointmentId]: false }));
    }
  };

  const openRescheduleModal = (appointment: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };
  
  const openDetailsModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const openReviewModal = (appointment: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setIsReviewModalOpen(true);
  };

  // Helper to format client name
  const getClientName = (appointment: any) => {
    if (appointment.user?.name) {
      return appointment.user.name;
    } else if (appointment.user?.firstName && appointment.user?.lastName) {
      return `${appointment.user.firstName} ${appointment.user.lastName}`;
    }
    return "Cliente";
  };

  // Helper to get the service name
  const getServiceName = (appointment: any) => {
    // If we have the services array with service details
    if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
      return appointment.services.map((s: any) => s.service?.name || s.name || "Serviço").join(", ");
    }
    
    // Fallback to the service object
    if (appointment.service && appointment.service.name) {
      return appointment.service.name;
    }
    
    return "Serviço não especificado";
  };

  // Helper to check if appointment can be reviewed
  const canReviewAppointment = (appointment: any): boolean => {
    // Check if appointment is completed
    // Em uma implementação real, pode ser útil verificar se o agendamento já foi avaliado
    // através de uma chamada à API ou de dados no próprio objeto appointment
    return appointment.status === "COMPLETED";
  };

  // Helper to get status color and label
  const getStatusInfo = (status: string) => {
    const statusKey = status.toUpperCase() as keyof typeof STATUS_LABELS;
    const statusLabel = STATUS_LABELS[statusKey] || "Desconhecido";
    const statusColor = STATUS_COLORS[statusKey] || "bg-gray-100 text-gray-800 border-gray-300";
    return { statusLabel, statusColor };
  };

  if (appointments.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const isUpdatingStatus = isUpdating[appointment.id] || false;
        const startTime = parseISO(appointment.startTime);
        const serviceName = getServiceName(appointment);
        const clientName = getClientName(appointment);
        const { statusLabel, statusColor } = getStatusInfo(appointment.status);
        const canReview = canReviewAppointment(appointment);
        
        return (
          <Card 
            key={appointment.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => openDetailsModal(appointment)}
          >
            <CardContent className={`p-0 ${compact ? 'divide-y-0' : 'divide-y'}`}>
              {/* Header with date, time and status */}
              <div className={`flex justify-between ${compact ? 'p-3' : 'p-4'} bg-muted/30`}>
                <div className="flex items-center gap-2">
                  <Calendar className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
                  <span className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>
                    {format(startTime, "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <span className="mx-1">•</span>
                  <Clock className={`${compact ? 'h-4 w-4' : 'h-5 w-5'} text-muted-foreground`} />
                  <span className={`${compact ? 'text-sm' : 'text-base'}`}>
                    {format(startTime, "HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <Badge className={`${statusColor} ${compact ? 'text-xs' : 'text-sm'}`}>
                  {statusLabel}
                </Badge>
              </div>
              
              {/* Body with service and client info */}
              <div className={`${compact ? 'p-3' : 'p-4'}`}>
                <div className="space-y-2">
                  <div>
                    <h3 className={`font-medium ${compact ? 'text-sm' : 'text-base'}`}>{serviceName}</h3>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className={`${compact ? 'text-xs' : 'text-sm'}`}>{clientName}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action buttons - conditional based on showActions or completed status */}
              {(showActions || appointment.status === "COMPLETED") && (
                <div className="bg-muted/30 p-2 flex flex-wrap gap-2 justify-end border-t">
                  {/* Show actions based on current appointment status */}
                  {showActions && appointment.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled={isUpdatingStatus}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment.id, "CONFIRMED");
                        }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Confirmar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled={isUpdatingStatus}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment.id, "CANCELLED");
                        }}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Cancelar
                      </Button>
                    </>
                  )}
                  
                  {showActions && appointment.status === "CONFIRMED" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled={isUpdatingStatus}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment.id, "COMPLETED");
                        }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Finalizar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled={isUpdatingStatus}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment.id, "NO_SHOW");
                        }}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Não Compareceu
                      </Button>
                    </>
                  )}
                  
                  {showActions && (appointment.status === "IN_PROGRESS" || appointment.status === "INPROGRESS" || appointment.status === "IN-PROGRESS") && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs"
                      disabled={isUpdatingStatus}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment.id, "COMPLETED");
                      }}
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Finalizar
                    </Button>
                  )}

                  {/* Add review button for completed appointments */}
                  {canReview && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
                      onClick={(e) => openReviewModal(appointment, e)}
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      Avaliar Cliente
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {/* Reschedule Modal */}
      {selectedAppointment && (
        <ProfessionalRescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          appointment={selectedAppointment}
        />
      )}
      
      {/* Details Modal */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          appointment={{
            id: selectedAppointment.id,
            service: getServiceName(selectedAppointment),
            services: selectedAppointment.services?.map((s: any) => ({
              id: s.id || s.serviceId,
              name: s.service?.name || s.name || "Serviço",
              price: s.service?.price || s.price || 0
            })) || [{
              id: selectedAppointment.service?.id || "service-id",
              name: selectedAppointment.service?.name || "Serviço",
              price: selectedAppointment.service?.price || 0
            }],
            professional: selectedAppointment.professional?.name || "Profissional",
            professionalId: selectedAppointment.professionalId,
            date: format(parseISO(selectedAppointment.startTime), "yyyy-MM-dd"),
            time: format(parseISO(selectedAppointment.startTime), "HH:mm"),
            price: selectedAppointment.price || selectedAppointment.service?.price || 0,
            status: mapApiStatusToInternal(selectedAppointment.status),
            location: selectedAppointment.location || "Local não especificado",
            notes: selectedAppointment.notes || "",
            canBeReviewed: selectedAppointment.status === "COMPLETED",
            hasBeenReviewed: selectedAppointment.hasBeenReviewed || false,
            userRole: "professional"
          }}
        />
      )}

      {/* Review Modal */}
      {selectedAppointment && (
        <AppointmentReviewDialog
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          appointmentData={{
            id: selectedAppointment.id,
            serviceId: selectedAppointment.serviceId || selectedAppointment.service?.id,
            serviceName: getServiceName(selectedAppointment),
            professionalId: selectedAppointment.professionalId,
            userId: selectedAppointment.userId || selectedAppointment.user?.id,
            userName: getClientName(selectedAppointment),
            reviewType: "user" // This is a professional reviewing a user
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["professionalBookings"] });
          }}
        />
      )}
    </div>
  );
};

export default ProfessionalBookingsList;
