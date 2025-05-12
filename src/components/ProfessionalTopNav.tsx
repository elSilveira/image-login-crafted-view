import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Briefcase, Calendar, ClipboardList, FileText, Settings, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

const professionalMenu = [
  { title: "Perfil", icon: User, path: "/profile/professional" },
  { title: "Serviços", icon: Briefcase, path: "/profile/professional/services" },
  { title: "Dashboard", icon: BarChart3, path: "/profile/professional/dashboard" },
  { title: "Agendamentos", icon: Calendar, path: "/profile/professional/bookings" },
  { title: "Avaliações", icon: Star, path: "/profile/professional/reviews" },
  { title: "Relatórios", icon: FileText, path: "/profile/professional/reports" },
  { title: "Configurações", icon: Settings, path: "/profile/professional/settings" },
];

export const ProfessionalTopNav: React.FC = () => {
  const location = useLocation();

  return (
    <div className="fixed top-14 left-0 right-0 h-[50px] bg-background border-b z-40 shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center h-[50px] overflow-x-auto px-4 no-scrollbar">
          {professionalMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors hover:bg-accent/50 whitespace-nowrap",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTopNav;
