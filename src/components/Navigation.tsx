
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User, Search } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Navigation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-[#4664EA]">
            AgendaFácil
          </Link>
          
          <div className="hidden md:flex space-x-6 mx-4">
            <Link to="/" className="text-gray-700 hover:text-[#4664EA]">
              Início
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-[#4664EA]">
              Buscar
            </Link>
            <Link to="/professionals" className="text-gray-700 hover:text-[#4664EA]">
              Empresas
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-[#4664EA]">
              Serviços
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Buscar serviços ou empresas..." 
                className="pl-10 w-full bg-gray-50 border-gray-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
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
