
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Search, User } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";

const Navigation = () => {
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
              Explorar
            </Link>
          </div>
          
          <SearchDropdown />

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
