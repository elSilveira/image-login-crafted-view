# Documentação de Requisições de API

Este documento mapeia todas as requisições de API utilizadas na aplicação, incluindo seus endpoints, parâmetros necessários e os momentos em que são chamadas.

## Índice
1. [Autenticação](#autenticação)
2. [Usuários](#usuários)
3. [Categorias](#categorias)
4. [Serviços](#serviços)
5. [Profissionais](#profissionais)
6. [Empresas](#empresas)
7. [Agendamentos](#agendamentos)
8. [Avaliações](#avaliações)
9. [Busca](#busca)
10. [Dashboard](#dashboard)
11. [Service Worker](#service-worker)

---

## Autenticação

### Login
- **Endpoint:** `POST /auth/login`
- **Chamado em:** `AuthContext.tsx` durante o processo de login
- **Parâmetros:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Resposta:**
  ```json
  {
    "accessToken": "string",
    "refreshToken": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string",
      "profilePicture": "string",
      "phone": "string",
      "role": "string",
      "professionalId": "string",
      "companyId": "string"
    }
  }
  ```

### Logout
- **Endpoint:** `POST /auth/logout`
- **Chamado em:** `AuthContext.tsx` durante o processo de logout
- **Parâmetros:**
  ```json
  {
    "refreshToken": "string"
  }
  ```

---

## Usuários

### Obter Perfil do Usuário
- **Endpoint:** `GET /users/me`
- **Chamado em:** Várias partes da aplicação para carregar dados do usuário logado
- **Parâmetros:** Nenhum (utiliza token de autenticação)
- **Resposta:**
  ```json
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "avatar": "string",
    "profilePicture": "string",
    "phone": "string",
    "role": "string"
  }
  ```

### Excluir Endereço de Usuário
- **Endpoint:** `DELETE /users/me/addresses/{addressId}`
- **Chamado em:** Configurações de perfil, ao remover um endereço
- **Parâmetros:** `addressId` (URL path)

---

## Categorias

### Listar Categorias
- **Endpoint:** `GET /categories`
- **Chamado em:** 
  - `Home.tsx`
  - `CategorySection.tsx`
  - `Search.tsx`
- **Parâmetros de Query (opcionais):**
  - `limit`: número (quantidade máxima de resultados)
  - `sort`: string (critério de ordenação)
- **Configuração de Cache:**
  - Tempo de vida: Infinito (categorias raramente mudam)
- **Resposta:**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "icon": "string"
    }
  ]
  ```

---

## Serviços

### Listar Serviços
- **Endpoint:** `GET /services`
- **Chamado em:** Páginas de busca e listagem de serviços
- **Parâmetros de Query (opcionais):**
  - `q`: string (termo de busca)
  - `category`: string (filtro por categoria)
  - `sort`: string (critério de ordenação)
  - `page`: número (paginação)
  - `limit`: número (quantidade por página)
- **Resposta:**
  ```json
  {
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "price": "number",
        "duration": "number",
        "categoryId": "string"
      }
    ],
    "pagination": {
      "total": "number",
      "page": "number",
      "limit": "number"
    }
  }
  ```

### Obter Detalhes de Serviço
- **Endpoint:** `GET /services/{serviceId}`
- **Chamado em:** Página de detalhes do serviço
- **Parâmetros:** `serviceId` (URL path)
- **Resposta:**
  ```json
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "price": "number",
    "duration": "number",
    "categoryId": "string"
  }
  ```

### Criar Serviço
- **Endpoint:** `POST /services`
- **Chamado em:** Área administrativa para criação de serviços
- **Parâmetros:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "duration": "number",
    "categoryId": "string"
  }
  ```

### Atualizar Serviço
- **Endpoint:** `PUT /services/{serviceId}`
- **Chamado em:** Área administrativa para edição de serviços
- **Parâmetros:**
  ```json
  {
    "name": "string",
    "description": "string",
    "price": "number",
    "duration": "number",
    "categoryId": "string"
  }
  ```

---

## Profissionais

### Listar Profissionais
- **Endpoint:** `GET /professionals`
- **Chamado em:** Listagem de profissionais disponíveis
- **Parâmetros de Query (opcionais):**
  - Similares aos da listagem de serviços

### Criar Perfil Profissional
- **Endpoint:** `POST /professionals`
- **Chamado em:** Processo de cadastro como profissional
- **Parâmetros:**
  ```json
  {
    "name": "string",
    "bio": "string",
    "services": "array"
  }
  ```

### Adicionar Serviço ao Profissional
- **Endpoint:** `POST /professionals/{professionalId}/services`
- **Chamado em:** Gerenciamento de serviços do profissional
- **Parâmetros:**
  ```json
  {
    "serviceId": "string",
    "price": "number",
    "description": "string",
    "schedule": [
      {
        "dayOfWeek": "string",
        "startTime": "string",
        "endTime": "string"
      }
    ]
  }
  ```

### Adicionar Serviço ao Perfil Autenticado
- **Endpoint:** `POST /professionals/services`
- **Chamado em:** Área do profissional na adição de serviços
- **Parâmetros:** 
  ```json
  {
    "serviceId": "string",
    "price": "string",
    "description": "string",
    "schedule": "array"
  }
  ```

### Atualizar Serviço do Profissional Autenticado
- **Endpoint:** `PUT /professionals/services/{serviceId}`
- **Chamado em:** Edição de serviços na área do profissional
- **Parâmetros:** Mesmos do endpoint anterior

### Remover Serviço de Profissional
- **Endpoint:** `DELETE /professionals/{professionalId}/services/{serviceId}`
- **Chamado em:** Exclusão de serviços do profissional
- **Parâmetros:** URL path

### Obter Preços de Serviços de Profissional
- **Endpoint:** `GET /professionals/{professionalId}/services/prices`
- **Chamado em:** Visualização e comparação de preços
- **Parâmetros:** `professionalId` (URL path)

### Obter Serviços de Profissional
- **Endpoint:** `GET /professionals/{professionalId}/services`
- **Chamado em:** Página de perfil do profissional
- **Parâmetros:** `professionalId` (URL path)

### Atualizar Preço de Serviço para Profissional
- **Endpoint:** `PATCH /professionals/{professionalId}/services/{serviceId}/price`
- **Chamado em:** Atualização de preços na área do profissional
- **Parâmetros:**
  ```json
  {
    "price": "number"
  }
  ```

### Obter Serviços do Profissional Autenticado
- **Endpoint:** `GET /professionals/me/services`
- **Chamado em:** Dashboard do profissional
- **Parâmetros:** Nenhum (utiliza token de autenticação)

### Obter Serviços do Profissional Autenticado (endpoint alternativo)
- **Endpoint:** `GET /professionals/services`
- **Chamado em:** Dashboard do profissional (versão alternativa)
- **Parâmetros:** Nenhum (utiliza token de autenticação)

---

## Empresas

### Listar Empresas
- **Endpoint:** `GET /companies`
- **Chamado em:** Seção de agendamentos da home, busca
- **Parâmetros de Query (opcionais):**
  - `q`: string (termo de busca)
  - `specialty`: string (filtro por especialidade)
  - `sort`: string (critério de ordenação)
  - `rating`: number (filtro por avaliação)
  - `availability`: string (filtro por disponibilidade)
  - `limit`: number (limite de resultados)

### Obter Detalhes da Empresa
- **Endpoint:** `GET /companies/{companyId}?include=address`
- **Chamado em:** Página de perfil da empresa
- **Parâmetros:** 
  - `companyId` (URL path)
  - `include`: "address" (query parameter para incluir o endereço)

### Registrar Empresa
- **Endpoint:** `POST /companies`
- **Chamado em:** Processo de cadastro de empresa
- **Parâmetros:**
  ```json
  {
    "name": "string",
    "description": "string",
    "specialty": "string",
    "address": "object"
  }
  ```

### Obter Agendamentos da Empresa
- **Endpoint:** `GET /companies/{companyId}/appointments`
- **Chamado em:** Dashboard da empresa, agenda
- **Parâmetros:**
  - `companyId` (URL path)
  - Parâmetros opcionais de query (filtros)

### Obter Serviços da Empresa
- **Endpoint:** `GET /companies/{companyId}/services`
- **Chamado em:** Página de perfil da empresa, listagem de serviços
- **Parâmetros:**
  - `companyId` (URL path)
  - Parâmetros opcionais de query (filtros)

---

## Agendamentos

### Listar Agendamentos
- **Endpoint:** `GET /appointments`
- **Chamado em:** Diversas partes que mostram agendamentos
- **Parâmetros de Query:**
  - `professionalId`: string (filtro por profissional)
  - `dateFrom`: string (data inicial - YYYY-MM-DD)
  - `dateTo`: string (data final - YYYY-MM-DD)
  - `include`: string (entidades relacionadas a incluir, ex: "user,service,professional")
  - `status`: string (filtro por status)
  - `serviceId`: string (filtro por serviço)
  - `limit`: number (limite de resultados)
  - `sort`: string (critério de ordenação, ex: "startTime_asc")
- **Resposta:**
  ```json
  {
    "data": [
      {
        "id": "string",
        "startTime": "string",
        "endTime": "string",
        "status": "string",
        "notes": "string",
        "userId": "string",
        "professionalId": "string",
        "serviceId": "string",
        "companyId": "string",
        "user": "object",
        "professional": "object",
        "service": "object"
      }
    ],
    "meta": {
      "total": "number",
      "page": "number",
      "limit": "number"
    }
  }
  ```

### Obter Agendamentos do Usuário
- **Endpoint:** `GET /appointments/me`
- **Chamado em:** Histórico de agendamentos do usuário
- **Parâmetros de Query (opcionais):**
  - `status`: string (filtro por status)
  - `startDate`: string (data inicial)
  - `endDate`: string (data final)
  - `serviceType`: string (filtro por tipo de serviço)
  - `search`: string (termo de busca)

### Obter Detalhes de Agendamento
- **Endpoint:** `GET /appointments/{appointmentId}`
- **Chamado em:** Modal de detalhes do agendamento
- **Parâmetros:** `appointmentId` (URL path)

### Criar Agendamento
- **Endpoint:** `POST /appointments`
- **Chamado em:** Processo de agendamento de serviço
- **Parâmetros:**
  ```json
  {
    "professionalId": "string",
    "serviceId": "string",
    "date": "string",
    "notes": "string (opcional)"
  }
  ```

### Atualizar Status de Agendamento
- **Endpoint:** `PATCH /appointments/{appointmentId}/status`
- **Chamado em:** Gerenciamento de agendamentos pelo profissional
- **Parâmetros:**
  ```json
  {
    "status": "string"
  }
  ```

### Cancelar Agendamento
- **Endpoint:** `POST /appointments/{appointmentId}/cancel`
- **Chamado em:** Cancelamento de agendamentos pelo usuário ou profissional
- **Parâmetros:**
  ```json
  {
    "reason": "string (opcional)"
  }
  ```

### Remarcar Agendamento
- **Endpoint:** `POST /appointments/{appointmentId}/reschedule`
- **Chamado em:** Remarcação de agendamentos
- **Parâmetros:**
  ```json
  {
    "date": "string"
  }
  ```

---

## Avaliações

### Listar Avaliações
- **Endpoint:** `GET /reviews`
- **Chamado em:** Seção de avaliações em perfis
- **Parâmetros de Query:**
  - Um dos seguintes deve ser fornecido:
    - `serviceId`: string (filtro por serviço)
    - `professionalId`: string (filtro por profissional)
    - `companyId`: string (filtro por empresa)
  - Outros parâmetros opcionais:
    - `startDate`: string (filtro por data)
    - `rating`: number (filtro por classificação)
    - `sort`: string (critério de ordenação)

### Obter Avaliações de Profissional com Estatísticas
- **Endpoint:** `GET /reviews/professional/{professionalId}`
- **Chamado em:** Estatísticas de avaliações em perfil de profissional
- **Parâmetros:** `professionalId` (URL path)
- **Resposta:**
  ```json
  {
    "professional": {
      "id": "string",
      "name": "string",
      "image": "string",
      "avatarUrl": "string",
      "coverImage": "string",
      "coverImageUrl": "string",
      "bio": "string",
      "rating": "number",
      "totalReviews": "number",
      "role": "string"
    },
    "reviews": "array",
    "count": "number"
  }
  ```

### Obter Avaliação Específica
- **Endpoint:** `GET /reviews/{reviewId}`
- **Chamado em:** Visualização de avaliação específica
- **Parâmetros:** `reviewId` (URL path)

### Criar Avaliação
- **Endpoint:** Não documentado explicitamente, provavelmente `POST /reviews`
- **Chamado em:** Após conclusão de serviço

### Excluir Avaliação
- **Endpoint:** `DELETE /reviews/{reviewId}`
- **Chamado em:** Exclusão de avaliações (possivelmente apenas para moderadores)
- **Parâmetros:** `reviewId` (URL path)

### Verificar Status de Avaliação de Agendamento
- **Endpoint:** Não documentado explicitamente

---

## Busca

### Pesquisar Resultados
- **Endpoint:** `GET /search`
- **Chamado em:** Página de busca principal
- **Parâmetros de Query:**
  - `q`: string (termo de busca)
  - `category`: string (filtro por categoria)
  - `sort`: string (critério de ordenação)
  - `page`: number (paginação)
  - `limit`: number (quantidade por página)
  - `type`: string ("services", "professionals", "companies", "all")
  - `professionalTipo`: string (filtro por tipo de profissional)
  - `useProfessionalServices`: boolean (incluir serviços de profissionais)

### Busca Rápida para Agendamento
- **Endpoint:** `GET /search/quick-booking`
- **Chamado em:** Campo de busca rápida na interface
- **Parâmetros de Query:**
  - `q`: string (termo de busca)
  - `limit`: number (quantidade máxima de resultados, padrão 5)

---

## Dashboard

### Obter Estatísticas do Dashboard do Profissional
- **Endpoint:** `GET /professionals/{professionalId}/dashboard-stats`
- **Chamado em:** Dashboard do profissional
- **Parâmetros:** `professionalId` (URL path)
- **Resposta:**
  ```json
  {
    "currentMonthRevenue": "number",
    "previousMonthRevenue": "number",
    "currentMonthAppointments": "number",
    "previousMonthAppointments": "number",
    "currentMonthNewClients": "number",
    "previousMonthNewClients": "number"
  }
  ```

### Obter Próximos Agendamentos para Dashboard
- **Endpoint:** `GET /appointments`
- **Chamado em:** Dashboard do profissional (componente de próximos agendamentos)
- **Parâmetros de Query:**
  - `professionalId`: string
  - `dateFrom`: string (data atual)
  - `dateTo`: string (data atual + 1 mês)
  - `include`: string ("user,service")
  - `status`: string ("pending,confirmed")
  - `limit`: string (número de registros)
  - `sort`: string ("startTime_asc")

### Obter Serviços Populares para Dashboard
- **Endpoint:** `GET /professionals/{professionalId}/popular-services`
- **Chamado em:** Dashboard do profissional (componente de serviços populares)
- **Parâmetros:** `professionalId` (URL path)
- **Resposta:**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "appointmentCount": "number",
      "rating": "number"
    }
  ]
  ```

---

## Service Worker

### Registro de Service Worker
- **Arquivo:** `register-sw.ts`
- **Comportamento:**
  - Registra o service worker com versão de timestamp para evitar cache: `/sw.js?v={timestamp}`
  - Gerencia atualizações automáticas do service worker
  - Lida com situações de offline
  - Limpa caches antigos quando necessário

---

## Considerações para Otimização

1. **Duplicação de Requisições:**
   - Múltiplos endpoints de listagem de serviços de profissional (`/professionals/me/services` e `/professionals/services`)
   - Várias formas de buscar agendamentos

2. **Oportunidades de Cache:**
   - Dados que raramente mudam (como categorias) podem ter um cache mais longo
   - Utilizar staleTime do React Query para reduzir chamadas desnecessárias

3. **Normalização de Parâmetros:**
   - Padronizar estrutura de parâmetros entre endpoints similares
   - Garantir que a mesma lógica de normalização seja aplicada consistentemente

4. **Redução de Requisições:**
   - Combinar múltiplos endpoints em um único quando possível
   - Implementar pre-fetching estratégico de dados necessários em breve