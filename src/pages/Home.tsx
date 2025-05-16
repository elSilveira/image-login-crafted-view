
"use client"; // Needed for hooks

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import AppointmentSection from "@/components/AppointmentSection";
import SocialFeed from "@/components/SocialFeed";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProfessionalsSection } from "@/components/home/ProfessionalsSection";
import { PageFooter } from "@/components/home/PageFooter";
import { fetchCategories, fetchAppointments, fetchSearchResults } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Fetch Categories using React Query
  const { data: categories, isLoading, isError, error } = useQuery<any[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // Cache categories for 10 minutes
  });
  
  // Pre-fetch upcoming appointments to improve user experience
  const { data: upcomingAppointments } = useQuery({
    queryKey: ["upcomingAppointments"],
    queryFn: () => fetchAppointments({ 
      include: "service,professional,services.service", 
      limit: 5, 
      sort: "startTime_asc" 
    }),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
  
  // Pre-fetch recommended services based on user preferences
  const { data: recommendedServices } = useQuery({
    queryKey: ["recommendedServices"],
    queryFn: () => fetchSearchResults({ 
      type: "services",
      limit: 5,
      sort: "rating_desc",
      useProfessionalServices: true
    }),
    staleTime: 15 * 60 * 1000,
  });
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-0 pt-20 pb-12">
        <div className="px-4">
          <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-6 text-iazi-text text-center">
            Encontre os melhores profissionais e serviços
          </h1>
        </div>
        
        <HeroSection />
        
        <CategorySection />

        <div className="grid md:grid-cols-12 gap-8 mt-8 px-4">
          <div className="md:col-span-8">
            <SocialFeed />
          </div>

          <div className="md:col-span-4 space-y-6">
            {/* Connected components with real appointment and service data */}
            <AppointmentSection />
            <ServicesSection />
            <ProfessionalsSection />
          </div>
        </div>

        <PageFooter />
      </main>
    </div>
  );
};

export default Home;
