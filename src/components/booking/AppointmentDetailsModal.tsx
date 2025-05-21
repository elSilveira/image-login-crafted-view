import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, FileText, RefreshCw, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { AppointmentStatus } from "@/lib/api-services";
import AppointmentReviewDialog from "../reviews/AppointmentReviewDialog";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentDetails | null;
}

export interface AppointmentDetails {
  id: string | number;
  service: string;
  services?: Array<{
    id: string;
    name: string;
    price?: number;
    duration?: number;
  }>;
  professional: string;
  professionalId?: string;
  location?: string;
  date: string;
  time: string;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  canBeReviewed?: boolean;
  hasBeenReviewed?: boolean;
  userRole?: "professional" | "user";
}

export default function AppointmentDetailsModal({ 
  isOpen, 
  onClose, 
  appointment 
}: AppointmentDetailsModalProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  
  if (!appointment) return null;

  const getStatusBadgeStyle = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "bg-iazi-primary";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "border-red-500 text-red-500";
      case "no-show":
        return "border-orange-500 text-orange-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return "Confirmado";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      case "no-show":
        return "Não Compareceu";
      default:
        return "Pendente";
    }
  };

  const canReview = appointment.status === "completed" && 
                   (appointment.canBeReviewed !== false) && 
                   (appointment.hasBeenReviewed !== true);

  const handleOpenReviewDialog = () => {
    setIsReviewDialogOpen(true);
  };

  const handleReviewSuccess = () => {
    // Atualizar o estado do agendamento para refletir que ele já foi avaliado
    if (appointment) {
      onClose(); // Fechamos o modal de detalhes
      
      // Aguardar um pouco para dar tempo da API atualizar
      setTimeout(() => {
        window.location.reload(); // Recarregar a página para atualizar todos os dados
      }, 1000);
    }
  };

  const getActionButtons = (status: AppointmentStatus, id: string | number) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50" asChild>
              <Link to={`/booking/${id}/cancel`}>Cancelar</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to={`/booking/${id}/reschedule`}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reagendar
              </Link>
            </Button>
          </div>
        );
      case "completed":
        return (
          <div className="flex flex-wrap gap-2">
            {canReview && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1 border-iazi-primary text-iazi-primary hover:bg-iazi-primary hover:text-white"
                onClick={handleOpenReviewDialog}
              >
                <Star className="h-3.5 w-3.5" />
                Avaliar
              </Button>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link to={`/booking/${id}/receipt`}>
                <FileText className="h-3 w-3 mr-1" />
                Recibo
              </Link>
            </Button>
            <Button size="sm" variant="default" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover" asChild>
              <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
            </Button>
          </div>
        );
      case "cancelled":
        return (
          <Button size="sm" variant="default" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover" asChild>
            <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
          </Button>
        );
      case "no-show":
        return (
          <Button size="sm" variant="default" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover" asChild>
            <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
          </Button>
        );
      default:
        return null;
    }
  };

  const formattedDate = appointment.date ? 
    format(parseISO(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
    "Data não especificada";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">Detalhes do Agendamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <Badge 
                variant={(appointment.status === "cancelled" || appointment.status === "no-show") ? "outline" : "default"}
                className={getStatusBadgeStyle(appointment.status)}
              >
                {getStatusLabel(appointment.status)}
              </Badge>
              <span className="font-medium text-lg">R$ {typeof appointment.price === 'number' ? appointment.price.toFixed(2) : appointment.price}</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <h3 className="font-medium text-lg">
                  {Array.isArray(appointment.services) && appointment.services.length > 0
                    ? appointment.services.map(s => s.name).join(", ")
                    : appointment.service}
                </h3>
                <div className="flex items-center text-muted-foreground">
                  <User className="h-4 w-4 mr-2" />
                  <span>com {appointment.professional}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              {appointment.location && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{appointment.location}</span>
                </div>
              )}

              {appointment.notes && (
                <div className="pt-3">
                  <h4 className="text-sm font-medium mb-1">Observações:</h4>
                  <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-md">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:gap-0">
            {getActionButtons(appointment.status, appointment.id)}
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AppointmentReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        appointmentData={{
          id: String(appointment.id),
          serviceId: Array.isArray(appointment.services) && appointment.services.length > 0 
            ? appointment.services[0].id 
            : undefined,
          serviceName: Array.isArray(appointment.services) && appointment.services.length > 0 
            ? appointment.services.map(s => s.name).join(", ") 
            : appointment.service,
          professionalId: appointment.professionalId,
          professionalName: appointment.professional,
          reviewType: appointment.userRole === "professional" ? "user" : "professional"
        }}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}
