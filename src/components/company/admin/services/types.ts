
export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  categoryId?: string;
  categoryName?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface ProfessionalService {
  id: string;
  serviceId: string;
  professionalId: string;
  price?: number;
  service: ServiceItem;
}

export interface ServiceFormData {
  name: string;
  description?: string;
  price?: number | string;
  duration?: number | string;
  categoryId?: string;
}
