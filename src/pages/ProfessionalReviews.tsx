import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star, Filter, LayoutList, LayoutGrid } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchReviews } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Review, Rating, ReviewStats } from "@/types/reviews";

// Componente container da página para uso consistente com outros componentes
const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container px-4 py-8 mx-auto max-w-7xl">
      {children}
    </div>
  );
};

const ProfessionalReviews = () => {
  const { user } = useAuth();
  const professionalId = user?.professionalId;
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Buscar avaliações do profissional
  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["professionalReviews", professionalId, timeFilter, ratingFilter, sortBy],
    queryFn: async () => {
      if (!professionalId) return { reviews: [], stats: calculateEmptyStats() };

      const params: Record<string, any> = {
        professionalId,
      };

      // Adicionar filtros de tempo se não for "all"
      if (timeFilter === "lastMonth") {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        params.startDate = lastMonth.toISOString().split('T')[0]; // Formato YYYY-MM-DD conforme documentação
      } else if (timeFilter === "lastThreeMonths") {
        const lastThreeMonths = new Date();
        lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);
        params.startDate = lastThreeMonths.toISOString().split('T')[0]; // Formato YYYY-MM-DD
      }

      // Adicionar filtro de avaliação se não for "all"
      if (ratingFilter !== "all" && !isNaN(parseInt(ratingFilter))) {
        const ratingValue = parseInt(ratingFilter);
        // Verificar se está entre 1 e 5 conforme documentação
        if (ratingValue >= 1 && ratingValue <= 5) {
          params.rating = ratingValue;
        }
      }

      // Adicionar ordenação conforme documentação
      if (sortBy === "recent") {
        params.sort = "updatedAt_desc"; // Usar updatedAt conforme documentação
      } else if (sortBy === "oldest") {
        params.sort = "updatedAt_asc";
      } else if (sortBy === "highRating") {
        params.sort = "rating_desc";
      } else if (sortBy === "lowRating") {
        params.sort = "rating_asc";
      }

      try {
        const reviewsData = await fetchReviews(params);
        
        // Se for um array, usar diretamente, caso contrário verificar se tem propriedade 'data'
        const reviewsArray = Array.isArray(reviewsData) 
          ? reviewsData 
          : (reviewsData.data || []);
        
        return {
          reviews: reviewsArray,
          stats: calculateStats(reviewsArray)
        };
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        throw error;
      }
    },
    enabled: !!professionalId,
  });

  // Calcular estatísticas das avaliações
  const calculateStats = (reviewsData: Review[]): ReviewStats => {
    if (!reviewsData || reviewsData.length === 0) {
      return calculateEmptyStats();
    }

    const totalReviews = reviewsData.length;
    const sumRatings = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    // Calcular distribuição de avaliações
    const distribution = [1, 2, 3, 4, 5].map((stars) => {
      const count = reviewsData.filter((review) => review.rating === stars).length;
      return {
        stars: stars as Rating,
        count,
        percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      };
    });

    return {
      averageRating,
      totalReviews,
      ratingDistribution: distribution,
    };
  };

  const calculateEmptyStats = (): ReviewStats => {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [1, 2, 3, 4, 5].map((stars) => ({
        stars: stars as Rating,
        count: 0,
        percentage: 0,
      })),
    };
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  // Renderizar estrelas para uma avaliação
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // Renderizar barra de progresso para distribuição de avaliações
  const renderRatingBar = (count: number, percentage: number, total: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-muted-foreground w-10">{count}</span>
      </div>
    );
  };

  // Card de estatísticas
  const StatsCard = () => {
    const stats = reviews?.stats || calculateEmptyStats();

    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Resumo das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-iazi-primary mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 mb-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
              <p className="text-sm text-muted-foreground">
                {stats.totalReviews} {stats.totalReviews === 1 ? "avaliação" : "avaliações"}
              </p>
            </div>

            <div className="space-y-2">
              {stats.ratingDistribution
                .slice()
                .reverse()
                .map((item) => (
                  <div key={item.stars} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-6">{item.stars}</span>
                    {renderStars(item.stars)}
                    {renderRatingBar(
                      item.count,
                      item.percentage,
                      stats.totalReviews
                    )}
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Card de filtros
  const FiltersCard = () => {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-3 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="lastMonth">Último mês</SelectItem>
                  <SelectItem value="lastThreeMonths">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as avaliações</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                  <SelectItem value="4">4 estrelas</SelectItem>
                  <SelectItem value="3">3 estrelas</SelectItem>
                  <SelectItem value="2">2 estrelas</SelectItem>
                  <SelectItem value="1">1 estrela</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="oldest">Mais antigas</SelectItem>
                  <SelectItem value="highRating">Maior avaliação</SelectItem>
                  <SelectItem value="lowRating">Menor avaliação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Renderizar um item de avaliação no formato de lista
  const ReviewListItem = ({ review }: { review: Review }) => {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col items-center sm:items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>
                  {review.user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="sm:mt-1">
                {renderStars(review.rating)}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-iazi-text">
                    {review.user.name}
                  </h4>
                  {review.service && (
                    <Badge variant="outline" className="mt-1">
                      {review.service.name}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.updatedAt)}
                </span>
              </div>

              {review.comment && (
                <p className="text-gray-700 whitespace-pre-wrap mt-2">
                  {review.comment}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Renderizar um item de avaliação no formato de grade
  const ReviewGridItem = ({ review }: { review: Review }) => {
    return (
      <Card className="h-full">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={review.user.avatar} alt={review.user.name} />
                <AvatarFallback>
                  {review.user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm text-iazi-text">
                  {review.user.name}
                </h4>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.updatedAt).split(" de ").pop()}
            </span>
          </div>

          <div className="mb-2">{renderStars(review.rating)}</div>

          {review.service && (
            <Badge variant="outline" className="self-start mb-2">
              {review.service.name}
            </Badge>
          )}

          {review.comment ? (
            <p className="text-sm text-gray-700 line-clamp-4 flex-grow">
              {review.comment}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Sem comentário
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[30%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Erro ao carregar avaliações</AlertTitle>
          <AlertDescription>
            Ocorreu um erro ao carregar suas avaliações. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      );
    }

    if (!reviews?.reviews || reviews.reviews.length === 0) {
      return (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Nenhuma avaliação encontrada</AlertTitle>
          <AlertDescription>
            Você ainda não recebeu avaliações ou nenhuma avaliação corresponde aos filtros selecionados.
          </AlertDescription>
        </Alert>
      );
    }

    if (viewMode === "list") {
      return (
        <div className="space-y-4">
          {reviews.reviews.map((review) => (
            <ReviewListItem key={review.id} review={review} />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.reviews.map((review) => (
          <ReviewGridItem key={review.id} review={review} />
        ))}
      </div>
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Avaliações</h1>
        </div>

        <Tabs defaultValue="reviews">
          <TabsList>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-4">
            <FiltersCard />
            {renderContent()}
          </TabsContent>

          <TabsContent value="stats">
            <StatsCard />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default ProfessionalReviews; 