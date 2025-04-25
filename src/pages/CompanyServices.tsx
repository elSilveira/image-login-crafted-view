
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { CompanyServicesHeader } from "@/components/company/CompanyServicesHeader";
import { CompanyServicesList } from "@/components/company/CompanyServicesList";
import { CompanyFeaturedServices } from "@/components/company/CompanyFeaturedServices";
import { CompanyPromotions } from "@/components/company/CompanyPromotions";

const CompanyServices = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas categorias");
  const [sortBy, setSortBy] = useState("popularity");
  const [ratingFilter, setRatingFilter] = useState<number[]>([0]);
  const [priceRange, setPriceRange] = useState("Qualquer preço");
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-6">
        <CompanyServicesHeader 
          companyId={id} 
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

        <div className="my-8">
          <CompanyFeaturedServices companyId={id} />
        </div>

        <div className="my-8">
          <CompanyPromotions companyId={id} />
        </div>

        <CompanyServicesList 
          companyId={id}
          searchTerm={searchTerm}
          category={category}
          sortBy={sortBy}
          ratingFilter={ratingFilter}
          priceRange={priceRange}
          availabilityFilter={availabilityFilter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CompanyServices;
