
import React from "react";
import Navigation from "@/components/Navigation";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { SidebarProvider } from "@/components/ui/sidebar";

const Settings = () => {
  return (
    <>
      <Navigation />
      <SidebarProvider>
        <div className="container-padding flex min-h-screen w-full flex-col md:flex-row gap-6">
          <SettingsSidebar />
          <div className="flex-1">
            <SettingsContent />
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Settings;
