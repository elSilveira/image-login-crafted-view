
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { 
  Calendar,
  MapPin, 
  Phone, 
  Mail, 
  Share, 
  Star, 
  FileText, 
  Briefcase,
  User,
  Image,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter
} from "lucide-react";
import Globe from "@/components/icons/Globe";
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
import { Link } from "react-router-dom";

// Mock data for company
const companyData = {
  id: "bella-hair-studio-112",
  name: "Bella Hair Studio",
  category: "Salão de Beleza",
  logo: "https://images.unsplash.com/photo-1487958449943-2429e8be8625",
  coverImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1200",
  rating: 4.7,
  totalReviews: 163,
  description: "O Bella Hair Studio é especializado em cortes modernos, colorações e tratamentos para todos os tipos de cabelo. Nossa equipe de profissionais qualificados está sempre atualizada com as últimas tendências e técnicas do mercado para oferecer o melhor serviço aos nossos clientes.",
  address: "Av. Paulista, 1500, Loja 23, São Paulo - SP",
  phone: "(11) 98765-4321",
  email: "contato@bellahair.com.br",
  website: "www.bellahair.com.br",
  openingHours: [
    { day: "Segunda-feira", hours: "09:00 - 19:00" },
    { day: "Terça-feira", hours: "09:00 - 19:00" },
    { day: "Quarta-feira", hours: "09:00 - 19:00" },
    { day: "Quinta-feira", hours: "09:00 - 19:00" },
    { day: "Sexta-feira", hours: "09:00 - 20:00" },
    { day: "Sábado", hours: "09:00 - 18:00" },
    { day: "Domingo", hours: "Fechado" }
  ],
  socialMedia: [
    { platform: "Facebook", url: "https://facebook.com/bellahair" },
    { platform: "Instagram", url: "https://instagram.com/bellahair" },
    { platform: "Twitter", url: "https://twitter.com/bellahair" },
    { platform: "Linkedin", url: "https://linkedin.com/company/bellahair" }
  ],
  services: [
    { id: "1", name: "Corte Feminino", price: "R$ 80,00", duration: "60 min", description: "Corte personalizado para valorizar o seu estilo." },
    { id: "2", name: "Corte Masculino", price: "R$ 60,00", duration: "30 min", description: "Corte moderno e preciso para homens." },
    { id: "3", name: "Coloração", price: "R$ 150,00", duration: "120 min", description: "Mudança ou retoque de cor com produtos de alta qualidade." },
    { id: "4", name: "Hidratação", price: "R$ 100,00", duration: "60 min", description: "Tratamento intensivo para nutrir os fios." },
    { id: "5", name: "Escova", price: "R$ 70,00", duration: "45 min", description: "Escova modeladora para um acabamento perfeito." }
  ],
  professionals: [
    { 
      id: "julia-ferreira-131", 
      name: "Julia Ferreira", 
      title: "Cabeleireira e Colorista", 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      description: "Especialista em cores e cortes modernos",
      rating: 4.8
    },
    { 
      id: "marcos-silva-132", 
      name: "Marcos Silva", 
      title: "Barbeiro e Cabeleireiro", 
      avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
      description: "Especializado em cortes masculinos e design de barba",
      rating: 4.7
    },
    { 
      id: "ana-oliveira-133", 
      name: "Ana Oliveira", 
      title: "Esteticista Capilar", 
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      description: "Tratamentos capilares avançados e reconstrução",
      rating: 4.9
    }
  ],
  galleryImages: [
    { id: "1", title: "Espaço do salão", image: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=600" },
    { id: "2", title: "Área de coloração", image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600" },
    { id: "3", title: "Resultado de tratamento", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=600" },
    { id: "4", title: "Área de cortes", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600" },
    { id: "5", title: "Exemplo de trabalho", image: "https://images.unsplash.com/photo-1626954079979-ec4f7b05e032?q=80&w=600" },
    { id: "6", title: "Equipe em ação", image: "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=600" }
  ],
  reviews: [
    { id: "1", author: "Maria Santos", rating: 5.0, date: "15/03/2024", comment: "Atendimento excelente! A Julia é incrível e adorei o resultado do meu corte e coloração." },
    { id: "2", author: "Pedro Costa", rating: 4.0, date: "28/02/2024", comment: "Bom atendimento, mas achei o preço um pouco elevado para o serviço oferecido." },
    { id: "3", author: "Carolina Lima", rating: 5.0, date: "10/01/2024", comment: "O melhor salão que já frequentei! Ambiente agradável e profissionais muito bem preparados." },
    { id: "4", author: "André Oliveira", rating: 4.5, date: "05/12/2023", comment: "Ótimo trabalho do Marcos com minha barba e cabelo. Recomendo muito o serviço dele!" }
  ]
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
  const [activeTab, setActiveTab] = useState("about");
  
  // In a real app, you would fetch the company data based on the ID
  // For now, we're using the mock data directly
  
  const getSocialIcon = (platform: string) => {
    switch(platform.toLowerCase()) {
      case "facebook": return <Facebook className="h-5 w-5" />;
      case "instagram": return <Instagram className="h-5 w-5" />;
      case "twitter": return <Twitter className="h-5 w-5" />;
      case "linkedin": return <Linkedin className="h-5 w-5" />;
      default: return null;
    }
  };

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
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={companyData.logo} alt={companyData.name} />
              <AvatarFallback>{companyData.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            {/* Company info */}
            <div className="flex flex-col flex-grow text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{companyData.name}</h1>
              <p className="text-[#4664EA] text-lg mb-2">{companyData.category}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4 justify-center md:justify-start">
                <div className="flex">
                  {renderStars(companyData.rating)}
                </div>
                <span className="font-semibold">{companyData.rating}</span>
                <span className="text-gray-500">({companyData.totalReviews} avaliações)</span>
              </div>
              
              {/* Quick contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#4664EA]" />
                  <span>{companyData.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#4664EA]" />
                  <span>{companyData.phone}</span>
                </div>
              </div>
            </div>
            
            {/* Contact button */}
            <div className="flex items-center">
              <Button size="lg" className="bg-[#4664EA] hover:bg-[#3A51C5]">
                <Phone className="mr-2 h-5 w-5" />
                Contato Direto
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
            <TabsTrigger value="professionals" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Profissionais
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-[#4664EA]/10 data-[state=active]:text-[#4664EA] rounded-none border-b-2 border-transparent data-[state=active]:border-[#4664EA] px-4 py-3 flex items-center gap-2">
              <Image className="h-4 w-4" />
              Galeria
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="about" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Sobre {companyData.name}</h2>
            <p className="text-gray-700 mb-6">{companyData.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações de Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#4664EA]" />
                    <span className="text-gray-700">{companyData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#4664EA]" />
                    <span className="text-gray-700">{companyData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[#4664EA]" />
                    <span className="text-gray-700">{companyData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#4664EA]" />
                    <a href={`https://${companyData.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#4664EA]">
                      {companyData.website}
                    </a>
                  </div>
                </div>
                
                {/* Social Media */}
                <h3 className="text-lg font-semibold mt-6 mb-3">Redes Sociais</h3>
                <div className="flex gap-3">
                  {companyData.socialMedia.map((social, index) => (
                    <a 
                      key={index} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Opening Hours */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Horário de Funcionamento</h3>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  {companyData.openingHours.map((item, index) => (
                    <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                      <span className="font-medium">{item.day}</span>
                      <span className={`${item.hours === "Fechado" ? "text-red-500" : "text-[#4664EA]"}`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map */}
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
                        <Button variant="outline" className="w-full" asChild>
                          <Link to={`/booking/${service.id}`}>
                            Agendar este serviço
                          </Link>
                        </Button>
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
                <Card key={professional.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={professional.avatar} 
                        alt={professional.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-1">{professional.name}</h3>
                      <p className="text-[#4664EA] text-sm mb-2">{professional.title}</p>
                      
                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(professional.rating)}
                        <span className="text-sm ml-1">{professional.rating}</span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{professional.description}</p>
                      
                      <Button className="w-full" asChild>
                        <Link to={`/professional/${professional.id}`}>
                          Ver Perfil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
          
          <TabsContent value="gallery" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Galeria de Fotos</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {companyData.galleryImages.map((image) => (
                <div key={image.id} className="group relative rounded-lg overflow-hidden aspect-square">
                  <img 
                    src={image.image} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-4 w-full text-white">
                      <h3 className="font-medium">{image.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Share and contact buttons */}
        <div className="flex flex-col sm:flex-row gap-3 my-6">
          <Button variant="outline" className="flex-1">
            <Share className="mr-2 h-5 w-5" />
            Compartilhar perfil
          </Button>
          <Button className="flex-1 bg-[#4664EA] hover:bg-[#3A51C5]">
            <Phone className="mr-2 h-5 w-5" />
            Contato direto
          </Button>
          <Button className="flex-1 bg-[#4664EA] hover:bg-[#3A51C5]" asChild>
            <Link to={`/booking/service?company=${companyData.id}`}>
              Agendar Serviço
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CompanyProfile;
