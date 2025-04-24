
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share, Star, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceProviders from "@/components/ServiceProviders";
import ServiceIncludes from "@/components/ServiceIncludes";
import ServiceFAQ from "@/components/ServiceFAQ";
import RelatedServices from "@/components/RelatedServices";
import Navigation from "@/components/Navigation";
import { services } from "@/lib/mock-services";

const ServiceDetails = () => {
  const { id } = useParams();
  
  // Find the service by ID from mock data, or use a fallback
  const service = services.find(s => s.id === Number(id)) || {
    id: 1,
    name: "Corte de Cabelo Masculino",
    category: "Cabeleireiro",
    description: "Corte masculino profissional com acabamento em navalha. Inclui lavagem e finalização.",
    image: "https://source.unsplash.com/random/800x400/?haircut",
    rating: 4.8,
    reviews: 156,
    price: "R$50",
    duration: "45 min",
    availability: "Hoje",
    company: "Bella Hair Studio",
    professional: "Julia Ferreira",
    company_id: "bella-hair-studio-112",
    professional_id: "julia-ferreira-131",
  };

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Service Info */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {service.category}
                </Badge>
                <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{service.rating}</span>
                  <span>({service.reviews} avaliações)</span>
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{service.duration}</span>
              </div>
              <div>
                <span className="text-lg font-semibold">
                  {service.price}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8">{service.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Link to={`/company/${service.company_id}`} className="text-sm hover:underline">
                {service.company}
              </Link>
            </div>

            <Tabs defaultValue="providers" className="w-full">
              <TabsList>
                <TabsTrigger value="providers">Profissionais</TabsTrigger>
                <TabsTrigger value="includes">O que inclui</TabsTrigger>
                <TabsTrigger value="faq">Perguntas frequentes</TabsTrigger>
              </TabsList>

              <TabsContent value="providers">
                <ServiceProviders serviceId={service.id} />
              </TabsContent>

              <TabsContent value="includes">
                <ServiceIncludes />
              </TabsContent>

              <TabsContent value="faq">
                <ServiceFAQ />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Serviços Relacionados</h3>
                <RelatedServices currentServiceId={service.id} />
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button className="w-full" size="lg" asChild>
                <Link to={`/booking/${service.id}`}>
                  Agendar Serviço
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetails;
