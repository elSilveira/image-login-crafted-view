import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SearchDropdown } from "@/components/SearchDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LogOut, User, Star, Award, Briefcase, Building, LayoutDashboard, Settings } from "lucide-react"; // Adicionado Settings

export default function Navigation() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <span className="font-bold text-2xl text-[#4664EA]">iAzi</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/booking-history" className="text-sm font-medium transition-colors hover:text-primary">
              Meus Agendamentos
            </Link>
            <Link to="/services" className="text-sm font-medium transition-colors hover:text-primary">
              Explorar
            </Link>
          </div>
        </div>
        
        <div className="flex-1 mx-4 md:mx-8 max-w-md">
          <SearchDropdown />
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/notifications" className="text-sm font-medium transition-colors hover:text-primary">
                <Bell className="h-5 w-5" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil (Usuário)
                    </Link>
                  </DropdownMenuItem>
                  {/* Conditionally render View Professional Profile link */}
                  {user.professionalProfileId && (
                    <DropdownMenuItem asChild>
                      <Link to={`/professional/${user.professionalProfileId}`} className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4" /> 
                        Ver Meu Perfil Profissional
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile/professional/settings" className="flex items-center">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Editar Perfil Profissional
                    </Link>
                  </DropdownMenuItem>
                  {/* Adicionado item de Configurações */}
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/company/register" className="flex items-center">
                      <Building className="mr-2 h-4 w-4" />
                      Cadastrar Empresa
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/company/my-company/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Painel Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/reviews" className="flex items-center">
                      <Star className="mr-2 h-4 w-4" />
                      Avaliações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/gamification" className="flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      Conquistas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-primary">
                Login
              </Link>
              <Link to="/register" className="text-sm font-medium transition-colors hover:text-primary">
                Registrar
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

