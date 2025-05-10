
import { Card, CardContent } from "@/components/ui/card";
import { Search, Briefcase, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Link to="/search" className="w-full">
        <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all border-iazi-border h-full cursor-pointer">
          <CardContent className="p-4 text-center">
            <Search className="mx-auto h-6 w-6 text-iazi-primary mb-2" />
            <h3 className="text-base font-outfit font-semibold mb-1 text-iazi-text">Encontre Profissionais</h3>
            <p className="text-xs font-inter text-iazi-text">
              Pesquise e encontre os melhores profissionais
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link to="/services" className="w-full">
        <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all border-iazi-border h-full cursor-pointer">
          <CardContent className="p-4 text-center">
            <Briefcase className="mx-auto h-6 w-6 text-iazi-primary mb-2" />
            <h3 className="text-base font-outfit font-semibold mb-1 text-iazi-text">Encontre Serviços</h3>
            <p className="text-xs font-inter text-iazi-text">
              Conheça os melhores serviços disponíveis
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link to="/booking-history" className="w-full">
        <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all border-iazi-border h-full cursor-pointer">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto h-6 w-6 text-iazi-primary mb-2" />
            <h3 className="text-base font-outfit font-semibold mb-1 text-iazi-text">Minha Agenda</h3>
            <p className="text-xs font-inter text-iazi-text">
              Visualize e gerencie seus compromissos
            </p>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};
