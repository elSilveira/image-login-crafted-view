import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews, fetchProfessionalReviewsWithStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2, AlertCircle } from "lucide-react";
import { Review, RatingDistribution } from "@/types/reviews.model";

interface ProfessionalReviewStatsProps {
  professionalId: string;
  useDetailedEndpoint?: boolean;
}

const ProfessionalReviewStats: React.FC<ProfessionalReviewStatsProps> = ({ 
  professionalId,
  useDetailedEndpoint = false
}) => {
  // Referência para controlar se o componente está montado
  const isMounted = useRef(true);

  // Buscar dados do profissional e suas avaliações com estatísticas se disponível
  const { data, isLoading, isError, error } = useQuery({
    queryKey: useDetailedEndpoint 
      ? ["professionalReviewsWithStats", professionalId] 
      : ["reviews", professionalId],
    queryFn: async () => {
      if (useDetailedEndpoint) {
        // Usar o endpoint que retorna tanto as reviews quanto as estatísticas
        return fetchProfessionalReviewsWithStats(professionalId);
      } else {
        // Usar o endpoint de reviews padrão
        const reviews = await fetchReviews({ professionalId });
        return { reviews };
      }
    },
    enabled: !!professionalId,
    // Evitar atualização infinita quando API estiver offline
    retry: 3,
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
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

  // Extrair as reviews da resposta
  const reviews = data?.reviews || [];
  
  // Se temos os dados completos do profissional, usar suas estatísticas diretamente
  const professional = data?.professional;
  const hasProfessionalStats = professional && 
                              (professional.rating !== undefined || professional.totalReviews !== undefined);

  // Se não temos reviews, mostrar mensagem de "nenhuma avaliação"
  if ((!reviews || reviews.length === 0) && !hasProfessionalStats) {
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
  // Usar os dados do próprio profissional se disponíveis, ou calcular a partir das reviews
  const totalReviews = hasProfessionalStats 
    ? professional.totalReviews 
    : reviews.length;
    
  const averageRating = hasProfessionalStats
    ? professional.rating
    : (totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0);
  
  // Distribuição das avaliações
  const ratingDistribution: RatingDistribution[] = [5, 4, 3, 2, 1].map(stars => ({
    stars: stars as 1 | 2 | 3 | 4 | 5,
    count: reviews.filter((review: Review) => Math.round(review.rating) === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter((review: Review) => Math.round(review.rating) === stars).length / totalReviews) * 100 : 0
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
          {ratingDistribution.map(({ stars, count, percentage }) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalReviewStats; 