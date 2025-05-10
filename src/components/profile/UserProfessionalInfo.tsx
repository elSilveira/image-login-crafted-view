"use client"; 

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchProfessionalDetails, updateProfessionalProfile, createProfessionalProfile } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { ProfileImages } from "./professional/ProfileImages"; 
import { ProfessionalInfo } from "./professional/ProfessionalInfo";
import { ExperienceSection } from "./professional/ExperienceSection";
import { EducationSection } from "./professional/EducationSection";
import { ServicesSection } from "./professional/ServicesSection";
import { AvailabilitySection } from "./professional/AvailabilitySection";
import { PortfolioSection } from "./professional/PortfolioSection";
import { Loader2, AlertCircle } from "lucide-react"; 
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { useNavigate } from "react-router-dom"; 
import { mapProfileImagesFromBackend, mapProfileImagesToBackend } from "./professional/ProfileImages";

// --- Schemas for Array Items ---
const experienceSchema = z.object({
  title: z.string().min(1, "Cargo é obrigatório"),
  company: z.string().min(1, "Empresa é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"), // Consider z.date() if using date picker
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Grau é obrigatório"),
  fieldOfStudy: z.string().min(1, "Área de estudo é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"), // Consider z.date()
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const professionalServiceSchema = z.object({
  serviceId: z.string().min(1, "Selecione um serviço"),
  price: z.number().positive("Preço deve ser positivo").optional(),
});

const availabilitySlotSchema = z.object({
  dayOfWeek: z.string().min(1, "Dia da semana inválido"),
  startTime: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Hora de início inválida (formato HH:mm, 24h)"),
  endTime: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/, "Hora de fim inválida (formato HH:mm, 24h)"),
});

const portfolioItemSchema = z.object({
  imageUrl: z.string().url({ message: "URL da imagem inválida." }).min(1, "URL da imagem é obrigatória"),
  description: z.string().optional().or(z.literal("")),
});

// --- Main Professional Profile Schema --- 
const professionalProfileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  role: z.string().optional().or(z.literal("")),
  avatar: z.string().url({ message: "URL da foto de perfil inválida." }).optional().or(z.literal("")), // Avatar
  cover_image: z.string().url({ message: "URL da imagem de capa inválida." }).optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  experiences: z.array(experienceSchema).optional().default([]),
  educations: z.array(educationSchema).optional().default([]),
  services: z.array(professionalServiceSchema).optional().default([]),
  availability: z.array(availabilitySlotSchema).optional().default([]),
  portfolio: z.array(portfolioItemSchema).optional().default([]),
});

// Adiciona companyId ao tipo do formulário
export type ProfessionalProfileFormData = z.infer<typeof professionalProfileSchema> & { companyId?: string };

interface UserProfessionalInfoProps {
  professionalId?: string; 
  professionalData?: any; // <-- NEW
}

// --- Mapping functions between backend and form schema ---

// Mapeamento de dias da semana do frontend (pt-BR) para backend (enum inglês)
const mapDayOfWeekToBackend = (day: string): string => {
  const dayMap: Record<string, string> = {
    "Segunda": "MONDAY",
    "Terça": "TUESDAY",
    "Quarta": "WEDNESDAY",
    "Quinta": "THURSDAY",
    "Sexta": "FRIDAY",
    "Sábado": "SATURDAY",
    "Domingo": "SUNDAY"
  };
  return dayMap[day] || day; // Retorna o mapeado ou o original se não encontrar
};

// Mapeamento de dias da semana do backend (enum inglês) para frontend (pt-BR)
const mapDayOfWeekFromBackend = (day: string): string => {
  const dayMap: Record<string, string> = {
    "MONDAY": "Segunda",
    "TUESDAY": "Terça",
    "WEDNESDAY": "Quarta",
    "THURSDAY": "Quinta",
    "FRIDAY": "Sexta",
    "SATURDAY": "Sábado",
    "SUNDAY": "Domingo"
  };
  return dayMap[day] || day; // Retorna o mapeado ou o original se não encontrar
};

// Normaliza string de horário para HH:mm (24h, zero à esquerda)
function normalizeTimeString(time: string): string {
  if (!time) return "";
  // Remove espaços
  time = time.trim();
  // Aceita HH:mm ou HH:mm:ss
  const match = time.match(/^([01]?[0-9]|2[0-3]):([0-5][0-9])(?::[0-5][0-9])?$/);
  if (match) {
    // Garante zero à esquerda
    const hour = match[1].padStart(2, '0');
    const minute = match[2].padStart(2, '0');
    return `${hour}:${minute}`;
  }
  // Se vier só HH, completa com :00
  if (/^([01]?[0-9]|2[0-3])$/.test(time)) return time.padStart(2, '0') + ':00';
  // Se não bater, retorna string vazia (para não enviar inválido)
  return "";
}

// ...existing code...
function mapBackendToForm(data: any): ProfessionalProfileFormData {
  // Suporta tanto o formato de associação quanto array simples de serviços
  let services: any[] = [];
  if (Array.isArray(data.services)) {
    // Se vierem objetos com serviceId OU id e price
    services = data.services.map((srv: any) => {
      // Se vier no formato { id, name, ... }
      if (srv && typeof srv === 'object' && srv.id && !srv.serviceId) {
        return {
          serviceId: srv.id,
          price: typeof srv.price === 'string' ? Number(srv.price) : (typeof srv.price === 'number' ? srv.price : undefined),
        };
      }
      // Se vier no formato { serviceId, price }
      return {
        serviceId: srv.serviceId || srv.id || '',
        price: typeof srv.price === 'string' ? Number(srv.price) : (typeof srv.price === 'number' ? srv.price : undefined),
      };
    });
  }
  return {
    name: data.name || "",
    role: data.role || data.title || "Profissional",
    avatar: data.avatar || data.image || data.avatarUrl || "",
    cover_image: data.coverImage || data.cover_image || "",
    bio: data.bio || "",
    phone: data.phone || "",
    experiences: (data.experiences || []).map((exp: any) => ({
      title: exp.title || "",
      company: exp.company || exp.companyName || "",
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 7) : "",
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : "",
      description: exp.description || "",
    })),
    educations: (data.educations || []).map((edu: any) => ({
      institution: edu.institution || edu.institutionName || "",
      degree: edu.degree || "",
      fieldOfStudy: edu.fieldOfStudy || edu.field_of_study || "",
      startDate: edu.startDate ? new Date(edu.startDate).toISOString().slice(0, 7) : "",
      endDate: edu.endDate ? new Date(edu.endDate).toISOString().slice(0, 7) : "",
      description: edu.description || "",
    })),
    services,
    availability: (data.availability || []).map((slot: any) => ({
      dayOfWeek: mapDayOfWeekFromBackend(slot.dayOfWeek || slot.day_of_week || ""),
      startTime: slot.startTime || slot.start_time || "",
      endTime: slot.endTime || slot.end_time || "",
    })),
    portfolio: (data.portfolio || data.portfolioItems || []).map((item: any) => ({
      imageUrl: item.imageUrl || item.image_url || "",
      description: item.description || "",
    })),
  };
}
// ...existing code...

// Map form data to backend contract (for create/update)
function mapFormToBackend(data: ProfessionalProfileFormData) {
  const payload: any = {
    name: data.name,
    role: data.role || undefined,
    avatar: data.avatar || undefined,
    coverImage: data.cover_image || undefined,
    bio: data.bio || undefined,
    phone: data.phone || undefined,
  };
  // companyId só se existir e for válido
  if (data.companyId) payload.companyId = data.companyId;
  // Sempre envia arrays, mesmo vazios
  payload.experiences = (data.experiences || []).map(exp => ({
    title: exp.title,
    companyName: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
  }));
  payload.educations = (data.educations || []).map(edu => ({
    institutionName: edu.institution,
    degree: edu.degree,
    fieldOfStudy: edu.fieldOfStudy,
    startDate: edu.startDate,
    endDate: edu.endDate,
    description: edu.description,
  }));
  payload.services = (data.services || []).map(srv => ({
    serviceId: srv.serviceId,
    price:
      srv.price === undefined || srv.price === null
        ? undefined
        : typeof srv.price === "string"
          ? Number(srv.price)
          : srv.price,
  }));
  payload.availability = (data.availability || []).filter(slot => slot.dayOfWeek && slot.startTime && slot.endTime).map(slot => ({
    day_of_week: mapDayOfWeekToBackend(slot.dayOfWeek),
    start_time: normalizeTimeString(slot.startTime),
    end_time: normalizeTimeString(slot.endTime),
  }));
  payload.portfolioItems = (data.portfolio || []).map(item => ({
    imageUrl: item.imageUrl,
    description: item.description,
  }));
  // Remove apenas undefined/null, mas mantém arrays vazios
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined || payload[key] === null) delete payload[key];
  });
  return payload;
}

export const UserProfessionalInfo: React.FC<UserProfessionalInfoProps> = ({ professionalId, professionalData }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  // --- NEW LOGIC: Determine edit mode for /me (logged-in user) or by ID (should not happen) ---
  // If professionalData exists and has an id, we are editing
  const isEditing = !!(professionalData && (professionalData.id || professionalData._id));

  // Only allow editing by ID if it's the user's own profile (should not happen)
  const isOwnProfile = !!user && professionalId === user?.professionalProfileId;
  if (professionalId && !isOwnProfile) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Erro: Não é permitido buscar perfil profissional por ID nesta página.</p>
      </div>
    );
  }

  // Setup react-hook-form
  const methods = useForm<ProfessionalProfileFormData>({
    resolver: zodResolver(professionalProfileSchema), 
    defaultValues: professionalData
      ? { ...mapBackendToForm(professionalData), ...mapProfileImagesFromBackend(professionalData) }
      : {
          name: user?.name || "", 
          role: "Profissional", 
          avatar: "",
          bio: "",
          phone: "", // Remove user?.phone, not present in User type
          experiences: [],
          educations: [],
          services: [],
          availability: [],
          portfolio: [],
        },
  });

  // Update form default values when data loads (for editing)
  useEffect(() => {
    if (isEditing && (professionalData || user)) {
      const formData = mapBackendToForm(professionalData || user);
      const imageFields = mapProfileImagesFromBackend(professionalData || user);
      methods.reset({ ...formData, ...imageFields });
    } else if (isEditing && !professionalData && !user) {
      console.warn('[UserProfessionalInfo] isEditing but no data is available');
    }
  }, [isEditing, professionalData, user, methods.reset]);

  // Mutation for creating or updating professional profile
  const mutation = useMutation({
    mutationFn: (formData: ProfessionalProfileFormData & { cover_image_url?: string; avatar_url?: string }) => {
      // Map main fields
      const payload = mapFormToBackend(formData);
      // Map image fields
      const imagePayload = mapProfileImagesToBackend(formData);
      // Merge for backend
      const finalPayload = { ...payload, ...imagePayload };
      
      // Log detalhado do payload por seções para facilitar depuração
      console.log('[UserProfessionalInfo] Payload completo:', finalPayload);
      
      if (finalPayload.availability && finalPayload.availability.length > 0) {
        console.log('[UserProfessionalInfo] Disponibilidade (availability):', 
          finalPayload.availability.map((slot: any) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        );
      }
      
      if (isEditing) {
        // Atualiza o perfil do profissional logado (PUT /professionals/me)
        return updateProfessionalProfile(finalPayload);
      } else {
        return createProfessionalProfile(finalPayload);
      }
    },
    onSuccess: (data) => {
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["professionalProfile", professionalId] });
        toast.success(data.message || "Perfil profissional atualizado com sucesso!");
        // Mantém na mesma página, apenas atualiza os dados
      } else {
        toast.success(data.message || "Perfil profissional criado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        // Não faz redirect, mantém na página para novo status aparecer
      }
    },
    onError: (error: any) => {
      console.error("Error submitting professional profile:", error.response?.data || error.message);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
          // Handle array errors (e.g., "experiences[0].title")
          const fieldName = err.path as keyof ProfessionalProfileFormData;
          if (fieldName) {
             methods.setError(fieldName, { type: "manual", message: err.msg });
          }
        });
        toast.error("Erro de validação. Verifique os campos marcados.");
      } else {
        toast.error(error.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} perfil profissional.`);
      }
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData & { cover_image_url?: string; avatar_url?: string }) => {
    // Debug: log current services in form state before mutation
    console.log('[UserProfessionalInfo] onSubmit - current services:', methods.getValues('services'));
    mutation.mutate(formData);
  };

  if (isEditing && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileImages /> 
        
        <ProfessionalInfo />
        <ExperienceSection />
        <EducationSection />
        <ServicesSection />
        <AvailabilitySection />
        <PortfolioSection />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => methods.reset()} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending || !methods.formState.isDirty}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Salvar Alterações" : "Criar Perfil"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

