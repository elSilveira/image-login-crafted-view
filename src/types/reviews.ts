/**
 * Tipos para API de Avaliações
 */

// Tipos para o sistema de reviews (avaliações)

// Valores de avaliação possíveis (1-5 estrelas)
export type Rating = 1 | 2 | 3 | 4 | 5;

// Tipo de avaliação (profissional ou usuário)
export type ReviewType = "professional" | "user";

// Interface para uma avaliação (review)
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  createdAt?: string;
  updatedAt: string;
  // Dados relacionados que podem vir incluídos
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  service?: {
    id: string;
    name: string;
  };
  professional?: {
    id: string;
    name: string;
    image?: string;
    avatarUrl?: string;
  };
  company?: {
    id: string;
    name: string;
    logo?: string;
  };
  // Campo para resposta do profissional, se implementado
  professionalResponse?: string;
}

// Interface para distribuição das avaliações
export interface RatingDistribution {
  stars: Rating;
  count: number;
  percentage: number;
}

// Interface para estatísticas de avaliação
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
}

// Interface para a resposta do endpoint de avaliações de profissional com estatísticas
export interface ProfessionalReviewsWithStats {
  professional: {
    id: string;
    name: string;
    image?: string;
    avatarUrl?: string;
    coverImage?: string;
    coverImageUrl?: string;
    bio?: string;
    rating: number;
    totalReviews: number;
    role?: string;
  };
  reviews: Review[];
  count: number;
}

// Interface para parâmetros da requisição de avaliações
export interface ReviewsQueryParams {
  professionalId?: string;
  serviceId?: string;
  companyId?: string;
  userId?: string;
  limit?: number;
  offset?: number;
  sort?: string; // ex: "updatedAt_desc", "rating_asc"
  startDate?: string; // ISO date string YYYY-MM-DD
  endDate?: string; // ISO date string YYYY-MM-DD
  rating?: number; // Filtrar por avaliação específica
}

// Interface para dados necessários para criar uma avaliação
export interface CreateReviewData {
  rating: number;
  comment?: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  userId?: string; // Adicionado para compatibilidade
  appointmentId?: string; // Adicionado para compatibilidade
  reviewType?: ReviewType; // Adicionado para compatibilidade
}

// Interface para dados necessários para atualizar uma avaliação
export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

// Interface para avaliação recebida da API
export interface Review {
  id: string;
  rating: Rating;
  comment?: string;
  userId: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  reviewType?: ReviewType;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  service?: {
    id: string;
    name: string;
  };
  professional?: {
    id: string;
    name: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

// Interface para estatísticas de avaliações
export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    stars: Rating;
    count: number;
    percentage: number;
  }[];
}

// Interface para status de avaliação de um agendamento
export interface AppointmentReviewStatus {
  hasBeenReviewed: boolean;
  canBeReviewed: boolean;
  reviewId?: string; // ID da avaliação, se já existir
}

// Interface para parâmetros de consulta de avaliações
export interface ReviewQueryParams {
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  userId?: string;
  reviewType?: ReviewType;
  rating?: Rating;
  startDate?: string;
  endDate?: string;
  sort?: 'createdAt_desc' | 'createdAt_asc' | 'rating_desc' | 'rating_asc';
  limit?: number;
  page?: number;
}
