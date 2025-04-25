
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyFormData } from "../CompanyRegisterForm";
import { Plus, Image, Clock, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StepServicesProps {
  formData: CompanyFormData;
  updateFormData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

// Mock service categories
const serviceCategories = [
  "Tratamentos Capilares",
  "Cortes de Cabelo",
  "Coloração",
  "Tratamentos Faciais",
  "Manicure e Pedicure",
  "Depilação",
  "Massagens",
  "Maquiagem",
  "Design de Sobrancelhas",
  "Tratamentos Corporais",
  "Outro",
];

export const StepServices: React.FC<StepServicesProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<{
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    image: string;
  } | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Handle adding or updating a service
  const handleSaveService = () => {
    if (!currentService) return;

    const updatedServices = [...formData.services];
    
    if (editIndex !== null) {
      // Update existing service
      updatedServices[editIndex] = currentService;
    } else {
      // Add new service
      updatedServices.push({
        ...currentService,
        id: Date.now().toString(), // Generate a unique ID
      });
    }
    
    updateFormData({ services: updatedServices });
    resetServiceForm();
    setIsDialogOpen(false);
  };

  // Handle removing a service
  const handleRemoveService = (index: number) => {
    const updatedServices = formData.services.filter((_, idx) => idx !== index);
    updateFormData({ services: updatedServices });
  };

  // Handle editing a service
  const handleEditService = (index: number) => {
    setCurrentService({ ...formData.services[index] });
    setEditIndex(index);
    setIsDialogOpen(true);
  };

  // Reset the service form
  const resetServiceForm = () => {
    setCurrentService({
      id: "",
      name: "",
      description: "",
      category: "",
      price: 0,
      duration: 30,
      image: "",
    });
    setEditIndex(null);
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetServiceForm();
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentService) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCurrentService({ ...currentService, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h${remainingMinutes}min`;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">3. Serviços Oferecidos</h2>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Serviços</h3>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={() => resetServiceForm()}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>
                  {editIndex !== null ? "Editar Serviço" : "Adicionar Serviço"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do serviço oferecido pela sua empresa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 pt-4">
                {/* Service Name */}
                <div>
                  <Label htmlFor="service-name">Nome do Serviço</Label>
                  <Input
                    id="service-name"
                    value={currentService?.name || ""}
                    onChange={(e) =>
                      setCurrentService(prev => 
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                    placeholder="Ex: Corte de Cabelo"
                    className="mt-1"
                  />
                </div>

                {/* Service Category */}
                <div>
                  <Label htmlFor="service-category">Categoria</Label>
                  <Select
                    value={currentService?.category || ""}
                    onValueChange={(value) =>
                      setCurrentService(prev => 
                        prev ? { ...prev, category: value } : null
                      )
                    }
                  >
                    <SelectTrigger id="service-category" className="mt-1">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service-price">Preço (R$)</Label>
                    <Input
                      id="service-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentService?.price || ""}
                      onChange={(e) =>
                        setCurrentService(prev => 
                          prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null
                        )
                      }
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="service-duration">Duração (min)</Label>
                    <Input
                      id="service-duration"
                      type="number"
                      min="5"
                      step="5"
                      value={currentService?.duration || ""}
                      onChange={(e) =>
                        setCurrentService(prev => 
                          prev ? { ...prev, duration: parseInt(e.target.value) || 30 } : null
                        )
                      }
                      placeholder="30"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Service Description */}
                <div>
                  <Label htmlFor="service-description">Descrição</Label>
                  <Textarea
                    id="service-description"
                    value={currentService?.description || ""}
                    onChange={(e) =>
                      setCurrentService(prev => 
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    placeholder="Descreva o serviço em detalhes"
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {/* Service Image */}
                <div>
                  <Label htmlFor="service-image">Imagem Ilustrativa</Label>
                  <div className="mt-2">
                    {currentService?.image ? (
                      <div className="relative w-full h-36">
                        <img
                          src={currentService.image}
                          alt="Service preview"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={() =>
                            setCurrentService(prev => 
                              prev ? { ...prev, image: "" } : null
                            )
                          }
                        >
                          Remover
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="service-image-upload"
                        className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                      >
                        <Image className="w-8 h-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">Upload de imagem</span>
                        <input
                          id="service-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveService}>Salvar Serviço</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Service List */}
        {formData.services.length === 0 ? (
          <div className="border border-dashed rounded-lg p-8 text-center">
            <h4 className="text-lg font-medium text-gray-500 mb-4">Nenhum serviço cadastrado</h4>
            <p className="text-gray-400 mb-6">
              Adicione serviços para que os clientes possam agendar com sua empresa
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => resetServiceForm()}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
                </Button>
              </DialogTrigger>
              {/* Dialog content is the same as above */}
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.services.map((service, index) => (
              <div
                key={service.id}
                className="border rounded-md p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-500">{service.category}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium mr-4">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(service.duration)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditService(index)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveService(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrev}>
          Voltar
        </Button>
        <Button type="button" onClick={onNext}>
          Próximo
        </Button>
      </div>
    </div>
  );
};
