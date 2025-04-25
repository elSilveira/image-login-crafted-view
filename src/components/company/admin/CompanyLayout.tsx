
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
        <CompanySidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
