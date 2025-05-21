import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { 
  Service,
  PaginatedResponse,
  ServiceCreateData,
  ProfessionalServiceData
} from './types';

/**
 * Serviço de API para serviços
 * Centraliza todas as operações relacionadas a serviços na plataforma
 */

/**
 * Busca todos os serviços com filtros opcionais
 * @param params Parâmetros para filtrar serviços (opcional)
 * @returns Lista paginada de serviços
 */
export const fetchAllServices = async (params: Record<string, any> = {}): Promise<PaginatedResponse<Service>> => {
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/services',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um serviço específico
 * @param serviceId ID do serviço
 * @returns Detalhes do serviço
 */
export const fetchServiceDetails = async (serviceId: string): Promise<Service> => {
  if (!serviceId) {
    throw new Error("ID do serviço é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/services/${serviceId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes do serviço ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Busca serviços populares
 * @param limit Limite de resultados
 * @returns Lista de serviços populares
 */
export const fetchTrendingServices = async (limit: number = 10): Promise<Service[]> => {
  try {
    return await apiRequest({
      method: 'GET',
      url: '/services/popular',
      params: { limit }
    });
  } catch (error) {
    console.error('Erro ao buscar serviços populares:', error);
    throw error;
  }
};

/**
 * Busca serviços por categoria
 * @param categoryId ID da categoria
 * @param params Parâmetros adicionais (paginação, filtros)
 * @returns Lista de serviços da categoria
 */
export const fetchServicesByCategory = async (
  categoryId: string,
  params: Record<string, any> = {}
): Promise<PaginatedResponse<Service>> => {
  if (!categoryId) {
    throw new Error("ID da categoria é obrigatório");
  }
  
  const normalizedParams = normalizeApiParams({
    ...params,
    categoryId
  });
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/services',
      params: normalizedParams
    });
  } catch (error) {
    console.error(`Erro ao buscar serviços da categoria ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Cria um novo serviço
 * @param serviceData Dados do serviço a ser criado
 * @returns Serviço criado
 */
export const createService = async (
  serviceData: ServiceCreateData
): Promise<Service> => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/services',
      data: serviceData
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
};

/**
 * Atualiza um serviço existente
 * @param serviceId ID do serviço
 * @param serviceData Dados do serviço a serem atualizados
 * @returns Serviço atualizado
 */
export const updateService = async (
  serviceId: string,
  serviceData: Partial<Service>
): Promise<Service> => {
  if (!serviceId) {
    throw new Error("ID do serviço é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'PUT',
      url: `/services/${serviceId}`,
      data: serviceData
    });
  } catch (error) {
    console.error(`Erro ao atualizar serviço ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Exclui um serviço
 * @param serviceId ID do serviço
 * @returns Status da operação
 */
export const deleteService = async (serviceId: string): Promise<void> => {
  if (!serviceId) {
    throw new Error("ID do serviço é obrigatório");
  }
  
  try {
    await apiRequest({
      method: 'DELETE',
      url: `/services/${serviceId}`
    });
  } catch (error) {
    console.error(`Erro ao excluir serviço ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Adiciona um serviço a um profissional
 * @param professionalId ID do profissional
 * @param serviceData Dados do serviço a ser vinculado
 * @returns Status da operação
 */
export const addServiceToProfessional = async (
  professionalId: string,
  serviceData: ProfessionalServiceData
): Promise<any> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'POST',
      url: `/professionals/${professionalId}/services`,
      data: serviceData
    });
  } catch (error) {
    console.error(`Erro ao adicionar serviço ao profissional ${professionalId}:`, error);
    throw error;
  }
};

/**
 * Remove um serviço de um profissional
 * @param professionalId ID do profissional
 * @param serviceId ID do serviço
 * @returns Status da operação
 */
export const removeServiceFromProfessional = async (
  professionalId: string,
  serviceId: string
): Promise<void> => {
  if (!professionalId || !serviceId) {
    throw new Error("IDs do profissional e do serviço são obrigatórios");
  }
  
  try {
    await apiRequest({
      method: 'DELETE',
      url: `/professionals/${professionalId}/services/${serviceId}`
    });
  } catch (error) {
    console.error(`Erro ao remover serviço ${serviceId} do profissional ${professionalId}:`, error);
    throw error;
  }
}; 