
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Calendar, User, MapPin, PhoneCall, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ProfessionalRescheduleModal from "./ProfessionalRescheduleModal";
import AppointmentDetailsModal from "../booking/AppointmentDetailsModal";

// This follows the API's APPOINTMENT_STATUS documentation
const STATUS_COLORS = {
  "PENDING": "bg-yellow-400",
  "CONFIRMED": "bg-blue-500",
  "IN_PROGRESS": "bg-purple-500", 
  "INPROGRESS": "bg-purple-500",
  "IN-PROGRESS": "bg-purple-500", 
  "COMPLETED": "bg-green-500",
  "CANCELLED": "bg-red-500",
  "NO_SHOW": "bg-orange-500", 
  "NOSHOW": "bg-orange-500",
  "NO-SHOW": "bg-orange-500"
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

  const openRescheduleModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };
  
  const openDetailsModal = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
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

  if (appointments.length === 0) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const isUpdatingStatus = isUpdating[appointment.id] || false;
        const startTime = parseISO(appointment.startTime);
        const serviceName = getServiceName(appointment);
        const clientName = getClientName(appointment);
        
        // Upper case status for consistent mapping
        const statusKey = appointment.status.toUpperCase() as keyof typeof STATUS_LABELS;
        const statusLabel = STATUS_LABELS[statusKey] || "Desconhecido";
        const statusColor = STATUS_COLORS[statusKey] || "bg-gray-400";
        
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
              
              {/* Action buttons - only shown if showActions is true and not in compact mode */}
              {showActions && !compact && (
                <div className="bg-muted/30 p-3 flex flex-wrap gap-2 justify-end border-t">
                  {/* Show actions based on current appointment status */}
                  {(statusKey === "PENDING") && (
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
                  
                  {(statusKey === "CONFIRMED") && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled={isUpdatingStatus}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment.id, "IN_PROGRESS");
                        }}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Iniciar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-xs"
                        disabled={isUpdatingStatus}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          openRescheduleModal(appointment);
                        }}
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        Reagendar
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
                  
                  {(statusKey === "IN_PROGRESS" || statusKey === "INPROGRESS" || statusKey === "IN-PROGRESS") && (
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
            date: format(parseISO(selectedAppointment.startTime), "yyyy-MM-dd"),
            time: format(parseISO(selectedAppointment.startTime), "HH:mm"),
            price: selectedAppointment.price || selectedAppointment.service?.price || 0,
            status: selectedAppointment.status.toLowerCase(),
            location: selectedAppointment.location || "Local não especificado",
            notes: selectedAppointment.notes || ""
          }}
        />
      )}
    </div>
  );
};

export default ProfessionalBookingsList;
