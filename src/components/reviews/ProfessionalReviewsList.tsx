import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Star, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const renderStars = (rating: number) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Arredonda para o 0.5 mais próximo
  
  for (let i = 1; i <= 5; i++) {
    let starClass = "text-gray-300";
    if (i <= roundedRating) {
      starClass = "text-yellow-500 fill-yellow-500";
    } else if (i - 0.5 === roundedRating) {
      starClass = "text-yellow-500 fill-yellow-500"; // Simplificação
    }
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${starClass}`}
      />
    );
  }
  return stars;
};

interface ProfessionalReviewsListProps {
  professionalId: string;
  limit?: number;
  showSeeAllButton?: boolean;
  onSeeAllClick?: () => void;
}

const ProfessionalReviewsList: React.FC<ProfessionalReviewsListProps> = ({
  professionalId,
  limit = 5,
  showSeeAllButton = false,
  onSeeAllClick
}) => {
  const { data: reviews, isLoading, isError, error } = useQuery<Review[]>({
    queryKey: ["reviews", professionalId],
    queryFn: () => fetchReviews({ professionalId, limit }),
    enabled: !!professionalId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-iazi-primary" />
        <span className="ml-2 text-muted-foreground">Carregando avaliações...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="p-4 flex flex-col items-center text-center text-destructive">
          <AlertCircle className="h-6 w-6 mb-2" />
          <p className="text-sm">
            Erro ao carregar avaliações. {error instanceof Error ? error.message : "Tente novamente mais tarde."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma avaliação disponível.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-l-4 border-l-iazi-primary/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                {review.user.avatar ? (
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                ) : (
                  <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{review.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {format(new Date(review.updatedAt), "dd/MM/yyyy", { locale: pt })}
                  </span>
                </div>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {showSeeAllButton && reviews.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline"
            onClick={onSeeAllClick}
            className="text-iazi-primary border-iazi-primary/30 hover:bg-iazi-primary/10"
          >
            Ver todas as avaliações
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalReviewsList; 