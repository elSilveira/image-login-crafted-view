import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { 
  Company,
  Professional,
  Service,
  PaginatedResponse
} from './types';

/**
 * Serviço de API para empresas
 * Centraliza todas as operações relacionadas a empresas na plataforma
 */

/**
 * Busca todas as empresas com filtros opcionais
 * @param params Parâmetros para filtrar empresas (opcional)
 * @returns Lista paginada de empresas
 */
export const fetchCompanies = async (params: Record<string, any> = {}): Promise<PaginatedResponse<Company>> => {
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/companies',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar empresas:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma empresa específica
 * @param companyId ID da empresa
 * @returns Detalhes da empresa
 */
export const fetchCompanyDetails = async (companyId: string): Promise<Company> => {
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/companies/${companyId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes da empresa ${companyId}:`, error);
    throw error;
  }
};

/**
 * Busca profissionais de uma empresa específica
 * @param companyId ID da empresa
 * @param params Parâmetros adicionais (paginação, filtros)
 * @returns Lista de profissionais da empresa
 */
export const fetchCompanyProfessionals = async (
  companyId: string,
  params: Record<string, any> = {}
): Promise<PaginatedResponse<Professional>> => {
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório");
  }
  
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/companies/${companyId}/professionals`,
      params: normalizedParams
    });
  } catch (error) {
    console.error(`Erro ao buscar profissionais da empresa ${companyId}:`, error);
    throw error;
  }
};

/**
 * Busca serviços oferecidos por uma empresa
 * @param companyId ID da empresa
 * @param params Parâmetros adicionais (paginação, filtros)
 * @returns Lista de serviços da empresa
 */
export const fetchCompanyServices = async (
  companyId: string,
  params: Record<string, any> = {}
): Promise<PaginatedResponse<Service>> => {
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório");
  }
  
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/companies/${companyId}/services`,
      params: normalizedParams
    });
  } catch (error) {
    console.error(`Erro ao buscar serviços da empresa ${companyId}:`, error);
    throw error;
  }
};

/**
 * Busca estatísticas do dashboard da empresa
 * @param companyId ID da empresa
 * @returns Estatísticas do dashboard
 */
export const fetchCompanyDashboardStats = async (companyId: string): Promise<any> => {
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/companies/${companyId}/dashboard-stats`
    });
  } catch (error) {
    console.error(`Erro ao buscar estatísticas da empresa ${companyId}:`, error);
    
    // Fornece dados simulados em caso de falha na API
    return {
      currentMonthRevenue: 12580,
      previousMonthRevenue: 10920,
      currentMonthAppointments: 245,
      previousMonthAppointments: 210,
      currentMonthNewClients: 68,
      previousMonthNewClients: 59
    };
  }
};

/**
 * Cria uma nova empresa
 * @param companyData Dados da empresa a ser criada
 * @returns Empresa criada
 */
export const createCompany = async (
  companyData: Partial<Company>
): Promise<Company> => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/companies',
      data: companyData
    });
  } catch (error) {
    console.error('Erro ao criar empresa:', error);
    throw error;
  }
};

/**
 * Atualiza uma empresa existente
 * @param companyId ID da empresa
 * @param companyData Dados da empresa a serem atualizados
 * @returns Empresa atualizada
 */
export const updateCompany = async (
  companyId: string,
  companyData: Partial<Company>
): Promise<Company> => {
  if (!companyId) {
    throw new Error("ID da empresa é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'PUT',
      url: `/companies/${companyId}`,
      data: companyData
    });
  } catch (error) {
    console.error(`Erro ao atualizar empresa ${companyId}:`, error);
    throw error;
  }
};

/**
 * Busca a empresa do usuário autenticado
 * @returns Detalhes da empresa do usuário atual
 */
export const fetchMyCompany = async (): Promise<Company> => {
  try {
    return await apiRequest({
      method: 'GET',
      url: '/companies/me'
    });
  } catch (error) {
    console.error('Erro ao buscar empresa do usuário:', error);
    throw error;
  }
}; 