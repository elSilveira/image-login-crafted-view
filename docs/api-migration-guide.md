# Guia de Migração da API

Este documento descreve o processo de migração da estrutura antiga de API para a nova estrutura modular.

## Por que migrar?

A nova estrutura de API oferece várias vantagens:

- **Organização mais clara** - Serviços agrupados por domínio
- **Performance melhorada** - Estratégias de cache otimizadas por tipo de dado
- **Melhor tipagem** - Tipos consistentes e bem definidos
- **Tratamento de erros centralizado** - Abordagem consistente para erros
- **Testabilidade** - Estrutura mais fácil de testar
- **Documentação abrangente** - Todos os endpoints documentados

## Como realizar a migração

### Passo 1: Atualizar importações

Altere suas importações para usar a nova estrutura:

```typescript
// ANTES
import { fetchAppointments } from '@/lib/api';
import { AppointmentWithDetails } from '@/lib/api-services';

// DEPOIS
import { fetchAppointments, Appointment } from '@/api';
```

### Passo 2: Atualizar hooks de consulta

Substitua os hooks padrão pelos hooks otimizados:

```typescript
// ANTES
const { data } = useQuery(['appointments'], fetchAppointments);

// DEPOIS
const { data } = useAppointmentsQuery(['appointments'], () => fetchAppointments());
```

### Passo 3: Melhorar as chaves de query

Use chaves de query mais específicas e detalhadas:

```typescript
// ANTES
const queryKey = ['appointments'];

// DEPOIS
const queryKey = ['professional-appointments', professionalId, date];
```

### Passo 4: Atualizar tratamento de erros

Use o sistema centralizado de tratamento de erros:

```typescript
// ANTES
try {
  const data = await fetchAppointments();
  // código para tratar dados
} catch (error) {
  // código específico para tratar erro
}

// DEPOIS
// O tratamento de erros já está incorporado nas funções de API
// Você só precisa lidar com as mensagens de erro no nível da UI
const { data, error, isError } = useAppointmentsQuery(['appointments'], () => fetchAppointments());

if (isError) {
  // Exibir mensagem ao usuário
}
```

## Exemplos de migração por serviço

### Agendamentos

```typescript
// ANTES
import { fetchAppointments, createAppointment } from '@/lib/api';

// DEPOIS
import { fetchAppointments, createAppointment, Appointment } from '@/api';
```

### Profissionais

```typescript
// ANTES
import { fetchProfessionalDetails } from '@/lib/api';

// DEPOIS
import { fetchProfessionalDetails, Professional } from '@/api';
```

### Serviços

```typescript
// ANTES
import { fetchServices } from '@/lib/api';

// DEPOIS
import { fetchAllServices, Service } from '@/api';
```

### Categorias

```typescript
// ANTES
import { fetchCategories } from '@/lib/api';

// DEPOIS
import { fetchCategories, Category } from '@/api';
```

### Empresas

```typescript
// ANTES
import { fetchCompanyDetails } from '@/lib/api';

// DEPOIS
import { fetchCompanyDetails, Company } from '@/api';
```

### Usuários

```typescript
// ANTES
import { fetchUserProfile, updateUserProfile } from '@/lib/api';

// DEPOIS
import { fetchUserProfile, updateUserProfile, User } from '@/api';
```

## Cronograma recomendado

1. Comece migrando os componentes de uso menos frequente
2. Migre em seguida os componentes de uso moderado
3. Por último, migre os componentes críticos após ter validado a abordagem

## Verificação de compatibilidade

Para garantir que a migração não cause problemas:

1. Teste cada componente após a migração
2. Verifique se o comportamento de cache está correto
3. Verifique se os tipos estão adequados
4. Confirme que o tratamento de erros está funcionando

## Suporte

Se encontrar problemas durante a migração, consulte a documentação em:
- `docs/api-requests.md` - Lista de todas as requisições disponíveis
- `src/api/index.ts` - Ponto de entrada único para todas as funções de API 