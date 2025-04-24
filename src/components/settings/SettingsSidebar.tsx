
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  User, Shield, Bell, CreditCard, 
  Globe, Settings as SettingsIcon, Accessibility, FileText 
} from "lucide-react";

const settingsNavigation = [
  { name: "Conta", href: "/settings/account", icon: User },
  { name: "Privacidade", href: "/settings/privacy", icon: Shield },
  { name: "Notificações", href: "/settings/notifications", icon: Bell },
  { name: "Pagamentos", href: "/settings/payments", icon: CreditCard },
  { name: "Idioma e Região", href: "/settings/locale", icon: Globe },
  { name: "Aparência", href: "/settings/appearance", icon: SettingsIcon },
  { name: "Acessibilidade", href: "/settings/accessibility", icon: Accessibility },
  { name: "Exportar Dados", href: "/settings/export", icon: FileText },
];

export const SettingsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.href}
                    onClick={() => navigate(item.href)}
                    tooltip={item.name}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
