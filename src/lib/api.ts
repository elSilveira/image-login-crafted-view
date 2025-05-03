import axios from "axios";

// Define a interface para o payload do token JWT (ajuste conforme necessário)
interface JwtPayload {
  userId: string;
  // Adicione outras propriedades do payload se houver
}

// Cria uma instância do Axios com a URL base da API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api", // Use variável de ambiente ou fallback
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


// Adicione outras funções de API conforme necessário (empresas, serviços, etc.)

export default apiClient;

