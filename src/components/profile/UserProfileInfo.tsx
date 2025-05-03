import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form"; // Import Controller if needed for complex inputs
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchUserProfile, updateUserProfile } from "@/lib/api"; // Import API functions from the correct path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the schema for form validation using Zod
const profileSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().nullable(), // Added phone, make it optional and nullable
  avatar: z.string().url("URL do avatar inválida").optional().or(z.literal("")).nullable(), // Allow empty string, valid URL, or null
  bio: z.string().optional().nullable(), // Added bio, make it optional and nullable
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const UserProfileInfo = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user profile data using the imported function
  const { data: user, isLoading, isError, error } = useQuery<any, Error>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile, // Use the imported function
    enabled: !isEditing, // Optionally disable refetching while editing
  });

  // Setup react-hook-form
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      avatar: "",
      bio: "",
    },
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty }, watch } = methods;

  // Update form default values when user data loads or changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "", // Add phone
        avatar: user.avatar || "",
        bio: user.bio || "", // Add bio
      });
    }
  }, [user, reset]);

  // Mutation for updating user profile using the imported function
  const mutation = useMutation({
    mutationFn: updateUserProfile, // Use the imported function
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] }); // Invalidate cache to refetch
      toast.success(data.message || "Perfil atualizado com sucesso!");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar perfil.");
    },
  });

  const onSubmit = (formData: ProfileFormData) => {
    // Only send changed data
    const changedData: Partial<ProfileFormData> = {};
    if (formData.name !== user?.name) changedData.name = formData.name;
    if (formData.email !== user?.email) changedData.email = formData.email;
    // Ensure avatar is sent correctly (handle empty string vs null if needed)
    if (formData.avatar !== user?.avatar) changedData.avatar = formData.avatar === "" ? null : formData.avatar;
    if (formData.phone !== user?.phone) changedData.phone = formData.phone === "" ? null : formData.phone;
    if (formData.bio !== user?.bio) changedData.bio = formData.bio === "" ? null : formData.bio;

    if (Object.keys(changedData).length > 0) {
      mutation.mutate(changedData);
    } else {
      setIsEditing(false); // No changes, just exit editing mode
    }
  };

  const handleCancel = () => {
    // Reset form to original values from the query data
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        bio: user.bio || "",
      });
    }
    setIsEditing(false);
  };

  // --- Loading State --- 
  if (isLoading && !user) { // Show loading only on initial fetch
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // --- Error State --- 
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar as informações do perfil. Tente novamente mais tarde.
              {error?.message && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
            </AlertDescription>
            <Button variant="outline" size="sm" onClick={() => queryClient.refetchQueries({ queryKey: ["userProfile"] })} className="mt-4">
              Tentar Novamente
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Basic fallback for avatar
  const getAvatarFallback = (name?: string) => {
    return name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  };

  // Get current form values for previewing avatar while editing
  const currentFormValues = watch();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <Avatar className="h-24 w-24">
                {/* Use avatar from form state if editing, otherwise from query data */}
                <AvatarImage src={isEditing ? currentFormValues.avatar ?? undefined : user?.avatar ?? undefined} alt={user?.name} />
                <AvatarFallback>{getAvatarFallback(user?.name)}</AvatarFallback>
              </Avatar>
              {/* Avatar edit button - functionality to be implemented */}
              {/* {isEditing && (
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full bg-background hover:bg-muted"
                  type="button" 
                  onClick={() => { toast.info("Funcionalidade de upload de avatar ainda não implementada.") }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )} */} 
            </div>
            <div className="flex-grow space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold">{user?.name || "Usuário"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
              {/* Display join date if available */}
              {/* <p className="text-sm text-muted-foreground">Membro desde {new Date(user?.createdAt).toLocaleDateString()}</p> */}
            </div>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="sm:ml-auto flex-shrink-0">
                <Edit className="mr-2 h-4 w-4" /> Editar Perfil
              </Button>
            )}
          </div>

          {/* Form Fields */} 
          <div className="grid gap-4 py-4">
            {/* Avatar URL Input (only visible when editing) */}
            {isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="avatar" className="text-right">
                  URL Avatar
                </Label>
                <div className="col-span-3">
                  <Input id="avatar" {...register("avatar")} disabled={mutation.isPending} placeholder="https://exemplo.com/avatar.png" />
                  {errors.avatar && <p className="text-sm text-destructive mt-1">{errors.avatar.message}</p>}
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <div className="col-span-3">
                <Input id="name" {...register("name")} disabled={!isEditing || mutation.isPending} />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input id="email" type="email" {...register("email")} disabled={!isEditing || mutation.isPending} />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>
            </div>
            {/* Phone field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Telefone
              </Label>
              <div className="col-span-3">
                <Input id="phone" type="tel" {...register("phone")} disabled={!isEditing || mutation.isPending} placeholder="(XX) XXXXX-XXXX" />
                {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
              </div>
            </div>
             {/* Bio field */}
             <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="bio" className="text-right pt-2">
                Bio
              </Label>
              <div className="col-span-3">
                <textarea 
                  id="bio" 
                  {...register("bio")} 
                  disabled={!isEditing || mutation.isPending} 
                  placeholder="Fale um pouco sobre você..." 
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {errors.bio && <p className="text-sm text-destructive mt-1">{errors.bio.message}</p>}
              </div>
            </div>
          </div>

          {/* Action Buttons */} 
          {isEditing && (
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={mutation.isPending}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-iazi-primary hover:bg-iazi-primary-hover" disabled={mutation.isPending || !isDirty}>
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Salvar Alterações
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

