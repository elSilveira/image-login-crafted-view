import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchUserAddresses, createUserAddress, updateUserAddress, deleteUserAddress } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the schema for the address form
const addressSchema = z.object({
  id: z.string().uuid().optional().nullable(), // Optional for creation
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "UF inválido").max(2, "UF inválido"),
  zipCode: z.string().min(8, "CEP inválido").max(9, "CEP inválido"), // Allow for 9 chars if hyphenated
  isPrimary: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

// Define the structure of the address object from the API
interface UserAddress {
  id: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
  // Add other fields if returned by the API (createdAt, updatedAt, userId)
}

export const UserAddresses = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  // Fetch user addresses
  const { data: addresses = [], isLoading, isError, error } = useQuery<UserAddress[], Error>({
    queryKey: ["userAddresses"],
    queryFn: fetchUserAddresses,
  });

  // Setup react-hook-form for the modal
  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
      isPrimary: false,
    },
  });

  // Reset form when modal opens or editingAddress changes
  useEffect(() => {
    if (isModalOpen) {
      if (editingAddress) {
        reset({
          id: editingAddress.id,
          street: editingAddress.street,
          number: editingAddress.number,
          complement: editingAddress.complement || "",
          neighborhood: editingAddress.neighborhood,
          city: editingAddress.city,
          state: editingAddress.state,
          zipCode: editingAddress.zipCode,
          isPrimary: editingAddress.isPrimary,
        });
      } else {
        reset({ // Reset to default for new address
          id: undefined,
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
          isPrimary: false,
        });
      }
    } else {
      setEditingAddress(null); // Clear editing state when modal closes
    }
  }, [isModalOpen, editingAddress, reset]);

  // Mutation for creating an address
  const createMutation = useMutation({
    mutationFn: createUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Endereço adicionado com sucesso!");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao adicionar endereço.");
    },
  });

  // Mutation for updating an address
  const updateMutation = useMutation({
    mutationFn: (data: AddressFormData) => {
      if (!data.id) throw new Error("ID do endereço é necessário para atualização.");
      const { id, ...updateData } = data;
      return updateUserAddress(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Endereço atualizado com sucesso!");
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar endereço.");
    },
  });

  // Mutation for deleting an address
  const deleteMutation = useMutation({
    mutationFn: deleteUserAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAddresses"] });
      toast.success("Endereço removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao remover endereço.");
    },
  });

  const onSubmit = (formData: AddressFormData) => {
    if (editingAddress) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (addressId: string) => {
    // Optional: Add confirmation dialog before deleting
    toast.warning("Tem certeza que deseja remover este endereço?", {
      action: {
        label: "Confirmar",
        onClick: () => deleteMutation.mutate(addressId),
      },
      cancel: {
        label: "Cancelar",
      },
    });
  };

  const openEditModal = (address: UserAddress) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingAddress(null); // Ensure no address is being edited
    setIsModalOpen(true);
  };

  // --- Loading State --- 
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meus Endereços</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
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
          <CardTitle>Meus Endereços</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Não foi possível carregar os endereços. Tente novamente mais tarde.
              {error?.message && <p className="text-xs mt-2">Detalhes: {error.message}</p>}
            </AlertDescription>
            <Button variant="outline" size="sm" onClick={() => queryClient.refetchQueries({ queryKey: ["userAddresses"] })} className="mt-4">
              Tentar Novamente
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="font-playfair text-2xl text-iazi-text">Meus Endereços</CardTitle>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-iazi-primary hover:bg-iazi-primary-hover font-lato" onClick={openAddModal}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Endereço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingAddress ? "Editar Endereço" : "Adicionar Novo Endereço"}</DialogTitle>
              <DialogDescription>
                {editingAddress ? "Atualize os detalhes do seu endereço." : "Preencha os detalhes do novo endereço."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              {/* Form Fields */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="street" className="text-right">Rua</Label>
                <div className="col-span-3">
                  <Input id="street" {...register("street")} disabled={isSubmitting} />
                  {errors.street && <p className="text-sm text-destructive mt-1">{errors.street.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="number" className="text-right">Número</Label>
                <div className="col-span-3">
                  <Input id="number" {...register("number")} disabled={isSubmitting} />
                  {errors.number && <p className="text-sm text-destructive mt-1">{errors.number.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="complement" className="text-right">Complemento</Label>
                <div className="col-span-3">
                  <Input id="complement" {...register("complement")} disabled={isSubmitting} />
                  {errors.complement && <p className="text-sm text-destructive mt-1">{errors.complement.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="neighborhood" className="text-right">Bairro</Label>
                <div className="col-span-3">
                  <Input id="neighborhood" {...register("neighborhood")} disabled={isSubmitting} />
                  {errors.neighborhood && <p className="text-sm text-destructive mt-1">{errors.neighborhood.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">Cidade</Label>
                <div className="col-span-3">
                  <Input id="city" {...register("city")} disabled={isSubmitting} />
                  {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">Estado (UF)</Label>
                <div className="col-span-3">
                  <Input id="state" {...register("state")} maxLength={2} disabled={isSubmitting} />
                  {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right">CEP</Label>
                <div className="col-span-3">
                  <Input id="zipCode" {...register("zipCode")} disabled={isSubmitting} placeholder="00000-000" />
                  {errors.zipCode && <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="isPrimary" className="text-right">Endereço Principal</Label>
                 <div className="col-span-3 flex items-center">
                    <Checkbox 
                      id="isPrimary" 
                      {...register("isPrimary")} 
                      disabled={isSubmitting}
                    />
                 </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                   <Button type="button" variant="outline" disabled={isSubmitting}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" className="bg-iazi-primary hover:bg-iazi-primary-hover" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingAddress ? "Salvar Alterações" : "Adicionar Endereço"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {addresses.length === 0 && !isLoading && (
          <p className="text-muted-foreground text-center py-4">Nenhum endereço cadastrado.</p>
        )}
        {addresses.map((address) => (
          <div key={address.id} className="flex items-start justify-between p-4 border rounded-lg hover:border-iazi-primary transition-colors">
            <div className="space-y-1">
              {/* Use street as title or add a title field if needed */}
              <h3 className="font-playfair font-medium text-lg text-iazi-text">
                {address.street}, {address.number} {address.isPrimary && <span className="text-xs text-iazi-primary ml-2">(Principal)</span>}
              </h3>
              <p className="font-lato text-muted-foreground">{address.complement}</p>
              <p className="font-lato text-muted-foreground">
                {address.neighborhood}, {address.city} - {address.state}
              </p>
              <p className="font-lato text-muted-foreground">CEP: {address.zipCode}</p>
            </div>
            <div className="flex space-x-2 flex-shrink-0 ml-4">
              <Button 
                size="icon" 
                variant="outline" 
                className="hover:text-iazi-primary hover:border-iazi-primary" 
                onClick={() => openEditModal(address)}
                disabled={deleteMutation.isPending}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="hover:text-red-500 hover:border-red-500" 
                onClick={() => handleDelete(address.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending && deleteMutation.variables === address.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

