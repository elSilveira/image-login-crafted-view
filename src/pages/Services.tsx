
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
import { Calendar, Search, Star, Filter, MoreHorizontal } from "lucide-react";

// Mock data for services
const services = [
  {
    id: 1,
    name: "Limpeza de Pele Profunda",
    category: "Tratamento Facial",
    company: "Clínica DermaBem",
    professional: "Dra. Ana Silva",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
    rating: 4.8,
    reviews: 87,
    price: "R$180",
    duration: "60 min",
    availability: "Hoje",
  },
  {
    id: 2,
    name: "Quiropraxia",
    category: "Fisioterapia",
    company: "FisioSaúde",
    professional: "Dr. Carlos Mendes",
    image: "https://images.unsplash.com/photo-1552693673-1bf958298935",
    rating: 4.9,
    reviews: 112,
    price: "R$150",
    duration: "45 min",
    availability: "Amanhã",
  },
  {
    id: 3,
    name: "Corte e Hidratação",
    category: "Cabelo",
    company: "Bella Hair Studio",
    professional: "Julia Ferreira",
    image: "https://images.unsplash.com/photo-1560869713-7d0a29430803",
    rating: 4.7,
    reviews: 95,
    price: "R$120",
    duration: "90 min",
    availability: "Hoje",
  },
  {
    id: 4,
    name: "Treinamento Funcional",
    category: "Fitness",
    company: "Fit Performance",
    professional: "Ricardo Almeida",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
    rating: 4.6,
    reviews: 64,
    price: "R$90",
    duration: "60 min",
    availability: "3 dias",
  },
  {
    id: 5,
    name: "Consulta Nutricional",
    category: "Nutrição",
    company: "NutriVida",
    professional: "Dra. Beatriz Costa",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
    rating: 4.8,
    reviews: 53,
    price: "R$200",
    duration: "60 min",
    availability: "2 dias",
  },
  {
    id: 6,
    name: "Clareamento Dental",
    category: "Odontologia",
    company: "OdontoExcelência",
    professional: "Dr. Marcos Oliveira",
    image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99",
    rating: 4.9,
    reviews: 78,
    price: "R$450",
    duration: "120 min",
    availability: "Hoje",
  }
];

// Category options
const categories = [
  "Todas categorias",
  "Tratamento Facial",
  "Fisioterapia",
  "Cabelo",
  "Fitness",
  "Nutrição",
  "Odontologia",
  "Massagem",
  "Estética",
  "Unhas",
];

// Price range options
const priceRanges = [
  "Qualquer preço",
  "Até R$100",
  "R$100 a R$200",
  "R$200 a R$300",
  "Acima de R$300",
];

// Availability options
const availabilityOptions = [
  "Qualquer data",
  "Hoje",
  "Amanhã",
  "Esta semana",
  "Próxima semana",
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas categorias");
  const [sortBy, setSortBy] = useState("rating");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [priceRange, setPriceRange] = useState("Qualquer preço");
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

  // Filter services based on search, category, rating, price, and availability
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      searchTerm === "" || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.professional.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      category === "Todas categorias" || 
      service.category === category;
    
    const matchesRating = service.rating >= ratingValue;
    
    // Simplified price matching - in a real app you'd parse the actual price value
    const matchesPriceRange = 
      priceRange === "Qualquer preço" || 
      (priceRange === "Até R$100" && service.price.replace("R$", "") <= "100") ||
      (priceRange === "R$100 a R$200" && 
        service.price.replace("R$", "") >= "100" && 
        service.price.replace("R$", "") <= "200") ||
      (priceRange === "R$200 a R$300" && 
        service.price.replace("R$", "") >= "200" && 
        service.price.replace("R$", "") <= "300") ||
      (priceRange === "Acima de R$300" && service.price.replace("R$", "") > "300");
    
    const matchesAvailability = 
      availabilityFilter === "Qualquer data" || 
      (availabilityFilter === "Hoje" && service.availability === "Hoje") ||
      (availabilityFilter === "Amanhã" && service.availability === "Amanhã") ||
      (availabilityFilter === "Esta semana") ||
      (availabilityFilter === "Próxima semana");
    
    return matchesSearch && matchesCategory && matchesRating && matchesPriceRange && matchesAvailability;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    } else if (sortBy === "price-asc") {
      return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''));
    } else if (sortBy === "price-desc") {
      return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''));
    }
    // Default sort by rating
    return b.rating - a.rating;
  });

  const servicesPerPage = 4;
  const totalPages = Math.ceil(sortedServices.length / servicesPerPage);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = sortedServices.slice(indexOfFirstService, indexOfLastService);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-2">Serviços</h1>
        <p className="text-gray-600 mb-8">
          Encontre os melhores serviços disponíveis na plataforma
        </p>

        {/* Filters Section */}
        <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Buscar por nome, categoria ou empresa..." 
                className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-60">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
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
                <SelectItem value="price-asc">Menor preço</SelectItem>
                <SelectItem value="price-desc">Maior preço</SelectItem>
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

            <div className="w-full md:w-1/3">
              <label className="flex items-center text-sm font-medium mb-2">
                <Filter className="h-4 w-4 mr-2" />
                Faixa de preço
              </label>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer preço" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
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
            <span className="font-semibold">{filteredServices.length}</span> serviços encontrados
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-4 flex flex-col items-center justify-center bg-gray-50">
                    <div className="h-24 w-24 mb-3 rounded-md overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {renderStars(service.rating)}
                    </div>
                    <div className="text-sm text-center">
                      <span className="font-semibold">{service.rating}</span>
                      <span className="text-gray-500"> ({service.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-lg font-semibold mb-1">{service.name}</h3>
                    <p className="text-[#4664EA] text-sm mb-2">{service.category}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="bg-gray-50">
                        {service.duration}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50">
                        {service.price}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Empresa:</span> {service.company}
                    </p>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Profissional:</span> {service.professional}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Disponível: {service.availability}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" asChild>
                        <Link to={`/service/${service.id}`}>
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

export default Services;
