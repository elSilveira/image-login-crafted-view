
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceCard } from "@/components/services/ServiceCard";
import { services } from "@/lib/mock-services";

interface CompanyFeaturedServicesProps {
  companyId: string | undefined;
}

export const CompanyFeaturedServices = ({ companyId }: CompanyFeaturedServicesProps) => {
  // Filter services to get those belonging to the company and limit to 3 featured services
  const featuredServices = services
    .filter(service => service.company_id === companyId)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
  
  if (featuredServices.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Serviços em Destaque</h2>
      <div className="grid grid-cols-1 gap-6">
        {featuredServices.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
