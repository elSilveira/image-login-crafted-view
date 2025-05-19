import React from "react";
import { Link } from "react-router-dom";
import { useAuth, getEffectiveUserRole } from "@/contexts/AuthContext";
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
import { Bell, LogOut, User, Star, Award, Briefcase, Building, LayoutDashboard, Settings, ClipboardList, FileText, Download } from "lucide-react";
import { InviteModal } from "@/components/InviteModal";
import apiClient from "@/lib/api";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePwaInstall } from "@/hooks/use-pwa-install";

export default function Navigation() {
  const { user, logout } = useAuth();
  const userRole = getEffectiveUserRole(user);
  const isMobile = useIsMobile();
  const { canInstall, handleInstallPWA, isPWA } = usePwaInstall();

  // Debug: Log user whenever it changes
  React.useEffect(() => {
    console.log('[Navigation] user context changed:', user);
  }, [user]);

  // Invite modal state
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [inviteCode, setInviteCode] = React.useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleLogout = () => {
    logout();
  };

  // Handler to request invite code
  const handleInviteClick = async () => {
    setLoadingInvite(true);
    setInviteModalOpen(true);
    setCopied(false);
    try {
      const res = await apiClient.post("/auth/invites");
      const data = res.data;
      setInviteCode(data.code || data.inviteCode || data.invite || "");
    } catch (e) {
      setInviteCode("");
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(`Use este código para se cadastrar: ${inviteCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
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
              <Link to="/search" className="text-sm font-medium transition-colors hover:text-primary">
                Explorar
              </Link>
            </div>
          </div>
          
          <div className="flex-1 mx-4 md:mx-8 max-w-md">
            <SearchDropdown />
          </div>
            <div className="flex items-center justify-end space-x-4">
            {isMobile && canInstall && !isPWA && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center text-primary border-primary hover:bg-primary/10"
                onClick={handleInstallPWA}
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Baixar App</span>
              </Button>
            )}
            
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
                    {/* Exibe a role do usuário no topo do dropdown, como item não clicável */}
                    <div className="px-3 py-2 text-xs text-muted-foreground font-mono bg-gray-100 rounded mb-1 cursor-default select-none">
                      {userRole}
                    </div>
                    {/* Criar Convite */}
                    <DropdownMenuItem onClick={handleInviteClick} className="flex items-center cursor-pointer">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Enviar Convite
                    </DropdownMenuItem>
                    {/* Meu Perfil (Usuário) */}
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Meu Perfil (Usuário)
                      </Link>
                    </DropdownMenuItem>
                    {/* Profissional */}
                    <DropdownMenuItem asChild>
                      <Link to="/profile/professional" className="flex items-center">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Profissional
                      </Link>
                    </DropdownMenuItem>
                    {/* Cadastrar Empresa */}
                    <DropdownMenuItem asChild>
                      <Link to="/company/register" className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Cadastrar Empresa
                      </Link>
                    </DropdownMenuItem>
                    {/* Painel Admin */}
                    <DropdownMenuItem asChild>
                      <Link to="/company/my-company/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                    {/* Avaliações */}
                    <DropdownMenuItem asChild>
                      <Link to="/reviews" className="flex items-center">
                        <Star className="mr-2 h-4 w-4" />
                        Avaliações
                      </Link>
                    </DropdownMenuItem>
                    {/* Conquistas */}
                    <DropdownMenuItem asChild>
                      <Link to="/gamification" className="flex items-center">
                        <Award className="mr-2 h-4 w-4" />
                        Conquistas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
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
      {/* Invite Modal rendered outside header for correct overlay */}
      <InviteModal
        open={inviteModalOpen}
        onOpenChange={open => setInviteModalOpen(open)}
        inviteCode={inviteCode}
        loading={loadingInvite}
        onCopy={handleCopy}
        copied={copied}
        role={undefined}
      />
    </>
  );
}
