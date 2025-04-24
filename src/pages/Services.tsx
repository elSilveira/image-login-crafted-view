import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePagination } from "@/components/services/ServicePagination";

// Mock data moved to a separate file
export const services = [
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
    company_id: "clinica-dermabem-123",
    professional_id: "dra-ana-silva-456",
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
    company_id: "fisiosaude-789",
    professional_id: "dr-carlos-mendes-101",
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
    company_id: "bella-hair-studio-112",
    professional_id: "julia-ferreira-131",
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
    company_id: "fit-performance-141",
    professional_id: "ricardo-almeida-151",
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
    company_id: "nutrivida-161",
    professional_id: "dra-beatriz-costa-171",
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
    company_id: "odontoexcelencia-181",
    professional_id: "dr-marcos-oliveira-191",
  }
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas categorias");
  const [sortBy, setSortBy] = useState("rating");
  const [ratingFilter, setRatingFilter] = useState([0]);
  const [priceRange, setPriceRange] = useState("Qualquer preço");
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");
  const [currentPage, setCurrentPage] = useState(1);
  
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
    
    const matchesRating = service.rating >= ratingFilter[0];
    
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

        <ServiceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          category={category}
          setCategory={setCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          availabilityFilter={availabilityFilter}
          setAvailabilityFilter={setAvailabilityFilter}
        />
        
        <div className="text-gray-600 mb-4">
          <p>
            <span className="font-semibold">{filteredServices.length}</span> serviços encontrados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <ServicePagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </div>
  );
};

export default Services;
