
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CompanySidebar } from "@/components/company/admin/CompanySidebar";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <div className="fixed z-30 h-full">
          <CompanySidebar />
        </div>
        <div className="flex-1 pl-[4rem] sm:pl-[16rem]">
          <main className="p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
