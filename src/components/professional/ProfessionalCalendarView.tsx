import React, { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ChevronLeft, ChevronRight, Info, CheckCircle, XCircle, AlertTriangle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DayCalendarView } from "@/components/company/calendar/DayCalendarView";
import { WeekCalendarView } from "@/components/company/calendar/WeekCalendarView";
import { MonthCalendarView } from "@/components/company/calendar/MonthCalendarView";
import { ListCalendarView } from "@/components/company/calendar/ListCalendarView";
import { ViewType, FilterType, AppointmentType, AppointmentStatus } from "@/components/company/calendar/types";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";
import { updateAppointmentStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import ProfessionalRescheduleModal from "./ProfessionalRescheduleModal";

// Define the structure expected from the API for an appointment
interface ApiAppointment {
  id: string;
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  status: string; // Using string to handle all possible values from API
  notes?: string | null;
  userId: string;
  professionalId: string;
  serviceId: string;
  companyId: string;
  // Include related data needed for display
  user?: { id: string; name: string | null; email?: string; phone?: string };
  professional?: { id: string; name: string };
  service?: { id: string; name: string; duration?: string; price?: number };
}

// Map API appointment to the format expected by calendar views
const adaptApiAppointment = (apiAppt: ApiAppointment): AppointmentType => {
  // Map API status to AppointmentStatus type (handling no-show as cancelled)
  let mappedStatus: AppointmentStatus = 
    apiAppt.status.toLowerCase() === "confirmed" ? "confirmed" :
    apiAppt.status.toLowerCase() === "pending" ? "pending" :
    apiAppt.status.toLowerCase() === "in-progress" || apiAppt.status.toLowerCase() === "in_progress" ? "in-progress" :
    apiAppt.status.toLowerCase() === "completed" ? "completed" :
    "cancelled"; // Default for cancelled and no-show

  return {
    id: apiAppt.id,
    title: apiAppt.service?.name ?? "Agendamento",
    start: new Date(apiAppt.startTime),
    end: new Date(apiAppt.endTime),
    status: mappedStatus,
    serviceName: apiAppt.service?.name ?? "N/A",
    clientName: apiAppt.user?.name ?? "N/A",
    clientId: apiAppt.userId,
    serviceId: apiAppt.serviceId,
    staffId: apiAppt.professionalId,
    staffName: apiAppt.professional?.name ?? "N/A",
    notes: apiAppt.notes || undefined,
    // Add additional details for the modal
    clientEmail: apiAppt.user?.email,
    clientPhone: apiAppt.user?.phone,
    servicePrice: apiAppt.service?.price,
    serviceDuration: apiAppt.service?.duration
  };
};

interface ProfessionalCalendarViewProps {
  viewType: ViewType;
  filters: FilterType;
}

const statusColors: Record<AppointmentStatus, string> = {
  "pending": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "confirmed": "bg-green-100 text-green-800 border-green-300",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-300",
  "completed": "bg-purple-100 text-purple-800 border-purple-300",
  "cancelled": "bg-red-100 text-red-800 border-red-300"
};

const statusLabels: Record<AppointmentStatus, string> = {
  "pending": "Pendente",
  "confirmed": "Confirmado",
  "in-progress": "Em Andamento",
  "completed": "Concluído",
  "cancelled": "Cancelado"
};

const ProfessionalCalendarView: React.FC<ProfessionalCalendarViewProps> = ({
  viewType,
  filters,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const professionalId = user?.professionalId;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  
  // For appointment details modal
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentType | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);

  // Handle opening appointment details
  const handleOpenAppointmentDetails = (appointment: AppointmentType) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  // Determine date range based on viewType and selectedDate
  const dateRange = useMemo(() => {
    let start: Date;
    let end: Date;
    switch (viewType) {
      case "day":
        start = startOfDay(selectedDate);
        end = endOfDay(selectedDate);
        break;
      case "week":
        start = startOfWeek(selectedDate, { locale: ptBR });
        end = endOfWeek(selectedDate, { locale: ptBR });
        break;
      case "month":
        start = startOfMonth(selectedDate);
        end = endOfMonth(selectedDate);
        break;
      case "list": // List view might show a week or month, adjust as needed
      default:
        start = startOfWeek(selectedDate, { locale: ptBR });
        end = endOfWeek(selectedDate, { locale: ptBR });
        break;
    }
    return { start, end };
  }, [viewType, selectedDate]);

  // Fetch appointments based on date range and filters
  useEffect(() => {
    if (!professionalId) {
      setError("ID do profissional não disponível.");
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          professionalId: professionalId,
          dateFrom: dateRange.start.toISOString().substring(0, 10), // YYYY-MM-DD
          dateTo: dateRange.end.toISOString().substring(0, 10),     // YYYY-MM-DD
          include: "user,service",
          limit: "500", // Fetch a larger number for calendar views
          sort: "startTime_asc" // Sort by start time ascending
        });

        // Add filters to query params if not "all"
        if (filters.status !== "all") {
          queryParams.append("status", filters.status);
        }
        if (filters.service !== "all") {
          queryParams.append("serviceId", filters.service);
        }        
        const response = await apiClient.get(`/appointments?${queryParams.toString()}`);
        const result = response.data;
        const data: ApiAppointment[] = result.data ?? [];

        const adaptedData = data.map(adaptApiAppointment);
        setAppointments(adaptedData);

      } catch (err: any) {
        console.error("Erro ao buscar agendamentos:", err);
        setError(err.message || "Erro ao carregar agendamentos.");
        setAppointments([]); // Clear appointments on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [professionalId, dateRange, filters]);

  // Handle status update
  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    setIsUpdating(true);

    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      
      // Success toast
      toast({
        title: "Status atualizado",
        description: `Agendamento ${statusLabels[newStatus as AppointmentStatus].toLowerCase()} com sucesso.`,
      });
      
      // Close the modal
      setIsDetailsOpen(false);
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["professionalBookings"] });
      
      // Refresh calendar view
      const queryParams = new URLSearchParams({
        professionalId: professionalId || '',
        dateFrom: dateRange.start.toISOString().substring(0, 10),
        dateTo: dateRange.end.toISOString().substring(0, 10),
        include: "user,service",
        limit: "500",
        sort: "startTime_asc"
      });

      if (filters.status !== "all") {
        queryParams.append("status", filters.status);
      }
      if (filters.service !== "all") {
        queryParams.append("serviceId", filters.service);
      }        
      
      const response = await apiClient.get(`/appointments?${queryParams.toString()}`);
      const result = response.data;
      const data = result.data ?? [];

      const adaptedData = data.map(adaptApiAppointment);
      setAppointments(adaptedData);

    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message || "Ocorreu um erro ao atualizar o status. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Open reschedule modal
  const openRescheduleModal = () => {
    setIsDetailsOpen(false);
    setIsRescheduleModalOpen(true);
  };

  // Handler for changing the selected date
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setCalendarVisible(false); // Hide calendar after selection
    }
  };
  
  // Navigate to previous period
  const goToPrevious = () => {
    let newDate;
    switch (viewType) {
      case "day":
        newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        break;
      case "week":
        newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 7);
        break;
      case "month":
        newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() - 1);
        break;
      default:
        newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 7);
    }
    setSelectedDate(newDate);
  };
  
  // Navigate to next period
  const goToNext = () => {
    let newDate;
    switch (viewType) {
      case "day":
        newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        break;
      case "week":
        newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 7);
        break;
      case "month":
        newDate = new Date(selectedDate);
        newDate.setMonth(selectedDate.getMonth() + 1);
        break;
      default:
        newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };
  
  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Custom enhanced calendar views with appointment interactions
  const renderCalendarView = () => {
    // Pass fetched/adapted appointments to the specific view along with an interaction handler
    const viewProps = { 
      date: selectedDate, 
      appointments: appointments,
      onAppointmentClick: handleOpenAppointmentDetails 
    };

    if (isLoading) {
      return <div className="mt-4"><Skeleton className="h-[400px] w-full" /></div>;
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Agendamentos</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    // Render appropriate calendar view with enhanced interactive appointments
    switch (viewType) {
      case "day":
        return (
          <EnhancedDayCalendarView 
            appointments={appointments} 
            date={selectedDate} 
            onAppointmentClick={handleOpenAppointmentDetails}
          />
        );
      case "week":
        return (
          <EnhancedWeekCalendarView 
            appointments={appointments} 
            date={selectedDate} 
            onAppointmentClick={handleOpenAppointmentDetails}
          />
        );
      case "month":
        return <MonthCalendarView {...viewProps as any} />;
      case "list":
        return <ListCalendarView {...viewProps as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2 pb-2 border-b">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPrevious}
            className="p-1 h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 font-medium"
            onClick={() => setCalendarVisible(!calendarVisible)}
          >
            {viewType === "day" 
              ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })
              : viewType === "week"
                ? `${format(dateRange.start, "dd/MM", { locale: ptBR })} - ${format(dateRange.end, "dd/MM/yyyy", { locale: ptBR })}`
                : format(selectedDate, "MMMM yyyy", { locale: ptBR })
            }
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNext}
            className="p-1 h-8 w-8"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="h-8 ml-1"
          >
            Hoje
          </Button>
        </div>
        
        {/* Calendar picker - toggle visibility */}
        {calendarVisible && (
          <div className="absolute z-50 mt-1 bg-white border shadow-lg rounded-md p-2 top-20">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border shadow pointer-events-auto"
            />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        {renderCalendarView()}
      </div>

      {/* Improved Appointment Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              Informações e ações disponíveis para este agendamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedAppointment.serviceName}</h3>
                <Badge className={statusColors[selectedAppointment.status]}>
                  {statusLabels[selectedAppointment.status]}
                </Badge>
              </div>
              
              <div className="space-y-2 divide-y">
                <div className="py-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                  <p className="font-medium">{selectedAppointment.clientName}</p>
                  {selectedAppointment.clientEmail && (
                    <p className="text-sm text-muted-foreground">{selectedAppointment.clientEmail}</p>
                  )}
                  {selectedAppointment.clientPhone && (
                    <p className="text-sm text-muted-foreground">{selectedAppointment.clientPhone}</p>
                  )}
                </div>
                
                <div className="py-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Data e Horário</h4>
                  <p className="font-medium">
                    {format(selectedAppointment.start, "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                  <p className="text-sm">
                    {format(selectedAppointment.start, "HH:mm", { locale: ptBR })} - 
                    {format(selectedAppointment.end, "HH:mm", { locale: ptBR })}
                  </p>
                </div>
                
                <div className="py-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Serviço</h4>
                  <p className="font-medium">{selectedAppointment.serviceName}</p>
                  {selectedAppointment.servicePrice && (
                    <p className="text-sm">
                      Preço: R$ {selectedAppointment.servicePrice.toFixed(2)}
                    </p>
                  )}
                  {selectedAppointment.serviceDuration && (
                    <p className="text-sm">
                      Duração: {selectedAppointment.serviceDuration}
                    </p>
                  )}
                </div>
                
                {selectedAppointment.notes && (
                  <div className="py-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Observações</h4>
                    <p className="text-sm bg-muted/30 p-2 rounded-md">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
            {selectedAppointment && (
              <>
                {/* Action buttons based on appointment status */}
                {selectedAppointment.status === "pending" && (
                  <div className="flex flex-wrap gap-2 justify-end w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "confirmed")}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Confirmar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "cancelled")}
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                )}
                
                {selectedAppointment.status === "confirmed" && (
                  <div className="flex flex-wrap gap-2 justify-end w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "in-progress")}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Iniciar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={isUpdating}
                      onClick={openRescheduleModal}
                    >
                      <CalendarDays className="h-3.5 w-3.5 mr-1" />
                      Reagendar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "cancelled")}
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                      Não Compareceu
                    </Button>
                  </div>
                )}
                
                {selectedAppointment.status === "in-progress" && (
                  <div className="flex flex-wrap gap-2 justify-end w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      disabled={isUpdating}
                      onClick={() => handleStatusUpdate(selectedAppointment.id, "completed")}
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Finalizar
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDetailsOpen(false)}
                  className="mt-2 sm:mt-0"
                >
                  Fechar
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reschedule Modal */}
      {selectedAppointment && (
        <ProfessionalRescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          appointment={selectedAppointment}
        />
      )}
    </div>
  );
};

// Enhanced Day Calendar View with appointment interactions
interface EnhancedCalendarViewProps {
  date: Date;
  appointments: AppointmentType[];
  onAppointmentClick: (appointment: AppointmentType) => void;
}

const EnhancedDayCalendarView: React.FC<EnhancedCalendarViewProps> = ({ 
  date, 
  appointments,
  onAppointmentClick
}) => {
  // Generate time slots from 8:00 to 20:00
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8;
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);
  });
  
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 text-center font-medium">
        {format(date, "EEEE, d MMMM yyyy", { locale: ptBR })}
      </div>
      <div className="divide-y">
        {timeSlots.map((timeSlot, index) => {
          const hourAppointments = appointments.filter(appt => 
            format(appt.start, 'HH') === format(timeSlot, 'HH')
          );
          
          return (
            <div key={index} className="flex">
              <div className="w-16 p-2 border-r text-center text-sm font-medium">
                {format(timeSlot, 'HH:mm')}
              </div>
              <div className="flex-1 min-h-[70px] p-1 relative">
                {hourAppointments.length > 0 ? (
                  <div className="space-y-1">
                    {hourAppointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        onClick={() => onAppointmentClick(appointment)}
                        className={`p-2 rounded-md border text-sm cursor-pointer hover:shadow-md transition-shadow
                          ${statusColors[appointment.status]}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium line-clamp-1">{appointment.serviceName}</span>
                          <span className="text-xs">
                            {format(appointment.start, 'HH:mm')} - {format(appointment.end, 'HH:mm')}
                          </span>
                        </div>
                        <div className="text-xs mt-1">Cliente: {appointment.clientName}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                    Nenhum agendamento
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Week Calendar View with appointment interactions
const EnhancedWeekCalendarView: React.FC<EnhancedCalendarViewProps> = ({
  date,
  appointments,
  onAppointmentClick
}) => {
  // Get the start of the week (Monday)
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  
  // Generate days for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    return day;
  });
  
  // Generate time slots
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8; // 8:00 to 20:00
    return hour;
  });
  
  return (
    <div className="border rounded-md overflow-x-auto">
      <div className="min-w-[900px]"> {/* Set minimum width to prevent squeezing */}
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r bg-muted"></div> {/* Empty top-left cell */}
          {weekDays.map((day, index) => {
            const isToday = format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
            return (
              <div 
                key={index} 
                className={`p-2 text-center font-medium ${
                  isToday ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <div>{format(day, 'EEE', { locale: ptBR })}</div>
                <div>{format(day, 'dd')}</div>
              </div>
            );
          })}
        </div>
        
        {/* Time slots rows */}
        {timeSlots.map((hour, timeIndex) => (
          <div key={timeIndex} className="grid grid-cols-8 border-b hover:bg-gray-50">
            <div className="p-2 border-r text-center text-sm font-medium">
              {`${hour}:00`}
            </div>
            
            {weekDays.map((day, dayIndex) => {
              const cellDate = new Date(day);
              cellDate.setHours(hour, 0, 0, 0);
              
              // Find appointments that start in this hour slot
              const cellAppointments = appointments.filter(appointment => {
                const appointmentDate = appointment.start;
                return format(appointmentDate, 'yyyy-MM-dd') === format(cellDate, 'yyyy-MM-dd') &&
                       parseInt(format(appointmentDate, 'HH')) === hour;
              });
              
              return (
                <div key={dayIndex} className="min-h-[60px] p-1 border-r relative">
                  {cellAppointments.length > 0 ? (
                    <div className="space-y-1">
                      {cellAppointments.map(appointment => (
                        <TooltipProvider key={appointment.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className={`p-1 rounded text-xs cursor-pointer hover:shadow-md transition-shadow truncate
                                  ${statusColors[appointment.status]}`}
                                onClick={() => onAppointmentClick(appointment)}
                              >
                                <div className="font-medium truncate">{appointment.serviceName}</div>
                                <div className="truncate text-[10px]">{appointment.clientName}</div>
                                <div className="text-[10px]">
                                  {format(appointment.start, 'HH:mm')} - {format(appointment.end, 'HH:mm')}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <div className="font-medium">{appointment.serviceName}</div>
                                <div>Cliente: {appointment.clientName}</div>
                                <div>
                                  {format(appointment.start, 'HH:mm')} - {format(appointment.end, 'HH:mm')}
                                </div>
                                <div>
                                  <Badge className={`text-[10px] mt-1 ${statusColors[appointment.status]}`}>
                                    {statusLabels[appointment.status]}
                                  </Badge>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalCalendarView;
