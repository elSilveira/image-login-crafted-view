
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProfessionalTopNav from "@/components/ProfessionalTopNav";
import ProfessionalSchedule from "@/pages/ProfessionalSchedule";

const ProfessionalAreaLayout: React.FC = () => {
  const location = useLocation();
  
  // Redirect calendar and bookings pages to the unified schedule view
  if (location.pathname === "/profile/professional/calendar" || 
      location.pathname === "/profile/professional/bookings") {
    return <Navigate to="/profile/professional/schedule" replace />;
  }
  
  // For the unified schedule view, render the ProfessionalSchedule component directly
  if (location.pathname === "/profile/professional/schedule") {
    return (
      <div className="min-h-screen flex flex-col w-full bg-background">
        <Navigation />
        <ProfessionalTopNav />
        <div className="flex-1 pt-[104px]">
          <main className="p-4 md:p-6 lg:p-8">
            <div className="w-full max-w-5xl mx-auto">
              <ProfessionalSchedule />
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // For all other routes, use the Outlet
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
