import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCompanyDetails } from "@/lib/api"; // Import API function
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
  Users,
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

// Removed mock data

// Define interfaces based on expected API response (adjust as needed)
interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface Professional {
  id: string; // Assuming ID is string based on previous examples
  name: string;
  specialty?: string; // Optional specialty
  avatar?: string | null;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string; // Assuming date is ISO string
  user: { // Assuming user info is nested
    id: string;
    name: string;
    avatar?: string | null;
  };
}

interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl?: string | null;
  coverImageUrl?: string | null;
  averageRating?: number;
  reviewCount?: number;
  categories?: Category[];
  yearEstablished?: number;
  bio?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string; // Consider a more structured format if possible
  services?: Service[];
  professionals?: Professional[];
  reviews?: Review[];
  amenities?: string[]; // Assuming amenities are strings
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
      // Handle half stars if needed, though fill might be simpler
      starClass = "text-yellow-500 fill-yellow-500"; // Simplification: treat half as full for fill
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

const formatPrice = (value?: number) => {
  if (value === undefined || value === null) return "N/A";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

const formatDuration = (minutes?: number) => {
  if (minutes === undefined || minutes === null) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}min` : ""}`.trim() || "N/A";
};

const CompanyProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("about");

  // Fetch company details using React Query
  const { data: company, isLoading, isError, error } = useQuery<Company, Error>({
    queryKey: ["companyDetails", id],
    queryFn: () => fetchCompanyDetails(id!),
    enabled: !!id,
  });

  // --- Loading State --- 
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-[#F4F3F2] flex justify-center items-center">
          <Loading text="Carregando perfil da empresa..." size="lg" fullScreen />
        </div>
      </>
    );
  }

  // --- Error State --- 
  if (isError || !company) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-6 mt-6">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-6 flex flex-col items-center text-center text-destructive">
              <AlertCircle className="h-10 w-10 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Empresa</h2>
              <p className="text-sm mb-4">
                Não foi possível carregar os detalhes da empresa. Tente novamente mais tarde.
              </p>
              {error && <p className="text-xs">Detalhes: {error.message}</p>}
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
  const coverImage = company.coverImageUrl || "https://via.placeholder.com/1200x300?text=Sem+Imagem+de+Capa";
  const logoImage = company.logoUrl || "https://via.placeholder.com/150?text=Logo";

  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      
      {/* Header with cover image */}
      <div className="relative h-48 md:h-64 w-full bg-cover bg-center bg-muted" style={{ backgroundImage: `url(${coverImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <main className="container mx-auto px-4 -mt-16 md:-mt-20 relative z-10 mb-12">
        {/* Company header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Logo */}
            <div className="h-24 w-24 md:h-32 md:w-32 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center border flex-shrink-0">
              <img src={logoImage} alt={company.name} className="max-h-20 md:max-h-24 max-w-20 md:max-w-24 object-contain p-1" />
            </div>
            
            {/* Company info */}
            <div className="flex flex-col flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{company.name}</h1>
              <p className="text-gray-600 mb-3 text-sm md:text-base">{company.description}</p>
              
              {/* Categories */}
              {company.categories && company.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {company.categories.map((category) => (
                    <Badge key={category.id} variant="outline" className="bg-gray-50">
                      {category.name}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Rating */}
              {(company.averageRating !== undefined && company.averageRating !== null) && (
                <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
                  <div className="flex">
                    {renderStars(company.averageRating)}
                  </div>
                  <span className="font-semibold">{company.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({company.reviewCount || 0} avaliações)</span>
                </div>
              )}

              {company.workingHours && (
                <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                  <Clock className="h-4 w-4 mr-1" /> 
                  {company.workingHours}
                </div>
              )}
            </div>
            
            {/* Book button / Share button */} 
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white w-full h-auto flex-wrap justify-start p-0 md:p-0 shadow-sm rounded-lg whitespace-nowrap">
            <TabsTrigger value="about" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <User className="h-4 w-4" />
              Sobre
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <FileText className="h-4 w-4" />
              Serviços ({company.services?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="professionals" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <Briefcase className="h-4 w-4" />
              Profissionais ({company.professionals?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <CalendarIcon className="h-4 w-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <Star className="h-4 w-4" />
              Avaliações ({company.reviewCount || 0})
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="about" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre</h2>
            {company.bio ? (
              <p className="text-gray-700 mb-6 whitespace-pre-wrap">{company.bio}</p>
            ) : (
              <p className="text-gray-500 mb-6 italic">Nenhuma descrição detalhada fornecida.</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Detalhes</h3>
                <div className="space-y-2">
                  {company.yearEstablished && (
                    <div className="flex items-start">
                      <span className="font-medium min-w-[100px] text-gray-600">Fundada em:</span>
                      <span className="text-gray-800">{company.yearEstablished}</span>
                    </div>
                  )}
                  {/* Add more details if available */} 
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Comodidades</h3>
                {company.amenities && company.amenities.length > 0 ? (
                  <ul className="space-y-1">
                    {company.amenities.map((amenity, i) => (
                      <li key={i} className="flex items-center text-gray-700">
                        <div className="h-2 w-2 rounded-full bg-iazi-primary mr-2 flex-shrink-0"></div>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">Nenhuma comodidade listada.</p>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
            <div className="space-y-3">
              {company.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-iazi-primary flex-shrink-0" />
                  <span className="text-gray-700">{company.address}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-iazi-primary flex-shrink-0" />
                  <span className="text-gray-700">{company.phone}</span>
                </div>
              )}
              {company.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-iazi-primary flex-shrink-0" />
                  <span className="text-gray-700">{company.email}</span>
                </div>
              )}
            </div>
            
            {/* Map Placeholder */}
            {company.address && (
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
            {company.services && company.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.services.map((service) => (
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
                      
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1" asChild>
                           <Link to={`/service/${service.id}`}>Ver Detalhes</Link>
                        </Button>
                        <Button className="flex-1 bg-iazi-primary hover:bg-iazi-primary-hover" asChild>
                          <Link to={`/booking/${service.id}`}>Agendar</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Nenhum serviço oferecido por esta empresa.</p>
            )}
          </TabsContent>
          
          <TabsContent value="professionals" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Nossa Equipe</h2>
            {company.professionals && company.professionals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {company.professionals.map((professional) => (
                  <Card key={professional.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={professional.avatar || undefined} alt={professional.name} />
                        <AvatarFallback>{professional.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg mb-1">{professional.name}</h3>
                      {professional.specialty && (
                        <p className="text-sm text-iazi-primary mb-4">{professional.specialty}</p>
                      )}
                      <Button variant="outline" className="w-full" asChild>
                        <Link to={`/professional/${professional.id}`}>Ver Perfil</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Nenhum profissional associado a esta empresa.</p>
            )}
          </TabsContent>
          
          <TabsContent value="availability" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Agenda</h2>
            {/* TODO: Implement actual availability logic based on API data */} 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  locale={pt}
                  disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} // Disable past dates
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium text-lg mb-4">
                  {date ? `Verificar disponibilidade para ${format(date, 'dd/MM/yyyy', { locale: pt })}` : 'Selecione uma data'}
                </h3>
                
                {date && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Selecione o profissional ou serviço para ver horários disponíveis (Integração Pendente).</p>
                    {/* Placeholder for availability slots */}
                    <div className="border rounded-md p-6 text-center text-gray-500 italic">
                      Funcionalidade de agenda ainda não implementada.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Avaliações ({company.reviewCount || 0})</h2>
            {/* TODO: Fetch and display reviews, possibly with pagination */} 
            {company.reviews && company.reviews.length > 0 ? (
              <div className="space-y-6">
                {company.reviews.slice(0, 5).map((review) => ( // Display first 5 reviews as example
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
                              {format(new Date(review.createdAt), "dd/MM/yyyy", { locale: pt })}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {/* Add button to see more reviews if needed */} 
                {(company.reviewCount || 0) > 5 && (
                  <div className="text-center mt-6">
                    <Button variant="outline">Ver todas as avaliações</Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">Esta empresa ainda não possui avaliações.</p>
            )}
          </TabsContent>
          
        </Tabs>
      </main>
    </div>
  );
};

export default CompanyProfile;

