
import React from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share, Star, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceProviders from "@/components/ServiceProviders";
import ServiceIncludes from "@/components/ServiceIncludes";
import ServiceFAQ from "@/components/ServiceFAQ";
import RelatedServices from "@/components/RelatedServices";

const ServiceDetails = () => {
  const { id } = useParams();

  // Mock data - In a real app, this would come from an API
  const service = {
    id: "1",
    name: "Corte de Cabelo Masculino",
    category: "Cabeleireiro",
    description: "Corte masculino profissional com acabamento em navalha. Inclui lavagem e finalização.",
    minPrice: 50,
    maxPrice: 120,
    duration: 45,
    rating: 4.8,
    reviewCount: 156,
    image: "https://source.unsplash.com/random/800x400/?haircut",
  };

  return (
    <div className="container mx-auto px-4 py-8">
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
                <span>({service.reviewCount} avaliações)</span>
              </div>
            </div>
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{service.duration} minutos</span>
            </div>
            <div>
              <span className="text-lg font-semibold">
                R$ {service.minPrice} - R$ {service.maxPrice}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground mb-8">{service.description}</p>

          <Tabs defaultValue="providers" className="w-full">
            <TabsList>
              <TabsTrigger value="providers">Profissionais</TabsTrigger>
              <TabsTrigger value="includes">O que inclui</TabsTrigger>
              <TabsTrigger value="faq">Perguntas frequentes</TabsTrigger>
            </TabsList>

            <TabsContent value="providers">
              <ServiceProviders />
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
              <RelatedServices />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
