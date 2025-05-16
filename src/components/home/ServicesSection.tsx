
import { ServiceCard } from "@/components/home/ServiceCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAppointments } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ServicesSection = () => {
  // Fetch recently completed appointments to show as recent services
  const { data: recentServices, isLoading, isError, error } = useQuery({
    queryKey: ["recentServices"],
    queryFn: async () => {
      try {
        // Fetch recently completed appointments
        const result = await fetchAppointments({
          include: "service,professional,services.service",
          status: "completed", // Only completed services
          limit: 5,
          sort: "endTime_desc" // Most recent first
        });
        
        // Make sure result is an array before filtering
        if (!result || !Array.isArray(result)) {
          console.warn('Expected array from fetchAppointments, got:', typeof result);
          return [];
        }
        
        return result.filter(appt => 
          appt.service || (appt.services && appt.services.length > 0)
        );
      } catch (err) {
        console.error('Error fetching recent services:', err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Process appointments to create service cards data
  const processedServices = recentServices?.map(appointment => {
    try {
      // Get service info either from service or services array
      const service = appointment.service || 
        (appointment.services && appointment.services.length > 0 ? 
          appointment.services[0].service : null);
      
      if (!service) return null;
      
      // Parse price safely
      let price = 0;
      if (service.price) {
        if (typeof service.price === 'string') {
          // Convert string price (e.g., "R$ 150,00") to number
          const numericString = service.price.replace(/[^\d.,]/g, '').replace(',', '.');
          price = parseFloat(numericString) || 0;
        } else {
          price = service.price;
        }
      }
      
      return {
        id: service.id,
        title: service.name,
        description: service.description || `Serviço com ${appointment.professional?.name || 'profissional'}`,
        rating: service.rating || appointment.professional?.rating || 4.5,
        price
      };
    } catch (err) {
      console.error("Error processing service data:", err);
      return null;
    }
  }).filter(Boolean) || [];

  // Fallback services if none are available
  const fallbackServices = [
    {
      id: "1",
      title: "Manutenção de Ar Condicionado",
      description: "Limpeza e manutenção do seu ar condicionado...",
      rating: 4.8,
      price: 150,
    },
    {
      id: "2",
      title: "Pintura Residencial",
      description: "Serviço profissional de pintura para sua casa...",
      rating: 4.7,
      price: 500,
    },
    {
      id: "3",
      title: "Aulas de Inglês",
      description: "Aulas particulares com professor nativo...",
      rating: 4.9,
      price: 80,
    },
  ];

  const displayServices = processedServices.length > 0 ? processedServices : fallbackServices;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-playfair font-semibold text-iazi-text">Serviços Recentes</h2>
        <Button variant="link" asChild>
          <Link to="/search?type=service" className="font-inter">Ver todos</Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Não foi possível carregar os serviços recentes.
            {error instanceof Error && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {displayServices.map((service) => (
            <ServiceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              rating={service.rating}
              price={service.price}
            />
          ))}
        </div>
      )}
    </section>
  );
};
