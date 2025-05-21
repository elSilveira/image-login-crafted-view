import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/api-config";

// Chaves consistentes para armazenamento de tokens e dados do usuário
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Cria uma instância do Axios com a URL base da API
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000, // 20 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

console.log("API URL Base:", apiClient.defaults.baseURL);

// --- Interceptor de Requisição ---
// Adiciona o token JWT ao cabeçalho Authorization
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor de Resposta ---
// Lida com refresh token e erros globais

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // Retorna a resposta se for bem-sucedida (status 2xx)
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Verifica se o erro é 401 e se não é uma tentativa de refresh que falhou
    if (error.response?.status === 401 && originalRequest.url !== "/auth/refresh" && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Se já estiver atualizando o token, adiciona a requisição à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers["Authorization"] = "Bearer " + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err); // Rejeita se o refresh falhar
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        console.error("Refresh token não encontrado, fazendo logout.");
        isRefreshing = false;
        // Limpar tudo e redirecionar (ou chamar função de logout do AuthContext)
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // Força redirecionamento
        }
        return Promise.reject(error);
      }

      try {
        console.log("Tentando atualizar token");
        const refreshResponse = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        console.log("Token atualizado com sucesso.");
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
        // Atualiza o refresh token se um novo for retornado
        if (newRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }

        // Atualiza o header da requisição original
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Processa a fila de requisições pendentes com o novo token
        processQueue(null, newAccessToken);

        // Tenta novamente a requisição original
        return apiClient(originalRequest);

      } catch (refreshError: any) {
        console.error("Falha ao atualizar token:", refreshError?.response?.data || refreshError);
        processQueue(refreshError, null); // Rejeita a fila com o erro de refresh
        // Limpar tudo e redirecionar
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // Força redirecionamento
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Para outros erros, apenas rejeita a promessa
    // Extrai mensagem de erro mais amigável
    const errorMessage = (error.response?.data as any)?.message || error.message || "Ocorreu um erro inesperado.";
    console.error("Erro na API:", errorMessage, error.response?.status, originalRequest.url);
    // Adiciona a errorMessage ao objeto de erro para uso posterior
    error.message = errorMessage;

    return Promise.reject(error);
  }
);

/**
 * Interface para as opções de requisição à API
 */
export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * Função centralizada para realizar requisições à API
 * @param options Opções da requisição
 * @returns Resposta da API
 */
export const apiRequest = async <T>(options: ApiRequestOptions): Promise<T> => {
  const { method = 'GET', url, params = {}, data, headers = {}, timeout = 30000 } = options;
  
  // Lista de endpoints críticos que devem ter cache local
  const criticalEndpoints = [
    '/professionals/.*/dashboard-stats',
    '/professionals/.*/popular-services',
    '/appointments',
    '/categories'
  ];
  
  // Gera uma chave de cache baseada na URL e parâmetros
  const getCacheKey = (url: string, params: Record<string, any> = {}) => {
    return `api_cache_${url}_${JSON.stringify(params)}`;
  };
  
  // Salva dados no cache local
  const saveToCache = (url: string, params: Record<string, any> = {}, data: any) => {
    const cacheKey = getCacheKey(url, params);
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      console.log(`Dados salvos no cache: ${cacheKey}`);
    } catch (error) {
      console.warn('Erro ao salvar dados no cache:', error);
    }
  };
  
  // Tenta recuperar dados do cache local
  const getFromCache = (url: string, params: Record<string, any> = {}, maxAge = 3600000) => {
    const cacheKey = getCacheKey(url, params);
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const age = Date.now() - parsedCache.timestamp;
        if (age < maxAge) {
          console.log(`Usando dados do cache: ${cacheKey}, idade: ${Math.round(age / 1000)}s`);
          return parsedCache.data;
        } else {
          console.log(`Cache expirado: ${cacheKey}, idade: ${Math.round(age / 1000)}s`);
        }
      }
    } catch (error) {
      console.warn('Erro ao recuperar dados do cache:', error);
    }
    return null;
  };
  
  // Verifica se o endpoint é considerado crítico (usando RegExp)
  const isEndpointCritical = (url: string) => {
    return criticalEndpoints.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(url);
    });
  };
  
  try {
    const response = await apiClient.request({
      method,
      url,
      params,
      data,
      headers,
      timeout
    });
    
    // Se for um GET em endpoint crítico, salva no cache
    if (method === 'GET' && isEndpointCritical(url)) {
      saveToCache(url, params, response.data);
    }
    
    return response.data;
  } catch (error) {
    // Tratamento especial para erros de rede
    if (error instanceof Error && 'message' in error) {
      if (
        error.message === 'Network Error' || 
        error.message === 'Failed to fetch' ||
        error.message.includes('network') ||
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('ECONNABORTED')
      ) {
        console.error('Erro de rede detectado:', error.message);
        
        // Se for um GET em endpoint crítico, tenta buscar do cache
        if (method === 'GET' && isEndpointCritical(url)) {
          console.warn('Usando fallback para dados em cache local');
          const cachedData = getFromCache(url, params);
          if (cachedData) {
            console.log('Dados recuperados do cache com sucesso');
            // Adiciona metadados indicando que são dados em cache
            if (typeof cachedData === 'object' && cachedData !== null) {
              // Se for um array, encapsulamos em um objeto com a propriedade _fromCache
              if (Array.isArray(cachedData)) {
                return {
                  data: cachedData,
                  _fromCache: true,
                  _cacheDate: new Date().toISOString()
                } as unknown as T;
              }
              // Se for um objeto, adicionamos as propriedades diretamente
              return {
                ...cachedData,
                _fromCache: true,
                _cacheDate: new Date().toISOString()
              } as unknown as T;
            }
            return cachedData as T;
          }
        }
      }
    }
    
    throw error;
  }
};

export default apiClient; 