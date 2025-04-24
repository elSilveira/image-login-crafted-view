
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Search, Star, User, Instagram, Facebook, Linkedin } from "lucide-react";
import AppointmentSection from "@/components/AppointmentSection";
import SocialFeed from "@/components/SocialFeed";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Feature Cards - More compact size */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <Search className="mx-auto h-6 w-6 text-[#4664EA] mb-2" />
              <h3 className="text-base font-semibold mb-1">Encontre Profissionais</h3>
              <p className="text-xs text-gray-600">
                Pesquise e encontre os melhores profissionais
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <Calendar className="mx-auto h-6 w-6 text-[#4664EA] mb-2" />
              <h3 className="text-base font-semibold mb-1">Escolha a Data</h3>
              <p className="text-xs text-gray-600">
                Selecione o melhor horário disponível
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all">
            <CardContent className="p-4 text-center">
              <Clock className="mx-auto h-6 w-6 text-[#4664EA] mb-2" />
              <h3 className="text-base font-semibold mb-1">Confirme o Agendamento</h3>
              <p className="text-xs text-gray-600">
                Receba confirmação instantânea
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Popular Categories - Enhanced with better icons */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Categorias Populares</h2>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-[#4664EA] hover:text-white group shadow-sm"
              >
                <User className="h-8 w-8 group-hover:text-white" />
                <span className="text-xs font-medium">Cabelo</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-[#4664EA] hover:text-white group shadow-sm"
              >
                <Clock className="h-8 w-8 group-hover:text-white" />
                <span className="text-xs font-medium">Barba</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-[#4664EA] hover:text-white group shadow-sm"
              >
                <Star className="h-8 w-8 group-hover:text-white" />
                <span className="text-xs font-medium">Manicure</span>
              </Button>
              {/* ... Add more category buttons with appropriate icons */}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Main Feed */}
          <div className="md:col-span-8">
            <SocialFeed />
          </div>

          {/* Side Content */}
          <div className="md:col-span-4 space-y-8">
            {/* Appointments Section */}
            <AppointmentSection />

            {/* Recent Services - Enhanced */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Serviços Recentes</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((service) => (
                  <Card key={service} className="overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gray-100" />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">Serviço Premium {service}</h3>
                        <p className="text-sm text-gray-600 mb-3">
                          Serviço profissional com atendimento personalizado...
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-medium">4.8</span>
                          </div>
                          <span className="text-[#4664EA] font-semibold">R$ 50,00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Featured Professionals - Under Recent Services */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Profissionais em Destaque</h2>
              <div className="space-y-4">
                {[1, 2].map((pro) => (
                  <Card key={pro} className="hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">Profissional {pro}</h3>
                          <div className="flex items-center text-sm text-yellow-500 mb-2">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="ml-1">4.8</span>
                          </div>
                          <Button size="sm" className="w-full">Ver Perfil</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Sobre</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#4664EA]">Quem Somos</a></li>
                <li><a href="#" className="hover:text-[#4664EA]">Como Funciona</a></li>
                <li><a href="#" className="hover:text-[#4664EA]">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Para Profissionais</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#4664EA]">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-[#4664EA]">Como Funciona</a></li>
                <li><a href="#" className="hover:text-[#4664EA]">Planos</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#4664EA]">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-[#4664EA]">Contato</a></li>
                <li><a href="#" className="hover:text-[#4664EA]">Política de Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#4664EA]">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#4664EA]">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#4664EA]">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t">
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:text-[#4664EA]">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#4664EA]">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#4664EA]">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">&copy; 2025 AgendaFácil. Todos os direitos reservados.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
