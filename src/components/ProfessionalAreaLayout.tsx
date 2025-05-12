import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProfessionalTopNav from "@/components/ProfessionalTopNav";

const ProfessionalAreaLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <Navigation />
      <ProfessionalTopNav />
      <div className="flex-1 pt-[104px]">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="w-full max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalAreaLayout;
