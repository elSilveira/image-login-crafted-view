import React, { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Briefcase, CreditCard, MessageSquare, Star } from "lucide-react";
import AppointmentReviewDialog from "@/components/reviews/AppointmentReviewDialog";

interface AppointmentDetailsProps {
  appointment: {
    id: string;
    status: string;
    startTime: string;
    endTime: string;
    notes?: string;
    service?: {
      id: string;
      name: string;
      price?: number;
      duration?: number;
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
    canBeReviewed?: boolean;
    hasBeenReviewed?: boolean;
  };
  onClose?: () => void;
}

const statusColors: Record<string, string> = {
  "PENDING": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "CONFIRMED": "bg-blue-100 text-blue-800 border-blue-300",
  "IN_PROGRESS": "bg-purple-100 text-purple-800 border-purple-300",
  "COMPLETED": "bg-green-100 text-green-800 border-green-300",
  "CANCELLED": "bg-red-100 text-red-800 border-red-300",
  "NO_SHOW": "bg-orange-100 text-orange-800 border-orange-300"
};

const statusLabels: Record<string, string> = {
  "PENDING": "Pendente",
  "CONFIRMED": "Confirmado",
  "IN_PROGRESS": "Em Andamento",
  "COMPLETED": "Concluído",
  "CANCELLED": "Cancelado",
  "NO_SHOW": "Não Compareceu"
};

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({ appointment, onClose }) => {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  
  // Verifica se o agendamento está concluído e pode ser avaliado
  const canReview = appointment.status === "COMPLETED" && 
                    appointment.canBeReviewed !== false && 
                    appointment.hasBeenReviewed !== true;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM, yyyy", { locale: ptBR });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: ptBR });
  };
  
  const formatPrice = (price?: number) => {
    if (price === undefined) return "Preço não informado";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };
  
  const handleOpenReviewDialog = () => {
    setIsReviewDialogOpen(true);
  };
  
  const handleReviewSuccess = () => {
    // Aqui poderia atualizar o estado do agendamento
    // para refletir que ele já foi avaliado
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">Detalhes do Agendamento</CardTitle>
            <Badge className={statusColors[appointment.status] || "bg-gray-100"}>
              {statusLabels[appointment.status] || appointment.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Informações do Serviço */}
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Briefcase className="h-5 w-5 text-iazi-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Serviço</h3>
                <p>{appointment.service?.name || "Serviço não especificado"}</p>
                {appointment.service?.price !== undefined && (
                  <p className="text-sm text-muted-foreground">{formatPrice(appointment.service.price)}</p>
                )}
              </div>
            </div>
            
            {/* Data e Horário */}
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-iazi-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Data</h3>
                <p>{formatDate(appointment.startTime)}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-iazi-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Horário</h3>
                <p>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
              </div>
            </div>
            
            {/* Profissional */}
            {appointment.professional && (
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-iazi-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Profissional</h3>
                  <p>{appointment.professional.name}</p>
                </div>
              </div>
            )}
            
            {/* Empresa/Local */}
            {appointment.company && (
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-iazi-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Local</h3>
                  <p>{appointment.company.name}</p>
                  {appointment.company.address && (
                    <p className="text-sm text-muted-foreground">{appointment.company.address}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Observações */}
            {appointment.notes && (
              <div className="flex items-start gap-2">
                <MessageSquare className="h-5 w-5 text-iazi-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Observações</h3>
                  <p className="whitespace-pre-wrap text-sm">{appointment.notes}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          {canReview && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleOpenReviewDialog}
            >
              <Star className="h-4 w-4" />
              Avaliar Serviço
            </Button>
          )}
          {appointment.hasBeenReviewed && (
            <Badge variant="outline" className="gap-1 border-green-200 text-green-600">
              <Star className="h-3 w-3 fill-green-500" />
              Avaliado
            </Badge>
          )}
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
            >
              Fechar
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Diálogo de Avaliação */}
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

export default AppointmentDetails; 