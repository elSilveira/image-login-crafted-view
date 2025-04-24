
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { User } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-[#4664EA]">
            AgendaFácil
          </Link>
          
          <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
};

export default Navigation;
