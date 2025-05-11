"use client"; 

import React, { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchProfessionalDetails, updateProfessionalProfile, createProfessionalProfile, fetchUserProfile } from "@/lib/api"; 
import { Button } from "@/components/ui/button";
import { ProfileImages } from "./professional/ProfileImages"; 
import { ProfessionalInfo } from "./professional/ProfessionalInfo";
import { ExperienceSection } from "./professional/ExperienceSection";
import { EducationSection } from "./professional/EducationSection";
import { PortfolioSection } from "./professional/PortfolioSection";
import { Loader2, AlertCircle } from "lucide-react"; 
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { useNavigate } from "react-router-dom"; 
import { mapProfileImagesFromBackend, mapProfileImagesToBackend } from "./professional/ProfileImages";

// --- Schemas for Array Items ---
const experienceSchema = z.object({
  title: z.string().min(1, "Cargo é obrigatório"),
  company: z.string().min(1, "Empresa é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Instituição é obrigatória"),
  degree: z.string().min(1, "Grau é obrigatório"),
  fieldOfStudy: z.string().min(1, "Área de estudo é obrigatória"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const portfolioItemSchema = z.object({
  imageUrl: z.string().url({ message: "URL da imagem inválida." }).min(1, "URL da imagem é obrigatória"),
  description: z.string().optional().or(z.literal("")),
});

// --- Main Professional Profile Schema --- 
const professionalProfileSchema = z.object({
  name: z.string().min(1, { message: "O nome é obrigatório." }),
  role: z.string().optional().or(z.literal("")),
  avatar: z.string().url({ message: "URL da foto de perfil inválida." }).optional().or(z.literal("")),
  cover_image: z.string().url({ message: "URL da imagem de capa inválida." }).optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  experiences: z.array(experienceSchema).optional().default([]),
  educations: z.array(educationSchema).optional().default([]),
  portfolio: z.array(portfolioItemSchema).optional().default([]),
});

// Adiciona companyId ao tipo do formulário
export type ProfessionalProfileFormData = z.infer<typeof professionalProfileSchema> & { companyId?: string };

interface UserProfessionalInfoProps {
  professionalId?: string; 
  professionalData?: any;
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

function mapBackendToForm(data: any): ProfessionalProfileFormData {
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
    portfolio: (data.portfolio || data.portfolioItems || []).map((item: any) => ({
      imageUrl: item.imageUrl || item.image_url || "",
      description: item.description || "",
    })),
  };
}

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
  console.log('[UserProfessionalInfo] professionalId:', professionalId, 'professionalData:', professionalData);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, updateAuthState, accessToken } = useAuth(); 

  // --- NEW LOGIC: Determine edit mode for /me (logged-in user) or by ID (should not happen) ---
  // If professionalData exists and has an id, we are editing
  const isEditing = !!(professionalData && (professionalData.id || professionalData._id));

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
          phone: "",
          experiences: [],
          educations: [],
          portfolio: [],
        },
  });

  // Only reset when professionalData changes and is defined
  useEffect(() => {
    if (professionalData && professionalData.id) {
      const formData = mapBackendToForm(professionalData);
      const imageFields = mapProfileImagesFromBackend(professionalData);
      methods.reset({ ...formData, ...imageFields });
    }
    // Do not reset to user fallback here, only on first render via defaultValues
  }, [professionalData, methods.reset]);

  // Mutation for creating or updating professional profile
  const mutation = useMutation({
    mutationFn: (formData: ProfessionalProfileFormData & { cover_image_url?: string; avatar_url?: string }) => {
      // Map main fields
      const payload = mapFormToBackend(formData);
      // Map image fields
      const imagePayload = mapProfileImagesToBackend(formData);
      // Merge for backend
      const finalPayload = { ...payload, ...imagePayload };
      
      console.log('[UserProfessionalInfo] Payload completo:', finalPayload);
      
      if (isEditing) {
        // Atualiza o perfil do profissional logado (PUT /professionals/me)
        return updateProfessionalProfile(finalPayload);
      } else {
        return createProfessionalProfile(finalPayload);
      }
    },
    onSuccess: async (data) => {
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["professionalProfile", professionalId] });
        toast({ title: data.message || "Perfil profissional atualizado com sucesso!" });
        // Mantém na mesma página, apenas atualiza os dados
      } else {
        toast({
          title: "Criado com sucesso",
          description: "Deseja adicionar serviços agora?",
          action: (
            <ToastAction altText="Adicionar Serviços" onClick={() => navigate("/servicos")}>Adicionar Serviços</ToastAction>
          ),
        });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        // Fetch updated user profile and update context
        try {
          const updatedUser = await fetchUserProfile();
          if (accessToken && updatedUser) {
            updateAuthState(updatedUser, accessToken);
          }
        } catch (e) {
          console.error("Falha ao atualizar contexto do usuário após criar perfil profissional", e);
        }
        // No auto-navigation; user must confirm in toast
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
        toast({ title: "Erro de validação. Verifique os campos marcados.", variant: "destructive" });
      } else {
        toast({ title: error.response?.data?.message || `Erro ao ${isEditing ? "atualizar" : "criar"} perfil profissional.`, variant: "destructive" });
      }
    },
  });

  const onSubmit = (formData: ProfessionalProfileFormData & { cover_image_url?: string; avatar_url?: string }) => {
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
        
        {!isEditing && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Informação</AlertTitle>
            <AlertDescription>
              Após criar seu perfil, você será redirecionado para a seção de serviços onde poderá 
              cadastrar os serviços que oferece e definir horários específicos para cada um.
            </AlertDescription>
          </Alert>
        )}
      </form>
    </FormProvider>
  );
};
