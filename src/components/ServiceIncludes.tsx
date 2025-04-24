
import React from "react";
import { Check } from "lucide-react";

const ServiceIncludes = () => {
  // Mock data - In a real app, this would come from props or an API
  const includes = [
    "Consulta inicial para entender suas preferências",
    "Lavagem dos cabelos com produtos profissionais",
    "Corte personalizado",
    "Acabamento com navalha",
    "Finalização com produtos específicos",
  ];

  return (
    <div className="space-y-4">
      {includes.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <Check className="h-5 w-5 text-green-500 mt-0.5" />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
};

export default ServiceIncludes;
