
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
        <div className="grid md:grid-cols-12 gap-8">
          {/* Lado esquerdo - Feed Social */}
          <div className="md:col-span-8">
            <SocialFeed />
          </div>

          {/* Lado direito - Agendamentos e Cards */}
          <div className="md:col-span-4 space-y-6">
            <AppointmentSection />
            
            <section className="grid gap-4">
              <Card className="bg-white/70 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Search className="mx-auto h-12 w-12 text-[#4664EA] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Encontre Profissionais</h3>
                  <p className="text-gray-600">
                    Pesquise e compare profissionais qualificados na sua região
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-[#4664EA] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Escolha a Data</h3>
                  <p className="text-gray-600">
                    Selecione o melhor dia e horário para seu atendimento
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <Clock className="mx-auto h-12 w-12 text-[#4664EA] mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Confirme o Agendamento</h3>
                  <p className="text-gray-600">
                    Receba a confirmação instantânea do seu horário
                  </p>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
