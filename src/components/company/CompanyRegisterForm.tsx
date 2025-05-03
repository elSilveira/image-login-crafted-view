"use client"; // Add this directive for client-side hooks

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query"; 
import { Card } from "@/components/ui/card";
import { StepBasicInfo } from "./registration/StepBasicInfo";
import { StepLocationContact } from "./registration/StepLocationContact";
import { StepServices } from "./registration/StepServices";
import { StepSettings } from "./registration/StepSettings";
import { RegistrationProgress } from "./registration/RegistrationProgress";
import { useToast } from "@/components/ui/use-toast";
import { registerCompany } from "@/lib/api"; 
import { Loader2 } from "lucide-react"; 

// Define the service data structure with image_url
export interface ServiceData {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  image_url: string; // Changed from image to image_url
}

// Define the company data structure with image URLs
export interface CompanyFormData {
  // Basic Info
  logo_url: string; // Changed from logo
  cover_image_url: string; // Changed from coverImage
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
  
  // Services (using the updated ServiceData interface)
  services: Array<ServiceData>;
  
  // Settings and Terms
  bookingSettings: {
    servicePadding: number; // minutes between appointments
    blockedHours: string[];
  };
  cancellationPolicy: string;
  paymentMethods: string[];
  termsAccepted: boolean;
}

// Initialize with default values using URL fields
const initialCompanyData: CompanyFormData = {
  logo_url: "", // Changed from logo
  cover_image_url: "", // Changed from coverImage
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

  // Mutation for registering company (remains the same, assuming API accepts URLs)
  const mutation = useMutation({
    mutationFn: registerCompany,
    onSuccess: (data) => {
      toast({
        title: "Registro finalizado",
        description: data.message || "Sua empresa foi cadastrada com sucesso!",
      });
      navigate("/company/my-company/dashboard"); 
    },
    onError: (error: any) => {
      toast({
        title: "Erro no Registro",
        description: error.response?.data?.message || "Não foi possível cadastrar a empresa. Tente novamente.",
        variant: "destructive",
      });
    },
  });
  
  // Handle next step (remains the same)
  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle previous step (remains the same)
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Update form data (remains the same)
  const updateFormData = (stepData: Partial<CompanyFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...stepData
    }));
  };
  
  // Handle form submission (remains the same)
  const handleSubmit = () => {
    if (!formData.termsAccepted) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos e condições para continuar.",
        variant: "destructive",
      });
      return;
    }
    // Ensure empty URLs are handled if needed by backend (e.g., send null or omit)
    const payload = { ...formData };
    if (payload.logo_url === "") payload.logo_url = undefined as any; // Or null
    if (payload.cover_image_url === "") payload.cover_image_url = undefined as any; // Or null
    payload.services = payload.services.map(service => ({
      ...service,
      image_url: service.image_url === "" ? undefined as any : service.image_url // Or null
    }));

    mutation.mutate(payload);
  };
  
  // Render current step (remains the same, subcomponents were updated)
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
          isSubmitting={mutation.isPending} 
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
      
      <Card className="p-6 shadow-lg relative"> 
        {mutation.isPending && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {renderStep()}
      </Card>
    </div>
  );
};

