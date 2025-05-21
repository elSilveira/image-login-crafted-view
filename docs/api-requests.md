# Documentação de Requisições de API

Este documento lista todas as chamadas de API utilizadas pela aplicação, detalhando seus parâmetros necessários, onde são usadas e como otimizar sua utilização.

## Estrutura de APIs da Aplicação

A aplicação foi reorganizada para usar uma abordagem modular de serviços API:

- **Cliente Centralizado**: `src/api/client.ts` - cliente HTTP centralizado com interceptadores
- **Módulos de Serviço**:
  - `src/api/appointments.ts` - serviços relacionados a agendamentos
  - `src/api/professionals.ts` - serviços relacionados a profissionais
  - `src/api/search.ts` - serviços de busca
  - `src/api/reviews.ts` - serviços de avaliações 
  - `src/api/categories.ts` - serviços relacionados a categorias
  - `src/api/companies.ts` - serviços relacionados a empresas
  - `src/api/services.ts` - serviços relacionados a serviços oferecidos
  - `src/api/users.ts` - serviços relacionados a usuários
- **Hooks Otimizados**: `src/hooks/use-query-optimized.ts` - hooks personalizados com tempo de cache otimizado

## Requisições Primárias

### Agendamentos (Appointments)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/appointments` | `fetchAppointments` | - | Várias telas | 2 min |
| GET | `/appointments/me` | `fetchMyAppointments` | - | Histórico de Agendamentos | 2 min |
| GET | `/appointments/{id}` | `fetchAppointmentDetails` | `id` | Detalhes de Agendamento | 2 min |
| POST | `/appointments` | `createAppointment` | `professionalId`, `serviceId`, `date` | Fluxo de Agendamento | - |
| PATCH | `/appointments/{id}/status` | `updateAppointmentStatus` | `id`, `status` | Gerenciamento de Agendamentos | - |
| POST | `/appointments/{id}/cancel` | `cancelAppointment` | `id` | Cancelar Agendamento | - |
| POST | `/appointments/{id}/reschedule` | `rescheduleAppointment` | `id`, `date` | Remarcar Agendamento | - |
| GET | `/appointments/{id}/review-status` | `checkAppointmentReviewStatus` | `id` | Verificar status de avaliação | 2 min |
| GET | `/companies/{id}/appointments` | `fetchCompanyAppointments` | `companyId` | Agendamentos de Empresa | 2 min |

### Profissionais (Professionals)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/professionals` | `fetchProfessionals` | - | Listagem de Profissionais | 5 min |
| GET | `/professionals/{id}` | `fetchProfessionalDetails` | `id` | Perfil do Profissional | 10 min |
| GET | `/professionals/me` | `fetchProfessionalMe` | - | Meu Perfil Profissional | 10 min |
| POST/PUT | `/professionals` or `/professionals/{id}` | `updateProfessionalProfile` | Dados do perfil | Atualização de Perfil | - |
| GET | `/professionals/{id}/dashboard-stats` | `fetchProfessionalDashboardStats` | `id` | Dashboard do Profissional | 5 min |
| GET | `/professionals/{id}/popular-services` | `fetchPopularServices` | `id` | Dashboard do Profissional | 5 min |
| GET | `/professionals/{id}/services` | `fetchProfessionalServices` | `id` | Perfil e Agendamento | 5 min |
| GET | `/professionals/{id}/available-dates` | `fetchProfessionalAvailableDates` | `id` | Fluxo de Agendamento | 5 min |
| GET | `/professionals/{id}/availability` | `fetchProfessionalAvailability` | `id`, `date` | Seleção de Horário | 5 min |

### Busca (Search)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/search` | `fetchSearchResults` | Parâmetros de busca | Página de Busca | 1 min |
| GET | `/search` (tipo: services) | `fetchServices` | `type: 'services'` | Listagem de Serviços | 1 min |
| GET | `/search` (filtro profissional) | `fetchProfessionalServicesViaSearch` | `professionalId`, `type: 'services'` | Perfil Profissional | 1 min |
| GET | `/search` (tipo: professionals) | `fetchProfessionalsViaSearch` | `type: 'professionals'` | Busca de Profissionais | 1 min |
| GET | `/search` (tipo: companies) | `fetchCompaniesViaSearch` | `type: 'companies'` | Busca de Empresas | 1 min |
| GET | `/search/quick` | `fetchQuickBookingOptions` | `q` (consulta) | Busca Rápida | 1 min |

### Avaliações (Reviews)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/reviews` | `fetchReviews` | Pelo menos um: `serviceId`, `professionalId`, `companyId` | Listagem de Avaliações | 15 min |
| GET | `/professionals/{id}/reviews` | `fetchProfessionalReviewsWithStats` | `id` | Perfil Profissional | 15 min |
| GET | `/reviews/{id}` | `fetchReviewById` | `id` | Detalhes de Avaliação | 15 min |
| POST | `/reviews` | `createReview` | `rating` e pelo menos um: `serviceId`, `professionalId`, `companyId` | Criar Avaliação | - |
| PATCH | `/reviews/{id}` | `updateReview` | `id` | Atualizar Avaliação | - |
| DELETE | `/reviews/{id}` | `deleteReview` | `id` | Excluir Avaliação | - |

### Categorias (Categories)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/categories` | `fetchCategories` | - | Listagem de Categorias | Infinito |
| GET | `/categories/{id}` | `fetchCategoryDetails` | `id` | Detalhes da Categoria | Infinito |
| GET | `/categories/slug` | `fetchCategoryBySlug` | `slug` | Busca por slug | Infinito |
| GET | `/categories/{id}/services` | `fetchCategoryServices` | `id` | Serviços por categoria | 5 min |
| POST | `/categories` | `createCategory` | `name` | Admin - Criar categoria | - |
| PUT | `/categories/{id}` | `updateCategory` | `id` + dados | Admin - Editar categoria | - |
| DELETE | `/categories/{id}` | `deleteCategory` | `id` | Admin - Remover categoria | - |

### Empresas (Companies)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/companies` | `fetchCompanies` | - | Listagem de Empresas | 5 min |
| GET | `/companies/{id}` | `fetchCompanyDetails` | `id` | Perfil da Empresa | 10 min |
| GET | `/companies/me` | `fetchMyCompany` | - | Minha Empresa | 10 min |
| GET | `/companies/{id}/professionals` | `fetchCompanyProfessionals` | `id` | Profissionais da Empresa | 5 min |
| GET | `/companies/{id}/services` | `fetchCompanyServices` | `id` | Serviços da Empresa | 5 min |
| GET | `/companies/{id}/dashboard-stats` | `fetchCompanyDashboardStats` | `id` | Dashboard da Empresa | 5 min |
| POST | `/companies` | `createCompany` | Dados da empresa | Criar Empresa | - |
| PUT | `/companies/{id}` | `updateCompany` | `id` + dados | Atualizar Empresa | - |

### Serviços (Services)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/services` | `fetchAllServices` | - | Listagem de Serviços | 5 min |
| GET | `/services/{id}` | `fetchServiceDetails` | `id` | Detalhes do Serviço | 5 min |
| GET | `/services/popular` | `fetchTrendingServices` | - | Serviços Populares | 5 min |
| GET | `/services` (com categoryId) | `fetchServicesByCategory` | `categoryId` | Serviços por Categoria | 5 min |
| POST | `/services` | `createService` | `name`, `categoryId` | Admin - Criar Serviço | - |
| PUT | `/services/{id}` | `updateService` | `id` + dados | Admin - Editar Serviço | - |
| DELETE | `/services/{id}` | `deleteService` | `id` | Admin - Remover Serviço | - |
| POST | `/professionals/{id}/services` | `addServiceToProfessional` | `professionalId`, `serviceId` | Adicionar Serviço ao Prof. | - |
| DELETE | `/professionals/{id}/services/{serviceId}` | `removeServiceFromProfessional` | `professionalId`, `serviceId` | Remover Serviço do Prof. | - |

### Usuários (Users)

| Método | Endpoint | Função | Parâmetros Requeridos | Onde é Utilizado | Cache |
|--------|----------|--------|----------------------|------------------|-------|
| GET | `/users/me` | `fetchUserProfile` | - | Perfil do Usuário | 10 min |
| GET | `/users/{id}` | `fetchUserDetails` | `id` | Admin - Detalhes do Usuário | 10 min |
| PUT | `/users/me` | `updateUserProfile` | Dados do perfil | Atualizar Perfil | - |
| PUT | `/users/me/password` | `updateUserPassword` | `currentPassword`, `newPassword` | Alterar Senha | - |
| POST | `/auth/forgot-password` | `requestPasswordReset` | `email` | Esqueci a Senha | - |
| POST | `/auth/reset-password` | `resetPassword` | `token`, `newPassword` | Redefinir Senha | - |
| POST | `/users/me/profile-picture` | `updateProfilePicture` | `formData` | Atualizar Foto | - |
| GET | `/auth/check-email` | `checkEmailAvailability` | `email` | Verificar Email | - |

## Otimizações Implementadas

1. **Centralização de Cliente HTTP**: Todas as chamadas de API agora usam um cliente HTTP centralizado com interceptadores para autenticação, refresh token e tratamento de erros.

2. **Normalização de Parâmetros**: Parâmetros da API são normalizados antes de enviar, garantindo consistência entre diferentes chamadas.

3. **Gerenciamento de Cache**: Diferentes tipos de dados têm diferentes tempos de cache:
   - Categorias: Cache permanente (raramente mudam)
   - Busca: 1 minuto (dados voláteis)
   - Agendamentos: 2 minutos (atualização frequente)
   - Perfis: 10 minutos (mudanças menos frequentes)
   - Avaliações: 15 minutos (mudanças ocasionais)

4. **Hooks Personalizados**: Hooks do React Query otimizados para cada tipo de dados:
   - `useDefaultQuery` - staleTime padrão de 5 minutos
   - `usePermanentQuery` - staleTime infinito para dados que raramente mudam
   - `useCategoriesQuery` - otimizado para categorias
   - `useSearchQuery` - otimizado para resultados de busca
   - `useAppointmentsQuery` - otimizado para agendamentos
   - `useProfileQuery` - otimizado para perfis de usuário

5. **Duplicação Reduzida**: Funções duplicadas foram consolidadas em serviços específicos, facilitando a manutenção e garantindo consistência de comportamento.

## Recomendações de Uso

1. **Importações**: Use importações centralizadas do módulo `@/api` em vez de importar diretamente de arquivos individuais:
   ```tsx
   // ✅ Bom
   import { fetchAppointments, Appointment } from '@/api';
   
   // ❌ Ruim
   import { fetchAppointments } from '@/lib/api';
   import { AppointmentWithDetails } from '@/lib/api-services';
   ```

2. **Hooks Otimizados**: Prefira usar os hooks otimizados para consultas de API:
   ```tsx
   // ✅ Bom
   const { data } = useAppointmentsQuery(['appointments'], () => fetchAppointments());
   
   // ❌ Ruim
   const { data } = useQuery(['appointments'], fetchAppointments);
   ```

3. **Chaves de Query**: Use chaves de query detalhadas que incluam todos os parâmetros relevantes:
   ```tsx
   // ✅ Bom
   const queryKey = ['professional-appointments', professionalId, date];
   
   // ❌ Ruim
   const queryKey = ['appointments'];
   ```

4. **Tratamento de Erros**: Utilize o tratamento de erros centralizado ao invés de implementar lógicas individuais em cada componente. 

5. **Hooks Obsoletos**: Evite usar hooks do arquivo `use-api-query.ts`, que está marcado como obsoleto. Em vez disso, use os hooks equivalentes do arquivo `use-query-optimized.ts`. 