import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchReviews } from "@/lib/api";
import { format } from "date-fns";
import { pt } from 'date-fns/locale';

const ReviewHistory = () => {
  const { user } = useAuth();
  // Referência para controlar se o componente está montado
  const isMounted = useRef(true);

  // Buscar avaliações feitas pelo usuário
  const { data: reviews, isLoading, isError, error } = useQuery({
    queryKey: ["userReviews"],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Buscar todas as avaliações feitas pelo usuário
      // Como a API não tem endpoint específico para isso, 
      // vamos filtrar pelo userId na resposta
      try {
        // Primeiro buscar avaliações para profissionais (o mais comum)
        const reviews = await fetchReviews({ 
          userId: user.id,
          sort: "updatedAt_desc", // Mais recentes primeiro
          limit: 20,
          include: "professional,service" // Incluir dados relacionados
        });
        
        return Array.isArray(reviews) ? reviews : [];
      } catch (error) {
        console.error("Erro ao buscar histórico de avaliações:", error);
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: 3, // Limitar o número de tentativas
    retryDelay: 2000, // Atraso entre tentativas (2 segundos)
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-iazi-primary" />
        <span className="ml-2 text-muted-foreground">Carregando seu histórico de avaliações...</span>
      </div>
    );
  }

  // Estado de erro
  if (isError) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="p-4 flex flex-col items-center text-center text-destructive">
          <AlertCircle className="h-6 w-6 mb-2" />
          <p className="text-sm">
            Erro ao carregar histórico de avaliações. {error instanceof Error ? error.message : "Tente novamente mais tarde."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Se não houver avaliações
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Você ainda não fez nenhuma avaliação
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: any) => {
        const serviceName = review.service?.name || "Serviço";
        const professionalName = review.professional?.name || "Profissional";
        const reviewDate = new Date(review.updatedAt || review.createdAt);
        
        return (
          <Card key={review.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2 font-playfair text-iazi-text">{serviceName}</h3>
                    <p className="text-muted-foreground font-inter mb-2">com {professionalName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-inter">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(reviewDate, "PPP", { locale: pt })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star 
                        key={index} 
                        className={`h-5 w-5 ${
                          index < review.rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "fill-gray-200 text-gray-200"
                        }`} 
                      />
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-iazi-text font-inter">{review.comment}</p>
                  </div>
                )}

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
        );
      })}
    </div>
  );
};

export default ReviewHistory;
