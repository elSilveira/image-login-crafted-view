import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, RefreshCw, Clock, Star, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ServicesList from "./ServicesList";
import { getMyAppointments, AppointmentStatus, AppointmentWithDetails } from "@/lib/api-services";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface BookingHistoryListProps {
  status: AppointmentStatus | "all";
}

interface FormattedAppointment {
  id: string | number;
  services: Array<{
    id: string;
    name: string;
    price?: number;
    duration?: number;
  }>;
  professional: string;
  professionalId?: string;
  date: string;
  time: string;
  totalPrice: number;
  status: AppointmentStatus;
}

const BookingHistoryList = ({ status }: BookingHistoryListProps) => {
  const [appointments, setAppointments] = useState<FormattedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getMyAppointments({ 
          status: status === 'all' ? undefined : status
        });
        
        console.log('API response:', response);
        
        // Handle different response formats
        let appointmentsData = [];
        
        if (response && typeof response === 'object') {
          if (Array.isArray(response)) {
            appointmentsData = response;
          } else if (response.data && Array.isArray(response.data)) {
            appointmentsData = response.data;
          } else if (response.appointments && Array.isArray(response.appointments)) {
            appointmentsData = response.appointments;
          }
        }
        
        console.log('Appointments data to process:', appointmentsData);
        
        // If we still don't have an array, show an error
        if (!Array.isArray(appointmentsData)) {
          throw new Error('Formato de resposta inválido da API');
        }
        
        // Transformar os dados da API para o formato esperado pelo componente
        const formattedAppointments: FormattedAppointment[] = appointmentsData.map((appointment: AppointmentWithDetails) => {
          // Extrair data e hora do campo date
          const dateObj = appointment.date ? parseISO(appointment.date) : new Date();
          const formattedDate = format(dateObj, "yyyy-MM-dd");
          const formattedTime = format(dateObj, "HH:mm");
          
          // Calcular preço total dos serviços
          const servicePrice = appointment.service?.price || 0;
          
          return {
            id: appointment.id,
            services: appointment.service ? [{
              id: appointment.service.id,
              name: appointment.service.name,
              price: appointment.service.price,
              duration: appointment.service.duration,
              startTime: formattedTime
            }] : [],
            professional: appointment.professional?.name || "Profissional não informado",
            professionalId: appointment.professionalId,
            date: formattedDate,
            time: formattedTime,
            totalPrice: servicePrice,
            status: appointment.status
          };
        });
        
        setAppointments(formattedAppointments);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        setError("Não foi possível carregar seus agendamentos. Tente novamente mais tarde.");
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus agendamentos.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointments();
  }, [status, toast]);
  
  // Exibir estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-iazi-primary"></div>
      </div>
    );
  }
  
  // Exibir mensagem de erro, se houver
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-gray-600 mb-4">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  // Exibir mensagem quando não há agendamentos
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Você ainda não possui agendamentos {status === "completed" ? "concluídos" : 
          status === "cancelled" ? "cancelados" : "agendados"}.</p>
        {status !== "scheduled" && (
          <Link to="/search">
            <Button variant="default" className="mt-4 bg-iazi-primary hover:bg-iazi-primary-hover">
              Agendar um serviço
            </Button>
          </Link>
        )}
      </div>
    );
  }
  
  // Filtrar agendamentos pelo status, se não for "all"
  const filteredAppointments = status === "all" 
    ? appointments 
    : appointments.filter((app) => app.status === status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-iazi-primary">Confirmado</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const getActionButtons = (status: string, id: string | number) => {
    switch (status) {
      case "scheduled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 font-inter" asChild>
              <Link to={`/booking/${id}/cancel`}>Cancelar</Link>
            </Button>
            <Button size="sm" variant="outline" className="font-inter" asChild>
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
            <Button size="sm" variant="outline" className="font-inter" asChild>
              <Link to={`/reviews/create/${id}`}>
                <Star className="h-3 w-3 mr-1" />
                Avaliar
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="font-inter" asChild>
              <Link to={`/booking/${id}/receipt`}>
                <FileText className="h-3 w-3 mr-1" />
                Recibo
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover font-inter" asChild>
              <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
            </Button>
          </div>
        );
      case "cancelled":
        return (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="bg-iazi-primary text-white hover:bg-iazi-primary-hover font-inter" asChild>
              <Link to={`/booking/${id}/reschedule`}>Agendar Novamente</Link>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-md transition-shadow border-iazi-border">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
                  <div className="bg-iazi-background-alt rounded-md p-3 text-center min-w-[70px]">
                    <p className="text-sm font-medium font-inter">
                      {new Date(appointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </p>
                    <div className="flex items-center justify-center mt-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {/* Display services using ServicesList component */}
                    <ServicesList 
                      services={appointment.services} 
                      showPrice={false}
                      showDuration={true}
                      showStartTime={true}
                      startTime={appointment.time}
                      compact={appointment.services.length > 1}
                    />
                    
                    <Link 
                      to={`/professional/${appointment.professional.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-muted-foreground hover:text-iazi-primary font-inter block mt-1"
                    >
                      com {appointment.professional}
                    </Link>
                    
                    <div className="flex items-center justify-between mt-2">
                      {getStatusBadge(appointment.status)}
                      <span className="font-medium font-inter text-iazi-text">
                        R$ {appointment.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 md:mt-0">
                  {getActionButtons(appointment.status, appointment.id)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center p-10">
          <p className="text-muted-foreground font-inter">Nenhum agendamento encontrado</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryList;
