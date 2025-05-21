/**
 * API Configuration
 * 
 * Este arquivo fornece configuração para endpoints de API e helpers
 * para garantir o uso consistente de URLs em toda a aplicação.
 */

// URL base para todas as requisições da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3002/api";

// Configuração global para cache e otimização
export const API_CACHE_CONFIG = {
  // Tempos de cache padrão (em milissegundos)
  defaultStaleTime: 5 * 60 * 1000, // 5 minutos
  shortStaleTime: 1 * 60 * 1000,   // 1 minuto
  longStaleTime: 30 * 60 * 1000,   // 30 minutos
  permanentStaleTime: Infinity,    // Infinito (dados que raramente mudam)
  
  // Configurações para diferentes tipos de dados
  categories: Infinity,            // Categorias raramente mudam
  search: 1 * 60 * 1000,           // Resultados de busca por 1 minuto
  appointments: 2 * 60 * 1000,     // Agendamentos por 2 minutos
  profile: 10 * 60 * 1000,         // Perfis por 10 minutos
  reviews: 15 * 60 * 1000,         // Avaliações por 15 minutos
  dashboard: 5 * 60 * 1000,        // Dados de dashboard por 5 minutos
};

// Configurações padrão para paginação
export const DEFAULT_PAGINATION = {
  limit: 10,
  page: 1
};

// Tipos de requisição suportados pela API
export enum ApiMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * Helper para obter a URL completa para um endpoint da API
 * @param path O caminho da API (sem a barra inicial)
 * @returns A URL completa da API
 */
export function getApiUrl(path: string): string {
  // Remove a barra inicial se presente
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Helper para criar parâmetros de consulta
 * @param params Objeto contendo parâmetros de consulta
 * @returns Instância de URLSearchParams
 */
export function createQueryParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  // Processa os parâmetros, lidando com undefined, arrays e objetos
  Object.entries(params).forEach(([key, value]) => {
    // Pula valores undefined ou null
    if (value === undefined || value === null) {
      return;
    }
    
    if (Array.isArray(value)) {
      // Para arrays, adiciona múltiplos parâmetros com o mesmo nome ou une com vírgulas
      // dependendo de como a API espera receber
      if (key === 'status') {
        // Caso especial: status é esperado como lista separada por vírgulas
        searchParams.append(key, value.join(','));
      } else {
        // Caso padrão: adicionar múltiplas entradas com o mesmo nome
        value.forEach(item => searchParams.append(key, String(item)));
      }
    } else if (typeof value === 'object') {
      // Para objetos, converte para JSON string
      searchParams.append(key, JSON.stringify(value));
    } else {
      // Para tipos primitivos (string, number, boolean), converte para string
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams;
}

/**
 * Função utilitária para criar uma URL completa da API com parâmetros de consulta
 * @param path Caminho da API
 * @param params Parâmetros de consulta
 * @returns URL completa com parâmetros de consulta
 */
export function createApiUrlWithParams(path: string, params: Record<string, any>): string {
  const url = getApiUrl(path);
  const searchParams = createQueryParams(params);
  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Normaliza parâmetros comuns de API para formato consistente
 * @param params Parâmetros originais
 * @returns Parâmetros normalizados
 */
export function normalizeApiParams(params: Record<string, any> = {}): Record<string, any> {
  const normalized = { ...params };
  
  // Normaliza status (converte para maiúsculas e lida com formatos variados)
  if (normalized.status) {
    if (typeof normalized.status === 'string' && normalized.status.includes(',')) {
      const statusArray = normalized.status.split(',');
      const normalizedStatuses = statusArray.map(normalizeStatusValue);
      normalized.status = [...new Set(normalizedStatuses)].join(',');
    } else if (typeof normalized.status === 'string') {
      normalized.status = normalizeStatusValue(normalized.status);
    }
  }
  
  // Normaliza parâmetros de include
  if (normalized.include && typeof normalized.include === 'string') {
    const includeArray = normalized.include.split(',');
    const validIncludes = ['user', 'service', 'professional', 'company', 'services'];
    const normalizedIncludes = includeArray
      .map(i => i.trim().toLowerCase())
      .filter(i => validIncludes.includes(i));
    normalized.include = normalizedIncludes.join(',');
  }
  
  return normalized;
}

/**
 * Função helper para normalizar valores de status
 */
function normalizeStatusValue(status: string): string {
  const trimmedStatus = status.trim().toUpperCase();
  if (trimmedStatus === 'IN-PROGRESS' || trimmedStatus === 'INPROGRESS') {
    return 'IN_PROGRESS';
  }
  if (trimmedStatus === 'NO-SHOW' || trimmedStatus === 'NOSHOW') {
    return 'NO_SHOW';
  }
  return trimmedStatus;
}

// Exporta todas as funcionalidades
export default {
  API_BASE_URL,
  API_CACHE_CONFIG,
  DEFAULT_PAGINATION,
  ApiMethod,
  getApiUrl,
  createQueryParams,
  createApiUrlWithParams,
  normalizeApiParams
};
