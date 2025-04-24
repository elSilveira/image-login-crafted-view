
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User, Search } from "lucide-react";
import { Input } from "./ui/input";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-[#4664EA]">
            AgendaFácil
          </Link>
          
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Buscar serviços ou profissionais..." 
                className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            className="text-gray-600 hover:text-[#4664EA]"
            asChild
          >
            <Link to="/login">
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
