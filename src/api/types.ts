/**
 * Tipos base para entidades da API
 * Este arquivo define tipos comuns utilizados em várias partes da aplicação
 */

// Status possíveis de um agendamento
export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

// Mapeamento de status de API para status internos
export const ApiStatusMapping: Record<string, AppointmentStatus> = {
  'PENDING': 'PENDING',
  'pending': 'PENDING',
  'CONFIRMED': 'CONFIRMED',
  'confirmed': 'CONFIRMED',
  'IN_PROGRESS': 'IN_PROGRESS',
  'IN-PROGRESS': 'IN_PROGRESS',
  'INPROGRESS': 'IN_PROGRESS',
  'in_progress': 'IN_PROGRESS',
  'in-progress': 'IN_PROGRESS',
  'inprogress': 'IN_PROGRESS',
  'COMPLETED': 'COMPLETED',
  'completed': 'COMPLETED',
  'CANCELLED': 'CANCELLED',
  'cancelled': 'CANCELLED',
  'NO_SHOW': 'NO_SHOW',
  'NO-SHOW': 'NO_SHOW',
  'NOSHOW': 'NO_SHOW',
  'no_show': 'NO_SHOW',
  'no-show': 'NO_SHOW',
  'noshow': 'NO_SHOW'
};

// Tipo base para metadados de paginação
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
}

// Tipo genérico para respostas paginadas da API
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Interface base para Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profilePicture?: string;
  phone?: string;
  role?: string;
  bio?: string;
  professionalId?: string | null;
  companyId?: string | null;
  isAdmin?: boolean;
  isProfessional?: boolean;
  hasCompany?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Interface base para Categoria
export interface Category {
  id: string;
  name: string;
  icon?: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Interface base para Serviço
export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  duration?: number | string;
  categoryId?: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para Profissional
export interface Professional {
  id: string;
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  image?: string;
  avatarUrl?: string;
  coverImage?: string;
  coverImageUrl?: string;
  role?: string;
  rating?: number;
  totalReviews?: number;
  services?: Service[];
  userId?: string;
  companyId?: string | null;
  company?: any;
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para Empresa
export interface Company {
  id: string;
  name: string;
  description?: string;
  specialty?: string;
  logo?: string;
  phone?: string;
  website?: string;
  email?: string;
  address?: Address;
  professionals?: Professional[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  totalReviews?: number;
}

// Interface para Endereço
export interface Address {
  id?: string;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zipcode: string;
  country?: string;
}

// Interface para Avaliação
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  serviceId?: string;
  service?: Service;
  professionalId?: string;
  professional?: Professional;
  companyId?: string;
  company?: Company;
  userId: string;
  user: User;
  createdAt: string;
  updatedAt?: string;
}

// Interface para Agendamento
export interface Appointment {
  id: string;
  userId?: string;
  user?: User;
  professionalId?: string;
  professional?: Professional;
  serviceId?: string;
  service?: Service;
  services?: Service[];
  companyId?: string;
  company?: Company;
  date?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string | null;
  location?: string | null;
  hasBeenReviewed?: boolean;
  canBeReviewed?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Interface para Notificação
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: any;
  createdAt: string;
  updatedAt?: string;
}

// Interface para Estatísticas do Dashboard
export interface DashboardStats {
  currentMonthRevenue: number;
  previousMonthRevenue: number;
  currentMonthAppointments: number;
  previousMonthAppointments: number;
  currentMonthNewClients: number;
  previousMonthNewClients: number;
}

// Interface para Serviço Popular
export interface PopularService {
  id: string;
  name: string;
  appointmentCount: number;
  rating: number;
}

// Interface para Status de Avaliação de Agendamento
export interface AppointmentReviewStatus {
  hasBeenReviewed: boolean;
  canBeReviewed: boolean;
  rating?: number;
}

// Interface para dados de criação de serviço
export interface ServiceCreateData {
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  categoryId?: string;
}

// Interface para serviço vinculado a profissional
export interface ProfessionalServiceData {
  serviceId: string;
  price?: number | string;
  description?: string;
  schedule?: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}

// Interface para dados de pesquisa
export interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
  limit?: number;
  type?: 'all' | 'services' | 'professionals' | 'companies';
  professionalTipo?: string;
  status?: string | string[];
  rating?: number;
  availability?: string;
  useProfessionalServices?: boolean;
  [key: string]: any;
}

// Interface para parâmetros de agendamento
export interface AppointmentParams {
  professionalId?: string;
  userId?: string;
  serviceId?: string;
  companyId?: string;
  status?: string | string[];
  startDate?: string;
  endDate?: string;
  dateFrom?: string;
  dateTo?: string;
  include?: string;
  limit?: number;
  page?: number;
  sort?: string;
  serviceType?: string;
  search?: string;
  [key: string]: any;
}

// Interface para dados de criação de agendamento
export interface AppointmentCreateData {
  professionalId: string;
  serviceId: string;
  date: string;
  services?: string[];
  notes?: string;
  startTime?: string;
  endTime?: string;
}

// Interface para parâmetros de avaliação
export interface ReviewParams {
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  userId?: string;
  rating?: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Interface para dados de criação de avaliação
export interface ReviewCreateData {
  rating: number;
  comment?: string;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  appointmentId?: string;
} 