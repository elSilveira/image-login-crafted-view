
import { useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SettingsMenuItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  onClick: (href: string) => void;
}

export const SettingsMenuItem = ({ name, href, icon: Icon, onClick }: SettingsMenuItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => onClick(href)}
        tooltip={name}
      >
        <Icon className="h-4 w-4" />
        <span>{name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
