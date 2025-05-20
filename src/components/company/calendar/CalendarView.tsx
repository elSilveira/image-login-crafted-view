// src/components/company/calendar/CalendarView.tsx
import React, { useState, useEffect, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { DayCalendarView } from "./DayCalendarView";
import { WeekCalendarView } from "./WeekCalendarView";
import { MonthCalendarView } from "./MonthCalendarView";
import { ListCalendarView } from "./ListCalendarView";
import { ViewType, FilterType, AppointmentStatus } from "./types";
import apiClient from "@/lib/api";
// Removed: import { mockAppointments } from "./mock-data";

// Re-use API and Display types (ideally share)
interface ApiAppointment {
  id: string;
  startTime: string; // ISO Date string
  endTime: string;   // ISO Date string
  status: AppointmentStatus;
  notes?: string | null;
  userId: string;
  professionalId: string;
  serviceId: string;
  companyId: string;
  // Include related data needed for display
  user?: { id: string; name: string | null };
  professional?: { id: string; name: string };
  service?: { id: string; name: string };
}

interface DisplayAppointment {
  id: string;
  start: Date;
  end: Date;
  status: ApiAppointment["status"];
  serviceName: string;
  clientName: string;
  staffName: string;
  // Add any other fields needed by child views
  serviceId: string;
  professionalId: string;
}

const adaptApiAppointment = (apiAppt: ApiAppointment): DisplayAppointment => ({
  id: apiAppt.id,
  start: new Date(apiAppt.startTime),
  end: new Date(apiAppt.endTime),
  status: apiAppt.status,
  serviceName: apiAppt.service?.name ?? "N/A",
  clientName: apiAppt.user?.name ?? "N/A",
  staffName: apiAppt.professional?.name ?? "N/A",
  serviceId: apiAppt.serviceId,
  professionalId: apiAppt.professionalId,
});

interface CalendarViewProps {
  viewType: ViewType;
  staffFilter: string; // Assuming staffFilter is professionalId or "all"
  // resourceFilter: string; // Assuming resource filter is not implemented yet
  filters: FilterType; // Contains status and serviceId
  companyId: string; // Need companyId
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  viewType,
  staffFilter,
  // resourceFilter, // Removed for now
  filters,
  companyId,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [appointments, setAppointments] = useState<DisplayAppointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!companyId) {
        setError("ID da empresa não fornecido.");
        setIsLoading(false);
        return;
    }

    const fetchAppointments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams({
          companyId: companyId,
          dateFrom: dateRange.start.toISOString().substring(0, 10), // YYYY-MM-DD
          dateTo: dateRange.end.toISOString().substring(0, 10),     // YYYY-MM-DD
          include: "user,professional,service",
          limit: "100", // Fetch a larger number for calendar views
        });

        // Add filters to query params if not "all"
        if (filters.status !== "all") {
          queryParams.append("status", filters.status);
        }
        if (filters.serviceId !== "all") {
          queryParams.append("serviceId", filters.serviceId);
        }
        if (staffFilter !== "all") {
          queryParams.append("professionalId", staffFilter);
        }
        // if (resourceFilter !== "all") { // Add resource filter if implemented
        //   queryParams.append("resourceId", resourceFilter);
        // }        // Use the correct API URL
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3002/api"}/appointments?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error(`Erro HTTP ${response.status}: Falha ao buscar agendamentos`);
        }
        const result = await response.json();
        const data: ApiAppointment[] = result.data ?? [];

        if (!data) {
          throw new Error("Resposta inválida da API");
        }

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
  }, [companyId, dateRange, filters, staffFilter]); // Re-fetch when range or filters change

  const renderCalendarView = () => {
    // Pass fetched/adapted appointments to the specific view
    const viewProps = { date: selectedDate, appointments: appointments };

    if (isLoading) {
        // Render skeletons based on view type
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
      {/* Consider moving Calendar selector outside if it controls selectedDate globally */} 
      {/* <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
        </h2>
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border p-0" // Compact calendar
            locale={ptBR}
          />
        </div>
      </div> */}
      {renderCalendarView()}
    </div>
  );
};

