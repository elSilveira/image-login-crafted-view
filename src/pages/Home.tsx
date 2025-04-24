
import Navigation from "@/components/Navigation";
import AppointmentSection from "@/components/AppointmentSection";
import SocialFeed from "@/components/SocialFeed";
import { FeatureCards } from "@/components/home/FeatureCards";
import { PopularCategories } from "@/components/home/PopularCategories";
import { RecentServices } from "@/components/home/RecentServices";
import { FeaturedProfessionals } from "@/components/home/FeaturedProfessionals";
import { Footer } from "@/components/home/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <FeatureCards />
        <PopularCategories />

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="md:col-span-8">
            <SocialFeed />
          </div>

          {/* Side Content */}
          <div className="md:col-span-4 space-y-8">
            <AppointmentSection />
            <RecentServices />
            <FeaturedProfessionals />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Home;
