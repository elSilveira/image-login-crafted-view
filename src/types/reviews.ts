
/**
 * Tipos para API de Avaliações
 */

// Rating deve estar entre 1 e 5
export type Rating = 1 | 2 | 3 | 4 | 5;

// Tipo de avaliação (profissional ou usuário)
export type ReviewType = "professional" | "user";

// Interface para criação de uma avaliação
export interface CreateReviewData {
  rating: Rating;
  comment?: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  userId?: string;
  appointmentId?: string;
  reviewType?: ReviewType;
}

// Interface para atualização de uma avaliação
export interface UpdateReviewData {
  rating?: Rating;
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
