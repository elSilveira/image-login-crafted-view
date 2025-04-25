
import { addDays, addHours, setHours, startOfDay } from "date-fns";
import { AppointmentType, StaffMember, Resource } from "./types";

// Mock staff data
export const mockStaff: StaffMember[] = [
  {
    id: "staff-1",
    name: "João Silva",
    role: "Cabeleireiro",
    image: "/placeholder.svg",
  },
  {
    id: "staff-2",
    name: "Maria Oliveira",
    role: "Manicure",
    image: "/placeholder.svg",
  },
  {
    id: "staff-3",
    name: "Carlos Santos",
    role: "Barbeiro",
    image: "/placeholder.svg",
  }
];

// Mock resources data
export const mockResources: Resource[] = [
  {
    id: "resource-1",
    name: "Sala 1",
    type: "room"
  },
  {
    id: "resource-2",
    name: "Sala 2",
    type: "room"
  },
  {
    id: "resource-3",
    name: "Cadeira de Massagem",
    type: "equipment"
  }
];

// Mock services
export const mockServices = [
  {
    id: "service-1",
    name: "Corte de Cabelo"
  },
  {
    id: "service-2",
    name: "Manicure"
  },
  {
    id: "service-3",
    name: "Barba"
  },
  {
    id: "service-4",
    name: "Massagem"
  }
];

// Create mock appointments
const today = new Date();
const todayStart = startOfDay(today);

export const mockAppointments: AppointmentType[] = [
  {
    id: "appointment-1",
    title: "Corte de Cabelo",
    start: setHours(todayStart, 10),
    end: setHours(todayStart, 11),
    clientName: "Pedro Almeida",
    clientId: "client-1",
    serviceId: "service-1",
    serviceName: "Corte de Cabelo",
    staffId: "staff-1",
    staffName: "João Silva",
    status: "confirmed",
    resourceId: "resource-1"
  },
  {
    id: "appointment-2",
    title: "Manicure",
    start: setHours(todayStart, 11),
    end: setHours(todayStart, 12),
    clientName: "Ana Costa",
    clientId: "client-2",
    serviceId: "service-2",
    serviceName: "Manicure",
    staffId: "staff-2",
    staffName: "Maria Oliveira",
    status: "pending",
    resourceId: "resource-2"
  },
  {
    id: "appointment-3",
    title: "Barba",
    start: setHours(todayStart, 14),
    end: setHours(todayStart, 15),
    clientName: "José Pereira",
    clientId: "client-3",
    serviceId: "service-3",
    serviceName: "Barba",
    staffId: "staff-3",
    staffName: "Carlos Santos",
    status: "in-progress",
    resourceId: "resource-1"
  },
  {
    id: "appointment-4",
    title: "Massagem",
    start: addHours(setHours(todayStart, 16), 0),
    end: addHours(setHours(todayStart, 17), 0),
    clientName: "Mariana Souza",
    clientId: "client-4",
    serviceId: "service-4",
    serviceName: "Massagem",
    staffId: "staff-1",
    staffName: "João Silva",
    status: "confirmed",
    resourceId: "resource-3"
  },
  {
    id: "appointment-5",
    title: "Corte de Cabelo",
    start: addHours(setHours(addDays(todayStart, 1), 9), 0),
    end: addHours(setHours(addDays(todayStart, 1), 10), 0),
    clientName: "Roberto Lima",
    clientId: "client-5",
    serviceId: "service-1",
    serviceName: "Corte de Cabelo",
    staffId: "staff-1",
    staffName: "João Silva",
    status: "confirmed",
    resourceId: "resource-1"
  },
  {
    id: "appointment-6",
    title: "Manicure",
    start: addHours(setHours(addDays(todayStart, 1), 11), 0),
    end: addHours(setHours(addDays(todayStart, 1), 12), 0),
    clientName: "Carla Ferreira",
    clientId: "client-6",
    serviceId: "service-2",
    serviceName: "Manicure",
    staffId: "staff-2",
    staffName: "Maria Oliveira",
    status: "cancelled",
    resourceId: "resource-2"
  },
  {
    id: "appointment-7",
    title: "Barba",
    start: addHours(setHours(addDays(todayStart, 2), 10), 0),
    end: addHours(setHours(addDays(todayStart, 2), 11), 0),
    clientName: "Fábio Castro",
    clientId: "client-7",
    serviceId: "service-3",
    serviceName: "Barba",
    staffId: "staff-3",
    staffName: "Carlos Santos",
    status: "completed",
    resourceId: "resource-1"
  }
];

export const mockTodayAppointments = mockAppointments.filter(appointment => {
  const appointmentDate = new Date(appointment.start);
  return appointmentDate.getDate() === today.getDate() && 
         appointmentDate.getMonth() === today.getMonth() && 
         appointmentDate.getFullYear() === today.getFullYear();
});

// Sort today's appointments by start time
export const sortedTodayAppointments = [...mockTodayAppointments].sort(
  (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
);
