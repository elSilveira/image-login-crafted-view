
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/15a72fb5-bede-4307-816e-037a944ec286.png" alt="IAZI" className="h-8" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-iazi-text hover:text-iazi-primary font-lato transition-colors">
              Início
            </Link>
            <Link to="/search" className="text-iazi-text hover:text-iazi-primary font-lato transition-colors">
              Explorar
            </Link>
            <Link to="/booking-history" className="text-iazi-text hover:text-iazi-primary font-lato transition-colors">
              Meus Agendamentos
            </Link>
          </div>
          
          <SearchDropdown />

          <Button
            variant="ghost"
            className="text-iazi-text hover:text-iazi-primary font-lato transition-colors"
            asChild
          >
            <Link to="/login" className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Entrar
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
