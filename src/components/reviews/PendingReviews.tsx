
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";
import ReviewForm from "./ReviewForm";

const PendingReviews = () => {
  // Mock data - in a real app this would come from an API
  const pendingServices = [
    {
      id: 1,
      service: "Corte de Cabelo Masculino",
      professional: "João Silva",
      date: "2025-03-25",
      time: "14:00",
      price: 80,
    },
    {
      id: 2,
      service: "Barba",
      professional: "João Silva",
      date: "2025-03-20",
      time: "15:30",
      price: 40,
    },
  ];

  return (
    <div className="space-y-4">
      {pendingServices.map((service) => (
        <Card key={service.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-medium text-lg mb-2 font-playfair text-iazi-text">{service.service}</h3>
                <p className="text-muted-foreground font-inter mb-2">com {service.professional}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-inter">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(service.date).toLocaleDateString('pt-BR', { 
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto font-inter"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Avaliar Serviço
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {pendingServices.length === 0 && (
        <div className="text-center py-8 text-muted-foreground font-inter">
          Não há serviços pendentes de avaliação
        </div>
      )}
    </div>
  );
};

export default PendingReviews;
