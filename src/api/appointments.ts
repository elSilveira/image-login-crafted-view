import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { 
  Appointment, 
  AppointmentParams, 
  AppointmentCreateData, 
  PaginatedResponse,
  AppointmentReviewStatus
} from './types';

/**
 * Serviço de API para gerenciar agendamentos
 * Centraliza todas as operações relacionadas a agendamentos
 */

/**
 * Busca agendamentos com base nos parâmetros fornecidos
 * @param params Parâmetros para filtrar, paginar e ordenar agendamentos
 * @returns Lista de agendamentos
 */
export const fetchAppointments = async (params: AppointmentParams = {}): Promise<Appointment[] | PaginatedResponse<Appointment>> => {
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/appointments',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw error;
  }
};

/**
 * Busca agendamentos do usuário autenticado
 * @param params Parâmetros opcionais de filtro
 * @returns Lista de agendamentos do usuário
 */
export const fetchMyAppointments = async (params: AppointmentParams = {}): Promise<Appointment[] | PaginatedResponse<Appointment>> => {
  const normalizedParams = normalizeApiParams(params);

  try {
    return await apiRequest({
      method: 'GET',
      url: '/appointments/me',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar meus agendamentos:', error);
    throw error;
  }
};

/**
 * Busca agendamentos de um profissional em um período específico
 * @param professionalId ID do profissional
 * @param dateFrom Data inicial (formato YYYY-MM-DD)
 * @param dateTo Data final (formato YYYY-MM-DD)
 * @param includeParams Parâmetros adicionais
 * @returns Lista de agendamentos do profissional
 */
export const fetchProfessionalAppointments = async (
  professionalId: string, 
  dateFrom: string, 
  dateTo: string,
  includeParams?: Partial<AppointmentParams>
): Promise<Appointment[] | PaginatedResponse<Appointment>> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  const params = normalizeApiParams({
    professionalId,
    dateFrom,
    dateTo,
    include: 'user,service,professional,services.service',
    limit: 100,
    sort: 'startTime_asc',
    ...includeParams
  });
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/appointments',
      params
    });
  } catch (error) {
    console.error(`Erro ao buscar agendamentos do profissional ${professionalId}:`, error);
    throw error;
  }
};

/**
 * Busca agendamentos próximos para o dashboard
 * @param professionalId ID do profissional
 * @param limit Limite de resultados
 * @returns Lista de próximos agendamentos
 */
export const fetchUpcomingAppointments = async (
  professionalId: string, 
  limit = 5
): Promise<Appointment[]> => {
  if (!professionalId) {
    throw new Error("ID do profissional é obrigatório");
  }
  
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);
  
  const params = normalizeApiParams({
    professionalId,
    dateFrom: today.toISOString().split('T')[0],
    dateTo: nextMonth.toISOString().split('T')[0],
    include: 'user,service',
    status: 'PENDING,CONFIRMED',
    limit: limit.toString(),
    sort: 'startTime_asc',
  });
  
  try {
    const response = await apiRequest<PaginatedResponse<Appointment>>({
      method: 'GET',
      url: '/appointments',
      params
    });
    
    return Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Erro ao buscar próximos agendamentos:', error);
    return [];
  }
};

/**
 * Busca agendamentos de uma empresa
 * @param companyId ID da empresa
 * @param params Parâmetros adicionais
 * @returns Lista de agendamentos da empresa
 */
export const fetchCompanyAppointments = async (
  companyId: string, 
  params: AppointmentParams = {}
): Promise<Appointment[] | PaginatedResponse<Appointment>> => {
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório");
  }
  
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/companies/${companyId}/appointments`,
      params: normalizedParams
    });
  } catch (error) {
    console.error(`Erro ao buscar agendamentos da empresa ${companyId}:`, error);
    throw error;
  }
};

/**
 * Busca detalhes de um agendamento específico
 * @param appointmentId ID do agendamento
 * @returns Detalhes do agendamento
 */
export const fetchAppointmentDetails = async (
  appointmentId: string
): Promise<Appointment> => {
  if (!appointmentId) {
    throw new Error("ID do agendamento é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/appointments/${appointmentId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes do agendamento ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Cria um novo agendamento
 * @param appointmentData Dados do agendamento a ser criado
 * @returns Agendamento criado
 */
export const createAppointment = async (
  appointmentData: AppointmentCreateData
): Promise<Appointment> => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/appointments',
      data: appointmentData
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    throw error;
  }
};

/**
 * Atualiza o status de um agendamento
 * @param appointmentId ID do agendamento
 * @param status Novo status
 * @returns Agendamento atualizado
 */
export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: string
): Promise<Appointment> => {
  if (!appointmentId) {
    throw new Error("ID do agendamento é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'PATCH',
      url: `/appointments/${appointmentId}/status`,
      data: { status }
    });
  } catch (error) {
    console.error(`Erro ao atualizar status do agendamento ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Cancela um agendamento
 * @param appointmentId ID do agendamento
 * @param reason Motivo do cancelamento (opcional)
 * @returns Agendamento cancelado
 */
export const cancelAppointment = async (
  appointmentId: string, 
  reason?: string
): Promise<Appointment> => {
  if (!appointmentId) {
    throw new Error("ID do agendamento é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'POST',
      url: `/appointments/${appointmentId}/cancel`,
      data: { reason }
    });
  } catch (error) {
    console.error(`Erro ao cancelar agendamento ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Remarca um agendamento
 * @param appointmentId ID do agendamento
 * @param date Nova data (formato YYYY-MM-DD)
 * @returns Agendamento remarcado
 */
export const rescheduleAppointment = async (
  appointmentId: string, 
  date: string
): Promise<Appointment> => {
  if (!appointmentId) {
    throw new Error("ID do agendamento é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'POST',
      url: `/appointments/${appointmentId}/reschedule`,
      data: { date }
    });
  } catch (error) {
    console.error(`Erro ao remarcar agendamento ${appointmentId}:`, error);
    throw error;
  }
};

/**
 * Verifica o status de avaliação de um agendamento
 * @param appointmentId ID do agendamento
 * @returns Status de avaliação
 */
export const checkAppointmentReviewStatus = async (
  appointmentId: string
): Promise<AppointmentReviewStatus> => {
  if (!appointmentId) {
    throw new Error("ID do agendamento é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/appointments/${appointmentId}/review-status`
    });
  } catch (error) {
    console.warn("Endpoint de verificação de avaliação não disponível, usando simulação");
    // Fornece resposta simulada para compatibilidade
    return {
      hasBeenReviewed: false,
      canBeReviewed: true
    };
  }
}; 