import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2, AlertCircle } from "lucide-react";

interface ProfessionalReviewStatsProps {
  professionalId: string;
}

const ProfessionalReviewStats: React.FC<ProfessionalReviewStatsProps> = ({ professionalId }) => {
  const { data: reviews, isLoading, isError, error } = useQuery({
    queryKey: ["reviews", professionalId],
    queryFn: () => fetchReviews({ professionalId }),
    enabled: !!professionalId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin text-iazi-primary" />
          <span className="ml-2 text-muted-foreground">Carregando estatísticas...</span>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="p-6 flex flex-col items-center text-center text-destructive">
          <AlertCircle className="h-6 w-6 mb-2" />
          <p className="text-sm">
            Erro ao carregar estatísticas. {error instanceof Error ? error.message : "Tente novamente mais tarde."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">Estatísticas</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Nenhuma avaliação disponível.</p>
        </CardContent>
      </Card>
    );
  }

  // Calcular estatísticas
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;
  
  // Distribuição das avaliações
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(review => Math.round(review.rating) === stars).length
  }));
  
  const maxCount = Math.max(...ratingDistribution.map(r => r.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-medium">Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold mb-2 text-iazi-primary">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < Math.floor(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : index < averageRating
                    ? "fill-yellow-400/50 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {totalReviews} avaliações
          </p>
        </div>
        
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count }) => {
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2">
                <div className="flex w-20 justify-end">
                  <span className="text-sm">{stars} {stars === 1 ? 'estrela' : 'estrelas'}</span>
                </div>
                <div className="flex-grow h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-14 text-sm text-gray-500">
                  {count} ({percentage.toFixed(0)}%)
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalReviewStats; 