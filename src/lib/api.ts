import axios from "axios";

// Define a interface para o payload do token JWT (ajuste conforme necessário)
interface JwtPayload {
  userId: string;
  // Adicione outras propriedades do payload se houver
}

// Cria uma instância do Axios com a URL base da API
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3001/") + "api", // Use variável de ambiente ou fallback
});

// Interceptor para adicionar o token JWT ao cabeçalho Authorization
apiClient.interceptors.request.use(
  (config) => {
    // Tenta obter o token do localStorage (ou de onde ele for armazenado pelo AuthContext)
    const token = localStorage.getItem("accessToken"); // Ajuste a chave conforme necessário

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptor para lidar com respostas (ex: refresh token, erros globais)
apiClient.interceptors.response.use(
  (response) => {
    // Qualquer código de status que esteja dentro do intervalo de 2xx faz com que esta função seja acionada
    return response;
  },
  (error) => {
    // Qualquer código de status que caia fora do intervalo de 2xx faz com que esta função seja acionada
    if (error.response && error.response.status === 401) {
      // Exemplo: Lidar com token expirado ou inválido
      // Poderia redirecionar para login ou tentar refresh token
      console.error("Erro 401: Não autorizado ou token inválido/expirado.");
      // Limpar token inválido e redirecionar para login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      // Forçar recarregamento ou usar navigate fora do contexto React
      if (window.location.pathname !== "/login") {
         window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// --- User Profile API Functions ---

// Função para buscar o perfil do usuário autenticado
export const fetchUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data; // Retorna os dados do usuário
};

// Função para atualizar o perfil do usuário autenticado
// data: Objeto contendo apenas os campos a serem atualizados
export const updateUserProfile = async (data: any) => {
  const response = await apiClient.put("/users/me", data);
  return response.data; // Retorna a resposta (pode incluir mensagem de sucesso)
};


// --- User Addresses API Functions ---

// Função para buscar os endereços do usuário autenticado
export const fetchUserAddresses = async () => {
  const response = await apiClient.get("/users/me/addresses");
  return response.data;
};

// Função para criar um novo endereço para o usuário autenticado
export const createUserAddress = async (addressData: any) => {
  const response = await apiClient.post("/users/me/addresses", addressData);
  return response.data;
};

// Função para atualizar um endereço específico do usuário
export const updateUserAddress = async (addressId: string, addressData: any) => {
  const response = await apiClient.put(`/users/me/addresses/${addressId}`, addressData);
  return response.data;
};

// Função para deletar um endereço específico do usuário
export const deleteUserAddress = async (addressId: string) => {
  const response = await apiClient.delete(`/users/me/addresses/${addressId}`);
  return response.data; // Geralmente retorna 204 No Content, mas pode ter corpo vazio
};

export const fetchAppointments = async () => {
  const response = await apiClient.get("/appointments"); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados das consultas
}

export const fetchCategories = async () => {
  const response = await apiClient.get("/categories"); // Ajuste a rota conforme necessário 
  return response.data; // Retorna os dados das categorias
}

export const fetchCompanies = async () => {
  const response = await apiClient.get("/companies"); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados das empresas
}

export const fetchServices = async () => {
  const response = await apiClient.get("/services"); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados dos serviços
}

export const fetchProfessionalDetails = async (professionalId:string) => {
  const response = await apiClient.get(`/professonals/${professionalId}`); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados dos profissionais
}

export const fetchCompanyDetails = async (companyId:string) => {
  const response = await apiClient.get(`/companies/${companyId}`); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados da empresa
}

export const fetchServiceDetails = async (serviceId:string) => {
  const response = await apiClient.get(`/services/${serviceId}`); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados do serviço
}

export const fetchAvailability = async (professionalId:string, date:string) => {
  const response = await apiClient.get(`/professionals/${professionalId}/availability`, { params: { date } }); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados de disponibilidade
}

export const createAppointment = async (appointmentData: any) => {
  const response = await apiClient.post("/appointments", appointmentData); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados do agendamento criado
}

export const updateProfessionalProfile = async (professionalId:string, data: any) => {
  const response = await apiClient.put(`/professionals/${professionalId}`, data); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados do perfil atualizado
}

export const registerCompany = async (companyData: any) => {
  const response = await apiClient.post("/companies", companyData); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados da empresa criada
}

export const fetchCompanyAppointments = async (companyId:string) => {
  const response = await apiClient.get(`/companies/${companyId}/appointments`); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados dos agendamentos da empresa
}

export const fetchCompanyServices = async (companyId:string) => {
  const response = await apiClient.get(`/companies/${companyId}/services`); // Ajuste a rota conforme necessário
  return response.data; // Retorna os dados dos serviços da empresa
}

// Adicione outras funções de API conforme necessário (empresas, serviços, etc.)

export default apiClient;

