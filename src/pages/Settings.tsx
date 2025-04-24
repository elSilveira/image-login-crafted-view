
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
        <div className="min-h-screen flex w-full">
          <div className="flex flex-col md:flex-row w-full gap-6 container mx-auto px-4 py-8 mt-16">
            <div className="w-full md:w-64 shrink-0">
              <SettingsSidebar />
            </div>
            <div className="flex-1 min-w-0">
              <SettingsContent />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
};

export default Settings;
