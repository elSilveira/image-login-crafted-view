
import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
  Users
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

// Mock data for company
const companyData = {
  id: 1,
  name: "Clínica DermaBem",
  description: "Centro especializado em tratamentos dermatológicos e estéticos de alta qualidade.",
  logo: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=300",
  coverImage: "https://images.unsplash.com/photo-1629136571981-a75b3494bd96?q=80&w=1200",
  rating: 4.9,
  totalReviews: 243,
  categories: ["Dermatologia", "Estética", "Saúde"],
  yearEstablished: "2010",
  bio: "A Clínica DermaBem é referência em saúde e estética da pele, oferecendo tratamentos avançados com equipamentos de última geração e profissionais altamente qualificados. Nosso compromisso é proporcionar atendimento personalizado e resultados excepcionais para cada paciente.",
  address: "Av. Paulista, 1000, São Paulo - SP",
  phone: "(11) 3456-7890",
  email: "contato@dermabem.com.br",
  workingHours: "Segunda a Sexta: 8h às 20h | Sábado: 8h às 14h",
  services: [
    { id: 1, name: "Consulta Dermatológica", price: "R$ 300,00", duration: "50 min", description: "Avaliação completa da saúde da pele com diagnóstico e prescrição de tratamentos." },
    { id: 2, name: "Limpeza de Pele Profunda", price: "R$ 250,00", duration: "90 min", description: "Procedimento para remover impurezas, cravos e células mortas." },
    { id: 3, name: "Aplicação de Botox", price: "R$ 980,00", duration: "30 min", description: "Tratamento para rugas e linhas de expressão com toxina botulínica." },
    { id: 4, name: "Preenchimento Facial", price: "R$ 1.200,00", duration: "45 min", description: "Procedimento para restaurar volume e contornos faciais." }
  ],
  professionals: [
    { id: 101, name: "Dra. Ana Silva", specialty: "Dermatologista", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
    { id: 102, name: "Dr. Carlos Mendes", specialty: "Dermatologista", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5" },
    { id: 103, name: "Dra. Beatriz Costa", specialty: "Esteticista", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" }
  ],
  reviews: [
    { id: 1, author: "Mariana Lima", rating: 5.0, date: "15/03/2024", comment: "Excelente atendimento e estrutura. Profissionais muito qualificados." },
    { id: 2, author: "Pedro Santos", rating: 4.5, date: "28/02/2024", comment: "Ótima clínica, ambiente muito agradável e equipe atenciosa." },
    { id: 3, author: "Julia Mendes", rating: 5.0, date: "10/01/2024", comment: "Atendimento excelente e resultados surpreendentes com os tratamentos." }
  ],
  amenities: ["Estacionamento", "Wi-Fi gratuito", "Ar-condicionado", "Sala de espera confortável", "Ambiente acessível"]
};

// Function to render stars based on rating
const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${
          i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    );
  }
  return stars;
};

const CompanyProfile = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("about");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header with cover image */}
      <div className="relative h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url(${companyData.coverImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <main className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
        {/* Company header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Logo */}
            <div className="h-32 w-32 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center">
              <img src={companyData.logo} alt={companyData.name} className="max-h-24 max-w-24 object-contain" />
            </div>
            
            {/* Company info */}
            <div className="flex flex-col flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{companyData.name}</h1>
              <p className="text-gray-600 mb-3">{companyData.description}</p>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {companyData.categories.map((category, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-50">
                    {category}
                  </Badge>
                ))}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2 justify-center md:justify-start">
                <div className="flex">
                  {renderStars(companyData.rating)}
                </div>
                <span className="font-semibold">{companyData.rating}</span>
                <span className="text-gray-500">({companyData.totalReviews} avaliações)</span>
              </div>

              <div className="text-sm text-gray-500 flex items-center justify-center md:justify-start">
                <Clock className="h-4 w-4 mr-1" /> 
                {companyData.workingHours}
              </div>
            </div>
            
            {/* Book button */}
            <div className="flex items-center">
              <Button size="lg">
                Ver Agenda
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs navigation */}
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white w-full h-auto flex-wrap justify-start p-0 md:p-0 shadow-sm rounded-lg">
            <TabsTrigger value="about" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Sobre
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="professionals" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Profissionais
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-iazi-primary/10 data-[state=active]:text-iazi-primary rounded-none border-b-2 border-transparent data-[state=active]:border-iazi-primary px-4 py-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="about" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre</h2>
            <p className="text-gray-700 mb-6">{companyData.bio}</p>
            
            <div className="flex flex-col sm:flex-row sm:gap-10 mb-6">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold mb-3">Detalhes</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="font-medium min-w-32">Fundada em:</span>
                    <span>{companyData.yearEstablished}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Comodidades</h3>
                <ul className="space-y-1">
                  {companyData.amenities.map((amenity, i) => (
                    <li key={i} className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-iazi-primary mr-2"></div>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-iazi-primary" />
                <span className="text-gray-700">{companyData.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-iazi-primary" />
                <span className="text-gray-700">{companyData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-iazi-primary" />
                <span className="text-gray-700">{companyData.email}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Localização</h3>
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="h-12 w-12 text-gray-400" />
                <span className="ml-2 text-gray-500">Mapa indisponível</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Serviços Oferecidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {companyData.services.map((service) => (
                <Card key={service.id} className="overflow-hidden border-l-4 border-l-iazi-primary">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <span className="text-lg font-semibold text-iazi-primary">{service.price}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{service.duration}</span>
                      </div>
                      
                      <p className="text-gray-700 text-sm">{service.description}</p>
                      
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">Agendar este serviço</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="professionals" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Nossa Equipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {companyData.professionals.map((professional) => (
                <Card key={professional.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={professional.avatar} alt={professional.name} />
                      <AvatarFallback>{professional.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1">{professional.name}</h3>
                    <p className="text-sm text-iazi-primary mb-4">{professional.specialty}</p>
                    <Button variant="outline" className="w-full">Ver Perfil</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="availability" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Agenda</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                  locale={pt}
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium text-lg mb-4">
                  {date ? `Horários disponíveis para ${format(date, 'dd/MM/yyyy')}` : 'Selecione uma data'}
                </h3>
                
                {date && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Selecione o profissional para ver horários disponíveis:</p>
                    <div className="space-y-3">
                      {companyData.professionals.map((pro) => (
                        <Card key={pro.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={pro.avatar} alt={pro.name} />
                                  <AvatarFallback>{pro.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h4 className="font-medium">{pro.name}</h4>
                                  <p className="text-sm text-gray-500">{pro.specialty}</p>
                                </div>
                              </div>
                              <Button size="sm">Ver horários</Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Avaliações de Clientes</h2>
              <Button variant="outline">Deixar avaliação</Button>
            </div>
            
            <div className="space-y-6">
              {companyData.reviews.map((review) => (
                <div key={review.id} className="border-b pb-5 mb-5 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-medium">{review.author}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm">{review.rating}</span>
                  </div>
                  
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Social sharing and contact buttons */}
        <div className="flex flex-col sm:flex-row gap-3 my-6">
          <Button variant="outline" className="flex-1">
            <Share className="mr-2 h-5 w-5" />
            Compartilhar
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="mr-2 h-5 w-5" />
            Contato
          </Button>
          <Button className="flex-1">
            Ver Agenda
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;
