
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Building,
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const companyMenu = [
  {
    title: "Dashboard",
    icon: BarChart3,
    path: "/company/my-company/dashboard",
  },
  {
    title: "Perfil da Empresa",
    icon: Building,
    path: "/company/my-company/profile",
  },
  {
    title: "Serviços",
    icon: ClipboardList,
    path: "/company/my-company/services",
  },
  {
    title: "Funcionários",
    icon: Users,
    path: "/company/my-company/staff",
  },
  {
    title: "Agendamentos",
    icon: Calendar,
    path: "/company/my-company/calendar",
  },
  {
    title: "Avaliações",
    icon: Star,
    path: "/company/my-company/reviews",
  },
  {
    title: "Relatórios",
    icon: FileText,
    path: "/company/my-company/reports",
  },
  {
    title: "Configurações",
    icon: Settings,
    path: "/company/my-company/settings",
  },
];

export const CompanyTopNav = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed top-14 left-0 right-0 h-[50px] bg-background border-b z-40">
      <div className="max-w-screen-2xl mx-auto px-4">
        <ul className="flex items-center h-[50px] gap-1 overflow-x-auto no-scrollbar">
          {companyMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
