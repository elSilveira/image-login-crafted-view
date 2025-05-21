// Tipos para o sistema de reviews (avaliações)

// Valores de avaliação possíveis (1-5 estrelas)
export type Rating = 1 | 2 | 3 | 4 | 5;

// Tipo de avaliação (profissional ou usuário)
export type ReviewType = "professional" | "user";

// Interface para usuário simplificado nas reviews
interface ReviewUser {
  id: string;
  name: string;
  avatar?: string;
}

// Interface para serviço simplificado nas reviews
interface ReviewService {
  id: string;
  name: string;
}

// Interface para profissional simplificado nas reviews
interface ReviewProfessional {
  id: string;
  name: string;
  image?: string;
  avatarUrl?: string;
}

// Interface para empresa simplificada nas reviews
interface ReviewCompany {
  id: string;
  name: string;
  logo?: string;
}

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
  user?: ReviewUser;
  service?: ReviewService;
  professional?: ReviewProfessional;
  company?: ReviewCompany;
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

// Interface para o profissional na resposta detalhada
export interface DetailedProfessional {
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
}

// Interface para a resposta do endpoint de avaliações de profissional com estatísticas
export interface ProfessionalReviewsWithStats {
  professional: DetailedProfessional;
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
  appointmentId?: string; // Opcional, para associar com agendamento
  reviewType?: ReviewType; // Opcional, para indicar o tipo de avaliação
}

// Interface para dados necessários para atualizar uma avaliação
export interface UpdateReviewData {
  rating?: number;
  comment?: string;
} 