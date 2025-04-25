
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  serviceName: string;
  customerName: string;
  date: string;
}

export const UserReviews = () => {
  // Mock data - in a real app this would come from the backend
  const reviews: Review[] = [
    {
      id: 1,
      rating: 5,
      comment: "Excelente profissional, super pontual e atencioso!",
      serviceName: "Corte de Cabelo",
      customerName: "João Silva",
      date: "2024-03-15",
    },
    {
      id: 2,
      rating: 4,
      comment: "Muito bom atendimento, recomendo!",
      serviceName: "Barba",
      customerName: "Maria Santos",
      date: "2024-03-10",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliações Recebidas</CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="mt-2 text-sm">{review.comment}</p>
                <div className="mt-2 text-sm text-muted-foreground">
                  <span>Serviço: {review.serviceName}</span>
                  <span className="mx-2">•</span>
                  <span>Cliente: {review.customerName}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Você ainda não recebeu nenhuma avaliação
          </div>
        )}
      </CardContent>
    </Card>
  );
};
