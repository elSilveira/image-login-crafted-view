import React, { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalDetails, fetchProfessionalMe, fetchProfessionalAvailableDates, fetchAvailability, fetchProfessionalAppointments } from "@/lib/api"; // Import API function
import Navigation from "@/components/Navigation";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Share, 
  Star, 
  FileText, 
  Briefcase,
  User,
  Image,
  Users,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from "@/components/ui/avatar";
import { 
  Badge 
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from 'date-fns/locale';
import { useAuth } from "@/contexts/AuthContext";

// Removed mock data

// Define interfaces based on expected API response (adjust as needed)
interface Service {
  id: string;
  name: string;
  description: string;
  price: string; // price as string per backend contract
  duration: number | string; // duration in minutes or string
  categoryId: string;
  image?: string | null;
  companyId: string;
  schedule?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}

interface Experience {
  id: number; // Assuming an ID exists
  startDate: string; // ISO date string
  endDate?: string | null; // ISO date string or null for current
  title: string;
  companyName: string;
  description?: string | null;
}

interface Education {
  id: number; // Assuming an ID exists
  endDate: string; // Year or ISO date string
  degree: string;
  institutionName: string;
}

interface PortfolioItem {
  id: number;
  imageUrl: string;
  description?: string | null;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
  user: { // Assuming user info is nested
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface Professional {
  id: string;
  name: string;
  title?: string | null; // e.g., "Dermatologista"
  bio?: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  averageRating?: number;
  reviewCount?: number;
  specialties?: string[]; // Assuming simple strings for now
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  services?: Service[];
  experiences?: Experience[];
  educations?: Education[];
  portfolioItems?: PortfolioItem[];
  reviews?: Review[];
  // Add company association if needed
  company?: {
    id: string;
    name: string;
  } | null;
}

// Function to render stars based on rating
const renderStars = (rating: number) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  for (let i = 1; i <= 5; i++) {
    let starClass = "text-gray-300";
    if (i <= roundedRating) {
      starClass = "text-yellow-500 fill-yellow-500";
    } else if (i - 0.5 === roundedRating) {
      starClass = "text-yellow-500 fill-yellow-500"; // Simplification
    }
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${starClass}`}
      />
    );
  }
  return stars;
};

const formatPrice = (value?: string) => {
  if (!value) return "N/A";
  // Try to parse as number for formatting
  const num = Number(value);
  if (!isNaN(num)) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
  }
  // If already formatted or not a number, return as is
  return value;
};

const formatDuration = (duration?: number | string) => {
  if (duration === undefined || duration === null) return "N/A";
  let minutes = typeof duration === 'string' ? parseInt(duration, 10) : duration;
  if (isNaN(minutes)) return String(duration);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}min` : ""}`.trim() || "N/A";
};

const formatDate = (dateString?: string | null, dateFormat = "dd/MM/yyyy") => {
  if (!dateString) return "N/A";
  try {
    return format(new Date(dateString), dateFormat, { locale: pt });
  } catch {
    return "Data inválida";
  }
};

const ProfessionalProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Sync active tab with URL query param `tab`
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  // Track cover image error state
  const [coverError, setCoverError] = useState(false);
  // Track avatar image error state
  const [avatarError, setAvatarError] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Se não houver id na URL, buscar dados do próprio profissional logado
  const isOwnProfile = !id && user?.isProfessional;

  const {
    data: professional,
    isLoading,
    isError,
    error
  } = useQuery<Professional, Error>({
    queryKey: [isOwnProfile ? "professionalMe" : "professionalDetails", id],
    queryFn: () => isOwnProfile ? fetchProfessionalMe() : fetchProfessionalDetails(id!),
    enabled: isOwnProfile || !!id,
  });

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Fetch available dates when professional loads
  useEffect(() => {
    if (!professional?.id) return;
    setLoadingDates(true);
    fetchProfessionalAvailableDates(professional.id)
      .then(dates => setAvailableDates(dates))
      .catch(err => console.error(err))
      .finally(() => setLoadingDates(false));
  }, [professional?.id]);

  // Fetch slots when date changes
  useEffect(() => {
    if (!date || !professional?.id) {
      setAppointments([]);
      return;
    }
    setLoadingSlots(true);
    const iso = date.toISOString().split('T')[0];
    // Fetch all appointments for the selected day
    fetchProfessionalAppointments(professional.id, iso, iso)
      .then(data => setAppointments(data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [date, professional?.id]);

  // Debug: log professional.services and availableDates
  useEffect(() => {
    if (professional) {
      console.log('[DEBUG] professional.services:', professional.services);
    }
  }, [professional]);
  useEffect(() => {
    console.log('[DEBUG] availableDates:', availableDates);
  }, [availableDates]);
  useEffect(() => {
    if (date && professional?.id && professional?.services && professional.services.length > 0) {
      const serviceId = professional.services[0].id;
      const iso = date.toISOString().split('T')[0];
      console.log('[DEBUG] fetchAvailability params:', { professionalId: professional.id, serviceId, iso });
    }
  }, [date, professional]);

  // --- Loading State --- 
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  // --- Error State --- 
  if (isError || !professional) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-6 flex flex-col items-center text-center text-destructive">
              <AlertCircle className="h-10 w-10 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Profissional</h2>
              <p className="text-sm mb-4">
                Não foi possível carregar os detalhes do profissional. Tente novamente mais tarde.
              </p>
              {error && <p className="text-xs">Detalhes: {error instanceof Error ? error.message : String(error)}</p>}
              <Button variant="destructive" asChild className="mt-4">
                <Link to="/">Voltar para Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // --- Success State --- 
  // Todas as referências a 'professional' abaixo estão seguras
  const coverImage = professional.coverImageUrl || "https://via.placeholder.com/1200x300?text=Sem+Imagem+de+Capa";
  const avatarImage = professional.avatarUrl;
  const avatarFallback = professional.name.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Header with cover image */}
      <div className="relative h-48 md:h-64 w-full bg-cover bg-center bg-muted">
        {!coverError ? (
          <img
            src={coverImage}
            alt="Imagem de Capa"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setCoverError(true)}
            style={{ zIndex: 0 }}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Imagem de capa indisponível</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <main className="container mx-auto px-4 -mt-16 md:-mt-20 relative z-10 mb-12">
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md flex-shrink-0">
              {!avatarError && avatarImage ? (
                <img
                  src={avatarImage}
                  alt={professional.name}
                  className="h-full w-full object-cover rounded-full"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              )}
            </Avatar>
            
            {/* Profile info */}
            <div className="flex flex-col flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{professional.name}</h1>
              {professional.title && (
                <p className="text-iazi-primary text-lg mb-2">{professional.title}</p>
              )}
              
              {/* Specialties */}
              {professional.specialties && professional.specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {professional.specialties.map((specialty, i) => (
                    <Badge key={i} variant="outline" className="bg-gray-50">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Rating */}
              {(professional.averageRating !== undefined && professional.averageRating !== null) && (
                <div className="flex items-center gap-1 mb-4 justify-center md:justify-start">
                  <div className="flex">
                    {renderStars(professional.averageRating)}
                  </div>
                  <span className="font-semibold">{professional.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({professional.reviewCount || 0} avaliações)</span>
                </div>
              )}
              {/* Link to Company if associated */}
              {professional.company && (
                 <p className="text-sm text-gray-600">
                   Associado a: <Link to={`/company/${professional.company.id}`} className="text-iazi-primary hover:underline">{professional.company.name}</Link>
                 </p>
              )}
            </div>
            
            {/* Schedule button / Share button */} 
            <div className="flex flex-col md:flex-row items-center gap-2 mt-4 md:mt-0 flex-shrink-0">
              <Button size="lg" onClick={() => setActiveTab("availability")} className="bg-iazi-primary hover:bg-iazi-primary-hover">
                Ver Agenda
              </Button>
               <Button variant="outline" size="icon" className="mt-2 md:mt-0">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs navigation */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v)} className="space-y-4">
          <TabsList className="bg-white w-full h-auto flex-wrap justify-start p-0 md:p-0 shadow-sm rounded-lg overflow-x-auto">
            <TabsTrigger value="about" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <User className="h-4 w-4" />
              Sobre
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <FileText className="h-4 w-4" />
              Serviços ({professional.services?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <Briefcase className="h-4 w-4" />
              Experiência
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <CalendarIcon className="h-4 w-4" />
              Disponibilidade
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <Star className="h-4 w-4" />
              Avaliações ({professional.reviewCount || 0})
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <Image className="h-4 w-4" />
              Portfólio ({professional.portfolioItems?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="about" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre</h2>
            {professional.bio ? (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{professional.bio}</p>
            ) : (
              <p className="text-gray-500 italic mb-6">Nenhuma biografia fornecida.</p>
            )}
            
            <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
            <div className="space-y-3">
              {professional.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-iazi-primary flex-shrink-0" />
                  <span className="text-gray-700">{professional.address}</span>
                </div>
              )}
              {professional.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-iazi-primary flex-shrink-0" />
                  <span className="text-gray-700">{professional.phone}</span>
                </div>
              )}
              {professional.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-iazi-primary flex-shrink-0" />
                  <span className="text-gray-700">{professional.email}</span>
                </div>
              )}
            </div>
            
            {/* Map Placeholder */}
            {professional.address && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Localização</h3>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  {/* TODO: Integrate with a map component if needed */}
                  <MapPin className="h-12 w-12 text-gray-400" />
                  <span className="ml-2 text-gray-500">Mapa indisponível (Integração Pendente)</span>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="services" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Serviços Oferecidos</h2>
            {professional.services && professional.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professional.services.map((service) => (
                  <Card key={service.id} className="overflow-hidden border-l-4 border-l-iazi-primary hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <span className="text-lg font-semibold text-iazi-primary">{formatPrice(service.price)}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDuration(service.duration)}</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{service.description}</p>
                      {service.schedule && service.schedule.length > 0 && (
                        <div className="mb-3">
                          <div className="font-semibold text-xs text-gray-500 mb-1">Horários:</div>
                          <ul className="text-xs text-gray-600 grid grid-cols-2 gap-1">
                            {service.schedule.map((slot, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="font-mono bg-gray-100 rounded px-2 py-0.5">
                                  {slot.dayOfWeek}: {slot.startTime} - {slot.endTime}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                          <Link to={`/service/${service.id}`}>Ver Detalhes</Link>
                        </Button>
                        <Button className="flex-1 bg-iazi-primary hover:bg-iazi-primary-hover" asChild>
                          {/* Link to booking, potentially passing professional ID */}
                          <Link to={`/booking/${service.id}?professional=${professional.id}`}>Agendar</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Nenhum serviço oferecido por este profissional.</p>
            )}
          </TabsContent>
          
          <TabsContent value="experience" className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Experiência Profissional</h2>
              {professional.experiences && professional.experiences.length > 0 ? (
                <div className="space-y-6">
                  {professional.experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-iazi-primary pl-4">
                      <div className="font-medium text-lg">{exp.title}</div>
                      <div className="text-iazi-primary">{exp.companyName}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(exp.startDate, "MMM yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Presente"}
                      </div>
                      {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-gray-500 italic">Nenhuma experiência profissional listada.</p>
              )}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-6">Formação Acadêmica</h2>
              {professional.educations && professional.educations.length > 0 ? (
                <div className="space-y-6">
                  {professional.educations.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-iazi-primary pl-4">
                      <div className="font-medium text-lg">{edu.degree}</div>
                      <div className="text-iazi-primary">{edu.institutionName}</div>
                      <div className="text-sm text-gray-500">{edu.endDate}</div> {/* Assuming endDate is just year or formatted string */}
                    </div>
                  ))}
                </div>
              ) : (
                 <p className="text-gray-500 italic">Nenhuma formação acadêmica listada.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="availability" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Verificar Disponibilidade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  locale={pt}
                  disabled={dateItem => {
                    const today = new Date(); today.setHours(0,0,0,0);
                    const iso = dateItem.toISOString().split('T')[0];
                    return loadingDates || dateItem < today || !availableDates.includes(iso);
                  }}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium text-lg mb-4">
                  {date ? `Horários disponíveis para ${format(date, 'dd/MM/yyyy', { locale: pt })}` : 'Selecione uma data'}
                </h3>
                {/* Legend */}
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-2"><Button size="sm" className="w-6 h-6 p-0" /> <span>Disponível</span></div>
                  <div className="flex items-center gap-2"><Button size="sm" variant="destructive" className="w-6 h-6 p-0" disabled /> <span>Indisponível</span></div>
                </div>
                <div>
                  {date ? (
                    loadingSlots ? (
                      <div className="text-center">Carregando horários...</div>
                    ) : (
                      (() => {
                        const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
                        const dayKey = days[date.getDay()];
                        const servicesForDay = (professional.services || []).filter(service =>
                          service.schedule && service.schedule.some(s => s.dayOfWeek === dayKey)
                        );
                        if (servicesForDay.length === 0) {
                          return <div className="text-center text-gray-500 italic">Nenhum serviço disponível para este dia da semana.</div>;
                        }
                        return (
                          <div className="space-y-8">
                            {servicesForDay.map(service => {
                              const slotDef = service.schedule.find(s => s.dayOfWeek === dayKey);
                              let allSlots: string[] = [];
                              if (slotDef) {
                                const generateTimeSlots = (start: string, end: string, interval: number) => {
                                  const times: string[] = [];
                                  let [sh, sm] = start.split(':').map(Number);
                                  let [eh, em] = end.split(':').map(Number);
                                  const current = new Date(date); current.setHours(sh, sm, 0, 0);
                                  const endDate = new Date(date); endDate.setHours(eh, em, 0, 0);
                                  while (current <= endDate) {
                                    times.push(format(current, 'HH:mm'));
                                    current.setMinutes(current.getMinutes() + interval);
                                  }
                                  return times;
                                };
                                allSlots = generateTimeSlots(slotDef.startTime, slotDef.endTime, 30);
                              }
                              return (
                                <div key={service.id}>
                                  <div className="font-semibold mb-2 flex items-center gap-2">
                                    <span className="text-iazi-primary">{service.name}</span>
                                    <span className="text-xs text-gray-500">{service.duration} min</span>
                                  </div>
                                  {allSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {allSlots.map((time, idx) => {
                                        // Check if there is an appointment for this service at this time
                                        const slotTaken = appointments.some(a => {
                                          if (a.serviceId !== service.id) return false;
                                          // Parse startTime to local time string
                                          const apptDate = new Date(a.startTime);
                                          const apptTime = format(apptDate, 'HH:mm');
                                          return apptTime === time;
                                        });
                                        const available = !slotTaken;
                                        return (
                                          <Button key={idx} variant={available ? 'outline' : 'destructive'} className="justify-start" disabled={!available}>
                                            <Clock className="mr-2 h-4 w-4" />{time}
                                          </Button>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="text-center text-gray-500 italic">Nenhum horário cadastrado para este serviço neste dia.</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    )
                  ) : (
                    <div className="text-center text-gray-500 italic">Selecione uma data</div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Avaliações ({professional.reviewCount || 0})</h2>
              {/* TODO: Add button functionality if user can review */}
              {/* <Button variant="outline">Deixar avaliação</Button> */}
            </div>
            
            {professional.reviews && professional.reviews.length > 0 ? (
              <div className="space-y-6">
                {professional.reviews.map((review) => (
                  <Card key={review.id} className="border-l-4 border-l-iazi-primary/50">
                     <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.user.avatar || undefined} alt={review.user.name} />
                          <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold">{review.user.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Add pagination or "load more" if needed */} 
              </div>
            ) : (
              <p className="text-gray-500 italic">Este profissional ainda não possui avaliações.</p>
            )}
          </TabsContent>

          <TabsContent value="portfolio" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Portfólio</h2>
            {professional.portfolioItems && professional.portfolioItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {professional.portfolioItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden group relative">
                    <img
                      src={item.imageUrl}
                      alt={item.description || "Portfolio Item"}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300?text=Imagem+Indisponível"; }}
                    />
                    {item.description && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white text-sm line-clamp-2">{item.description}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Nenhum item no portfólio.</p>
            )}
          </TabsContent>
          
        </Tabs>
      </main>
    </div>
  );
};

export default ProfessionalProfile;

