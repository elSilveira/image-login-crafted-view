
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, MessageSquare } from "lucide-react";

const ReviewHistory = () => {
  // Mock data - in a real app this would come from an API
  const reviews = [
    {
      id: 1,
      service: "Coloração",
      professional: "Maria Santos",
      date: "2025-03-15",
      rating: 5,
      comment: "Excelente trabalho! A cor ficou exatamente como eu queria.",
      professionalResponse: "Obrigada pelo feedback! Foi um prazer atender você.",
      images: [],
    },
    {
      id: 2,
      service: "Manicure",
      professional: "Ana Oliveira",
      date: "2025-03-10",
      rating: 4,
      comment: "Muito bom atendimento, pontual e profissional.",
      professionalResponse: null,
      images: [],
    },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2 font-playfair text-iazi-text">{review.service}</h3>
                  <p className="text-muted-foreground font-inter mb-2">com {review.professional}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-inter">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(review.date).toLocaleDateString('pt-BR', { 
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-iazi-text font-inter">{review.comment}</p>
              </div>

              {review.professionalResponse && (
                <div className="bg-iazi-background-alt p-4 rounded-lg border border-iazi-border">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-5 w-5 text-iazi-primary mt-1" />
                    <div>
                      <p className="font-medium text-sm mb-1 font-inter">Resposta do profissional:</p>
                      <p className="text-muted-foreground font-inter">{review.professionalResponse}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {reviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground font-inter">
          Você ainda não fez nenhuma avaliação
        </div>
      )}
    </div>
  );
};

export default ReviewHistory;
