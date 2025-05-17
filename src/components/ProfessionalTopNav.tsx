
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Briefcase, Calendar, ClipboardList, FileText, Settings, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const professionalMenu = [
  { title: "Perfil", icon: User, path: "/profile/professional", alwaysEnabled: true },
  { title: "Serviços", icon: Briefcase, path: "/profile/professional/services", alwaysEnabled: false },
  { title: "Dashboard", icon: BarChart3, path: "/profile/professional/dashboard", alwaysEnabled: false },
  { title: "Agenda", icon: Calendar, path: "/profile/professional/schedule", alwaysEnabled: false }, // Updated path to unified view
  { title: "Avaliações", icon: Star, path: "/profile/professional/reviews", alwaysEnabled: false },
  { title: "Relatórios", icon: FileText, path: "/profile/professional/reports", alwaysEnabled: false },
  { title: "Configurações", icon: Settings, path: "/profile/professional/settings", alwaysEnabled: false },
];

export const ProfessionalTopNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  // Check if the user is a professional
  const isProfessional = user?.isProfessional === true;

  return (
    <div className="fixed top-14 left-0 right-0 h-[50px] bg-background border-b z-40 shadow-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center h-[50px] overflow-x-auto px-4 no-scrollbar">
          {professionalMenu.map((item) => {
            // Determine if this menu item should be disabled
            const isDisabled = !isProfessional && !item.alwaysEnabled;
            
            return (
              <Link
                key={item.path}
                to={isDisabled ? '#' : item.path}
                onClick={(e) => isDisabled && e.preventDefault()}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 mx-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTopNav;
