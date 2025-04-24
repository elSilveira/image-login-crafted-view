import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ServiceFilters } from "@/components/services/ServiceFilters";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePagination } from "@/components/services/ServicePagination";
import { services, specialties, availabilityOptions } from "@/lib/mock-services";

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
