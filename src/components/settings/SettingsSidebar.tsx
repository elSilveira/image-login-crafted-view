
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  User, Shield, Bell, CreditCard, Globe, 
  Palette, Accessibility, FileText 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const settingsNavigation = [
  { name: "Conta", href: "/settings/account", icon: User },
  { name: "Privacidade", href: "/settings/privacy", icon: Shield },
  { name: "Notificações", href: "/settings/notifications", icon: Bell },
  { name: "Pagamentos", href: "/settings/payments", icon: CreditCard },
  { name: "Idioma e Região", href: "/settings/locale", icon: Globe },
  { name: "Aparência", href: "/settings/appearance", icon: Palette },
  { name: "Acessibilidade", href: "/settings/accessibility", icon: Accessibility },
  { name: "Exportar Dados", href: "/settings/export", icon: FileText },
];

export const SettingsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 shrink-0">
      <nav className="space-y-2">
        {settingsNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                isActive && "bg-iazi-primary text-white hover:bg-iazi-primary-hover"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
};
