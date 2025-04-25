
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ServiceProviders from "@/components/ServiceProviders";
import { services } from "@/lib/mock-services";

const CompanyBooking = () => {
  const { companyId } = useParams();
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Filter services by company_id
  const companyServices = services.filter(
    (service) => service.company_id === companyId
  );

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-playfair mb-2">Agendar Serviço</h1>
          <p className="text-muted-foreground">
            Selecione o serviço e o profissional de sua preferência
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Serviços Disponíveis</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {companyServices.map((service) => (
                <Card
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    selectedService === service.id
                      ? "border-iazi-primary shadow-md"
                      : "hover:border-iazi-border-hover"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>
                      {service.duration} • R$ {service.price}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {selectedService && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Profissionais Disponíveis
              </h2>
              <ServiceProviders serviceId={selectedService} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyBooking;
