
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Search } from "lucide-react";
import AppointmentSection from "@/components/AppointmentSection";
import SocialFeed from "@/components/SocialFeed";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Feature Cards - Now at the top */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Search className="mx-auto h-8 w-8 text-[#4664EA] mb-2" />
              <h3 className="text-lg font-semibold mb-1">Encontre Profissionais</h3>
              <p className="text-sm text-gray-600">
                Pesquise profissionais qualificados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Calendar className="mx-auto h-8 w-8 text-[#4664EA] mb-2" />
              <h3 className="text-lg font-semibold mb-1">Escolha a Data</h3>
              <p className="text-sm text-gray-600">
                Selecione o melhor horário
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur">
            <CardContent className="p-4 text-center">
              <Clock className="mx-auto h-8 w-8 text-[#4664EA] mb-2" />
              <h3 className="text-lg font-semibold mb-1">Confirme o Agendamento</h3>
              <p className="text-sm text-gray-600">
                Confirmação instantânea
              </p>
            </CardContent>
          </Card>
        </section>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="md:col-span-8">
            <SocialFeed />
          </div>

          {/* Appointments Section */}
          <div className="md:col-span-4">
            <AppointmentSection />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
