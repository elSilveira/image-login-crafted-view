import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface ServicesListProps {
  services: Service[] | { service: Service }[];
  compact?: boolean;
  showPrice?: boolean;
  showDuration?: boolean;
  className?: string;
}

const ServicesList = ({
  services,
  compact = false,
  showPrice = true,
  showDuration = false,
  className = "",
}: ServicesListProps) => {
  // Normalize the services array - the API might return either plain services or {service: Service} objects
  const normalizedServices: Service[] = services.map((item: any) => {
    if (item.service) {
      return item.service;
    }
    return item;
  });

  if (!normalizedServices || normalizedServices.length === 0) {
    return <div className="text-muted-foreground text-sm">Nenhum serviço selecionado</div>;
  }

  if (compact) {
    return (
      <div className={`flex flex-wrap gap-1 ${className}`}>
        {normalizedServices.map((service) => (
          <Badge key={service.id} variant="outline">
            {service.name}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <ScrollArea className={normalizedServices.length > 3 ? "h-[120px]" : "h-auto"}>
        <div className="space-y-1">
          {normalizedServices.map((service) => (
            <div key={service.id} className="flex justify-between text-sm">
              <span>{service.name}</span>
              <div className="flex space-x-3">
                {showDuration && <span className="text-muted-foreground">{service.duration} min</span>}
                {showPrice && <span className="font-medium">R$ {service.price}</span>}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {normalizedServices.length > 1 && showPrice && (
        <div className="flex justify-between pt-2 mt-2 border-t text-sm font-medium">
          <span>Total:</span>
          <span>
            R$ {normalizedServices.reduce((sum, service) => sum + (service?.price || 0), 0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
