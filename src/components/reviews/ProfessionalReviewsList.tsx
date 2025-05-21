import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews, fetchProfessionalReviewsWithStats } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, Star, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Review } from "@/types/reviews.model";

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
  useDetailedEndpoint?: boolean;
}

const ProfessionalReviewsList: React.FC<ProfessionalReviewsListProps> = ({
  professionalId,
  limit = 5,
  showSeeAllButton = false,
  onSeeAllClick,
  useDetailedEndpoint = false
}) => {
  // Referência para controlar se o componente está montado
  const isMounted = useRef(true);

  // Usar o endpoint adequado com base na prop useDetailedEndpoint
  const { data, isLoading, isError, error } = useQuery({
    queryKey: useDetailedEndpoint 
      ? ["professionalReviewsWithStats", professionalId] 
      : ["reviews", professionalId],
    queryFn: async () => {
      if (useDetailedEndpoint) {
        // Usar o endpoint que retorna tanto as reviews quanto as estatísticas
        const result = await fetchProfessionalReviewsWithStats(professionalId);
        return result.reviews || [];
      } else {
        // Usar o endpoint de reviews padrão com limite
        return fetchReviews({ professionalId, limit });
      }
    },
    enabled: !!professionalId,
    // Evitar atualização infinita quando API estiver offline
    retry: 3,
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });

  // Extrair as reviews da resposta e aplicar o limite se necessário
  const reviews = React.useMemo(() => {
    if (!data) return [];
    
    // Se já tivermos os dados no formato correto, usar diretamente
    const reviewsArray = Array.isArray(data) ? data : [];
    
    // Aplicar o limite se necessário
    return limit > 0 ? reviewsArray.slice(0, limit) : reviewsArray;
  }, [data, limit]);

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
      {reviews.map((review: Review) => (
        <Card key={review.id} className="border-l-4 border-l-iazi-primary/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                {review.user?.avatar ? (
                  <AvatarImage src={review.user.avatar} alt={review.user.name} />
                ) : (
                  <AvatarFallback>{review.user?.name.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{review.user?.name || "Usuário"}</span>
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