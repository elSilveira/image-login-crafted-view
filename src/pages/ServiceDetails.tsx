import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchServiceDetails } from "@/lib/api"; // Import API function
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share, Star, Clock, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServiceProviders from "@/components/ServiceProviders";
import ServiceIncludes from "@/components/ServiceIncludes";
import ServiceFAQ from "@/components/ServiceFAQ";
import RelatedServices from "@/components/RelatedServices";
import Navigation from "@/components/Navigation";
// Removed mock data import: import { services } from "@/lib/mock-services";

// Define an interface for the service data structure (adjust based on actual API response)
interface Service {
  id: number;
  name: string;
  description: string;
  price: number; // Assuming price is a number
  duration: number; // Assuming duration is in minutes
  category: { id: number; name: string }; // Assuming category is an object
  company: { id: string; name: string }; // Assuming company is an object
  // Add other fields based on your API response (e.g., images, rating, reviews, professionals)
  images?: { url: string }[];
  averageRating?: number;
  reviewCount?: number;
}

const ServiceDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch service details using React Query
  const { data: service, isLoading, isError, error } = useQuery<Service, Error>({
    // Ensure the query key is unique and includes the service ID
    queryKey: ["serviceDetails", id],
    // Only run the query if id is defined
    queryFn: () => fetchServiceDetails(id!),
    enabled: !!id, // Ensures id is not undefined before fetching
    // staleTime: 5 * 60 * 1000, // Optional: Cache data for 5 minutes
  });

  const [imageError, setImageError] = useState(false);

  // --- Loading State --- 
  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-16 flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  // --- Error State --- 
  if (isError || !service) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8 mt-16">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-6 flex flex-col items-center text-center text-destructive">
              <AlertCircle className="h-10 w-10 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro ao Carregar Serviço</h2>
              <p className="text-sm mb-4">
                Não foi possível carregar os detalhes do serviço. Tente novamente mais tarde.
              </p>
              {error && <p className="text-xs">Detalhes: {error.message}</p>}
              <Button variant="destructive" asChild className="mt-4">
                <Link to="/">Voltar para Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // --- Success State (Display Service Details) --- 
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h > 0 ? `${h}h ` : ""}${m > 0 ? `${m}min` : ""}`.trim();
  };

  const mainImage = service.images?.[0]?.url || "https://via.placeholder.com/800x400?text=Sem+Imagem";

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="relative h-[300px] md:h-[400px] w-full mb-8 rounded-lg overflow-hidden bg-muted">
          {!imageError && (
            <img
              src={mainImage}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Service Info */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                {service.category && (
                  <Badge variant="secondary" className="mb-2">
                    {service.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold mb-2">
                  {/* Link might not be needed if already on the details page */}
                  {service.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {service.averageRating !== undefined && (
                    <>
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{service.averageRating.toFixed(1)}</span>
                      <span>({service.reviewCount || 0} avaliações)</span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDuration(service.duration)}</span>
              </div>
              <div>
                <span className="text-lg font-semibold">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 whitespace-pre-wrap">{service.description}</p>

            {service.company && (
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Link to={`/company/${service.company.id}`} className="text-sm hover:underline">
                  {service.company.name}
                </Link>
                {/* Link to see all services from the company - adjust route if needed */}
                <Link to={`/company/${service.company.id}/services`} className="text-sm text-iazi-primary hover:underline ml-2">
                  Ver todos os serviços desta empresa
                </Link>
              </div>
            )}

            <Tabs defaultValue="providers" className="w-full">
              <TabsList>
                <TabsTrigger value="providers">Profissionais</TabsTrigger>
                <TabsTrigger value="includes">O que inclui</TabsTrigger>
                <TabsTrigger value="faq">Perguntas frequentes</TabsTrigger>
              </TabsList>

              <TabsContent value="providers">
                {/* Pass serviceId or relevant data to child components */}
                <ServiceProviders serviceId={service.id} />
              </TabsContent>

              <TabsContent value="includes">
                {/* ServiceIncludes does not accept props, so remove them */}
                <ServiceIncludes />
              </TabsContent>

              <TabsContent value="faq">
                {/* ServiceFAQ does not accept props, so remove them */}
                <ServiceFAQ />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Serviços Relacionados</h3>
                {/* Pass categoryId or other relevant data */}
                <RelatedServices currentServiceId={String(service.id)} categoryId={service.category?.id} />
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button className="w-full bg-iazi-primary hover:bg-iazi-primary-hover" size="lg" asChild>
                {/* Ensure booking route is correct */}
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

