
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const RelatedServices = () => {
  // Mock data - In a real app, this would come from props or an API
  const relatedServices = [
    {
      id: "2",
      name: "Barba",
      image: "https://source.unsplash.com/random/100x100/?beard",
      price: 40,
    },
    {
      id: "3",
      name: "Coloração",
      image: "https://source.unsplash.com/random/100x100/?hair-color",
      price: 150,
    },
  ];

  return (
    <div className="space-y-4">
      {relatedServices.map((service) => (
        <Link key={service.id} to={`/service/${service.id}`}>
          <Card className="hover:bg-accent transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-muted-foreground">
                    A partir de R$ {service.price}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default RelatedServices;
