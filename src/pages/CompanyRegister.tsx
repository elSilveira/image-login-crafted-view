
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { CompanyRegisterForm } from "@/components/company/CompanyRegisterForm";

const CompanyRegister = () => {
  return (
    <div className="min-h-screen bg-[#F4F3F2]">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CompanyRegisterForm />
        </div>
      </div>
    </div>
  );
};

export default CompanyRegister;
