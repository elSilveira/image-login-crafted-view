
import React, { useState } from "react";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServicePagination } from "@/components/services/ServicePagination";
import { services } from "@/lib/mock-services";
import { mockCompany } from "@/lib/mock-company";

interface CompanyServicesListProps {
  companyId: string | undefined;
  searchTerm: string;
  category: string;
  sortBy: string;
  ratingFilter: number[];
  priceRange: string;
  availabilityFilter: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const CompanyServicesList = ({
  companyId,
  searchTerm,
  category,
  sortBy,
  ratingFilter,
  priceRange,
  availabilityFilter,
  currentPage,
  setCurrentPage,
}: CompanyServicesListProps) => {
  // Filter company services based on the mock company
  const companyServices = mockCompany.services.map(service => ({
    id: parseInt(service.id),
    name: service.name,
    category: service.category,
    company: mockCompany.name,
    professional: mockCompany.staff[0].name,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600",
    rating: 4.8,
    reviews: 45,
    price: service.price,
    duration: service.duration,
    availability: "Hoje",
    company_id: mockCompany.id,
    professional_id: mockCompany.staff[0].id,
    description: service.description,
  }));
  
  // Apply filters
  const filteredServices = companyServices.filter((service) => {
    // Apply search term filter
    if (
      searchTerm &&
      !service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !service.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Apply category filter
    if (category !== "Todas categorias" && service.category !== category) {
      return false;
    }

    // Apply rating filter
    if (service.rating < ratingFilter[0]) {
      return false;
    }

    // Apply price range filter
    if (priceRange !== "Qualquer preço") {
      const price = parseInt(service.price.replace(/\D/g, ""));
      
      if (priceRange === "Até R$100" && price > 100) {
        return false;
      } else if (priceRange === "R$100 a R$200" && (price < 100 || price > 200)) {
        return false;
      } else if (priceRange === "R$200 a R$300" && (price < 200 || price > 300)) {
        return false;
      } else if (priceRange === "Acima de R$300" && price <= 300) {
        return false;
      }
    }

    // Apply availability filter
    if (availabilityFilter !== "Qualquer data" && service.availability !== availabilityFilter) {
      if (
        availabilityFilter === "Esta semana" &&
        !["Hoje", "Amanhã", "3 dias"].includes(service.availability)
      ) {
        return false;
      }
      
      if (
        availabilityFilter === "Próxima semana" &&
        ["Hoje", "Amanhã"].includes(service.availability)
      ) {
        return false;
      }
    }

    return true;
  });

  // Sort services based on selected sort option
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating;
    } else if (sortBy === "reviews") {
      return b.reviews - a.reviews;
    } else if (sortBy === "price-asc") {
      const priceA = parseInt(a.price.replace(/\D/g, ""));
      const priceB = parseInt(b.price.replace(/\D/g, ""));
      return priceA - priceB;
    } else if (sortBy === "price-desc") {
      const priceA = parseInt(a.price.replace(/\D/g, ""));
      const priceB = parseInt(b.price.replace(/\D/g, ""));
      return priceB - priceA;
    } else if (sortBy === "duration-asc") {
      const durationA = parseInt(a.duration);
      const durationB = parseInt(b.duration);
      return durationA - durationB;
    } else if (sortBy === "duration-desc") {
      const durationA = parseInt(a.duration);
      const durationB = parseInt(b.duration);
      return durationB - durationA;
    } else {
      // Default sort by popularity (using reviews as a proxy for popularity)
      return b.reviews - a.reviews;
    }
  });

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  const [expandedServiceId, setExpandedServiceId] = useState<number | null>(null);

  const handleToggleExpand = (serviceId: number) => {
    if (expandedServiceId === serviceId) {
      setExpandedServiceId(null);
    } else {
      setExpandedServiceId(serviceId);
    }
  };

  if (filteredServices.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">Nenhum serviço encontrado</h3>
        <p className="text-gray-500">
          Tente ajustar seus filtros para ver mais resultados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Serviços Disponíveis ({companyServices.length})</h2>
      <div className="space-y-6">
        {paginatedServices.map((service) => (
          <div key={service.id}>
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
      <ServicePagination
        currentPage={currentPage}
        totalPages={Math.ceil(companyServices.length / 5)}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
