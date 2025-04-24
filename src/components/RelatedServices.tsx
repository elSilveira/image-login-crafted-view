
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { services } from "@/lib/mock-services";

interface RelatedServicesProps {
  currentServiceId?: number;
}

const RelatedServices = ({ currentServiceId }: RelatedServicesProps) => {
  // Filter services to exclude the current one and limit to 2
  const relatedServices = services
    .filter(service => service.id !== currentServiceId)
    .slice(0, 2)
    .map(service => ({
      id: service.id,
      name: service.name,
      image: service.image,
      price: service.price,
    }));

  return (
    <div className="space-y-4">
      {relatedServices.map((service) => (
        <Link key={service.id} to={`/service/${service.id}`}>
          <Card className="hover:bg-accent transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-muted-foreground">
                    A partir de {service.price}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RelatedServices;
