
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
import { fetchCategories } from "@/lib/api"; // Import API function
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Home = () => {
  // Fetch Categories using React Query
  const { data: categories, isLoading, isError, error } = useQuery<any[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    // staleTime: 10 * 60 * 1000, // Optional: Cache categories for 10 minutes
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-0 pt-20 pb-12"> {/* Remove horizontal padding */} 
        <div className="px-4"> {/* Add padding back for centered content */} 
          <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-6 text-iazi-text text-center">
            Encontre os melhores profissionais e serviços
          </h1>
        </div>
        
        <HeroSection />
        
        {/* --- Category Section --- */}
        {isLoading ? (
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-24 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              ))}
            </div>
          </section>
        ) : isError ? (
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                Não foi possível carregar as categorias. {error?.message}
              </AlertDescription>
            </Alert>
          </div>
        ) : categories && categories.length > 0 ? (
          // Pass fetched categories to the component
          <CategorySection title="Categorias Populares" categories={categories} />
        ) : (
          <div className="py-8 px-4 text-center text-muted-foreground">Nenhuma categoria encontrada.</div>
        )}
        {/* --- End Category Section --- */}

        <div className="grid md:grid-cols-12 gap-8 mt-8 px-4"> {/* Add padding back */} 
          <div className="md:col-span-8">
            {/* TODO: Connect SocialFeed */}
            <SocialFeed />
          </div>

          <div className="md:col-span-4 space-y-6">
            {/* TODO: Connect AppointmentSection, ServicesSection, ProfessionalsSection */}
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

