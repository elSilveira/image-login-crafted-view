
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppointmentStatus, getMyAppointments, AppointmentWithDetails, mapApiStatusToInternal } from "@/lib/api-services";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isSameDay } from "date-fns";

interface BookingHistoryCalendarProps {
  status?: AppointmentStatus | "all";
  serviceType?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

interface FormattedAppointment {
  id: string | number;
  service: string;
  professional: string;
  date: string;
  time: string;
  price: number;
  status: AppointmentStatus;
}

const BookingHistoryCalendar = ({ 
  status,
  serviceType,
  search,
  startDate,
  endDate
}: BookingHistoryCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<FormattedAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Function to format appointments from API response
  const formatAppointments = (appointmentsData: AppointmentWithDetails[]): FormattedAppointment[] => {
    return appointmentsData.map((appointment) => {
      // Determine date and time from startTime
      let dateObj;
      let formattedDate;
      let formattedTime;
      
      if (appointment.startTime) {
        dateObj = parseISO(appointment.startTime);
        formattedDate = format(dateObj, "yyyy-MM-dd");
        formattedTime = format(dateObj, "HH:mm");
      } else if (appointment.date) {
        dateObj = parseISO(appointment.date);
        formattedDate = format(dateObj, "yyyy-MM-dd");
        formattedTime = format(dateObj, "HH:mm");
      } else {
        dateObj = new Date();
        formattedDate = format(dateObj, "yyyy-MM-dd");
        formattedTime = "00:00";
      }
      
      // Get service name and price
      let serviceName = "Serviço não especificado";
      let servicePrice = 0;
      
      if (appointment.service) {
        serviceName = appointment.service.name;
        servicePrice = typeof appointment.service.price === 'string'
          ? parseFloat(appointment.service.price)
          : (appointment.service.price || 0);
      } else if (Array.isArray(appointment.services) && appointment.services.length > 0) {
        serviceName = appointment.services.map(s => s.name).join(", ");
        servicePrice = appointment.services.reduce((sum, s) => {
          const price = typeof s.price === 'string' ? parseFloat(s.price) : (s.price || 0);
          return sum + price;
        }, 0);
      }
      
      // Map status
      const mappedStatus = mapApiStatusToInternal(appointment.status.toString());
      
      return {
        id: appointment.id,
        service: serviceName,
        professional: appointment.professional?.name || "Profissional não informado",
        date: formattedDate,
        time: formattedTime,
        price: servicePrice,
        status: mappedStatus
      };
    });
  };
  
  // Fetch appointments
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
        
        // Format appointments
        const formattedAppointments = formatAppointments(appointmentsData);
        
        // Apply client-side filters (service type and search)
        const filteredAppointments = formattedAppointments.filter(app => {
          // Filter by service type
          if (serviceType && serviceType !== 'all') {
            if (!app.service.toLowerCase().includes(serviceType.toLowerCase())) {
              return false;
            }
          }
          
          // Filter by search term
          if (search && search.trim() !== '') {
            const searchTerm = search.toLowerCase();
            const matchesProfessional = app.professional.toLowerCase().includes(searchTerm);
            const matchesService = app.service.toLowerCase().includes(searchTerm);
            
            if (!matchesProfessional && !matchesService) {
              return false;
            }
          }
          
          return true;
        });
        
        setAppointments(filteredAppointments);
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
  }, [status, startDate, endDate, serviceType, search, toast]);
  
  // Function to check if a date has appointments
  const hasAppointment = (date: Date) => {
    return appointments.some(apt => {
      const aptDate = parseISO(apt.date);
      return isSameDay(aptDate, date);
    });
  };
  
  // Function to get appointments for the selected date
  const getAppointmentsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      return isSameDay(aptDate, selectedDate);
    });
  };
  
  const selectedDateAppointments = getAppointmentsForSelectedDate();
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-iazi-primary"></div>
      </div>
    );
  }
  
  // Show error state
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

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasAppointment: appointments.map(apt => parseISO(apt.date)),
            }}
            modifiersStyles={{
              hasAppointment: { 
                backgroundColor: "rgb(229, 168, 169, 0.15)", 
                fontWeight: "bold",
                color: "#cc6677" 
              }
            }}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">
            {selectedDate ? (
              <>
                Agendamentos em{" "}
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </>
            ) : (
              "Selecione uma data"
            )}
          </h3>
          
          <ScrollArea className="h-[300px] pr-4">
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDateAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="p-3 border rounded-md hover:bg-iazi-background-alt transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{apt.service}</p>
                        <p className="text-sm text-muted-foreground">com {apt.professional}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                      <Badge className={
                        apt.status === "scheduled" ? "bg-iazi-primary" : 
                        apt.status === "completed" ? "bg-green-500" : 
                        "bg-red-500"
                      }>
                        {apt.status === "scheduled" ? "Agendado" : 
                         apt.status === "completed" ? "Concluído" : 
                         "Cancelado"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                {selectedDate ? "Nenhum agendamento nesta data" : "Selecione uma data para ver os agendamentos"}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingHistoryCalendar;
