import { apiRequest } from './client';
import { normalizeApiParams } from '@/lib/api-config';
import { 
  Category,
  PaginatedResponse
} from './types';

/**
 * Serviço de API para categorias
 * Centraliza todas as operações relacionadas a categorias na plataforma
 */

/**
 * Busca todas as categorias com filtros opcionais
 * @param params Parâmetros para filtrar categorias (opcional)
 * @returns Lista de categorias
 */
export const fetchCategories = async (params: Record<string, any> = {}): Promise<Category[] | PaginatedResponse<Category>> => {
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/categories',
      params: normalizedParams
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};

/**
 * Busca detalhes de uma categoria específica
 * @param categoryId ID da categoria
 * @returns Detalhes da categoria
 */
export const fetchCategoryDetails = async (categoryId: string): Promise<Category> => {
  if (!categoryId) {
    throw new Error("ID da categoria é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/categories/${categoryId}`
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes da categoria ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Busca categorias por slug
 * @param slug Slug da categoria
 * @returns Categoria correspondente ao slug
 */
export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  if (!slug) {
    throw new Error("Slug da categoria é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'GET',
      url: '/categories/slug',
      params: { slug }
    });
  } catch (error) {
    console.error(`Erro ao buscar categoria pelo slug ${slug}:`, error);
    throw error;
  }
};

/**
 * Busca serviços de uma categoria específica
 * @param categoryId ID da categoria
 * @param params Parâmetros adicionais (paginação, filtros)
 * @returns Lista de serviços da categoria
 */
export const fetchCategoryServices = async (
  categoryId: string,
  params: Record<string, any> = {}
): Promise<any> => {
  if (!categoryId) {
    throw new Error("ID da categoria é obrigatório");
  }
  
  const normalizedParams = normalizeApiParams(params);
  
  try {
    return await apiRequest({
      method: 'GET',
      url: `/categories/${categoryId}/services`,
      params: normalizedParams
    });
  } catch (error) {
    console.error(`Erro ao buscar serviços da categoria ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Cria uma nova categoria (apenas para administradores)
 * @param categoryData Dados da categoria a ser criada
 * @returns Categoria criada
 */
export const createCategory = async (
  categoryData: Partial<Category>
): Promise<Category> => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/categories',
      data: categoryData
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    throw error;
  }
};

/**
 * Atualiza uma categoria existente (apenas para administradores)
 * @param categoryId ID da categoria
 * @param categoryData Dados da categoria a serem atualizados
 * @returns Categoria atualizada
 */
export const updateCategory = async (
  categoryId: string,
  categoryData: Partial<Category>
): Promise<Category> => {
  if (!categoryId) {
    throw new Error("ID da categoria é obrigatório");
  }
  
  try {
    return await apiRequest({
      method: 'PUT',
      url: `/categories/${categoryId}`,
      data: categoryData
    });
  } catch (error) {
    console.error(`Erro ao atualizar categoria ${categoryId}:`, error);
    throw error;
  }
};

/**
 * Exclui uma categoria (apenas para administradores)
 * @param categoryId ID da categoria
 * @returns Status da operação
 */
export const deleteCategory = async (categoryId: string): Promise<void> => {
  if (!categoryId) {
    throw new Error("ID da categoria é obrigatório");
  }
  
  try {
    await apiRequest({
      method: 'DELETE',
      url: `/categories/${categoryId}`
    });
  } catch (error) {
    console.error(`Erro ao excluir categoria ${categoryId}:`, error);
    throw error;
  }
}; 