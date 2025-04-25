
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { settingsNavigation } from "./navigation";
import { SettingsMenuItem } from "./SettingsMenuItem";

export const SettingsSidebar = () => {
  const navigate = useNavigate();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavigation.map((item) => (
                <SettingsMenuItem
                  key={item.name}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  onClick={navigate}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
