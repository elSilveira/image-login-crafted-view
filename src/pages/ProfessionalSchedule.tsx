
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import ProfessionalCalendarContent from "@/components/professional/ProfessionalCalendarContent";
import { ProfessionalBookingsView } from "@/components/professional/ProfessionalBookingsView";

const ProfessionalSchedule = () => {
  const [activeView, setActiveView] = useState<"calendar" | "list">("calendar");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  // On desktop, we'll show both views side by side
  if (isDesktop) {
    return (
      <div className="space-y-6 w-full">
        <h1 className="text-2xl font-semibold">Minha Agenda</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar takes 2/3 of the space */}
          <div className="lg:col-span-2">
            <ProfessionalCalendarContent />
          </div>
          
          {/* Bookings list takes 1/3 of the space */}
          <div className="lg:col-span-1">
            <ProfessionalBookingsView />
          </div>
        </div>
      </div>
    );
  }
  
  // On mobile, we'll show tabs to switch between views
  return (
    <div className="space-y-6 w-full">
      <h1 className="text-2xl font-semibold">Minha Agenda</h1>
      
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "calendar" | "list")}>
        <TabsList className="grid grid-cols-2 w-full mb-6">
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="list">Agendamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="mt-0">
          <ProfessionalCalendarContent />
        </TabsContent>
        
        <TabsContent value="list" className="mt-0">
          <ProfessionalBookingsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalSchedule;
