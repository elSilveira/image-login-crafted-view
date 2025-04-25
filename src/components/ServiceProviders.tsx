
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceProvidersProps {
  serviceId?: number;
  onProviderSelect?: (providerId: string) => void;
}

const ServiceProviders = ({ serviceId, onProviderSelect }: ServiceProvidersProps) => {
  // Mock data - In a real app, this would come from props or an API
  const providers = [
    {
      id: "1",
      name: "João Silva",
      avatar: "https://source.unsplash.com/random/100x100/?portrait",
      rating: 4.9,
      reviews: 124,
      price: 80,
      specialties: ["Corte Masculino", "Barba"],
      companyId: 1,
    },
    {
      id: "2",
      name: "Maria Santos",
      avatar: "https://source.unsplash.com/random/100x100/?woman",
      rating: 4.7,
      reviews: 98,
      price: 75,
      specialties: ["Coloração", "Corte Feminino"],
      companyId: 2,
    },
  ];

  const handleProviderClick = (providerId: string) => {
    if (onProviderSelect) {
      onProviderSelect(providerId);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <Card 
          key={provider.id} 
          className={`hover:shadow-md transition-shadow ${onProviderSelect ? "cursor-pointer" : ""}`}
          onClick={() => onProviderSelect && handleProviderClick(provider.id)}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback>{provider.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/professional/${provider.id}`}
                    className="font-semibold hover:text-iazi-primary"
                    onClick={(e) => onProviderSelect && e.preventDefault()}
                  >
                    {provider.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{provider.rating}</span>
                    <span>({provider.reviews} avaliações)</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {provider.specialties.join(" • ")}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="text-right">
                  <div className="font-semibold">R$ {provider.price}</div>
                  <div className="text-sm text-muted-foreground">por serviço</div>
                </div>
                {!onProviderSelect ? (
                  <Button asChild>
                    <Link to={`/company/${provider.companyId}/booking?provider=${provider.id}`}>
                      Agendar
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={() => handleProviderClick(provider.id)}>
                    Selecionar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceProviders;
