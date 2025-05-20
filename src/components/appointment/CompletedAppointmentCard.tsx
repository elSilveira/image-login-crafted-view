import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Calendar, MapPin, User } from "lucide-react";
import AppointmentReviewDialog from "@/components/reviews/AppointmentReviewDialog";

interface CompletedAppointmentCardProps {
  appointment: {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    service?: {
      id: string;
      name: string;
      price?: number;
    };
    professional?: {
      id: string;
      name: string;
    };
    company?: {
      id: string;
      name: string;
      address?: string;
    };
    hasBeenReviewed?: boolean;
  };
  onViewDetails?: (appointmentId: string) => void;
}

const CompletedAppointmentCard = ({
  appointment,
  onViewDetails,
}: CompletedAppointmentCardProps) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: ptBR });
  };

  const isCompletedAndReviewable = 
    appointment.status === "COMPLETED" && 
    !appointment.hasBeenReviewed;

  const handleReviewSuccess = () => {
    // Poderia atualizar o estado local ou invalidar a query para refletir
    // que a avaliação foi enviada
  };

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">
                  {appointment.service?.name || "Agendamento"}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(appointment.startTime)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </span>
                </div>
              </div>

              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Concluído
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {appointment.professional && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-iazi-primary" />
                  <span>{appointment.professional.name}</span>
                </div>
              )}

              {appointment.company && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-iazi-primary" />
                  <span>{appointment.company.name}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              {isCompletedAndReviewable ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => setIsReviewDialogOpen(true)}
                >
                  <Star className="h-4 w-4" />
                  Avaliar
                </Button>
              ) : appointment.hasBeenReviewed ? (
                <Badge variant="outline" className="gap-1 border-green-200 text-green-600">
                  <Star className="h-3 w-3 fill-green-500" />
                  Avaliado
                </Badge>
              ) : (
                <div /> // Espaçador
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(appointment.id)}
              >
                Ver detalhes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AppointmentReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        appointmentData={{
          id: appointment.id,
          serviceId: appointment.service?.id,
          serviceName: appointment.service?.name,
          professionalId: appointment.professional?.id,
          professionalName: appointment.professional?.name,
          companyId: appointment.company?.id,
          companyName: appointment.company?.name,
        }}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
};

export default CompletedAppointmentCard; 