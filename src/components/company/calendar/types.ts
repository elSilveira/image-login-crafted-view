
export type ViewType = "day" | "week" | "month" | "list";

export type AppointmentStatus = "confirmed" | "pending" | "in-progress" | "completed" | "cancelled";

export type FilterType = {
  status: string;
  service: string;
  staff: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  image?: string;
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
};
