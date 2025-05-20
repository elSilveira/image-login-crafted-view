export type ViewType = "day" | "week" | "month" | "list";

export type AppointmentStatus = "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";

export type FilterType = {
  status: string;
  service: string;
  serviceId: string;
  staff: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
  email?: string;
  phone?: string;
  bio?: string;
  imageUrl?: string;
};

export type Resource = {
  id: string;
  name: string;
  type: string;
};

export type AppointmentType = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  clientName: string;
  clientId: string;
  serviceId: string;
  serviceName: string;
  staffId: string;
  staffName: string;
  status: AppointmentStatus;
  notes?: string;
  resourceId?: string;
  preparationTime?: number; // in minutes
  finalizationTime?: number; // in minutes
  clientEmail?: string;
  clientPhone?: string;
  servicePrice?: number;
  serviceDuration?: string;
};
