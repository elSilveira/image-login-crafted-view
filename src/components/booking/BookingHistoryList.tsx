
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, RefreshCw, Clock, Star, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ServicesList from "./ServicesList";
import { 
  getMyAppointments, 
  AppointmentStatus, 
  AppointmentWithDetails, 
  mapApiStatusToInternal 
} from "@/lib/api-services";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import AppointmentDetailsModal, { AppointmentDetails } from "./AppointmentDetailsModal";
import AppointmentReviewDialog from "../reviews/AppointmentReviewDialog";
import { useQueryClient } from "@tanstack/react-query";

interface BookingHistoryListProps {
  status: AppointmentStatus | "all";
  serviceType?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
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
  notes?: string;
  location?: string;
  canReview?: boolean;
}

const BookingHistoryList = ({ 
  status, 
  serviceType, 
  search, 
  startDate, 
  endDate 
}: BookingHistoryListProps) => {
  const [appointments, setAppointments] = useState<FormattedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [appointmentToReview, setAppointmentToReview] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getMyAppointments({ 
          status: status === 'all' ? undefined : status,
          startDate,
          endDate
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
        
        // Transform API data to the format expected by the component
        const formattedAppointments: FormattedAppointment[] = appointmentsData.map((appointment: AppointmentWithDetails) => {
          // Use startTime as primary date source
          let dateObj;
          let formattedTime;
          
          if (appointment.startTime) {
            dateObj = parseISO(appointment.startTime);
            formattedTime = format(dateObj, "HH:mm");
          } else if (appointment.date) {
            dateObj = parseISO(appointment.date);
            formattedTime = format(dateObj, "HH:mm");
          } else {
            dateObj = new Date();
            formattedTime = format(dateObj, "HH:mm");
          }
          
          const formattedDate = format(dateObj, "yyyy-MM-dd");
          
          // Process services - we can have an array of services or a single service
          const appointmentServices = [];
          let totalPrice = 0;
          
          // Case 1: Array services in API response
          if (Array.isArray(appointment.services) && appointment.services.length > 0) {
            appointmentServices.push(...appointment.services.map(service => ({
              id: service.id,
              name: service.name,
              price: typeof service.price === 'string' ? parseFloat(service.price) : service.price,
              duration: service.duration,
              startTime: formattedTime
            })));
            
            // Calculate total price of services
            totalPrice = appointmentServices.reduce((sum, service) => 
              sum + (typeof service.price === 'number' ? service.price : 0), 0);
          }
          // Case 2: Single service field
          else if (appointment.service) {
            appointmentServices.push({
              id: appointment.service.id,
              name: appointment.service.name,
              price: typeof appointment.service.price === 'string' 
                ? parseFloat(appointment.service.price as string) 
                : appointment.service.price,
              duration: appointment.service.duration,
              startTime: formattedTime
            });
            totalPrice = typeof appointment.service.price === 'string' 
              ? parseFloat(appointment.service.price) 
              : (appointment.service.price || 0);
          }
          
          // Map API status to our internal status
          const mappedStatus = mapApiStatusToInternal(appointment.status.toString());
          
          // Check if appointment can be reviewed (completed and not yet reviewed)
          const canReview = mappedStatus === "completed";
          
          return {
            id: appointment.id,
            services: appointmentServices,
            professional: appointment.professional?.name || "Profissional não informado",
            professionalId: appointment.professional?.id || appointment.professionalId,
            date: formattedDate,
            time: formattedTime,
            totalPrice: totalPrice,
            status: mappedStatus,
            notes: appointment.notes || '',
            location: appointment.location || '',
            canReview: canReview
          };
        });
        
        setAppointments(formattedAppointments);
      } catch (err: any) {
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
  }, [status, startDate, endDate, toast]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-iazi-primary"></div>
      </div>
    );
  }
  
  // Error state
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
  
  // No appointments state
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
  
  // Apply client-side filters (status, service type, search)
  const filteredAppointments = appointments.filter(app => {
    // Filter by status if not "all"
    if (status !== "all" && app.status !== status) {
      return false;
    }
    
    // Filter by service type
    if (serviceType && serviceType !== 'all') {
      // Check if any service matches the service type
      const hasMatchingService = app.services.some(
        service => service.name.toLowerCase().includes(serviceType.toLowerCase())
      );
      if (!hasMatchingService) {
        return false;
      }
    }
    
    // Filter by search term
    if (search && search.trim() !== '') {
      const searchTerm = search.toLowerCase();
      const matchesProfessional = app.professional.toLowerCase().includes(searchTerm);
      const matchesServices = app.services.some(service => 
        service.name.toLowerCase().includes(searchTerm)
      );
      
      if (!matchesProfessional && !matchesServices) {
        return false;
      }
    }
    
    return true;
  });

  const handleAppointmentClick = (appointment: FormattedAppointment) => {
    // Convert FormattedAppointment to AppointmentDetails for modal
    const modalAppointment: AppointmentDetails = {
      id: appointment.id,
      service: appointment.services.map(s => s.name).join(", "),
      services: appointment.services,
      professional: appointment.professional,
      professionalId: appointment.professionalId,
      date: appointment.date,
      time: appointment.time,
      price: appointment.totalPrice,
      status: appointment.status,
      notes: appointment.notes,
      location: appointment.location
    };
    
    setSelectedAppointment(modalAppointment);
    setIsModalOpen(true);
  };

  const handleReviewClick = (appointment: FormattedAppointment, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointmentToReview(appointment);
    setIsReviewModalOpen(true);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-iazi-primary">Confirmado</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Concluído</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="border-red-500 text-red-500">Cancelado</Badge>;
      case "no-show":
        return <Badge variant="outline" className="border-orange-500 text-orange-500">Não Compareceu</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {filteredAppointments.length > 0 ? (
        filteredAppointments.map((appointment) => (
          <Card 
            key={appointment.id} 
            className="hover:shadow-md transition-shadow border-iazi-border cursor-pointer"
            onClick={() => handleAppointmentClick(appointment)}
          >
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center flex-1">
                  <div className="bg-iazi-background-alt rounded-md p-3 text-center min-w-[70px]">
                    <p className="text-sm font-medium">
                      {format(parseISO(appointment.date), "dd/MM", { locale: ptBR })}
                    </p>
                    <div className="flex items-center justify-center mt-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {/* Display services */}
                    <div className="mb-1">
                      <h3 className="font-medium text-base">
                        {appointment.services.length > 0 
                          ? appointment.services.map(s => s.name).join(", ")
                          : "Serviço não especificado"}
                      </h3>
                    </div>
                    
                    <Link 
                      to={`/professional/${appointment.professionalId || ''}`}
                      className="text-muted-foreground hover:text-iazi-primary block mt-1"
                      onClick={(e) => e.stopPropagation()} // Prevent modal from opening
                    >
                      com {appointment.professional}
                    </Link>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(appointment.status)}
                        
                        {/* Add review button for completed appointments that can be reviewed */}
                        {appointment.canReview && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 text-xs bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700"
                            onClick={(e) => handleReviewClick(appointment, e)}
                          >
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            Avaliar
                          </Button>
                        )}
                      </div>
                      <span className="font-medium text-iazi-text">
                        R$ {typeof appointment.totalPrice === 'number' ? 
                            appointment.totalPrice.toFixed(2).replace('.', ',') : 
                            appointment.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center p-10">
          <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
        </div>
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
      />

      {/* Review Modal */}
      {appointmentToReview && (
        <AppointmentReviewDialog
          open={isReviewModalOpen}
          onOpenChange={setIsReviewModalOpen}
          appointmentData={{
            id: appointmentToReview.id.toString(),
            serviceId: appointmentToReview.services[0]?.id,
            serviceName: appointmentToReview.services.map(s => s.name).join(", "),
            professionalId: appointmentToReview.professionalId,
            professionalName: appointmentToReview.professional,
            reviewType: "professional" // This is a user reviewing a professional
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            
            // Show success toast
            toast({
              title: "Avaliação enviada",
              description: "Obrigado por compartilhar sua experiência!",
            });
          }}
        />
      )}
    </div>
  );
};

export default BookingHistoryList;
