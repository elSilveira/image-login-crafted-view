
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyCalendarContent } from "@/components/company/calendar/CompanyCalendarContent";
import Navigation from "@/components/Navigation";

const CompanyBooking = () => {
  const { companyId } = useParams<{ companyId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container max-w-7xl mx-auto py-8 px-4 pt-20">
        <CompanyCalendarContent />
      </div>
    </div>
  );
};

export default CompanyBooking;
