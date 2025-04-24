
import { 
  User, Shield, Bell, CreditCard, 
  Globe, Settings as SettingsIcon, Accessibility, FileText 
} from "lucide-react";

export const settingsNavigation = [
  { name: "Conta", href: "/settings/account", icon: User },
  { name: "Privacidade", href: "/settings/privacy", icon: Shield },
  { name: "Notificações", href: "/settings/notifications", icon: Bell },
  { name: "Pagamentos", href: "/settings/payments", icon: CreditCard },
  { name: "Idioma e Região", href: "/settings/locale", icon: Globe },
  { name: "Aparência", href: "/settings/appearance", icon: SettingsIcon },
  { name: "Acessibilidade", href: "/settings/accessibility", icon: Accessibility },
  { name: "Exportar Dados", href: "/settings/export", icon: FileText },
];
