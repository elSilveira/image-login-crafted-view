
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { StepBasicInfo } from "./registration/StepBasicInfo";
import { StepLocationContact } from "./registration/StepLocationContact";
import { StepServices } from "./registration/StepServices";
import { StepSettings } from "./registration/StepSettings";
import { RegistrationProgress } from "./registration/RegistrationProgress";
import { useToast } from "@/components/ui/use-toast";

// Define the company data structure
export interface CompanyFormData {
  // Basic Info
  logo: string;
  coverImage: string;
  name: string;
  cnpj: string;
  mainCategory: string;
  subCategories: string[];
  description: string;
  foundingYear: string;
  
  // Location and Contact
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  phone: string;
  email: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  workingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  
  // Services
  services: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number; // in minutes
    image: string;
  }>;
  
  // Settings and Terms
  bookingSettings: {
    servicePadding: number; // minutes between appointments
    blockedHours: string[];
  };
  cancellationPolicy: string;
  paymentMethods: string[];
  termsAccepted: boolean;
}

// Initialize with default values
const initialCompanyData: CompanyFormData = {
  logo: "",
  coverImage: "",
  name: "",
  cnpj: "",
  mainCategory: "",
  subCategories: [],
  description: "",
  foundingYear: "",
  
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  location: {
    lat: -23.5505,
    lng: -46.6333,
  },
  phone: "",
  email: "",
  website: "",
  socialMedia: {
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  },
  workingHours: {
    monday: { open: "09:00", close: "18:00", isOpen: true },
    tuesday: { open: "09:00", close: "18:00", isOpen: true },
    wednesday: { open: "09:00", close: "18:00", isOpen: true },
    thursday: { open: "09:00", close: "18:00", isOpen: true },
    friday: { open: "09:00", close: "18:00", isOpen: true },
    saturday: { open: "09:00", close: "13:00", isOpen: true },
    sunday: { open: "09:00", close: "13:00", isOpen: false },
  },
  
  services: [],
  
  bookingSettings: {
    servicePadding: 15,
    blockedHours: [],
  },
  cancellationPolicy: "",
  paymentMethods: [],
  termsAccepted: false,
};

export const CompanyRegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CompanyFormData>(initialCompanyData);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Update form data
  const updateFormData = (stepData: Partial<CompanyFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Here would be API call to save company data
    console.log("Company registration data:", formData);
    
    toast({
      title: "Registro finalizado",
      description: "Sua empresa foi cadastrada com sucesso!",
    });
    
    // Redirect to company profile page after successful registration
    navigate("/profile");
  };
  
  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNextStep} 
        />;
      case 2:
        return <StepLocationContact 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNextStep} 
          onPrev={handlePrevStep} 
        />;
      case 3:
        return <StepServices 
          formData={formData} 
          updateFormData={updateFormData} 
          onNext={handleNextStep} 
          onPrev={handlePrevStep} 
        />;
      case 4:
        return <StepSettings 
          formData={formData} 
          updateFormData={updateFormData} 
          onSubmit={handleSubmit} 
          onPrev={handlePrevStep} 
        />;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro de Empresa</h1>
        <p className="mt-2 text-gray-600">Preencha as informações da sua empresa para começar a oferecer serviços</p>
      </div>
      
      <RegistrationProgress currentStep={currentStep} />
      
      <Card className="p-6 shadow-lg">
        {renderStep()}
      </Card>
    </div>
  );
};
