import { useQuery } from "@tanstack/react-query";
import { fetchAppointments } from "@/lib/api";
import { CalendarDays, Clock, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Define interface for Appointment data (adjust based on actual API response)
interface Appointment {
  id: string; // Assuming ID is string
  dateTime: string; // Assuming ISO string format
  status: string; // e.g., "SCHEDULED", "COMPLETED", "CANCELLED"
  service: {
    id: number;
    name: string;
  };
  professional: {
    id: string;
    name: string;
  };
  // Add other relevant fields like company, user, etc. if needed
}

const AppointmentSection = () => {
  // Fetch appointments using React Query
  // Assuming the API filters appointments for the logged-in user
  const { data: appointments, isLoading, isError, error } = useQuery<Appointment[], Error>({
    queryKey: ["userAppointments"],
    queryFn: fetchAppointments,
    // Filter for upcoming appointments (status might be SCHEDULED or CONFIRMED)
    // This filtering might be better done on the backend if possible
    select: (data) => data.filter(appt => 
      (appt.status === "SCHEDULED" || appt.status === "CONFIRMED") && 
      new Date(appt.dateTime) >= new Date()
    ).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()), // Sort by date
    staleTime: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: pt });
    } catch {
      return "Data inválida";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm", { locale: pt });
    } catch {
      return "Hora inválida";
    }
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl font-playfair">
          <Clock className="h-5 w-5" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-24 bg-destructive/10 border border-destructive rounded-md p-4">
            <AlertCircle className="h-5 w-5 text-destructive mr-2" />
            <span className="text-destructive text-sm">Erro ao carregar agendamentos.</span>
            {/* <span className="text-destructive text-xs">{error.message}</span> */} 
          </div>
        )}
        {!isLoading && !isError && (
          <div className="space-y-3">
            {appointments && appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      {/* Link to service details */}
                      <Link 
                        to={`/service/${appointment.service.id}`}
                        className="block font-playfair font-semibold text-base hover:text-iazi-primary"
                      >
                        {appointment.service.name}
                      </Link>
                      {/* Link to professional profile */}
                      <Link 
                        to={`/professional/${appointment.professional.id}`}
                        className="text-sm text-gray-600 hover:text-iazi-primary font-inter"
                      >
                        {appointment.professional.name}
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 font-inter flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5"/>
                        {formatDate(appointment.dateTime)} às {formatTime(appointment.dateTime)}
                      </p>
                      {/* Link to reschedule page (ensure route exists and handles ID) */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-[#4664EA] hover:text-white font-inter"
                        asChild
                      >
                        {/* Adjust route as needed */}
                        <Link to={`/booking/${appointment.id}/reschedule`}>
                          Reagendar
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500 py-4 italic">
                Você não tem agendamentos futuros.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentSection;

