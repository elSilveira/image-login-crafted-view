import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Search, Star, Filter, ChevronDown, MoreHorizontal } from "lucide-react";

// Mock data for companies
export const professionals = [
  {
    id: 1,
    name: "Clínica DermaBem",
    specialty: "Clínica Dermatológica",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 4.8,
    reviews: 124,
    services: ["Limpeza de Pele", "Peeling", "Botox"],
    professionals: ["Dra. Ana Silva", "Dr. Miguel Santos"],
    availability: "Hoje",
    price: "R$150-300",
  },
  {
    id: 2,
    name: "FisioSaúde",
    specialty: "Centro de Fisioterapia",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
    rating: 4.6,
    reviews: 98,
    services: ["Quiropraxia", "RPG", "Acupuntura"],
    professionals: ["Dr. Carlos Mendes", "Dra. Paula Lima"],
    availability: "Amanhã",
    price: "R$100-200",
  },
  {
    id: 3,
    name: "Bella Hair Studio",
    specialty: "Salão de Beleza",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    rating: 4.9,
    reviews: 213,
    services: ["Corte", "Coloração", "Hidratação"],
    professionals: ["Julia Ferreira", "Roberto Gomes"],
    availability: "Hoje",
    price: "R$80-250",
  },
  {
    id: 4,
    name: "Fit Performance",
    specialty: "Academia e Personal Training",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    rating: 4.7,
    reviews: 86,
    services: ["Musculação", "Funcional", "Pilates"],
    professionals: ["Ricardo Almeida", "Camila Souza"],
    availability: "3 dias",
    price: "R$90-120",
  },
  {
    id: 5,
    name: "NutriVida",
    specialty: "Consultório Nutricional",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    rating: 4.5,
    reviews: 76,
    services: ["Avaliação", "Plano Alimentar", "Reeducação"],
    professionals: ["Dra. Beatriz Costa", "Dr. André Martins"],
    availability: "2 dias",
    price: "R$120-300",
  },
  {
    id: 6,
    name: "OdontoExcelência",
    specialty: "Clínica Odontológica",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    rating: 4.9,
    reviews: 154,
    services: ["Limpeza", "Clareamento", "Restauração"],
    professionals: ["Dr. Marcos Oliveira", "Dra. Luiza Dias"],
    availability: "Hoje",
    price: "R$200-600",
  }
];

// Specialty options
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

// Availability options
const availabilityOptions = [
  "Qualquer data",
  "Hoje",
  "Amanhã",
  "Esta semana",
  "Próxima semana",
];

const Professionals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialty, setSpecialty] = useState("Todas especialidades");
  const [sortBy, setSortBy] = useState("rating");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");
  const [currentPage, setCurrentPage] = useState(1);
  
  const ratingValue = ratingFilter[0];

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

  // Filter professionals based on search, specialty, rating, and availability
  const filteredProfessionals = professionals.filter((pro) => {
    const matchesSearch = 
      searchTerm === "" || 
      pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pro.professionals.some(prof => prof.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = 
      specialty === "Todas especialidades" || 
      pro.specialty === specialty;
    
    const matchesRating = pro.rating >= ratingValue;
    
    const matchesAvailability = 
      availabilityFilter === "Qualquer data" || 
      (availabilityFilter === "Hoje" && pro.availability === "Hoje") ||
      (availabilityFilter === "Amanhã" && pro.availability === "Amanhã") ||
      (availabilityFilter === "Esta semana") ||
      (availabilityFilter === "Próxima semana");
    
    return matchesSearch && matchesSpecialty && matchesRating && matchesAvailability;
  });

  // Sort professionals
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    } else if (sortBy === "recent") {
      return b.id - a.id;  // Using ID as a proxy for "recent"
    }
    // Default sort by rating
    return b.rating - a.rating;
  });

  const professionalPerPage = 4;
  const totalPages = Math.ceil(sortedProfessionals.length / professionalPerPage);
  const indexOfLastProfessional = currentPage * professionalPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - professionalPerPage;
  const currentProfessionals = sortedProfessionals.slice(indexOfFirstProfessional, indexOfLastProfessional);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Empresas</h1>
        <p className="text-gray-600 mb-8">
          Encontre as melhores empresas e profissionais para o serviço que você precisa
        </p>

        {/* Filters Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Buscar por nome, especialidade ou serviço..." 
                className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Melhor avaliação</SelectItem>
                <SelectItem value="reviews">Mais avaliações</SelectItem>
                <SelectItem value="recent">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced filters */}
          <div className="flex flex-col md:flex-row gap-6 pt-4 border-t border-gray-100">
            <div className="w-full md:w-1/3">
              <label className="flex items-center text-sm font-medium mb-2">
                <Filter className="h-4 w-4 mr-2" />
                Avaliação mínima: {ratingValue}+ estrelas
              </label>
              <Slider
                defaultValue={[0]}
                max={5}
                step={0.5}
                value={ratingFilter}
                onValueChange={setRatingFilter}
                className="py-2"
              />
            </div>

            <div className="w-full md:w-1/3">
              <label className="flex items-center text-sm font-medium mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                Disponibilidade
              </label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer data" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Results count */}
        <div className="text-gray-600 mb-4">
          <p>
            <span className="font-semibold">{filteredProfessionals.length}</span> empresas encontradas
          </p>
        </div>

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentProfessionals.map((company) => (
            <Card key={company.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-4 flex flex-col items-center justify-center bg-gray-50">
                    <Avatar className="h-24 w-24 mb-3">
                      <AvatarImage src={company.image} alt={company.name} />
                      <AvatarFallback>{company.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(company.rating)}
                    </div>
                    <div className="text-sm text-center">
                      <span className="font-semibold">{company.rating}</span>
                      <span className="text-gray-500"> ({company.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-lg font-semibold mb-1">{company.name}</h3>
                    <p className="text-[#4664EA] text-sm mb-2">{company.specialty}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {company.services.map((service, i) => (
                        <Badge key={i} variant="outline" className="bg-gray-50">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Profissionais:</span> {company.professionals.join(", ")}
                    </p>
                    
                    <div className="flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Disponível: {company.availability}</span>
                      </div>
                      <div>{company.price}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to={`/professional/${company.id}`}>
                          Ver detalhes
                        </Link>
                      </Button>
                      <Button className="flex-1">Agendar</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {totalPages > 5 && (
              <PaginationItem>
                <MoreHorizontal className="h-4 w-4 mx-2" />
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </div>
  );
};

export default Professionals;
