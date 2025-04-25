
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CompanySidebar } from "@/components/company/admin/CompanySidebar";
import Navigation from "@/components/Navigation";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Navigation />
        <CompanySidebar />
        <div className="flex-1 pl-0 md:pl-[16rem] pt-14">
          <main className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
