import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import { fetchAppointments, fetchCompanies } from "@/lib/api";
import { CalendarDays, Clock, Loader2, AlertCircle, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { useState } from "react";
import { CompanyCard } from "@/components/search/CompanyCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

// Define interface for Appointment data (alinhado ao backend)
interface Appointment {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: string;    // "confirmed", "pending", "completed", etc.
  service?: {
    id: string;
    name: string;
    price?: number | string;
    duration?: string;
  };
  services?: Array<{
    id: string;
    service?: {
      id: string;
      name: string;
      price?: number | string;
      duration?: string;
    }
  }>;
  professional: {
    id: string;
    name: string;
    image?: string;
    rating?: number;
  };
  user?: {
    id: string;
    name: string;
  };
}

const specialties = [
  "Todas especialidades",
  "Clínica Dermatológica",
  "Centro de Fisioterapia",
  "Salão de Beleza",
  "Academia e Personal Training",
  "Consultório Nutricional",
  "Clínica Odontológica",
  "Consultório Psicológico",
  "Centro de Massagem",
  "Estúdio de Manicure",
];
const availabilityOptions = [
  "Qualquer data",
  "Hoje",
  "Amanhã",
  "Esta semana",
  "Próxima semana",
];

const AppointmentSection = () => {
  const queryClient = useQueryClient();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("Todas especialidades");
  const [sortBy, setSortBy] = useState("rating");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");

  // Fetch companies with filters
  const { data: companies = [], isLoading, isError, error } = useQuery<any[], Error>({
    queryKey: ["companies", searchTerm, specialty, sortBy, ratingFilter, availabilityFilter],
    queryFn: () => fetchCompanies({
      q: searchTerm,
      specialty: specialty !== "Todas especialidades" ? specialty : undefined,
      sort: sortBy,
      rating: ratingFilter[0] > 0 ? ratingFilter[0] : undefined,
      availability: availabilityFilter !== "Qualquer data" ? availabilityFilter : undefined,
      limit: 8,
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Busca agendamentos do usuário logado (futuros, status relevante)
  const { data: appointments, isLoading: isLoadingAppointments, isError: isErrorAppointments, error: errorAppointments } = useQuery<Appointment[], Error>({
    queryKey: ["userAppointments"],
    queryFn: () => fetchAppointments({ 
      include: "service,professional,services.service", 
      limit: 10, 
      sort: "startTime_desc"
    }),
    select: (data) => {
      // Ensure data is an array before filtering
      if (!data || !Array.isArray(data)) {
        return [];
      }
      return data
        .filter(appt =>
          ["confirmed", "pending", "in-progress"].includes(appt.status) &&
          new Date(appt.startTime) >= new Date()
        )
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    },
    staleTime: 5 * 60 * 1000,
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
        {isLoadingAppointments ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : isErrorAppointments ? (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os próximos agendamentos.
              {errorAppointments?.message && <p className="text-xs mt-2">Detalhes: {errorAppointments.message}</p>}
            </AlertDescription>
          </Alert>
        ) : (
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
                        to={`/service/${appointment.service?.id || (appointment.services?.[0]?.service?.id || '')}`}
                        className="block font-playfair font-semibold text-base hover:text-iazi-primary"
                      >
                        {appointment.service?.name || (appointment.services?.[0]?.service?.name || 'Serviço Agendado')}
                        {appointment.services && appointment.services.length > 1 && (
                          <span className="text-sm text-gray-500 ml-2">
                            + {appointment.services.length - 1} {appointment.services.length === 2 ? 'serviço' : 'serviços'}
                          </span>
                        )}
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
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(appointment.startTime)} às {formatTime(appointment.startTime)}
                      </p>
                      {/* Link to view appointment details */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-[#4664EA] hover:text-white font-inter"
                        asChild
                      >
                        <Link to={`/booking/history?highlight=${appointment.id}`}>
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center gap-4 py-8">
                <p className="text-center text-sm text-gray-500">
                  Você não tem agendamentos futuros.
                </p>
                <div className="flex flex-col gap-2 items-center">
                  <Button asChild variant="default" className="font-inter bg-iazi-primary hover:bg-iazi-primary-hover">
                    <Link to="/search?type=service">
                      Agendar um Serviço
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="font-inter">
                    <Link to="/search?type=professional">
                      Encontrar Profissionais
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentSection;

