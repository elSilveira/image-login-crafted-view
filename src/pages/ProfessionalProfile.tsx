
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
  Image,
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
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { pt } from 'date-fns/locale';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Mock data for professional
const professionalData = {
  id: 1,
  name: "Dra. Ana Silva",
  title: "Dermatologista",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  coverImage: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?q=80&w=1200",
  rating: 4.8,
  totalReviews: 124,
  specialties: ["Dermatologia Clínica", "Procedimentos Estéticos", "Tratamentos Faciais"],
  bio: "Profissional com mais de 10 anos de experiência em dermatologia clínica e estética. Especializada em tratamentos para rejuvenescimento facial e procedimentos minimamente invasivos.",
  address: "Av. Paulista, 1000, Sala 501, São Paulo - SP",
  phone: "(11) 98765-4321",
  email: "dra.anasilva@clinica.com.br",
  services: [
    { id: 1, name: "Consulta Dermatológica", price: "R$ 300,00", duration: "50 min", description: "Avaliação completa da saúde da pele com diagnóstico e prescrição de tratamentos." },
    { id: 2, name: "Limpeza de Pele Profunda", price: "R$ 250,00", duration: "90 min", description: "Procedimento para remover impurezas, cravos e células mortas." },
    { id: 3, name: "Aplicação de Botox", price: "R$ 980,00", duration: "30 min", description: "Tratamento para rugas e linhas de expressão com toxina botulínica." },
    { id: 4, name: "Preenchimento Facial", price: "R$ 1.200,00", duration: "45 min", description: "Procedimento para restaurar volume e contornos faciais." }
  ],
  experience: [
    { period: "2018 - Atual", title: "Dermatologista Chefe", institution: "Clínica DermaBem" },
    { period: "2015 - 2018", title: "Dermatologista", institution: "Hospital Sírio-Libanês" },
    { period: "2012 - 2015", title: "Residência em Dermatologia", institution: "Hospital das Clínicas - USP" }
  ],
  education: [
    { year: "2012", title: "Especialização em Dermatologia Estética", institution: "Instituto de Dermatologia Avançada" },
    { year: "2010", title: "Residência em Dermatologia", institution: "Hospital das Clínicas - USP" },
    { year: "2008", title: "Graduação em Medicina", institution: "Universidade de São Paulo" }
  ],
  portfolio: [
    { id: 1, title: "Antes e depois - Tratamento de acne", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=300" },
    { id: 2, title: "Antes e depois - Rejuvenescimento", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300" },
    { id: 3, title: "Antes e depois - Preenchimento labial", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=300" }
  ],
  reviews: [
    { id: 1, author: "Mariana Lima", rating: 5.0, date: "15/03/2024", comment: "Excelente profissional, muito atenciosa e competente. Recomendo!" },
    { id: 2, author: "Pedro Santos", rating: 4.5, date: "28/02/2024", comment: "Ótimo atendimento. O tratamento teve resultados visíveis já na primeira sessão." },
    { id: 3, author: "Julia Mendes", rating: 5.0, date: "10/01/2024", comment: "Profissional extremamente capacitada. Ambiente agradável e atendimento pontual." }
  ],
  similarProfessionals: [
    { id: 101, name: "Dr. Carlos Mendes", specialty: "Dermatologista", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5" },
    { id: 102, name: "Dra. Beatriz Costa", specialty: "Dermatologista", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
    { id: 103, name: "Dr. Ricardo Alves", specialty: "Dermatologista", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" }
  ]
};

const ProfessionalProfile = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("about");
  
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header with cover image */}
      <div className="relative h-64 w-full bg-cover bg-center" style={{ backgroundImage: `url(${professionalData.coverImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      
      <main className="container mx-auto px-4 -mt-20 relative z-10 mb-12">
        {/* Profile header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={professionalData.avatar} alt={professionalData.name} />
              <AvatarFallback>{professionalData.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            {/* Profile info */}
            <div className="flex flex-col flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{professionalData.name}</h1>
              <p className="text-[#4664EA] text-lg mb-2">{professionalData.title}</p>
              
              {/* Specialties */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {professionalData.specialties.map((specialty, i) => (
                  <Badge key={i} variant="outline" className="bg-gray-50">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 justify-center md:justify-start">
                <div className="flex">
                  {renderStars(professionalData.rating)}
                </div>
                <span className="font-semibold">{professionalData.rating}</span>
                <span className="text-gray-500">({professionalData.totalReviews} avaliações)</span>
              </div>
            </div>
            
            {/* Schedule button */}
            <div className="flex items-center">
              <Button size="lg" className="bg-[#4664EA] hover:bg-[#3A51C5]">
                Agendar Consulta
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs navigation */}
        <Tabs defaultValue="about" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white w-full h-auto flex-wrap justify-start p-0 md:p-0 shadow-sm rounded-lg">
            <TabsTrigger value="about" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Sobre
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Experiência
            </TabsTrigger>
            <TabsTrigger value="availability" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Disponibilidade
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <Image className="h-4 w-4" />
              Portfólio
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="about" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre</h2>
            <p className="text-gray-700 mb-6">{professionalData.bio}</p>
            
            <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#4664EA]" />
                <span className="text-gray-700">{professionalData.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#4664EA]" />
                <span className="text-gray-700">{professionalData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#4664EA]" />
                <span className="text-gray-700">{professionalData.email}</span>
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
              {professionalData.services.map((service) => (
                <Card key={service.id} className="overflow-hidden border-l-4 border-l-[#4664EA]">
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{service.name}</h3>
                        <span className="text-lg font-semibold text-[#4664EA]">{service.price}</span>
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
          
          <TabsContent value="experience" className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">Experiência Profissional</h2>
              <div className="space-y-6">
                {professionalData.experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-[#4664EA] pl-4">
                    <div className="font-medium text-lg">{exp.title}</div>
                    <div className="text-[#4664EA]">{exp.institution}</div>
                    <div className="text-sm text-gray-500">{exp.period}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-6">Formação Acadêmica</h2>
              <div className="space-y-6">
                {professionalData.education.map((edu, i) => (
                  <div key={i} className="border-l-2 border-[#4664EA] pl-4">
                    <div className="font-medium text-lg">{edu.title}</div>
                    <div className="text-[#4664EA]">{edu.institution}</div>
                    <div className="text-sm text-gray-500">{edu.year}</div>
                  </div>
                ))}
              </div>
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
                />
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="font-medium text-lg mb-4">
                  {date ? `Horários disponíveis para ${format(date, 'dd/MM/yyyy')}` : 'Selecione uma data'}
                </h3>
                
                {date && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"].map((time, i) => (
                      <Button key={i} variant="outline" className="justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </Button>
                    ))}
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
              {professionalData.reviews.map((review) => (
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
          
          <TabsContent value="portfolio" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Portfólio de Trabalhos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {professionalData.portfolio.map((item) => (
                <div key={item.id} className="group relative rounded-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-4 w-full text-white">
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Social sharing and contact buttons */}
        <div className="flex flex-col sm:flex-row gap-3 my-6">
          <Button variant="outline" className="flex-1">
            <Share className="mr-2 h-5 w-5" />
            Compartilhar perfil
          </Button>
          <Button variant="outline" className="flex-1">
            <Phone className="mr-2 h-5 w-5" />
            Contato direto
          </Button>
          <Button className="flex-1 bg-[#4664EA] hover:bg-[#3A51C5]">
            Agendar Consulta
          </Button>
        </div>
        
        {/* Similar professionals */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-6">
            <Users className="h-5 w-5 mr-2 text-[#4664EA]" />
            <h2 className="text-xl font-semibold">Profissionais similares</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {professionalData.similarProfessionals.map((pro) => (
              <Card key={pro.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={pro.avatar} alt={pro.name} />
                    <AvatarFallback>{pro.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{pro.name}</h3>
                    <p className="text-sm text-[#4664EA]">{pro.specialty}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalProfile;
