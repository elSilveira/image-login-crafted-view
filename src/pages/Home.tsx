
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Search, Star, User } from "lucide-react";
import AppointmentSection from "@/components/AppointmentSection";
import SocialFeed from "@/components/SocialFeed";
import { Input } from "@/components/ui/input";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Feature Cards - Smaller size */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <Card className="bg-white/70 backdrop-blur">
            <CardContent className="p-3 text-center">
              <Search className="mx-auto h-6 w-6 text-[#4664EA] mb-1" />
              <h3 className="text-base font-semibold mb-1">Encontre Profissionais</h3>
              <p className="text-xs text-gray-600">
                Pesquise profissionais qualificados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur">
            <CardContent className="p-3 text-center">
              <Calendar className="mx-auto h-6 w-6 text-[#4664EA] mb-1" />
              <h3 className="text-base font-semibold mb-1">Escolha a Data</h3>
              <p className="text-xs text-gray-600">
                Selecione o melhor horário
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur">
            <CardContent className="p-3 text-center">
              <Clock className="mx-auto h-6 w-6 text-[#4664EA] mb-1" />
              <h3 className="text-base font-semibold mb-1">Confirme o Agendamento</h3>
              <p className="text-xs text-gray-600">
                Confirmação instantânea
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input 
            placeholder="Buscar serviços ou profissionais..." 
            className="pl-10 bg-white"
          />
        </div>

        {/* Popular Categories */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categorias Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Cabelo', 'Barba', 'Manicure', 'Maquiagem', 'Massagem', 'Estética'].map((category) => (
              <Button
                key={category}
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2 hover:bg-[#4664EA] hover:text-white group"
              >
                <User className="h-6 w-6 group-hover:text-white" />
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Featured Professionals */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Profissionais em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((pro) => (
              <Card key={pro} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Profissional {pro}</h3>
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full" size="sm">Ver Perfil</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Services */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Serviços Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((service) => (
              <Card key={service} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Serviço {service}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Descrição breve do serviço oferecido...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#4664EA] font-semibold">R$ 50,00</span>
                    <Button size="sm">Agendar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#4664EA]">
                  <facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-[#4664EA]">
                  <linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; 2025 AgendaFácil. Todos os direitos reservados.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
