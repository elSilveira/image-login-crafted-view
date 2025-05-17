
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from "@/components/Navigation";
import { CompanyTopNav } from "./CompanyTopNav";
import { PageContainer } from "@/components/ui/page-container";

interface CompanyLayoutProps {
  children: React.ReactNode;
}

export const CompanyLayout: React.FC<CompanyLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Navigation />
        <CompanyTopNav />
        <div className="flex-1 pt-16">
          <main className="p-4 md:p-6 lg:p-8">
            <PageContainer>
              {children}
            </PageContainer>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
