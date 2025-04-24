
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Search } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <section className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Agende seus serviços de forma simples e rápida
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Encontre os melhores profissionais e marque seus horários em poucos cliques
          </p>
          <Button 
            size="lg"
            className="bg-[#4664EA] hover:bg-[#3651D3] text-lg h-12 px-8"
          >
            Agendar agora
          </Button>
        </section>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
      </main>
    </div>
  );
};

export default Home;
