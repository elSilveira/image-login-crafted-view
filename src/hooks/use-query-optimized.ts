import { 
  useQuery, 
  UseQueryOptions, 
  UseQueryResult, 
  QueryKey 
} from '@tanstack/react-query';
import { API_CACHE_CONFIG } from '@/lib/api-config';

type QueryOptions<TData, TError, TQueryKey extends QueryKey> = 
  Omit<UseQueryOptions<TData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>;

/**
 * Hooks otimizados para React Query
 * 
 * Esta biblioteca oferece hooks pre-configurados para diferentes tipos de dados,
 * com tempos de cache otimizados para cada caso de uso.
 */

/**
 * useQuery com staleTime padrão (5 minutos)
 */
export function useDefaultQuery<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: API_CACHE_CONFIG.defaultStaleTime,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * useQuery para dados que raramente mudam (Infinity staleTime)
 */
export function usePermanentQuery<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: API_CACHE_CONFIG.permanentStaleTime,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * useQuery para categorias (staleTime = Infinity)
 */
export function useCategoriesQuery<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: API_CACHE_CONFIG.categories,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * useQuery para resultados de pesquisa (staleTime = 1 minuto)
 */
export function useSearchQuery<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: API_CACHE_CONFIG.search,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * useQuery para agendamentos (staleTime = 2 minutos)
 */
export function useAppointmentsQuery<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: API_CACHE_CONFIG.appointments,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    ...options
  });
}

/**
 * useQuery para perfis (staleTime = 10 minutos)
 */
export function useProfileQuery<TData = unknown, TError = Error, TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
  queryFn: () => Promise<TData>,
  options?: QueryOptions<TData, TError, TQueryKey>
): UseQueryResult<TData, TError> {
  return useQuery<TData, TError, TData, TQueryKey>({
    queryKey,
    queryFn,
    staleTime: API_CACHE_CONFIG.profile,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
    refetchOnWindowFocus: false,
    ...options
  });
} 