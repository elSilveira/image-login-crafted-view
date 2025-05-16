import { ProfessionalCard } from "@/components/home/ProfessionalCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAppointments, fetchSearchResults } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export const ProfessionalsSection = () => {
  const { isAuthenticated } = useAuth();
  
  // Fetch top professionals from appointments and recommendations
  const { data: professionals, isLoading, isError, error } = useQuery({
    queryKey: ["homeProfessionals"],
    queryFn: async () => {
      let professionals = [];
      
      // If user is authenticated, get professionals from their appointments
      if (isAuthenticated) {
        try {
          const appointmentsResult = await fetchAppointments({ 
            include: "professional",
            limit: 5,
            sort: "startTime_desc" 
          });
          
          // Ensure appointmentsResult is an array
          const appointmentsArray = Array.isArray(appointmentsResult) 
            ? appointmentsResult 
            : (appointmentsResult?.data && Array.isArray(appointmentsResult.data) 
                ? appointmentsResult.data 
                : []);
          
          // Extract unique professionals from appointments
          const professionalMap = new Map();
          appointmentsArray.forEach(appointment => {
            if (appointment && appointment.professional && !professionalMap.has(appointment.professional.id)) {
              professionalMap.set(appointment.professional.id, {
                id: appointment.professional.id,
                name: appointment.professional.name,
                rating: appointment.professional.rating || 4.5,
                image: appointment.professional.image || null
              });
            }
          });
          
          professionals = [...professionalMap.values()];
        } catch (err) {
          console.error('Error fetching professionals from appointments:', err);
          // Continue with empty professionals array
        }
      }
      
      // If we don't have enough professionals, get recommendations
      if (professionals.length < 3) {
        try {
          const searchResult = await fetchSearchResults({
            type: "professionals",
            limit: 5,
            sort: "rating_desc"
          });
          
          let recommendedProfessionals = [];
          
          // Handle different response formats
          if (searchResult && Array.isArray(searchResult)) {
            recommendedProfessionals = searchResult.map(pro => ({
              id: pro.id,
              name: pro.name,
              rating: pro.rating || 4.5,
              image: pro.image || null
            }));
          } else if (searchResult && searchResult.professionals && Array.isArray(searchResult.professionals)) {
            recommendedProfessionals = searchResult.professionals.map(pro => ({
              id: pro.id,
              name: pro.name,
              rating: pro.rating || 4.5,
              image: pro.image || null
            }));
          }
          
          // Add unique professionals from recommendations
          recommendedProfessionals.forEach(pro => {
            if (!professionals.some(p => p.id === pro.id)) {
              professionals.push(pro);
            }
          });
        } catch (err) {
          console.error('Error fetching recommended professionals:', err);
          // Continue with current professionals list
        }
      }
      
      // Return top 3 professionals
      return professionals.slice(0, 3);
    },
    staleTime: 5 * 60 * 1000,
  });
  
  // Fallback professionals if none are available
  const fallbackProfessionals = [
    {
      id: "1",
      name: "João Silva",
      rating: 4.8,
      image: null,
    },
    {
      id: "2",
      name: "Maria Oliveira",
      rating: 4.9,
      image: null,
    },
  ];

  const displayProfessionals = professionals?.length > 0 ? professionals : fallbackProfessionals;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-playfair font-semibold text-iazi-text">Profissionais em Destaque</h2>
        <Button variant="link" asChild>
          <Link to="/search?type=professional" className="font-inter">Ver todos</Link>
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
            Não foi possível carregar os profissionais em destaque.
            {error instanceof Error && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {displayProfessionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              id={professional.id}
              name={professional.name}
              rating={professional.rating}
              image={professional.image}
            />
          ))}
        </div>
      )}
    </section>
  );
}