
import React, { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayCalendarView } from "@/components/company/calendar/DayCalendarView";
import { WeekCalendarView } from "@/components/company/calendar/WeekCalendarView";
import { MonthCalendarView } from "@/components/company/calendar/MonthCalendarView";
import { ListCalendarView } from "@/components/company/calendar/ListCalendarView";
import { ViewType, FilterType, AppointmentType, AppointmentStatus } from "@/components/company/calendar/types";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/api";

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
    apiAppt.status === "confirmed" ? "confirmed" :
    apiAppt.status === "pending" ? "pending" :
    apiAppt.status === "in-progress" ? "in-progress" :
    apiAppt.status === "completed" ? "completed" :
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
    notes: apiAppt.notes || undefined
  };
};

interface ProfessionalCalendarViewProps {
  viewType: ViewType;
  filters: FilterType;
}

const ProfessionalCalendarView: React.FC<ProfessionalCalendarViewProps> = ({
  viewType,
  filters,
}) => {
  const { user } = useAuth();
  const professionalId = user?.professionalId;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarVisible, setCalendarVisible] = useState<boolean>(false);

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

  const renderCalendarView = () => {
    // Pass fetched/adapted appointments to the specific view
    const viewProps = { date: selectedDate, appointments: appointments };

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

    switch (viewType) {
      case "day":
        return <DayCalendarView {...viewProps} />;
      case "week":
        return <WeekCalendarView {...viewProps} />;
      case "month":
        return <MonthCalendarView {...viewProps} />;
      case "list":
        return <ListCalendarView {...viewProps} />;
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
              className="rounded-md border shadow"
            />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        {renderCalendarView()}
      </div>
    </div>
  );
};

export default ProfessionalCalendarView;
