
import apiClient from "./api";

// Criar um novo serviço
export const createService = async (serviceData: any) => {
  const response = await apiClient.post("/services", serviceData);
  return response.data;
};

// Atualizar um serviço existente
export const updateService = async (serviceId: string, serviceData: any) => {
  const response = await apiClient.put(`/services/${serviceId}`, serviceData);
  return response.data;
};

// Adicionar um serviço a um profissional
export const addServiceToProfessional = async (professionalId: string, serviceData: any) => {
  const response = await apiClient.post(`/professionals/${professionalId}/services`, serviceData);
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

// Atualizar preço de um serviço para um profissional
export const updateProfessionalServicePrice = async (professionalId: string, serviceId: string, price: number) => {
  const response = await apiClient.patch(`/professionals/${professionalId}/services/${serviceId}/price`, { price });
  return response.data;
};
