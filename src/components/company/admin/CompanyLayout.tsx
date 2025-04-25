
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import { CompanyTopNav } from "./CompanyTopNav";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Navigation />
        <CompanyTopNav />
        <div className="flex-1 pt-[104px]">
          <main className="p-4 md:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
