
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
import { CompanyFormData, ServiceData } from "../CompanyRegisterForm"; // Assuming ServiceData uses image_url
import { Plus, Image as ImageIcon, Clock, Edit, Trash } from "lucide-react";
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

// Mock service categories (Keep as is)
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

// Define the structure for the service being edited/added
interface CurrentServiceState extends Omit<ServiceData, "id"> {
  id?: string; // ID is optional during creation
}

export const StepServices: React.FC<StepServicesProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Use the updated ServiceData structure (with image_url)
  const [currentService, setCurrentService] = useState<CurrentServiceState | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Handle adding or updating a service
  const handleSaveService = () => {
    if (!currentService) return;

    const updatedServices = [...formData.services];
    const serviceToSave: ServiceData = {
      ...currentService,
      id: currentService.id || Date.now().toString(), // Ensure ID exists
      image_url: currentService.image_url || "", // Use image_url
    };
    
    if (editIndex !== null) {
      // Update existing service
      updatedServices[editIndex] = serviceToSave;
    } else {
      // Add new service
      updatedServices.push(serviceToSave);
    }
    
    updateFormData({ services: updatedServices });
    resetServiceForm();
    setIsDialogOpen(false);
  };

  // Handle removing a service (remains the same)
  const handleRemoveService = (index: number) => {
    const updatedServices = formData.services.filter((_, idx) => idx !== index);
    updateFormData({ services: updatedServices });
  };

  // Handle editing a service
  const handleEditService = (index: number) => {
    setCurrentService({ ...formData.services[index] }); // Load existing service data
    setEditIndex(index);
    setIsDialogOpen(true);
  };

  // Reset the service form
  const resetServiceForm = () => {
    setCurrentService({
      // id is generated on save
      name: "",
      description: "",
      category: "",
      price: 0,
      duration: 30,
      image_url: "", // Reset image_url
    });
    setEditIndex(null);
  };

  // Handle dialog close (remains the same)
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) resetServiceForm();
  };

  // Format price for display (remains the same)
  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Format duration for display (remains the same)
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
                {/* Service Name (remains the same) */}
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

                {/* Service Category (remains the same) */}
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

                {/* Price and Duration (remains the same) */}
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

                {/* Service Description (remains the same) */}
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

                {/* Service Image URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="service_image_url">URL da Imagem Ilustrativa</Label>
                  <Input
                    id="service_image_url"
                    type="url"
                    value={currentService?.image_url || ""} // Use image_url
                    onChange={(e) =>
                      setCurrentService(prev => 
                        prev ? { ...prev, image_url: e.target.value } : null // Update image_url
                      )
                    }
                    placeholder="https://exemplo.com/servico.jpg"
                    className="mt-1"
                  />
                  <div className="mt-2 h-36 w-full bg-muted rounded-lg overflow-hidden relative border">
                    {currentService?.image_url ? (
                      <img 
                        src={currentService.image_url} 
                        alt="Prévia do Serviço" 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
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
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button onClick={() => resetServiceForm()}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
                </Button>
              </DialogTrigger>
              {/* Dialog content is defined above */}
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
                  {service.image_url ? (
                    <img
                      src={service.image_url} // Use image_url
                      alt={service.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-400" />
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

