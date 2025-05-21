import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PendingReviews from "@/components/reviews/PendingReviews";
import ReviewHistory from "@/components/reviews/ReviewHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "@/components/reviews/ReviewForm";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchProfessionalDetails, fetchProfessionalReviewsWithStats } from "@/lib/api";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfessionalReviewStats from "@/components/reviews/ProfessionalReviewStats";
import ProfessionalReviewsList from "@/components/reviews/ProfessionalReviewsList";

const ReviewsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const professionalId = searchParams.get("professionalId");
  const serviceId = searchParams.get("serviceId");
  const companyId = searchParams.get("companyId");
  const { toast } = useToast();
  
  // Estado para controlar se o modal de avaliação deve ser exibido
  const [showReviewForm, setShowReviewForm] = useState(false);
  // Referência para controlar se o componente está montado
  const isMounted = useRef(true);
  
  // Buscar detalhes do profissional se um professionalId foi fornecido
  const { 
    data: professional, 
    isLoading: isLoadingProfessional, 
    isError: isErrorProfessional, 
    error: professionalError 
  } = useQuery({
    queryKey: ["professionalDetails", professionalId],
    queryFn: () => fetchProfessionalDetails(professionalId!),
    enabled: !!professionalId,
    retry: 3, // Limitar o número de tentativas para 3
    retryDelay: 1000, // Atraso entre tentativas (1 segundo)
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Buscar reviews específicas do profissional, incluindo estatísticas
  const {
    data: professionalReviews,
    isLoading: isLoadingReviews,
    isError: isErrorReviews,
    error: reviewsError
  } = useQuery({
    queryKey: ["professionalReviewsWithStats", professionalId],
    queryFn: () => fetchProfessionalReviewsWithStats(professionalId!),
    enabled: !!professionalId && !isErrorProfessional && !isLoadingProfessional,
    retry: 3,
    retryDelay: 2000,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  
  // Configurar limpeza quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Mostrar o formulário de avaliação automaticamente se um profesional ID foi fornecido via URL
  useEffect(() => {
    if (professionalId && isMounted.current) {
      setShowReviewForm(true);
    }
  }, [professionalId]);
  
  const handleReviewSuccess = () => {
    toast({
      title: "Avaliação enviada com sucesso",
      description: "Obrigado por compartilhar sua experiência!"
    });
    setShowReviewForm(false);
  };

  // Mostrar mensagem de erro quando a API está indisponível
  if ((isErrorProfessional || isErrorReviews) && professionalId) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="p-6 flex flex-col items-center text-center text-destructive">
              <AlertCircle className="h-10 w-10 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erro de Conexão</h2>
              <p className="text-sm mb-4">
                Não foi possível carregar os dados. Verifique sua conexão com a internet.
              </p>
              {(professionalError || reviewsError) && <p className="text-xs mb-4">Detalhes: {(professionalError || reviewsError) instanceof Error ? (professionalError || reviewsError).message : String(professionalError || reviewsError)}</p>}
              <Button variant="outline" onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Estado de carregamento
  const isLoading = isLoadingProfessional || isLoadingReviews;
  if (isLoading && professionalId) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-iazi-primary" />
            <span className="ml-3 text-iazi-primary font-medium">Carregando...</span>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 w-full">
          <h1 className="text-2xl font-semibold">Avaliações</h1>
          
          {/* Exibir card para avaliar profissional específico se fornecido via URL */}
          {professionalId && professional && (
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-lg font-medium">Avaliar {professional.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {professional.title || "Profissional"}
                  </p>
                </div>
                
                {showReviewForm ? (
                  <ReviewForm
                    professionalId={professionalId}
                    serviceId={serviceId || undefined}
                    onClose={() => setShowReviewForm(false)}
                    onSuccess={handleReviewSuccess}
                  />
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Obrigado por sua avaliação!
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowReviewForm(true)}
                      className="text-iazi-primary"
                    >
                      Adicionar outra avaliação
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Se temos um ID específico, mostrar avaliações daquele profissional */}
          {professionalId && professionalReviews && !showReviewForm && (
            <div className="space-y-6">
              <h2 className="text-xl font-medium">Avaliações de {professional?.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <ProfessionalReviewStats 
                    professionalId={professionalId}
                    useDetailedEndpoint={true}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <ProfessionalReviewsList 
                    professionalId={professionalId}
                    useDetailedEndpoint={true}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Voltar
                </Button>
              </div>
            </div>
          )}
          
          {/* Mostrar seção de avaliações do usuário somente quando não estamos visualizando um profissional específico */}
          {!professionalId && (
            <div className="space-y-6">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                  <PendingReviews />
                </TabsContent>
                <TabsContent value="history">
                  <ReviewHistory />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;
