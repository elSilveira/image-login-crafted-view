
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Calendar } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price?: number;
  duration?: number;
  startTime?: string;
}

interface ServicesListProps {
  services: Service[] | { service: Service }[];
  compact?: boolean;
  showPrice?: boolean;
  showDuration?: boolean;
  showStartTime?: boolean;
  startTime?: string;
  className?: string;
}

const ServicesList = ({
  services,
  compact = false,
  showPrice = true,
  showDuration = false,
  showStartTime = false,
  startTime = "",
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
          <Badge key={service.id} variant="outline" className="bg-muted/50">
            {service.name}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <ScrollArea className={normalizedServices.length > 3 ? "h-[120px]" : "h-auto"}>
        <div className="space-y-3">
          {normalizedServices.map((service) => (
            <div 
              key={service.id} 
              className="flex justify-between text-sm py-2 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium">{service.name}</span>
              <div className="flex space-x-4">
                {(showStartTime || showDuration) && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    {showDuration && service.duration && (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        <span>{service.duration} min</span>
                      </div>
                    )}
                    
                    {showStartTime && (service.startTime || startTime) && (
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        <span>{service.startTime || startTime}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {showPrice && service.price !== undefined && (
                  <span className="font-medium text-iazi-primary">
                    R$ {service.price}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      {normalizedServices.length > 1 && showPrice && (
        <div className="flex justify-between pt-3 mt-3 border-t text-sm font-medium">
          <span>Total:</span>
          <span className="text-iazi-primary">
            R$ {normalizedServices.reduce((sum, service) => sum + (service?.price || 0), 0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
