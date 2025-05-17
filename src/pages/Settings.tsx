
import React from "react";
import Navigation from "@/components/Navigation";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsContent } from "@/components/settings/SettingsContent";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react"; 
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const isMobile = useIsMobile();

  return (
    <>
      <Navigation />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <div className="flex flex-col md:flex-row w-full gap-6 container mx-auto px-4 py-8 mt-6">
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="mb-4 w-full md:hidden">
                    <Menu className="h-4 w-4 mr-2" />
                    Menu de Configurações
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[340px] pt-16">
                  <SettingsSidebar />
                </SheetContent>
              </Sheet>
            ) : (
              <div className="w-full md:w-64 shrink-0">
                <SettingsSidebar />
              </div>
            )}
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
