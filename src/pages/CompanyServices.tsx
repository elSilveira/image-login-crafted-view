
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { CompanyServicesHeader } from "@/components/company/CompanyServicesHeader";
import { CompanyServicesList } from "@/components/company/CompanyServicesList";
import { CompanyFeaturedServices } from "@/components/company/CompanyFeaturedServices";
import { CompanyPromotions } from "@/components/company/CompanyPromotions";
import { PageContainer } from "@/components/ui/page-container";

const CompanyServices = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Todas categorias");
  const [sortBy, setSortBy] = useState("popularity");
  const [ratingFilter, setRatingFilter] = useState<number[]>([0]);
  const [priceRange, setPriceRange] = useState("Qualquer preço");
  const [availabilityFilter, setAvailabilityFilter] = useState("Qualquer data");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-16">
        <PageContainer>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          </div>

          <div className="my-6">
            <CompanyFeaturedServices companyId={id} />
          </div>

          <div className="my-6">
            <CompanyPromotions companyId={id} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <CompanyServicesList 
              companyId={id}
              searchTerm={searchTerm}
              category={category}
              sortBy={sortBy}
              ratingFilter={ratingFilter}
              priceRange={priceRange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </PageContainer>
      </div>
    </div>
  );
};

export default CompanyServices;
