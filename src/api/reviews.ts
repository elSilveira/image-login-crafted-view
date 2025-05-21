import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import {
  Review,
  ReviewParams,
  ReviewCreateData,
  PaginatedResponse
} from './types';

/**
 * Serviço de API para avaliações
 * Centraliza todas as operações relacionadas a avaliações na plataforma
 */

/**
 * Busca avaliações com base nos parâmetros fornecidos
 * @param params Parâmetros para filtrar avaliações
 * @returns Lista de avaliações
 */
export const fetchReviews = async (params: ReviewParams): Promise<Review[] | PaginatedResponse<Review>> => {
  // Valida parâmetros mínimos necessários
  if (!params.serviceId && !params.professionalId && !params.companyId) {
    throw new Error("É necessário fornecer serviceId, professionalId ou companyId para filtrar as avaliações");
  }
  
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/reviews',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
};

/**
 * Busca avaliações de um profissional, com estatísticas agregadas
 * @param professionalId ID do profissional
 * @returns Lista de avaliações com estatísticas
 */
export const fetchProfessionalReviewsWithStats = async (professionalId: string): Promise<any> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/professionals/${professionalId}/reviews`
    });
  } catch (error) {
    console.error(`Erro ao buscar avaliações do profissional ${professionalId}:`, error);
    throw error;
  }
};

/**
 * Busca uma avaliação específica pelo ID
 * @param reviewId ID da avaliação
 * @returns Detalhes da avaliação
 */
export const fetchReviewById = async (reviewId: string): Promise<Review> => {
  if (!reviewId) {
    throw new Error("ID da avaliação é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/reviews/${reviewId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar avaliação ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova avaliação
 * @param reviewData Dados da avaliação a ser criada
 * @returns Avaliação criada
 */
export const createReview = async (reviewData: ReviewCreateData): Promise<Review> => {
  // Valida se ao menos um ID foi fornecido
  if (!reviewData.serviceId && !reviewData.professionalId && !reviewData.companyId) {
    throw new Error("É necessário fornecer pelo menos um ID (serviço, profissional ou empresa)");
  }
  
  // Valida se a avaliação está entre 1 e 5
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("A avaliação deve ser um valor numérico entre 1 e 5");
  }
  
  try {
    return await apiRequest({
      method: 'POST',
      url: '/reviews',
      data: reviewData
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }
};

/**
 * Atualiza uma avaliação existente
 * @param reviewId ID da avaliação
 * @param reviewData Dados da avaliação a serem atualizados
 * @returns Avaliação atualizada
 */
export const updateReview = async (
  reviewId: string, 
  reviewData: { rating?: number; comment?: string }
): Promise<Review> => {
  if (!reviewId) {
    throw new Error("ID da avaliação é obrigatório");
  }
  
  // Valida se a avaliação está entre 1 e 5 (se fornecida)
  if (reviewData.rating && (reviewData.rating < 1 || reviewData.rating > 5)) {
    throw new Error("A avaliação deve ser um valor numérico entre 1 e 5");
  }
  
  try {
    return await apiRequest({
      method: 'PATCH',
      url: `/reviews/${reviewId}`,
      data: reviewData
    });
  } catch (error) {
    console.error(`Erro ao atualizar avaliação ${reviewId}:`, error);
    throw error;
  }
};

/**
 * Exclui uma avaliação
 * @param reviewId ID da avaliação
 * @returns Status da operação
 */
export const deleteReview = async (reviewId: string): Promise<void> => {
  if (!reviewId) {
    throw new Error("ID da avaliação é obrigatório");
  }
  
  try {
    await apiRequest({
      method: 'DELETE',
      url: `/reviews/${reviewId}`
    });
  } catch (error) {
    console.error(`Erro ao excluir avaliação ${reviewId}:`, error);
    throw error;
  }
}; 