# Guia de Integração do Frontend com a API do Dashboard Profissional

Este guia fornece informações detalhadas sobre como integrar seu frontend com a API do Dashboard Profissional do ServiConnect. Todos os endpoints necessários foram implementados e estão prontos para uso.

## Visão Geral da API

A API do Dashboard Profissional consiste em três principais endpoints:

1. **Estatísticas do Dashboard** - Fornece métricas financeiras e de agendamentos
2. **Serviços Populares** - Lista os serviços mais requisitados do profissional
3. **Próximos Agendamentos** - Apresenta os agendamentos confirmados e pendentes

Todos os endpoints exigem autenticação via token JWT e verificam as permissões adequadas do usuário.

## 1. Estatísticas do Dashboard

**Endpoint:** `GET /api/professionals/{id}/dashboard-stats`

Este endpoint fornece estatísticas importantes para exibir na visão principal do dashboard.

### Requisição

- **URL:** `/api/professionals/{id}/dashboard-stats` (substitua `{id}` pelo ID do profissional)
- **Método:** GET
- **Cabeçalhos:**
  ```
  Authorization: Bearer {seu-token-jwt}
  ```

### Resposta

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

### Exemplo de Implementação em React

```jsx
import { useState, useEffect } from 'react';

const DashboardStats = ({ professionalId, token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/professionals/${professionalId}/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar estatísticas: ${response.status}`);
        }

        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Use os dados de fallback apenas se necessário
        setStats({
          currentMonthRevenue: 0,
          previousMonthRevenue: 0,
          currentMonthAppointments: 0,
          previousMonthAppointments: 0,
          currentMonthNewClients: 0,
          previousMonthNewClients: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [professionalId, token]);

  if (loading) return <div>Carregando estatísticas...</div>;

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Receita do Mês</h3>
        <p className="value">R$ {stats?.currentMonthRevenue || 0}</p>
        {stats && (
          <p className={`trend ${stats.currentMonthRevenue > stats.previousMonthRevenue ? 'positive' : 'negative'}`}>
            {stats.currentMonthRevenue > stats.previousMonthRevenue 
              ? `+${((stats.currentMonthRevenue - stats.previousMonthRevenue) / stats.previousMonthRevenue * 100).toFixed(1)}%` 
              : `${((stats.currentMonthRevenue - stats.previousMonthRevenue) / stats.previousMonthRevenue * 100).toFixed(1)}%`}
          </p>
        )}
      </div>
      
      {/* Componentes similares para outras estatísticas */}
    </div>
  );
};

export default DashboardStats;
```

## 2. Serviços Populares

**Endpoint:** `GET /api/professionals/{id}/popular-services`

Este endpoint lista os serviços mais populares do profissional com contagem de agendamentos e avaliações.

### Requisição

- **URL:** `/api/professionals/{id}/popular-services` (substitua `{id}` pelo ID do profissional)
- **Método:** GET
- **Cabeçalhos:**
  ```
  Authorization: Bearer {seu-token-jwt}
  ```

### Resposta

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

### Exemplo de Implementação em React

```jsx
import { useState, useEffect } from 'react';
import { StarRating } from './components/StarRating';

const PopularServices = ({ professionalId, token }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/professionals/${professionalId}/popular-services`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar serviços populares: ${response.status}`);
        }

        const data = await response.json();
        setServices(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        // Mantenha a lista vazia em caso de erro
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, [professionalId, token]);

  if (loading) return <div>Carregando serviços populares...</div>;

  if (services.length === 0) {
    return <div className="no-data">Nenhum serviço encontrado.</div>;
  }

  return (
    <div className="popular-services">
      <h2>Serviços Mais Populares</h2>
      <div className="services-list">
        {services.map(service => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <div className="service-stats">
              <p>{service.appointmentCount} agendamentos</p>
              <StarRating rating={service.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularServices;
```

## 3. Próximos Agendamentos

**Endpoint:** `GET /api/appointments/upcoming`

Este endpoint lista os próximos agendamentos pendentes e confirmados do profissional.

### Requisição

- **URL:** `/api/appointments/upcoming`
- **Método:** GET
- **Parâmetros de consulta:**
  - `professionalId` (obrigatório): ID do profissional
  - `limit` (opcional): Número máximo de registros a retornar (padrão: 5)
  - `page` (opcional): Número da página para paginação (padrão: 1)
  - `sort` (opcional): Campo e direção para ordenação (padrão: 'startTime_asc')
- **Cabeçalhos:**
  ```
  Authorization: Bearer {seu-token-jwt}
  ```

### Resposta

```json
{
  "data": [
    {
      "id": "1",
      "startTime": "2025-05-23T14:00:00Z",
      "endTime": "2025-05-23T15:00:00Z",
      "status": "CONFIRMED",
      "user": {
        "id": "u1",
        "name": "João Silva",
        "email": "joao@exemplo.com",
        "avatar": "https://exemplo.com/avatar.jpg"
      },
      "services": [
        {
          "service": {
            "id": "s1",
            "name": "Corte Feminino",
            "price": 80,
            "duration": 60
          }
        }
      ]
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "pageSize": 5,
    "totalPages": 2
  }
}
```

### Exemplo de Implementação em React

```jsx
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UpcomingAppointments = ({ professionalId, token }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/appointments/upcoming?professionalId=${professionalId}&page=${page}&limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar agendamentos: ${response.status}`);
        }

        const result = await response.json();
        setAppointments(result.data);
        setPagination(result.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
        setAppointments([]);
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [professionalId, token, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.totalPages) {
      setPage(newPage);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM', às' HH:mm", { locale: ptBR });
  };

  if (loading) return <div>Carregando agendamentos...</div>;

  if (appointments.length === 0) {
    return <div className="no-data">Nenhum agendamento encontrado para os próximos dias.</div>;
  }

  return (
    <div className="upcoming-appointments">
      <h2>Próximos Agendamentos</h2>
      <div className="appointments-list">
        {appointments.map(appointment => (
          <div key={appointment.id} className="appointment-card">
            <div className="appointment-header">
              <h3>{formatDateTime(appointment.startTime)}</h3>
              <span className={`status ${appointment.status.toLowerCase()}`}>
                {appointment.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente'}
              </span>
            </div>
            <div className="appointment-details">
              <div className="client-info">
                <img src={appointment.user.avatar || '/default-avatar.png'} alt={appointment.user.name} />
                <p>{appointment.user.name}</p>
              </div>
              <div className="service-info">
                {appointment.services.map(item => (
                  <div key={item.service.id} className="service-item">
                    <p className="service-name">{item.service.name}</p>
                    <p className="service-price">R$ {item.service.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>{page} de {pagination.totalPages}</span>
          <button 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pagination.totalPages}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;
```

## Criando um Dashboard Completo

Abaixo está um exemplo de como integrar todos os componentes em um dashboard completo:

```jsx
import { useState, useEffect } from 'react';
import DashboardStats from './components/DashboardStats';
import PopularServices from './components/PopularServices';
import UpcomingAppointments from './components/UpcomingAppointments';
import { useAuth } from './hooks/useAuth';

const ProfessionalDashboard = () => {
  const { user, token } = useAuth();
  const [professionalId, setProfessionalId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionalId = async () => {
      try {
        // Obter o ID do profissional associado ao usuário atual
        const response = await fetch('/api/professionals/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Falha ao obter dados do profissional');
        }

        const data = await response.json();
        setProfessionalId(data.id);
      } catch (error) {
        console.error('Erro ao buscar perfil profissional:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfessionalId();
    }
  }, [token]);

  if (loading) {
    return <div className="loading">Carregando dashboard...</div>;
  }

  if (!professionalId) {
    return <div className="error-message">Perfil de profissional não encontrado.</div>;
  }

  return (
    <div className="professional-dashboard">
      <h1>Dashboard</h1>
      
      <section className="stats-section">
        <DashboardStats professionalId={professionalId} token={token} />
      </section>
      
      <div className="dashboard-grid">
        <section className="popular-services-section">
          <PopularServices professionalId={professionalId} token={token} />
        </section>
        
        <section className="upcoming-section">
          <UpcomingAppointments professionalId={professionalId} token={token} />
        </section>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
```

## Tratamento de Erros

Todos os endpoints seguem um formato padronizado de resposta de erro:

```json
{
  "error": "Mensagem descrevendo o que deu errado"
}
```

Os códigos de status HTTP comuns incluem:
- `400` - Requisição inválida (parâmetros incorretos)
- `401` - Não autenticado (token ausente ou inválido)
- `403` - Não autorizado (permissões insuficientes)
- `404` - Não encontrado
- `500` - Erro do servidor

Para um tratamento de erros adequado, considere implementar interceptadores de requisição para lidar com erros comuns de forma centralizada:

```jsx
// api.js - Exemplo com axios
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Adicionar token JWT a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tratamento centralizado de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Redirecionar para login ou atualizar token
        window.location.href = '/login?session_expired=true';
      }
      
      if (status === 403) {
        // Redirecionar para página de acesso negado
        window.location.href = '/acesso-negado';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Testes

Para testar sua implementação, você pode usar o script de teste incluído no backend:

```powershell
.\test-dashboard.ps1 -Token "seu-token-jwt" -ProfessionalId "id-do-profissional"
```

## Considerações de Desempenho

- **Caching**: Considere implementar cache no cliente para os dados do dashboard, especialmente para as estatísticas que não mudam frequentemente
- **Lazy Loading**: Carregue os componentes conforme necessário para melhorar o tempo de carregamento inicial
- **Error Boundaries**: Envolva componentes independentes em boundaries de erro para evitar que falhas em um componente afetem todo o dashboard
- **Feedback visual**: Sempre forneça feedback ao usuário durante o carregamento de dados e em caso de erros

## Conclusão

A API do Dashboard Profissional está agora completamente implementada e pronta para integração frontend. Os dados simulados de fallback não são mais necessários, embora seja uma boa prática mantê-los como opção para situações de falha de rede ou erro do servidor.

Para qualquer dúvida adicional, consulte a documentação completa da API ou entre em contato com a equipe de desenvolvimento.
