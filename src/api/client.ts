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
 * Função para fazer requisições HTTP com tratamento de erros e resposta formatada
 * @param config Configuração da requisição
 * @returns Promise com dados da resposta
 */
export const apiRequest = async<T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    // Propaga o erro para ser tratado pelo chamador
    throw error;
  }
};

export default apiClient; 