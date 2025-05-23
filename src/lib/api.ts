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
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3002/api", // CORRIGIDO: Fallback COM /api
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
  try {
    // Create a copy of params to avoid modifying the original object
    const apiParams = { ...params };
    
    // Normalize status values
    if (apiParams.status) {
      // When filtering by multiple statuses, it comes as a comma-separated string
      if (typeof apiParams.status === 'string' && apiParams.status.includes(',')) {
        const statusArray = apiParams.status.split(',');
        // Normalize each status value
        const normalizedStatuses = statusArray.map(s => {
          const status = s.trim().toUpperCase();
          // Handle different status format variations
          if (status === 'IN-PROGRESS' || status === 'INPROGRESS') {
            return 'IN_PROGRESS';
          }
          if (status === 'NO-SHOW' || status === 'NOSHOW') {
            return 'NO_SHOW';
          }
          return status;
        });
        // Remove duplicates and join
        apiParams.status = [...new Set(normalizedStatuses)].join(',');
      } else {
        // Single status case
        const status = apiParams.status.trim().toUpperCase();
        if (status === 'IN-PROGRESS' || status === 'INPROGRESS') {
          apiParams.status = 'IN_PROGRESS';
        } else if (status === 'NO-SHOW' || status === 'NOSHOW') {
          apiParams.status = 'NO_SHOW';
        } else {
          apiParams.status = status;
        }
      }
    }
    
    // Normalize include parameter
    if (apiParams.include) {
      const includeArray = apiParams.include.split(',');
      // Filter and normalize include values
      const normalizedIncludes = includeArray
        .map(i => i.trim().toLowerCase())
        .filter(i => ['user', 'service', 'professional', 'company'].includes(i));
      apiParams.include = normalizedIncludes.join(',');
    }
    
    // Check if we should use mock data for testing
    const useMockData = localStorage.getItem('useMockAppointmentsData') === 'true';
    
    if (useMockData) {
      const mockAppointments = [
        {
          id: "mock-1",
          startTime: "2025-05-25T09:00:00.000Z",
          endTime: "2025-05-25T10:00:00.000Z",
          status: apiParams.status?.includes('PENDING') ? "PENDING" : 
                 apiParams.status?.includes('CONFIRMED') ? "CONFIRMED" :
                 apiParams.status?.includes('COMPLETED') ? "COMPLETED" : "PENDING",
          service: {
            id: "s1",
            name: "Corte de Cabelo",
            duration: 60
          },
          user: {
            id: "u1",
            name: "João Silva"
          }
        },
        {
          id: "mock-2",
          startTime: "2025-05-26T14:00:00.000Z",
          endTime: "2025-05-26T15:30:00.000Z",
          status: apiParams.status?.includes('CONFIRMED') ? "CONFIRMED" : 
                 apiParams.status?.includes('PENDING') ? "PENDING" :
                 apiParams.status?.includes('COMPLETED') ? "COMPLETED" : "CONFIRMED",
          services: [
            {
              service: {
                id: "s2",
                name: "Tintura",
                duration: 90
              }
            }
          ],
          user: {
            id: "u2",
            name: "Maria Santos"
          }
        }
      ];
      
      // Filter based on status if provided
      if (apiParams.status) {
        const statusArray = apiParams.status.split(',');
        return mockAppointments.filter(appointment => 
          statusArray.includes(appointment.status)
        );
      }
      
      return mockAppointments;
    }    
    // Use real API
    const response = await apiClient.get("/appointments", { params: apiParams });
      // Handle response with data array (pagination format)
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Handle direct array response
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Default fallback
    return [];
  } catch (error) {
    console.error('Error in fetchAppointments:', error);
    throw error;
  }
}
export const createAppointment = async (appointmentData: any) => {
  // Updated to handle the multi-service model
  // appointmentData should include serviceIds array now
  const response = await apiClient.post("/appointments", appointmentData);
  return response.data;
}
// Added function to update appointment status
export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
        // Normalize the status format to what the API expects
        let normalizedStatus = status.toLowerCase();
        
        // Handle different status format variations
        if (normalizedStatus === "in-progress") {
            normalizedStatus = "in_progress"; // Use the API's preferred format
        } else if (normalizedStatus === "inprogress") {
            normalizedStatus = "in_progress";
        } else if (normalizedStatus === "no-show") {
            normalizedStatus = "no_show";
        } else if (normalizedStatus === "noshow") {
            normalizedStatus = "no_show";
        }
          // Convert to uppercase as required by the API (status like PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW)
        const apiStatusValue = normalizedStatus.toUpperCase();
        
        // Check if we're using mock data
        const useMockData = localStorage.getItem('useMockAppointmentsData') === 'true';
        
        if (useMockData) {
            // Simulate a successful response
            return { 
                success: true,
                message: "Status updated successfully",
                appointment: {
                    id: appointmentId,
                    status: apiStatusValue
                }
            };
        }
          // Use real API
        const response = await apiClient.patch(`/appointments/${appointmentId}/status`, { status: apiStatusValue });
        return response.data;
    } catch (error) {
        console.error("[API] Error updating appointment status:", error);
        
        if (error instanceof AxiosError) {
            // Handle specific API error messages
            const errorMessage = error.response?.data?.message || 
                "Não foi possível atualizar o status do agendamento.";
                
            throw new Error(errorMessage);
        }
        
        throw error; // Re-throw other types of errors
    }
}

// Added function to reschedule appointment
export const rescheduleAppointment = async (appointmentId: string, startTime: string, endTime: string) => {
    try {
        const response = await apiClient.patch(`/appointments/${appointmentId}`, { 
            startTime, 
            endTime 
        });
        return response.data;
    } catch (error) {
        console.error("[API] Error rescheduling appointment:", error);
        
        if (error instanceof AxiosError) {
            // Handle specific API error messages
            const errorMessage = error.response?.data?.message || 
                "Não foi possível reagendar o agendamento.";
                
            if (error.response?.status === 409) {
                throw new Error("Conflito de horário: Este horário já está reservado.");
            }
            
            throw new Error(errorMessage);
        }
        
        throw error; // Re-throw other types of errors
    }
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
  // Debug para identificar os campos de imagem na resposta
  console.log("Resposta da API do profissional:", response.data);
  
  // Normalizar campos de imagem
  const data = response.data;
  
  // Garantir que tanto avatarUrl quanto image estejam disponíveis
  if (data.image && !data.avatarUrl) {
    data.avatarUrl = data.image;
  } else if (data.avatarUrl && !data.image) {
    data.image = data.avatarUrl;
  }
  
  // Garantir que tanto coverImageUrl quanto coverImage estejam disponíveis
  if (data.coverImage && !data.coverImageUrl) {
    data.coverImageUrl = data.coverImage;
  } else if (data.coverImageUrl && !data.coverImage) {
    data.coverImage = data.coverImageUrl;
  }
  
  return data;
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
  
  // Normalizar campos de imagem
  const data = response.data;
  
  // Garantir que tanto avatarUrl quanto image estejam disponíveis
  if (data.image && !data.avatarUrl) {
    data.avatarUrl = data.image;
  } else if (data.avatarUrl && !data.image) {
    data.image = data.avatarUrl;
  }
  
  // Garantir que tanto coverImageUrl quanto coverImage estejam disponíveis
  if (data.coverImage && !data.coverImageUrl) {
    data.coverImageUrl = data.coverImage;
  } else if (data.coverImageUrl && !data.coverImage) {
    data.coverImage = data.coverImageUrl;
  }
  
  return data;
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
  console.log(`[DEBUG] Fetching appointments for professional ${professionalId} from ${dateFrom} to ${dateTo}`);
  
  try {
    const response = await apiClient.get(`/appointments`, {
      params: {
        professionalId,
        dateFrom,
        dateTo,
        include: 'user,service,services,professional,services.service', // Include service details for services array
        limit: 100,
        sort: 'startTime_asc',
      },
    });
    
    // Process the response to ensure service data is accessible
    const responseData = response.data;
    const appointments = Array.isArray(responseData) ? responseData : 
                        responseData.data && Array.isArray(responseData.data) ? responseData.data : [];
    
    // Normalize each appointment to ensure service data is available
    const normalizedAppointments = appointments.map((appointment: any) => {
      // Ensure appointment has serviceId if it's not already there but in the service object
      if (!appointment.serviceId && appointment.service?.id) {
        appointment.serviceId = appointment.service.id;
      }
      
      // Process services array if it exists
      if (Array.isArray(appointment.services)) {
        appointment.services = appointment.services.map((serviceItem: any) => {
          // Handle case where service details are nested under a 'service' property
          if (serviceItem.service) {
            return {
              ...serviceItem,
              id: serviceItem.id || serviceItem.service.id,
              name: serviceItem.name || serviceItem.service.name,
              duration: serviceItem.duration || serviceItem.service.duration,
              price: serviceItem.price || serviceItem.service.price,
              // Preserve the original service object for reference
              service: serviceItem.service
            };
          }
          return serviceItem;
        });
      }
      
      return appointment;
    });
    
    // Debug log the normalized data structure
    if (normalizedAppointments.length > 0) {
      console.log('[DEBUG] Normalized appointment structure:', {
        appointment: normalizedAppointments[0],
        serviceData: normalizedAppointments[0].service,
        servicesArray: normalizedAppointments[0].services
      });
    } else {
      console.log('[DEBUG] No appointments found for the selected date range');
    }
    
    // Return the data in the expected format
    return {
      ...responseData,
      data: normalizedAppointments
    };
  } catch (error) {
    console.error('[ERROR] Failed to fetch professional appointments:', error);
    throw error;
  }
};

export const fetchProfessionalServicesViaSearch = async (professionalId: string) => {
  // Uses the new /api/search endpoint to get services for a professional
  const response = await apiClient.get("/search", {
    params: {
      type: "services",
      professionalId,
      limit: 100, // or adjust as needed
    },
  });
  // The response structure is { services: [...] }
  return response.data?.services || [];
};

// --- Reviews API Functions ---
export const fetchReviews = async (params: any = {}) => {
  // Ao menos um dos parâmetros de filtro deve ser fornecido (serviceId, professionalId ou companyId)
  // Validação conforme documentação
  if (!params.serviceId && !params.professionalId && !params.companyId) {
    throw new Error("É necessário fornecer serviceId, professionalId ou companyId para filtrar as avaliações");
  }
  
  const response = await apiClient.get("/reviews", { params });
  
  // A API retorna um array de reviews
  return response.data;
};

export const fetchProfessionalReviewsWithStats = async (professionalId: string) => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  // Usa o endpoint específico que retorna dados do profissional junto com as avaliações
  const response = await apiClient.get(`/reviews/professional/${professionalId}`);
  
  // A API retorna um objeto com professional, reviews e count
  return response.data;
};

export const fetchReviewById = async (reviewId: string) => {
  if (!reviewId) {
    throw new Error("ID da avaliação é obrigatório");
  }
  const response = await apiClient.get(`/reviews/${reviewId}`);
  return response.data;
};

export const createReview = async (reviewData: {
  rating: number;
  comment?: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
}) => {
  // Valida se ao menos um ID foi fornecido conforme documentação
  if (!reviewData.serviceId && !reviewData.professionalId && !reviewData.companyId) {
    throw new Error("É necessário fornecer pelo menos um ID (serviço, profissional ou empresa)");
  }
  
  // Valida se a avaliação está entre 1 e 5 conforme documentação
  if (reviewData.rating < 1 || reviewData.rating > 5) {
    throw new Error("A avaliação deve ser um valor numérico entre 1 e 5");
  }
  
  const response = await apiClient.post("/reviews", reviewData);
  return response.data;
};

export const updateReview = async (reviewId: string, reviewData: {
  rating?: number;
  comment?: string;
}) => {
  // Valida se a avaliação está entre 1 e 5, se fornecida
  if (reviewData.rating !== undefined && (reviewData.rating < 1 || reviewData.rating > 5)) {
    throw new Error("A avaliação deve ser um valor numérico entre 1 e 5");
  }
  
  // Verifica se há dados para atualizar
  if (Object.keys(reviewData).length === 0) {
    throw new Error("Nenhum dado fornecido para atualização.");
  }
  
  const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  if (!reviewId) {
    throw new Error("ID da avaliação é obrigatório");
  }
  
  const response = await apiClient.delete(`/reviews/${reviewId}`);
  // Retorna apenas o status 204 em caso de sucesso
  return { success: true };
};

// Função para verificar se um agendamento já foi avaliado
export const checkAppointmentReviewStatus = async (appointmentId: string) => {
  try {
    // Esta rota não está documentada, mas podemos assumir que existe
    // para verificar o status de avaliação de um agendamento
    const response = await apiClient.get(`/appointments/${appointmentId}/review-status`);
    return response.data;
  } catch (error) {
    console.warn("Endpoint de verificação de avaliação não disponível, usando simulação");
    return {
      hasBeenReviewed: false,
      canBeReviewed: true
    };
  }
};

// Funções para o dashboard do profissional

/**
 * Busca estatísticas gerais do dashboard do profissional
 * @param professionalId ID do profissional
 * @returns Estatísticas do dashboard
 */
export const fetchProfessionalDashboardStats = async (professionalId: string) => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    const response = await apiClient.get(`/professionals/${professionalId}/dashboard-stats`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    // Fornecer dados simulados em caso de falha na API
    return {
      currentMonthRevenue: 4230,
      previousMonthRevenue: 3780,
      currentMonthAppointments: 78,
      previousMonthAppointments: 72,
      currentMonthNewClients: 24,
      previousMonthNewClients: 25
    };
  }
};

/**
 * Busca agendamentos próximos para o dashboard
 * @param professionalId ID do profissional
 * @param limit Limite de resultados
 * @returns Lista de próximos agendamentos
 */
export const fetchUpcomingAppointments = async (professionalId: string, limit = 5) => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    // Atualizado para usar o endpoint correto conforme a documentação
    const response = await apiClient.get('/appointments/upcoming', {
      params: {
        professionalId,
        limit,
        sort: 'startTime_asc'
      }
    });
    
    // Verificar se a resposta tem um objeto "data" para paginação
    const data = response.data && response.data.data ? response.data.data : response.data;
    
    // Garantir que é um array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erro ao buscar próximos agendamentos:", error);
    return [];
  }
};

/**
 * Busca serviços populares do profissional para o dashboard
 * @param professionalId ID do profissional
 * @returns Lista de serviços populares
 */
export const fetchPopularServices = async (professionalId: string) => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    const response = await apiClient.get(`/professionals/${professionalId}/popular-services`);
    
    // Verificando se a resposta é um array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Verificando se temos um objeto com propriedade data que é um array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    return [];
  } catch (error) {
    console.error("Erro ao buscar serviços populares:", error);
    // Fornecer dados simulados em caso de falha na API
    return [
      { id: '1', name: 'Corte Feminino', appointmentCount: 32, rating: 4.8 },
      { id: '2', name: 'Coloração', appointmentCount: 24, rating: 4.7 },
      { id: '3', name: 'Manicure', appointmentCount: 18, rating: 4.6 }
    ];
  }
};

export default apiClient;
