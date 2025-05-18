import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalDetails, fetchProfessionalMe, fetchProfessionalAvailableDates, fetchProfessionalAppointments } from "@/lib/api"; // Import API function
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
  Loader2,
  AlertCircle
} from "lucide-react";
import { Loading } from "@/components/ui/loading";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
  if (h > 0 && m > 0) {
    return `${h}h ${m}min`;
  } else if (h > 0) {
    return `${h}h`;
  } else if (m > 0) {
    return `${m}min`;
  } else {
    return "N/A";
  }
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
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Sync active tab with URL query param `tab`
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'about';
  const [activeTab, setActiveTab] = useState(defaultTab);  const [availableDates, setAvailableDates] = useState<string[]>([]);
  // Track dates available for the specific filtered service
  const [filteredAvailableDates, setFilteredAvailableDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  // Track cover image error state
  const [coverError, setCoverError] = useState(false);
  // Track avatar image error state
  const [avatarError, setAvatarError] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [selectedServiceForSlot, setSelectedServiceForSlot] = useState<string | null>(null);
  const [selectedServicesForSlot, setSelectedServicesForSlot] = useState<string[]>([]);
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
  
  // Update filtered available dates when service filter changes
  useEffect(() => {
    if (!professional?.services) return;
    
    // If no service filter or "all" is selected, use all available dates
    if (!serviceFilter || serviceFilter === "all") {
      setFilteredAvailableDates(availableDates);
      return;
    }
    
    // Find the selected service
    const selectedService = professional.services.find(s => s.id === serviceFilter);
    if (!selectedService || !selectedService.schedule) {
      setFilteredAvailableDates([]);
      return;
    }
    
    // Filter available dates based on the service's schedule
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const availableDaysOfWeek = selectedService.schedule.map(s => s.dayOfWeek);
    
    const filtered = availableDates.filter(dateStr => {
      const date = new Date(dateStr);
      const dayOfWeek = days[date.getDay()];
      return availableDaysOfWeek.includes(dayOfWeek);
    });
    
    setFilteredAvailableDates(filtered);
    console.log('[DEBUG] filteredAvailableDates for service', serviceFilter, ':', filtered);
    
  }, [serviceFilter, availableDates, professional?.services]);
  
  useEffect(() => {
    if (date && professional?.id && professional?.services && professional.services.length > 0) {
      const serviceId = professional.services[0].id;
      const iso = date.toISOString().split('T')[0];
      console.log('[DEBUG] fetchAvailability params:', { professionalId: professional.id, serviceId, iso });
    }
  }, [date, professional]);

  // Fecha o dropdown de seleção de serviço ao clicar fora
  useEffect(() => {
    if (!expandedSlot) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setExpandedSlot(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedSlot]);
  // --- Loading State --- 
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#F4F3F2] flex justify-center items-center">
          <Loading text="Carregando profissional..." size="lg" fullScreen />
        </div>
      </>
    );
  }

  // --- Error State --- 
  if (isError || !professional) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-6 mt-6">
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
    <div className="min-h-screen bg-[#F4F3F2]">
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
          <TabsList className="bg-white w-full h-auto flex-wrap justify-start p-0 md:p-0 shadow-sm rounded-lg whitespace-nowrap">
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
                  <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-iazi-primary/20 to-iazi-primary/5 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <span className="text-lg font-semibold text-iazi-primary">{formatPrice(service.price)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDuration(service.duration)}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-gray-700 text-sm mb-4">{service.description || "Sem descrição disponível."}</p>
                        
                        {service.schedule && service.schedule.length > 0 && (
                          <div className="mb-4 bg-muted/30 p-3 rounded-md">
                            <div className="font-medium text-sm mb-2">Horários disponíveis:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                              {service.schedule.map((slot, idx) => (
                                <div key={idx} className="flex items-center">
                                  <Badge variant="outline" className="mr-2 bg-white">
                                    {slot.dayOfWeek.substring(0, 3)}
                                  </Badge>
                                  <span>{slot.startTime} - {slot.endTime}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" className="flex-1" asChild>
                            <Link to={`/service/${service.id}`}>Detalhes</Link>
                          </Button>
                          <Button className="flex-1 bg-iazi-primary hover:bg-iazi-primary-hover" asChild>
                            <Link to={`/booking/${service.id}?professional=${professional.id}`}>Agendar</Link>
                          </Button>
                        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="col-span-1">
                {/* Service filter with improved visual design */}
                {professional.services && professional.services.length > 1 && (
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <label className="block text-sm font-medium mb-2">Filtrar por serviço</label>
                      <Select
                        value={serviceFilter || "all"}                        onValueChange={value => {
                          const newFilter = value === "all" ? "" : value;
                          setServiceFilter(newFilter);
                          setSelectedSlot(null);
                          setExpandedSlot(null);
                          setSelectedServiceForSlot(null);
                          setSelectedServicesForSlot([]);
                          
                          // If we're selecting a specific service, verify if it's available on the current date
                          // If not, reset the date selection to avoid confusion
                          if (newFilter && date) {
                            const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
                            const dayKey = days[date.getDay()];
                            const service = professional.services?.find(s => s.id === newFilter);
                            
                            // If service isn't available on the current selected day, reset date
                            if (!service?.schedule?.some(s => s.dayOfWeek === dayKey)) {
                              setDate(new Date()); // Reset to today
                              // This will trigger the slot fetch useEffect
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-full h-10 border-gray-200 bg-white">
                          <SelectValue placeholder="Todos os serviços" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os serviços</SelectItem>
                          {professional.services.map(service => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}
                  <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-center">                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="border rounded-md pointer-events-auto mx-auto"
                        locale={pt}
                        disabled={dateItem => {
                          const today = new Date(); today.setHours(0,0,0,0);
                          const iso = dateItem.toISOString().split('T')[0];
                          
                          // Block past dates
                          if (loadingDates || dateItem < today) {
                            return true;
                          }

                          // Use the appropriate date array based on whether a filter is applied
                          const datesToCheck = serviceFilter && serviceFilter !== "all" 
                            ? filteredAvailableDates 
                            : availableDates;
                          
                          // Block dates not in the available dates array
                          if (!datesToCheck.includes(iso)) {
                            return true;
                          }
                          
                          return false; // Date is available
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-4">
                      {date ? `Horários disponíveis para ${format(date, 'dd/MM/yyyy', { locale: pt })}` : 'Selecione uma data'}
                    </h3>
                      {/* Selected services and time display */}
                    {selectedSlot && selectedServicesForSlot.length > 0 && (
                      <div className="mb-4 p-4 bg-iazi-primary/10 rounded-md border border-iazi-primary/30">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
                          <div>
                            <span className="text-sm text-gray-600">Horário selecionado:</span>
                            <span className="ml-2 font-semibold text-iazi-primary">{selectedSlot}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (!selectedServicesForSlot.length || !selectedSlot || !professional?.id || !date) return;
                              const dateStr = date.toISOString().split('T')[0];
                              navigate(`/booking/${selectedServicesForSlot.join(',')}?professional=${professional.id}&date=${dateStr}&time=${selectedSlot}`);
                            }}
                            disabled={!selectedSlot || !selectedServicesForSlot.length}
                          >
                            Agendar
                          </Button>
                        </div>
                        
                        <div className="mt-3">
                          <div className="text-sm text-gray-600 mb-2">Serviços selecionados:</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedServicesForSlot.map(sid => {
                              const serv = (professional.services || []).find(s => s.id === sid);
                              return serv ? (
                                <Badge 
                                  key={sid}
                                  variant="outline" 
                                  className="py-1.5 pl-3 pr-2 flex items-center gap-2 bg-white"
                                >
                                  <span>{serv.name}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-5 w-5 rounded-full"
                                    onClick={() => setSelectedServicesForSlot(prev => prev.filter(id => id !== sid))}
                                  >
                                    ×
                                  </Button>
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                        
                        {/* Total price and duration calculations */}
                        {selectedServicesForSlot.length > 0 && (
                          <div className="mt-4 border-t border-iazi-primary/30 pt-3">
                            <div className="flex flex-col sm:flex-row justify-between gap-2">
                              <div>
                                <span className="text-sm text-gray-600">Tempo total:</span>
                                <span className="ml-2 font-semibold">
                                  {(() => {
                                    // Calculate total duration
                                    let totalMinutes = 0;
                                    selectedServicesForSlot.forEach(sid => {
                                      const serv = (professional.services || []).find(s => s.id === sid);
                                      if (serv) {
                                        const duration = typeof serv.duration === 'string' 
                                          ? parseInt(serv.duration, 10) 
                                          : (serv.duration || 0);
                                        totalMinutes += isNaN(duration) ? 0 : duration;
                                      }
                                    });
                                    
                                    // Format duration
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    if (hours > 0 && minutes > 0) {
                                      return `${hours}h ${minutes}min`;
                                    } else if (hours > 0) {
                                      return `${hours}h`;
                                    } else {
                                      return `${minutes}min`;
                                    }
                                  })()}
                                </span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600">Valor total:</span>
                                <span className="ml-2 font-semibold text-iazi-primary">
                                  {(() => {
                                    // Calculate total price
                                    let totalPrice = 0;
                                    selectedServicesForSlot.forEach(sid => {
                                      const serv = (professional.services || []).find(s => s.id === sid);
                                      if (serv) {
                                        const price = typeof serv.price === 'string'
                                          ? parseFloat(serv.price)
                                          : (serv.price || 0);
                                        totalPrice += isNaN(price) ? 0 : price;
                                      }
                                    });
                                    
                                    // Format price
                                    return new Intl.NumberFormat("pt-BR", { 
                                      style: "currency", 
                                      currency: "BRL" 
                                    }).format(totalPrice);
                                  })()}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Legend */}
                    <div className="flex gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-iazi-primary rounded-full"></div> 
                        <span className="text-sm">Disponível</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div> 
                        <span className="text-sm">Indisponível</span>
                      </div>
                    </div>
                    
                    {/* Time slots display */}
                    {date ? (
                      loadingSlots ? (
                        <div className="text-center p-8">
                          <Loader2 className="h-8 w-8 mx-auto animate-spin text-iazi-primary mb-2" />
                          <p className="text-muted-foreground">Carregando horários disponíveis...</p>
                        </div>
                      ) : (
                        (() => {
                          // Date helper variables
                          const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
                          const dayKey = days[date.getDay()];
                          
                          // Apply service filter if selected
                          const servicesForDay = (professional.services || []).filter(service =>
                            ((!serviceFilter || serviceFilter === "all") || service.id === serviceFilter) &&
                            service.schedule && service.schedule.some(s => s.dayOfWeek === dayKey)
                          );
                          
                          if (servicesForDay.length === 0) {
                            return (
                              <div className="text-center p-8 text-gray-500">
                                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <p className="font-medium">Nenhum serviço disponível para este dia da semana.</p>
                                <p className="text-sm mt-1">Tente selecionar outro dia ou serviço.</p>
                              </div>
                            );
                          }
                          
                          // Gather and sort all slots for all services
                          let slotSet = new Set<string>();
                          servicesForDay.forEach(service => {
                            const slotDef = service.schedule.find(s => s.dayOfWeek === dayKey);
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
                              generateTimeSlots(slotDef.startTime, slotDef.endTime, 30).forEach(t => slotSet.add(t));
                            }
                          });
                          
                          const allSlots = Array.from(slotSet).sort();
                          
                          return (
                            <div className="space-y-6">
                              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                {allSlots.map((time, idx) => {
                                  // Find services available at this slot
                                  let availableServices: Service[] = [];
                                  
                                  if (!serviceFilter || serviceFilter === "all") {
                                    // No filter: check which services are available at this time
                                    const slotTaken = appointments.some(a => {
                                      const apptDate = new Date(a.startTime);
                                      const apptTime = format(apptDate, 'HH:mm');
                                      return apptTime === time;
                                    });
                                    
                                    if (!slotTaken) {
                                      availableServices = servicesForDay.filter(service => {
                                        const slotDef = service.schedule.find(s => s.dayOfWeek === dayKey);
                                        if (!slotDef) return false;
                                        
                                        const serviceSlots = (() => {
                                          const times: string[] = [];
                                          let [sh, sm] = slotDef.startTime.split(':').map(Number);
                                          let [eh, em] = slotDef.endTime.split(':').map(Number);
                                          const current = new Date(date); current.setHours(sh, sm, 0, 0);
                                          const endDate = new Date(date); endDate.setHours(eh, em, 0, 0);
                                          while (current <= endDate) {
                                            times.push(format(current, 'HH:mm'));
                                            current.setMinutes(current.getMinutes() + 30);
                                          }
                                          return times;
                                        })();
                                        
                                        return serviceSlots.includes(time);
                                      });
                                    }
                                  } else {
                                    // Filtered: only check the selected service
                                    availableServices = servicesForDay.filter(service => {
                                      if (service.id !== serviceFilter) return false;
                                      const slotDef = service.schedule.find(s => s.dayOfWeek === dayKey);
                                      if (!slotDef) return false;
                                      
                                      const serviceSlots = (() => {
                                        const times: string[] = [];
                                        let [sh, sm] = slotDef.startTime.split(':').map(Number);
                                        let [eh, em] = slotDef.endTime.split(':').map(Number);
                                        const current = new Date(date); current.setHours(sh, sm, 0, 0);
                                        const endDate = new Date(date); endDate.setHours(eh, em, 0, 0);
                                        while (current <= endDate) {
                                          times.push(format(current, 'HH:mm'));
                                          current.setMinutes(current.getMinutes() + 30);
                                        }
                                        return times;
                                      })();
                                      
                                      if (!serviceSlots.includes(time)) return false;
                                      
                                      const slotTaken = appointments.some(a => {
                                        if (a.serviceId !== service.id) return false;
                                        const apptDate = new Date(a.startTime);
                                        const apptTime = format(apptDate, 'HH:mm');
                                        return apptTime === time;
                                      });
                                      
                                      return !slotTaken;
                                    });
                                  }
                                  
                                  const isAvailable = availableServices.length > 0;
                                  const isSelected = selectedSlot === time;
                                  
                                  return (
                                    <div key={time} className="relative">
                                      <button
                                        className={`
                                          w-full py-2 px-1 text-center rounded-md text-sm transition-all
                                          ${isSelected ? 'ring-2 ring-iazi-primary ring-offset-1 bg-iazi-primary text-white' : ''}
                                          ${!isSelected && isAvailable ? 'bg-iazi-primary/20 hover:bg-iazi-primary/30 text-iazi-primary font-medium' : ''}
                                          ${!isAvailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                                        `}
                                        disabled={!isAvailable}
                                        onClick={() => {
                                          if (!isAvailable) return;
                                          
                                          // If selecting the already selected slot or if only one service is available
                                          if ((isSelected && availableServices.length <= 1) || availableServices.length === 1) {
                                            // Toggle selection off if already selected, or set it if only one service
                                            if (isSelected) {
                                              setSelectedSlot(null);
                                              setSelectedServicesForSlot([]);
                                            } else {
                                              setSelectedSlot(time);
                                              setSelectedServicesForSlot([availableServices[0].id]);
                                            }
                                          } else {
                                            // Show services selection for this time slot
                                            setSelectedSlot(time);
                                            setExpandedSlot(expandedSlot === time ? null : time);
                                          }
                                        }}
                                      >
                                        {time}
                                      </button>
                                      
                                      {/* Service selection panel - improved with a modal-like display */}
                                      {expandedSlot === time && availableServices.length > 1 && (
                                        <div
                                          ref={dropdownRef}
                                          className="absolute left-0 right-0 top-full z-40 mt-1 bg-white rounded-md border shadow-lg p-3 w-64 max-w-[calc(100vw-2rem)]"
                                          style={{ transform: 'translateX(-50%)', left: '50%' }}
                                        >
                                          <div className="mb-2 text-sm font-medium">Selecione os serviços</div>
                                          <div className="space-y-1.5 max-h-60 overflow-y-auto">
                                            {availableServices.map(service => (
                                              <label
                                                key={service.id}
                                                className={`
                                                  flex items-center gap-2.5 p-2 rounded-md cursor-pointer
                                                  ${selectedServicesForSlot.includes(service.id) 
                                                    ? 'bg-iazi-primary/10 border border-iazi-primary/30' 
                                                    : 'hover:bg-muted border border-transparent'}
                                                `}
                                              >
                                                <input
                                                  type="checkbox"
                                                  className="accent-iazi-primary h-4 w-4"
                                                  checked={selectedServicesForSlot.includes(service.id)}
                                                  onChange={e => {
                                                    setSelectedServicesForSlot(prev =>
                                                      e.target.checked
                                                        ? [...prev, service.id]
                                                        : prev.filter(id => id !== service.id)
                                                    );
                                                  }}
                                                />
                                                <div className="flex flex-col">
                                                  <span className="font-medium text-sm">{service.name}</span>
                                                  <div className="flex text-xs text-muted-foreground gap-3">
                                                    <span>{formatDuration(service.duration)}</span>
                                                    <span>{formatPrice(service.price)}</span>
                                                  </div>
                                                </div>
                                              </label>
                                            ))}
                                          </div>                                          {/* Show total duration and price when services are selected */}
                                          {selectedServicesForSlot.length > 0 && (
                                            <div className="mt-3 pt-3 border-t text-sm">
                                              <div className="flex justify-between mb-1">
                                                <span className="text-gray-600">Tempo total:</span>
                                                <span className="font-medium">
                                                  {(() => {
                                                    let totalMinutes = 0;
                                                    selectedServicesForSlot.forEach(sid => {
                                                      const serv = availableServices.find(s => s.id === sid);
                                                      if (serv) {
                                                        const duration = typeof serv.duration === 'string' 
                                                          ? parseInt(serv.duration, 10) 
                                                          : (serv.duration || 0);
                                                        totalMinutes += isNaN(duration) ? 0 : duration;
                                                      }
                                                    });
                                                    
                                                    const hours = Math.floor(totalMinutes / 60);
                                                    const minutes = totalMinutes % 60;
                                                    if (hours > 0 && minutes > 0) {
                                                      return `${hours}h ${minutes}min`;
                                                    } else if (hours > 0) {
                                                      return `${hours}h`;
                                                    } else {
                                                      return `${minutes}min`;
                                                    }
                                                  })()}
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">Valor total:</span>
                                                <span className="font-medium text-iazi-primary">
                                                  {(() => {
                                                    let totalPrice = 0;
                                                    selectedServicesForSlot.forEach(sid => {
                                                      const serv = availableServices.find(s => s.id === sid);
                                                      if (serv) {
                                                        const price = typeof serv.price === 'string'
                                                          ? parseFloat(serv.price)
                                                          : (serv.price || 0);
                                                        totalPrice += isNaN(price) ? 0 : price;
                                                      }
                                                    });
                                                    
                                                    return new Intl.NumberFormat("pt-BR", { 
                                                      style: "currency", 
                                                      currency: "BRL" 
                                                    }).format(totalPrice);
                                                  })()}
                                                </span>
                                              </div>
                                            </div>
                                          )}
                                        
                                          <div className="flex justify-end mt-3 gap-2">
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              onClick={() => setExpandedSlot(null)}
                                            >
                                              Fechar
                                            </Button>
                                            <Button
                                              size="sm"
                                              disabled={selectedServicesForSlot.length === 0}
                                              onClick={() => setExpandedSlot(null)}
                                            >
                                              Confirmar
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                              
                              {/* No time slots available message */}
                              {allSlots.length === 0 && (
                                <div className="text-center p-8 text-gray-500">
                                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                  <p className="font-medium">Nenhum horário disponível</p>
                                  <p className="text-sm mt-1">Tente selecionar outra data.</p>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      )
                    ) : (
                      <div className="text-center p-8 text-gray-500">
                        <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p>Selecione uma data para ver os horários disponíveis</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
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
