import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { 
  Professional, 
  Service, 
  DashboardStats, 
  PopularService,
  PaginatedResponse
} from './types';

/**
 * Serviço de API para profissionais
 * Centraliza todas as operações relacionadas a profissionais
 */

/**
 * Busca lista de profissionais com filtros opcionais
 * @param params Parâmetros para filtrar profissionais
 * @returns Lista de profissionais
 */
export const fetchProfessionals = async (params: any = {}): Promise<Professional[] | PaginatedResponse<Professional>> => {
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/professionals',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um profissional específico
 * @param professionalId ID do profissional
 * @returns Detalhes do profissional
 */
export const fetchProfessionalDetails = async (professionalId: string): Promise<Professional> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/professionals/${professionalId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes do profissional ${professionalId}:`, error);
    throw error;
  }
};

/**
 * Busca o perfil do profissional autenticado
 * @returns Perfil do profissional
 */
export const fetchProfessionalMe = async (): Promise<Professional> => {
  try {
    return await apiRequest({
      method: 'GET',
      url: '/professionals/me'
    });
  } catch (error) {
    console.error('Erro ao buscar perfil do profissional autenticado:', error);
    throw error;
  }
};

/**
 * Cria ou atualiza perfil profissional
 * @param data Dados do perfil profissional
 * @returns Perfil profissional criado/atualizado
 */
export const updateProfessionalProfile = async (data: Partial<Professional>): Promise<Professional> => {
  try {
    // Se o ID estiver presente, é uma atualização
    if (data.id) {
      return await apiRequest({
        method: 'PUT',
        url: `/professionals/${data.id}`,
        data
      });
    } 
    // Caso contrário, é uma criação
    else {
      return await apiRequest({
        method: 'POST',
        url: '/professionals',
        data
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar perfil profissional:', error);
    throw error;
  }
};

/**
 * Busca estatísticas do dashboard para o profissional
 * @param professionalId ID do profissional
 * @returns Estatísticas do dashboard
 */
export const fetchProfessionalDashboardStats = async (professionalId: string): Promise<DashboardStats> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/professionals/${professionalId}/dashboard-stats`
    });
  } catch (error) {
    console.error(`Erro ao buscar estatísticas do dashboard para o profissional ${professionalId}:`, error);
    // Fornece dados simulados em caso de falha na API
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
 * Busca serviços populares do profissional para o dashboard
 * @param professionalId ID do profissional
 * @returns Lista de serviços populares
 */
export const fetchPopularServices = async (professionalId: string): Promise<PopularService[]> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/professionals/${professionalId}/popular-services`
    });
  } catch (error) {
    console.error(`Erro ao buscar serviços populares do profissional ${professionalId}:`, error);
    // Fornece dados simulados em caso de falha na API
    return [
      { id: '1', name: 'Corte Feminino', appointmentCount: 32, rating: 4.8 },
      { id: '2', name: 'Coloração', appointmentCount: 24, rating: 4.7 },
      { id: '3', name: 'Manicure', appointmentCount: 18, rating: 4.6 }
    ];
  }
};

/**
 * Busca serviços oferecidos por um profissional
 * @param professionalId ID do profissional
 * @returns Lista de serviços
 */
export const fetchProfessionalServices = async (professionalId: string): Promise<Service[]> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/professionals/${professionalId}/services`
    });
  } catch (error) {
    console.error(`Erro ao buscar serviços do profissional ${professionalId}:`, error);
    throw error;
  }
};

/**
 * Busca datas disponíveis para um profissional
 * @param professionalId ID do profissional
 * @returns Lista de datas disponíveis em formato YYYY-MM-DD
 */
export const fetchProfessionalAvailableDates = async (professionalId: string): Promise<string[]> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  try {
    const response = await apiRequest<{ availableDates: string[] }>({
      method: 'GET',
      url: `/professionals/${professionalId}/available-dates`
    });
    
    return response.availableDates || [];
  } catch (error) {
    console.error(`Erro ao buscar datas disponíveis para o profissional ${professionalId}:`, error);
    // Em caso de falha, retorna datas dos próximos 30 dias
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Pula domingos (0 = domingo no getDay)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  }
};

/**
 * Busca disponibilidade de horários para um profissional em uma data específica
 * @param professionalId ID do profissional
 * @param date Data no formato YYYY-MM-DD
 * @param serviceId ID do serviço (opcional)
 * @returns Lista de horários disponíveis
 */
export const fetchProfessionalAvailability = async (
  professionalId: string, 
  date: string,
  serviceId?: string
): Promise<string[]> => {
  if (!professionalId || !date) {
    throw new Error("ID do profissional e data são obrigatórios");
  }
  
  try {
    const params: any = { date };
    if (serviceId) params.serviceId = serviceId;
    
    return await apiRequest({
      method: 'GET',
      url: `/professionals/${professionalId}/availability`,
      params
    });
  } catch (error) {
    console.error(`Erro ao buscar disponibilidade para o profissional ${professionalId} na data ${date}:`, error);
    throw error;
  }
}; 