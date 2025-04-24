
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, Calendar, Search, User } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";
import { useState } from "react";

const Navigation = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/15a72fb5-bede-4307-816e-037a944ec286.png" alt="IAZI" className="h-8" />
          </Link>
          
          <div className={`hidden md:flex items-center space-x-6 ${isSearchExpanded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
            <Link to="/" className="text-iazi-text hover:text-iazi-primary font-inter text-sm transition-colors flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="font-medium">Início</span>
            </Link>
            <Link to="/search" className="text-iazi-text hover:text-iazi-primary font-inter text-sm transition-colors flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="font-medium">Explorar</span>
            </Link>
            <Link to="/booking-history" className="text-iazi-text hover:text-iazi-primary font-inter text-sm transition-colors flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Agendamentos</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className={`transition-all duration-200 ${isSearchExpanded ? 'w-[300px] md:w-[400px]' : 'w-[180px]'}`}>
              <div 
                onClick={() => setIsSearchExpanded(true)} 
                onBlur={() => setIsSearchExpanded(false)} 
                tabIndex={0}
              >
                <SearchDropdown />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-iazi-text hover:text-iazi-primary font-inter transition-colors text-sm"
              asChild
            >
              <Link to="/login" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Entrar</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
