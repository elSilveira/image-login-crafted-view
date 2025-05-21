import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { User } from './types';

/**
 * Serviço de API para usuários
 * Centraliza todas as operações relacionadas a usuários na plataforma
 */

/**
 * Busca o perfil do usuário autenticado
 * @returns Perfil do usuário autenticado
 */
export const fetchUserProfile = async (): Promise<User> => {
  try {
    return await apiRequest({
      method: 'GET',
      url: '/users/me'
    });
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    throw error;
  }
};

/**
 * Busca detalhes de um usuário específico (apenas para administradores)
 * @param userId ID do usuário
 * @returns Detalhes do usuário
 */
export const fetchUserDetails = async (userId: string): Promise<User> => {
  if (!userId) {
    throw new Error("ID do usuário é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/users/${userId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes do usuário ${userId}:`, error);
    throw error;
  }
};

/**
 * Atualiza o perfil do usuário autenticado
 * @param userData Dados do usuário a serem atualizados
 * @returns Perfil atualizado
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    return await apiRequest({
      method: 'PUT',
      url: '/users/me',
      data: userData
    });
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    throw error;
  }
};

/**
 * Atualiza a senha do usuário autenticado
 * @param currentPassword Senha atual
 * @param newPassword Nova senha
 * @returns Status da operação
 */
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  if (!currentPassword || !newPassword) {
    throw new Error("Senha atual e nova senha são obrigatórias");
  }
  
  try {
    await apiRequest({
      method: 'PUT',
      url: '/users/me/password',
      data: { currentPassword, newPassword }
    });
  } catch (error) {
    console.error('Erro ao atualizar senha do usuário:', error);
    throw error;
  }
};

/**
 * Envia uma solicitação para redefinir a senha
 * @param email Email do usuário
 * @returns Status da operação
 */
export const requestPasswordReset = async (email: string): Promise<void> => {
  if (!email) {
    throw new Error("Email é obrigatório");
  }
  
  try {
    await apiRequest({
      method: 'POST',
      url: '/auth/forgot-password',
      data: { email }
    });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    throw error;
  }
};

/**
 * Redefine a senha usando um token de recuperação
 * @param token Token de recuperação
 * @param newPassword Nova senha
 * @returns Status da operação
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  if (!token || !newPassword) {
    throw new Error("Token e nova senha são obrigatórios");
  }
  
  try {
    await apiRequest({
      method: 'POST',
      url: '/auth/reset-password',
      data: { token, newPassword }
    });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    throw error;
  }
};

/**
 * Atualiza a foto de perfil do usuário
 * @param formData FormData contendo a imagem
 * @returns URL da imagem atualizada
 */
export const updateProfilePicture = async (formData: FormData): Promise<{ url: string }> => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/users/me/profile-picture',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    throw error;
  }
};

/**
 * Verifica se o email já está em uso
 * @param email Email a ser verificado
 * @returns {boolean} true se o email estiver disponível, false se já estiver em uso
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  if (!email) {
    throw new Error("Email é obrigatório");
  }
  
  try {
    const response = await apiRequest<{ available: boolean }>({
      method: 'GET',
      url: '/auth/check-email',
      params: { email }
    });
    
    return response.available;
  } catch (error) {
    console.error(`Erro ao verificar disponibilidade do email ${email}:`, error);
    // Em caso de erro, presume que o email já está em uso para evitar conflitos
    return false;
  }
}; 