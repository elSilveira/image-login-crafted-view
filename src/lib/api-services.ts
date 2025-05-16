import apiClient from "./api";

// Interface para tipagem dos dados de serviço
export interface ServiceCreateData {
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  categoryId?: string;
}

// Interface para tipagem dos dados de serviço de profissional
export interface ProfessionalServiceData {
  serviceId: string;
  price?: number;
  description?: string;
  schedule?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}

// Interface para tipagem dos agendamentos
export interface AppointmentData {
  id: string;
  userId: string;
  professionalId: string;
  serviceId: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no-show";

export interface AppointmentWithDetails extends AppointmentData {
  service?: {
    id: string;
    name: string;
    description?: string;
    price?: number;
    duration?: number;
  };
  professional?: {
    id: string;
    name: string;
    role?: string;
    image?: string;
  };
}

// Criar um novo serviço
export const createService = async (serviceData: ServiceCreateData) => {
  const response = await apiClient.post("/services", serviceData);
  return response.data;
};

// Atualizar um serviço existente
export const updateService = async (serviceId: string, serviceData: ServiceCreateData) => {
  const response = await apiClient.put(`/services/${serviceId}`, serviceData);
  return response.data;
};

// Adicionar um serviço a um profissional
export const addServiceToProfessional = async (professionalId: string, serviceData: ProfessionalServiceData) => {
  const response = await apiClient.post(`/professionals/${professionalId}/services`, serviceData);
  return response.data;
};

// Adicionar um serviço ao profissional autenticado (novo endpoint)
export const addServiceToMe = async (serviceData: ProfessionalServiceData) => {
  // Ensure price is string or null
  const normalizedData = {
    ...serviceData,
    price: serviceData.price != null ? String(serviceData.price) : null,
  };
  const response = await apiClient.post(`/professionals/services`, normalizedData);
  return response.data;
};

// Atualizar um serviço do profissional autenticado (novo endpoint)
export const updateMyProfessionalService = async (serviceId: string, serviceData: ProfessionalServiceData) => {
  // Ensure price is string or null
  const normalizedData = {
    ...serviceData,
    price: serviceData.price != null ? String(serviceData.price) : null,
  };
  const response = await apiClient.put(`/professionals/services/${serviceId}`, normalizedData);
  return response.data;
};

// Remover um serviço de um profissional
export const removeServiceFromProfessional = async (professionalId: string, serviceId: string) => {
  const response = await apiClient.delete(`/professionals/${professionalId}/services/${serviceId}`);
  return response.data;
};

// Obter preços de serviços de um profissional
export const getProfessionalServicePrices = async (professionalId: string) => {
  const response = await apiClient.get(`/professionals/${professionalId}/services/prices`);
  return response.data;
};

// Obter serviços de um profissional
export const getProfessionalServices = async (professionalId: string) => {
  const response = await apiClient.get(`/professionals/${professionalId}/services`);
  return response.data;
};

// Atualizar preço de um serviço para um profissional
export const updateProfessionalServicePrice = async (professionalId: string, serviceId: string, price: number) => {
  const response = await apiClient.patch(`/professionals/${professionalId}/services/${serviceId}/price`, { price });
  return response.data;
};

// Obter serviços do profissional autenticado
export const getMyProfessionalServices = async () => {
  const response = await apiClient.get(`/professionals/me/services`);
  return response.data;
};

// Obter serviços do profissional autenticado (novo endpoint)
export const getOwnProfessionalServices = async () => {
  const response = await apiClient.get(`/professionals/services`);
  return response.data;
};

// Buscar todos os profissionais (para admin)
export const fetchProfessionals = async () => {
  const response = await apiClient.get("/professionals");
  return response.data;
};

// Obter agendamentos do usuário atual
export const getMyAppointments = async (params?: {
  status?: AppointmentStatus | 'all';
  startDate?: string;
  endDate?: string;
}) => {
  let url = '/appointments/me';
  const queryParams = new URLSearchParams();
  
  if (params?.status && params.status !== 'all') {
    queryParams.append('status', params.status);
  }
  
  if (params?.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  
  if (params?.endDate) {
    queryParams.append('endDate', params.endDate);
  }
    const queryString = queryParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  const response = await apiClient.get(url);
  return response.data;
};

// Obter detalhes de um agendamento específico
export const getAppointmentDetails = async (appointmentId: string) => {
  const response = await apiClient.get(`/appointments/${appointmentId}`);
  return response.data;
};

// Criar um novo agendamento
export const createAppointment = async (appointmentData: {
  professionalId: string;
  serviceId: string;
  date: string;
  notes?: string;
}) => {
  const response = await apiClient.post('/appointments', appointmentData);
  return response.data;
};

// Atualizar o status de um agendamento
export const updateAppointmentStatus = async (
  appointmentId: string,
  status: AppointmentStatus
) => {
  const response = await apiClient.patch(`/appointments/${appointmentId}/status`, { status });
  return response.data;
};

// Cancelar um agendamento
export const cancelAppointment = async (appointmentId: string, reason?: string) => {
  const response = await apiClient.post(`/appointments/${appointmentId}/cancel`, { reason });
  return response.data;
};

// Remarcar um agendamento
export const rescheduleAppointment = async (appointmentId: string, newDate: string) => {
  const response = await apiClient.post(`/appointments/${appointmentId}/reschedule`, { date: newDate });
  return response.data;
};
