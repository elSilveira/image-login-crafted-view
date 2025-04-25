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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
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

export const CompanySidebar = () => {
  const location = useLocation();
  
  return (
    <Sidebar className="h-screen border-r">
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-xl font-bold text-center">iAzi Admin</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {companyMenu.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 flex justify-center">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
