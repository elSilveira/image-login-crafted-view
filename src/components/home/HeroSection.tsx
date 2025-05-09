
import { Card, CardContent } from "@/components/ui/card";
import { Search, Calendar, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const HeroSection = () => {
  const { user } = useAuth();
  const canPublish = user && (user.professionalProfileId || false); // Add company check here in the future

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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

      <Link to="/booking-history" className="w-full">
        <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all border-iazi-border h-full cursor-pointer">
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto h-6 w-6 text-iazi-primary mb-2" />
            <h3 className="text-base font-outfit font-semibold mb-1 text-iazi-text">Escolha a Data</h3>
            <p className="text-xs font-inter text-iazi-text">
              Selecione o melhor horário disponível
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link to="/booking/1" className="w-full">
        <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all border-iazi-border h-full cursor-pointer">
          <CardContent className="p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-iazi-primary mb-2" />
            <h3 className="text-base font-outfit font-semibold mb-1 text-iazi-text">Confirme o Agendamento</h3>
            <p className="text-xs font-inter text-iazi-text">
              Receba confirmação instantânea
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link to={canPublish ? "/new-publication" : "/profile/professional/settings"} className="w-full">
        <Card className="bg-white/70 backdrop-blur hover:shadow-lg transition-all border-iazi-border h-full cursor-pointer">
          <CardContent className="p-4 text-center">
            <FileText className="mx-auto h-6 w-6 text-iazi-primary mb-2" />
            <h3 className="text-base font-outfit font-semibold mb-1 text-iazi-text">Nova Publicação</h3>
            <p className="text-xs font-inter text-iazi-text">
              {canPublish 
                ? "Compartilhe novidades sobre seus serviços" 
                : "Crie seu perfil profissional para publicar"
              }
            </p>
          </CardContent>
        </Card>
      </Link>
    </section>
  );
};
