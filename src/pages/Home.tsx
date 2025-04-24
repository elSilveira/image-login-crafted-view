
import Navigation from "@/components/Navigation";
import AppointmentSection from "@/components/AppointmentSection";
import SocialFeed from "@/components/SocialFeed";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProfessionalsSection } from "@/components/home/ProfessionalsSection";
import { PageFooter } from "@/components/home/PageFooter";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-20 pb-12">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-6 text-iazi-text text-center">
          Encontre os melhores profissionais e serviços
        </h1>
        
        <HeroSection />
        <CategorySection />

        <div className="grid md:grid-cols-12 gap-8 mt-8">
          <div className="md:col-span-8">
            <SocialFeed />
          </div>

          <div className="md:col-span-4 space-y-6">
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
