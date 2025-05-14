import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { Professional } from "@/pages/ProfessionalProfile";

// Define a interface para o payload do token JWT (ajuste conforme necessário)
interface JwtPayload {
  userId: string;
  // Adicione outras propriedades do payload se houver
}

// Consistent keys for storing tokens and user data
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

// Cria uma instância do Axios com a URL base da API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3003/api", // CORRIGIDO: Fallback para porta 3003
});

console.log("API URL Base:", apiClient.defaults.baseURL);

// --- Request Interceptor ---
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

// --- Response Interceptor ---
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
        console.log("Tentando atualizar token com:", refreshToken);
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
    // Opcional: Extrair mensagem de erro mais amigável
    const errorMessage = (error.response?.data as any)?.message || error.message || "Ocorreu um erro inesperado.";
    console.error("Erro na API:", errorMessage, error.response?.status, originalRequest.url);
    // Poderia adicionar o errorMessage ao objeto de erro para uso posterior
    error.message = errorMessage;

    return Promise.reject(error);
  }
);

// --- Funções de API existentes (mantidas como estavam) ---

// --- User Profile API Functions ---
export const fetchUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};
export const updateUserProfile = async (data: any) => {
  const response = await apiClient.put("/users/me", data);
  return response.data;
};

// --- User Addresses API Functions ---
export const fetchUserAddresses = async () => {
  const response = await apiClient.get("/users/me/addresses");
  return response.data;
};
export const createUserAddress = async (addressData: any) => {
  const response = await apiClient.post("/users/me/addresses", addressData);
  return response.data;
};
export const updateUserAddress = async (addressId: string, addressData: any) => {
  const response = await apiClient.put(`/users/me/addresses/${addressId}`, addressData);
  return response.data;
};
export const deleteUserAddress = async (addressId: string) => {
  const response = await apiClient.delete(`/users/me/addresses/${addressId}`);
  return response.data;
};

// --- Appointments API Functions ---
export const fetchAppointments = async (params: any = {}) => { // Added params
  const response = await apiClient.get("/appointments", { params });
  return response.data;
}
export const createAppointment = async (appointmentData: any) => {
  // Updated to handle the multi-service model
  // appointmentData should include serviceIds array now
  const response = await apiClient.post("/appointments", appointmentData);
  return response.data;
}
// Added function to update appointment status
export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    const response = await apiClient.patch(`/appointments/${appointmentId}/status`, { status });
    return response.data;
}

// --- Categories API Functions ---
export const fetchCategories = async (params: any = {}) => {
  const response = await apiClient.get("/categories", { params });
  return response.data;
}

// --- Companies API Functions ---
export const fetchCompanies = async (params: any = {}) => {
  const response = await apiClient.get("/companies", { params });
  return response.data;
}
export const fetchCompanyDetails = async (companyId:string) => {
  const response = await apiClient.get(`/companies/${companyId}?include=address`); // Include address
  return response.data;
}
export const registerCompany = async (companyData: any) => {
  const response = await apiClient.post("/companies", companyData);
  return response.data;
}
// Added function to update company details
export const updateCompanyDetails = async (companyId: string, companyData: any) => {
    const response = await apiClient.put(`/companies/${companyId}`, companyData);
    return response.data;
}
export const fetchCompanyAppointments = async (companyId:string, params: any = {}) => { // Added params
  const response = await apiClient.get(`/companies/${companyId}/appointments`, { params });
  return response.data;
}
export const fetchCompanyServices = async (companyId:string, params: any = {}) => { // Added params
  const response = await apiClient.get(`/companies/${companyId}/services`, { params });
  return response.data;
}

// --- Services API Functions ---
export const fetchServices = async (params: any = {}) => {
  const response = await apiClient.get("/services", { params });
  return response.data;
}
export const fetchServiceDetails = async (serviceId:string) => {
  const response = await apiClient.get(`/services/${serviceId}`);
  return response.data;
}

// --- Professionals API Functions ---
export const fetchProfessionals = async (params: any = {}) => { // Added function
    const response = await apiClient.get("/professionals", { params });
    return response.data;
}
export const fetchProfessionalDetails = async (professionalId:string) => {
  const response = await apiClient.get(`/professionals/${professionalId}`);
  return response.data;
}
export const fetchProfessionalServices = async (professionalId: string) => {
  const response = await apiClient.get(`/professionals/${professionalId}/services`);
  return response.data;
}
export const createProfessionalProfile = async (data: any) => {
  const response = await apiClient.post(`/professionals`, data);
  return response.data;
}
export const updateProfessionalProfile = async (data: any) => {
  // Atualiza o perfil do profissional logado (PUT /professionals/me)
  const response = await apiClient.put(`/professionals/me`, data);
  return response.data;
}
export const fetchAvailability = async (professionalId: string, _serviceId: string | undefined, date: string) => {
  // For disponibilidade tab: do not send serviceId, only professionalId and date
  const response = await apiClient.get(
    `/professionals/${professionalId}/availability`,
    { params: { date } }
  );
  return response.data;
};
export const fetchProfessionalMe = async () => {
  const response = await apiClient.get("/professionals/me");
  return response.data;
};
// --- New: Fetch all professionals with services (for search) ---
export const fetchAllProfessionalsWithServices = async (tipo: "all" | "only-linked" | "only-unlinked" = "all") => {
  const response = await apiClient.get("/professionals/all-services", { params: { tipo } });
  return response.data;
};

// --- Notifications API Function (Example) ---
export const fetchNotifications = async (params: any = {}) => {
    const response = await apiClient.get("/notifications", { params }); // Assuming endpoint exists
    return response.data;
}

// --- Promotions API Function (Example) ---
export const fetchPromotions = async (params: any = {}) => {
    const response = await apiClient.get("/promotions", { params }); // Assuming endpoint exists
    return response.data;
}

// --- New: Search API Function ---
export const fetchSearchResults = async (params: any = {}) => {
  const response = await apiClient.get("/search", { params });
  return response.data;
};

// --- Quick Actions API ---
export const fetchQuickBookingOptions = async (query: string) => {
  const response = await apiClient.get("/search/quick-booking", { 
    params: { q: query, limit: 5 } 
  });
  return response.data;
};

// --- Direct Booking API Functions ---
export const checkDirectBookingEligibility = async (serviceId: string) => {
  const response = await apiClient.get(`/services/${serviceId}/direct-booking-eligibility`);
  return response.data;
};

// --- Direct Professional Service Booking ---
export const bookProfessionalService = async (professionalId: string, bookingData: any) => {
  // Updated to handle multiple services - serviceIds are now part of bookingData
  const response = await apiClient.post(`/professionals/${professionalId}/book`, bookingData);
  return response.data;
};

export async function fetchProfessionalById(professionalId: string): Promise<Professional> {
  const response = await fetch(`/api/professionals/${professionalId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch professional');
  }
  return response.json();
}

export async function fetchProfessionalAvailableDates(professionalId: string): Promise<string[]> {
  // TODO: Replace with actual API call once the endpoint is available
  // const response = await fetch(`/api/professionals/${professionalId}/available-dates`);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch available dates');
  // }
  // return response.json();

  // Mock data for now
  console.log("Fetching available dates for professional: ", professionalId);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  // Simulate some available dates for May 2025, excluding weekends and some specific dates
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // For testing, let's assume current month is May 2025
  // In a real scenario, the API would return dates based on the professional's actual availability.
  const availableDates: string[] = [];
  if (currentYear === 2025 && currentMonth === 4) { // May is month 4 (0-indexed)
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2025, 4, day);
      const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        if (![15, 16, 22, 23].includes(day)) { // Exclude some specific dates
          availableDates.push(date.toISOString().split('T')[0]);
        }
      }
    }
  } else {
    // If not May 2025, return a few dynamic dates for testing
     const tomorrow = new Date(today);
     tomorrow.setDate(today.getDate() + 1);
     const dayAfterTomorrow = new Date(today);
     dayAfterTomorrow.setDate(today.getDate() + 2);
     const fiveDaysLater = new Date(today);
     fiveDaysLater.setDate(today.getDate() + 5);
     availableDates.push(tomorrow.toISOString().split('T')[0]);
     availableDates.push(dayAfterTomorrow.toISOString().split('T')[0]);
     availableDates.push(fiveDaysLater.toISOString().split('T')[0]);
  }
  return availableDates;
}

// Adicione outras funções de API conforme necessário

export const fetchProfessionalAppointments = async (professionalId: string, dateFrom: string, dateTo: string) => {
  // Fetch all appointments for a professional in a date range, including user and service
  const response = await apiClient.get(`/appointments`, {
    params: {
      professionalId,
      dateFrom,
      dateTo,
      include: 'user,service',
      limit: 500,
      sort: 'startTime_asc',
    },
  });
  return response.data;
};

export default apiClient;
