import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { 
  SearchParams, 
  Service, 
  Professional, 
  Company, 
  PaginatedResponse 
} from './types';

/**
 * Serviço de API para buscas
 * Centraliza todas as operações relacionadas a buscas na plataforma
 */

// Interface que representa a estrutura de retorno da API de busca
export interface SearchResults {
  services?: PaginatedResponse<Service>;
  professionals?: PaginatedResponse<Professional>;
  companies?: PaginatedResponse<Company>;
}

// Interface para resultados de busca rápida
export interface QuickBookingResult {
  id: string;
  type: "services" | "professional" | "company";
  name: string;
  subtitle?: string;
  category?: string;
  availability?: string;
  price?: string;
  rating?: number;
  directBooking: boolean;
  imageUrl?: string;
}

// Interface estendida para os resultados de serviço vindos da busca
// que podem conter campos adicionais não definidos no tipo Service base
interface SearchServiceResult extends Service {
  company?: { name: string };
  professional?: { name: string; avatarUrl?: string };
  image?: string;
  rating?: number;
}

/**
 * Busca resultados genéricos com base nos parâmetros fornecidos
 * @param params Parâmetros de busca
 * @returns Resultados da busca organizados por tipo
 */
export const fetchSearchResults = async (params: SearchParams = {}): Promise<SearchResults> => {
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/search',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    
    // Retorna objeto vazio em caso de erro
    return {};
  }
};

/**
 * Busca serviços com base nos parâmetros fornecidos
 * @param params Parâmetros de busca específicos para serviços
 * @returns Lista paginada de serviços
 */
export const fetchServices = async (params: SearchParams = {}): Promise<PaginatedResponse<Service>> => {
  const normalizedParams = normalizeApiParams({ 
    ...params,
    type: 'services' 
  });
  
  try {
    const results = await apiRequest<SearchResults>({
      method: 'GET',
      url: '/search',
      params: normalizedParams
    });
    
    return results.services || { data: [], meta: { total: 0, page: 1, limit: 10 } };
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    // Retorna resposta vazia em caso de erro
    return { data: [], meta: { total: 0, page: 1, limit: 10 } };
  }
};

/**
 * Busca serviços de um profissional específico
 * @param professionalId ID do profissional
 * @param params Parâmetros de busca adicionais
 * @returns Lista de serviços do profissional
 */
export const fetchProfessionalServicesViaSearch = async (
  professionalId: string,
  params: SearchParams = {}
): Promise<Service[]> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  const normalizedParams = normalizeApiParams({ 
    ...params,
    professionalId,
    type: 'services',
    limit: 100  // Busca todos os serviços do profissional
  });
  
  try {
    const results = await apiRequest<SearchResults>({
      method: 'GET',
      url: '/search',
      params: normalizedParams
    });
    
    return results.services?.data || [];
  } catch (error) {
    console.error(`Erro ao buscar serviços do profissional ${professionalId}:`, error);
    return [];
  }
};

/**
 * Busca profissionais com base nos parâmetros fornecidos
 * @param params Parâmetros de busca específicos para profissionais
 * @returns Lista paginada de profissionais
 */
export const fetchProfessionalsViaSearch = async (params: SearchParams = {}): Promise<PaginatedResponse<Professional>> => {
  const normalizedParams = normalizeApiParams({ 
    ...params,
    type: 'professionals' 
  });
  
  try {
    const results = await apiRequest<SearchResults>({
      method: 'GET',
      url: '/search',
      params: normalizedParams
    });
    
    return results.professionals || { data: [], meta: { total: 0, page: 1, limit: 10 } };
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    // Retorna resposta vazia em caso de erro
    return { data: [], meta: { total: 0, page: 1, limit: 10 } };
  }
};

/**
 * Busca empresas com base nos parâmetros fornecidos
 * @param params Parâmetros de busca específicos para empresas
 * @returns Lista paginada de empresas
 */
export const fetchCompaniesViaSearch = async (params: SearchParams = {}): Promise<PaginatedResponse<Company>> => {
  const normalizedParams = normalizeApiParams({ 
    ...params,
    type: 'companies' 
  });
  
  try {
    const results = await apiRequest<SearchResults>({
      method: 'GET',
      url: '/search',
      params: normalizedParams
    });
    
    return results.companies || { data: [], meta: { total: 0, page: 1, limit: 10 } };
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    // Retorna resposta vazia em caso de erro
    return { data: [], meta: { total: 0, page: 1, limit: 10 } };
  }
};

/**
 * Busca rápida para opções de agendamento
 * @param query Termo de busca
 * @returns Opções de agendamento rápido
 */
export const fetchQuickBookingOptions = async (query: string): Promise<any[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/search/quick',
      params: { q: query }
    });
  } catch (error) {
    console.error(`Erro ao buscar opções rápidas para "${query}":`, error);
    return [];
  }
};

/**
 * Obtém opções de agendamento rápido para o dropdown de busca
 * @param query Termo de busca
 * @returns Lista de resultados formatados para o dropdown
 */
export const getQuickBookingOptions = async (query: string): Promise<QuickBookingResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  try {
    // Primeiro, tenta usar a API de busca rápida específica
    try {
      const quickResults = await fetchQuickBookingOptions(query);
      if (Array.isArray(quickResults) && quickResults.length > 0) {
        return quickResults;
      }
    } catch (quickError) {
      console.warn("API de busca rápida não disponível, usando busca padrão", quickError);
    }
    
    // Se a API de busca rápida falhar, usa a busca normal
    const results = await fetchSearchResults({
      q: query,
      limit: 8
    });
    
    // Transforma os resultados no formato esperado
    const quickResults: QuickBookingResult[] = [];
    
    // Adiciona serviços (diretamente agendáveis)
    const servicesArray = results.services?.data || [];
    if (servicesArray.length > 0) {
      servicesArray.slice(0, 3).forEach((service: any) => {
        quickResults.push({
          id: service.id,
          type: "services",
          name: service.name || "Serviço sem nome",
          subtitle: service.company?.name || service.professional?.name,
          category: typeof service.category === 'object' ? service.category?.name : service.category,
          price: typeof service.price === 'number' ? service.price.toString() : service.price,
          rating: service.rating,
          directBooking: true,
          imageUrl: service.image || service.professional?.avatarUrl
        });
      });
    }
    
    // Adiciona profissionais
    const professionalsArray = results.professionals?.data || [];
    if (professionalsArray.length > 0) {
      professionalsArray.slice(0, 3).forEach((professional) => {
        quickResults.push({
          id: professional.id,
          type: "professional",
          name: professional.name || "Profissional sem nome",
          subtitle: professional.company?.name || professional.role,
          rating: professional.rating,
          directBooking: Array.isArray(professional.services) && professional.services.length > 0,
          imageUrl: professional.avatarUrl || professional.image
        });
      });
    }
    
    // Adiciona empresas
    const companiesArray = results.companies?.data || [];
    if (companiesArray.length > 0) {
      companiesArray.slice(0, 2).forEach((company) => {
        quickResults.push({
          id: company.id,
          type: "company",
          name: company.name || "Empresa sem nome",
          subtitle: company.specialty || company.address?.city,
          rating: company.rating,
          directBooking: false,
          imageUrl: company.logo
        });
      });
    }
    
    return quickResults;
    
  } catch (error) {
    console.error("Erro ao buscar opções de agendamento rápido:", error);
    return [];
  }
}; 