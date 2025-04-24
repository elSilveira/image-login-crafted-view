
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceProviders = () => {
  // Mock data - In a real app, this would come from props or an API
  const providers = [
    {
      id: "1",
      name: "João Silva",
      avatar: "https://source.unsplash.com/random/100x100/?portrait",
      rating: 4.9,
      reviews: 124,
      price: 80,
    },
    {
      id: "2",
      name: "Maria Santos",
      avatar: "https://source.unsplash.com/random/100x100/?woman",
      rating: 4.7,
      reviews: 98,
      price: 75,
    },
  ];

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <Card key={provider.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={provider.avatar} alt={provider.name} />
                  <AvatarFallback>{provider.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Link
                    to={`/professional/${provider.id}`}
                    className="font-semibold hover:text-primary"
                  >
                    {provider.name}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{provider.rating}</span>
                    <span>({provider.reviews} avaliações)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold">R$ {provider.price}</div>
                  <div className="text-sm text-muted-foreground">por serviço</div>
                </div>
                <Button>Agendar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceProviders;
