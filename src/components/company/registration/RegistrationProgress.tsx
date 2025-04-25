
import React from "react";
import { cn } from "@/lib/utils";

interface RegistrationProgressProps {
  currentStep: number;
}

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: "Informações Básicas" },
    { number: 2, title: "Localização e Contato" },
    { number: 3, title: "Serviços Oferecidos" },
    { number: 4, title: "Configurações e Termos" },
  ];

  return (
    <div className="pb-8">
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div 
              className={cn(
                "rounded-full w-10 h-10 flex items-center justify-center text-white font-bold mb-2",
                currentStep >= step.number 
                  ? "bg-iazi-primary" 
                  : "bg-gray-300"
              )}
            >
              {step.number}
            </div>
            <div className="text-sm text-center">{step.title}</div>
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "absolute h-1 w-[calc(25%-2.5rem)]", 
                  currentStep > step.number ? "bg-iazi-primary" : "bg-gray-300"
                )}
                style={{ left: `calc(${12.5 + index * 25}% - 1px)` }}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">
            Etapa {currentStep} de {steps.length}
          </span>
          <span>{steps[currentStep - 1].title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-iazi-primary h-2 rounded-full" 
            style={{ width: `${(currentStep / steps.length) * 100}%` }} 
          />
        </div>
      </div>
    </div>
  );
};
