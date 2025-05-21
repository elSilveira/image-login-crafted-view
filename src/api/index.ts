/**
 * API Services - Ponto Central de Exportação
 * 
 * Este arquivo exporta todas as funções de API organizadas por domínios,
 * permitindo importações mais limpas nos componentes.
 */

// Cliente HTTP
export { default as apiClient } from './client';
export { apiRequest } from './client';

// Serviços de Agendamentos
export * from './appointments';

// Serviços de Profissionais
export * from './professionals';

// Serviços de Busca
export * from './search';

// Serviços de Avaliações
export * from './reviews';

// Serviços de Categorias
export * from './categories';

// Serviços de Empresas
export * from './companies';

// Serviços de Serviços
export * from './services';

// Serviços de Usuários
export * from './users';

// Re-exporta tipos
export * from './types';

// Hooks otimizados para consultas de API (com cache otimizado)
export * from '../hooks/use-query-optimized';

/**
 * NOTA SOBRE MIGRAÇÃO:
 * 
 * Para migrar da estrutura antiga para a nova estrutura de API:
 * 
 * 1. Substitua importações existentes de src/lib/api.ts por importações de src/api
 *    Por exemplo:
 *    - Antes: import { fetchAppointments } from '@/lib/api';
 *    - Depois: import { fetchAppointments } from '@/api';
 * 
 * 2. Para tipos, importe diretamente de @/api
 *    Por exemplo:
 *    - Antes: import { AppointmentWithDetails } from '@/lib/api-services';
 *    - Depois: import { Appointment } from '@/api';
 * 
 * 3. Quando necessário, atualize a declaração de tipos de resposta:
 *    - Antes: const { data } = useQuery<any[]>(['appointments'], fetchAppointments);
 *    - Depois: const { data } = useQuery<Appointment[]>(['appointments'], fetchAppointments);
 * 
 * 4. Para melhor desempenho, considere utilizar os hooks otimizados:
 *    - Antes: const { data } = useQuery(['categories'], fetchCategories);
 *    - Depois: const { data } = useCategoriesQuery(['categories'], () => fetchCategories());
 */ 