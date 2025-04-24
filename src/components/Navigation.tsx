
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, Calendar, Search, User, Settings, LogOut, Menu } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Início", path: "/", icon: Home },
    { name: "Explorar", path: "/search", icon: Search },
    { name: "Agendamentos", path: "/booking-history", icon: Calendar },
    { name: "Configurações", path: "/settings", icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <img src="/lovable-uploads/15a72fb5-bede-4307-816e-037a944ec286.png" alt="IAZI" className="h-8" />
          </Link>
          
          <div className={`hidden md:flex items-center space-x-6 ${isSearchExpanded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="text-iazi-text hover:text-iazi-primary font-inter text-sm transition-colors flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
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

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px]">
                <div className="py-4">
                  <div className="space-y-4">
                    {navItems.map((item) => (
                      <SheetClose asChild key={item.path}>
                        <Link
                          to={item.path}
                          className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-accent transition-colors"
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      {isAuthenticated ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-iazi-text hover:text-iazi-primary font-inter transition-colors text-sm"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          <span className="font-medium">Sair</span>
                        </Button>
                      ) : (
                        <Link
                          to="/login"
                          className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-accent transition-colors"
                        >
                          <User className="mr-3 h-4 w-4" />
                          Entrar
                        </Link>
                      )}
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop user menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Meu Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-iazi-text hover:text-iazi-primary font-inter transition-colors text-sm"
                asChild
              >
                <Link to="/login" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Entrar</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
