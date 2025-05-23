# Requisitos de API para Dashboard Profissional

## Endpoints Necessários

### 1. Estatísticas do Dashboard
- **Rota:** `/professionals/{id}/dashboard-stats`
- **Método:** GET
- **Resposta:**
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

### 2. Serviços Populares
- **Rota:** `/professionals/{id}/popular-services`
- **Método:** GET
- **Resposta:**
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

### 3. Próximos Agendamentos
- **Rota:** `/appointments`
- **Método:** GET
- **Parâmetros:**
  - `professionalId`: ID do profissional
  - `dateFrom`: Data de início (hoje)
  - `dateTo`: Data final (próximo mês)
  - `include`: 'user,service'
  - `status`: 'PENDING,CONFIRMED'
  - `limit`: Limite de resultados (default: 5)
  - `sort`: 'startTime_asc'

## Observações

O frontend já possui implementações que consomem estes endpoints. Quando estiverem funcionando corretamente, o dashboard exibirá:

1. Estatísticas de faturamento, agendamentos e novos clientes
2. Lista dos serviços mais populares com contagem e avaliação
3. Lista dos próximos agendamentos com detalhes

Existem implementações de fallback no frontend para fornecer dados simulados caso a API falhe, mas para uso em produção os endpoints precisam ser implementados no backend. 