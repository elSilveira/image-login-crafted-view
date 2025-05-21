# Requisitos de API Backend para Dashboard de Profissionais

Este documento descreve os endpoints de API necessários para implementar corretamente o dashboard de profissionais na aplicação frontend.

## Endpoints Essenciais

### Dashboard Stats

**Endpoint:** `/professionals/{id}/dashboard-stats`  
**Método:** GET  
**Propósito:** Fornecer estatísticas gerais para o dashboard do profissional.

**Resposta esperada:**
```json
{
  "currentMonthRevenue": 4230,
  "previousMonthRevenue": 3780,
  "currentMonthAppointments": 78,
  "previousMonthAppointments": 72,
  "currentMonthNewClients": 24,
  "previousMonthNewClients": 25
}
```

**Nota de implementação:**
- `currentMonthRevenue`: Receita total do mês atual (em reais)
- `previousMonthRevenue`: Receita total do mês anterior (em reais)
- `currentMonthAppointments`: Número total de agendamentos no mês atual
- `previousMonthAppointments`: Número total de agendamentos no mês anterior
- `currentMonthNewClients`: Número de novos clientes no mês atual
- `previousMonthNewClients`: Número de novos clientes no mês anterior

### Serviços Populares

**Endpoint:** `/professionals/{id}/popular-services`  
**Método:** GET  
**Propósito:** Fornecer lista dos serviços mais populares do profissional.

**Resposta esperada:**
```json
[
  {
    "id": "1",
    "name": "Corte Feminino",
    "appointmentCount": 32,
    "rating": 4.8
  },
  {
    "id": "2",
    "name": "Coloração",
    "appointmentCount": 24,
    "rating": 4.7
  },
  {
    "id": "3",
    "name": "Manicure",
    "appointmentCount": 18,
    "rating": 4.6
  }
]
```

**Formato alternativo aceitável (wrapper com data):**
```json
{
  "data": [
    {
      "id": "1",
      "name": "Corte Feminino",
      "appointmentCount": 32,
      "rating": 4.8
    },
    ...
  ]
}
```

**Nota de implementação:**
- `id`: Identificador único do serviço
- `name`: Nome do serviço
- `appointmentCount`: Número de agendamentos para este serviço
- `rating`: Avaliação média do serviço (0-5)
- A lista deve ser ordenada por número de agendamentos (mais popular primeiro)

### Próximos Agendamentos

**Endpoint:** `/appointments`  
**Método:** GET  
**Parâmetros:**
- `professionalId`: ID do profissional
- `dateFrom`: Data inicial (formato ISO)
- `dateTo`: Data final (formato ISO)
- `include`: Relações a incluir (user,service)
- `status`: Status dos agendamentos (PENDING,CONFIRMED)
- `limit`: Número máximo de resultados
- `sort`: Ordenação (startTime_asc)

**Resposta esperada:**
```json
{
  "data": [
    {
      "id": "1",
      "startTime": "2023-10-15T14:00:00Z",
      "endTime": "2023-10-15T15:00:00Z",
      "status": "CONFIRMED",
      "service": {
        "id": "101",
        "name": "Corte Feminino"
      },
      "user": {
        "id": "201",
        "name": "Maria Silva"
      }
    },
    ...
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 5
  }
}
```

**Formato alternativo aceitável (apenas array):**
```json
[
  {
    "id": "1",
    "startTime": "2023-10-15T14:00:00Z",
    "endTime": "2023-10-15T15:00:00Z",
    "status": "CONFIRMED",
    "service": {
      "id": "101",
      "name": "Corte Feminino"
    },
    "user": {
      "id": "201",
      "name": "Maria Silva"
    }
  },
  ...
]
```

## Requisitos de Segurança e Autenticação

- Todos os endpoints devem exigir autenticação
- O profissional só deve ter acesso aos seus próprios dados
- Implementar rate limiting para evitar sobrecarga do servidor

## Tratamento de Erros

O backend deve retornar códigos de erro HTTP adequados e mensagens descritivas:

- `400` - Requisição inválida (parâmetros faltando ou inválidos)
- `401` - Não autorizado (token inválido ou expirado)
- `403` - Proibido (sem permissão para acessar o recurso)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## Considerações de Performance

- Os endpoints de dashboard devem ter cache configurado para 5 minutos
- Implemente paginação e limitação de resultados para todas as listas
- Otimize as consultas de banco de dados para evitar carga excessiva

## Estratégias para Resiliência e Suporte Offline

Para garantir que o dashboard funcione mesmo em situações de conectividade instável ou acesso offline, recomendamos as seguintes estratégias:

### Suporte a HTTP Cache e Service Workers

- Configure os cabeçalhos Cache-Control para permitir armazenamento em cache no navegador
- Exemplo: `Cache-Control: max-age=300, stale-while-revalidate=3600` (permite uso de dados com até 1 hora de antiguidade enquanto atualiza em segundo plano)
- Use ETag para permitir validação eficiente de cache

### Formato de Resposta para Falhas Parciais

Quando apenas parte dos dados está disponível, a API deve retornar um status 206 (Partial Content) com um formato consistente:

```json
{
  "data": {
    "stats": { ... },  // Dados disponíveis 
    "appointments": null,  // Indisponível
    "services": [ ... ]  // Dados disponíveis
  },
  "meta": {
    "partial": true,
    "unavailable": ["appointments"],
    "cached": ["stats", "services"],
    "cacheDate": "2023-10-15T14:00:00Z"
  }
}
```

### Simulação para Desenvolvimento

Durante o desenvolvimento, o backend deve fornecer um endpoint de simulação que imita falhas de rede e respostas parciais:

**Endpoint:** `/debug/simulate/network`  
**Método:** GET  
**Parâmetros:**
- `scenario`: tipo de simulação (offline, slow, intermittent)
- `duration`: duração em segundos

Este recurso permite testar o comportamento do frontend em situações adversas de conectividade. 