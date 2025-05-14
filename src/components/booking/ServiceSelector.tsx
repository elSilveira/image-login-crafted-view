import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Clock, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalServices } from "@/lib/api";

interface ServiceSelectorProps {
  professionalId: string;
  selectedServices: any[];
  onServiceSelect: (service: any, isSelected: boolean) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  professionalId, 
  selectedServices, 
  onServiceSelect 
}) => {
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ["professionalServices", professionalId],
    queryFn: () => fetchProfessionalServices(professionalId),
    enabled: !!professionalId,
  });

  // Helper to check if a service is selected
  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(service => service.id === serviceId);
  };

  if (isLoading) {
    return <div className="py-8 text-center">Carregando serviços...</div>;
  }

  if (isError) {
    return <div className="py-8 text-center text-red-500">Erro ao carregar serviços</div>;
  }

  if (!services || services.length === 0) {
    return <div className="py-8 text-center">Nenhum serviço disponível</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Selecione os serviços</h3>
        <p className="text-muted-foreground mb-4">
          Você pode selecionar vários serviços para seu agendamento
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service: any) => (
          <Card 
            key={service.id}
            className={`cursor-pointer transition-all ${
              isServiceSelected(service.id) ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onServiceSelect(service, !isServiceSelected(service.id))}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-md">{service.name}</CardTitle>
                <Checkbox 
                  checked={isServiceSelected(service.id)}
                  onCheckedChange={(checked) => {
                    onServiceSelect(service, !!checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{service.duration} min</span>
                </div>
                <div className="font-medium">R$ {service.price}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;
