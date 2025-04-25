
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CompanyFormData } from "../CompanyRegisterForm";
import { MapPin, Phone, Mail, Link } from "lucide-react";

interface StepLocationContactProps {
  formData: CompanyFormData;
  updateFormData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepLocationContact: React.FC<StepLocationContactProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
}) => {
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);

  // Handle zip code lookup
  const handleZipCodeLookup = () => {
    const zipCode = formData.address.zipCode.replace(/[^0-9]/g, "");
    
    if (zipCode.length !== 8) {
      return; // Invalid zip code
    }
    
    setIsLookingUpZip(true);
    
    // Simulating address lookup (would be replaced with actual API call)
    setTimeout(() => {
      updateFormData({
        address: {
          ...formData.address,
          street: "Av. Paulista",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
        }
      });
      setIsLookingUpZip(false);
    }, 1000);
  };

  // Handle working hours update
  const handleWorkingHoursUpdate = (
    day: string,
    field: "open" | "close" | "isOpen",
    value: string | boolean
  ) => {
    updateFormData({
      workingHours: {
        ...formData.workingHours,
        [day]: {
          ...formData.workingHours[day],
          [field]: value,
        },
      },
    });
  };

  // Form validation
  const isFormValid = () => {
    return (
      formData.address.street.trim() !== "" &&
      formData.address.number.trim() !== "" &&
      formData.address.city.trim() !== "" &&
      formData.address.state.trim() !== "" &&
      formData.address.zipCode.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.email.trim() !== ""
    );
  };

  const days = [
    { key: "monday", label: "Segunda-feira" },
    { key: "tuesday", label: "Terça-feira" },
    { key: "wednesday", label: "Quarta-feira" },
    { key: "thursday", label: "Quinta-feira" },
    { key: "friday", label: "Sexta-feira" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">2. Localização e Contato</h2>

      <div className="space-y-6">
        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Endereço</h3>
          
          {/* ZIP Code with Lookup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="zip-code">CEP</Label>
              <div className="flex mt-1">
                <Input
                  id="zip-code"
                  value={formData.address.zipCode}
                  onChange={(e) =>
                    updateFormData({
                      address: { ...formData.address, zipCode: e.target.value },
                    })
                  }
                  placeholder="00000-000"
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  onClick={handleZipCodeLookup}
                  disabled={isLookingUpZip || formData.address.zipCode.length < 8}
                  className="rounded-l-none"
                >
                  {isLookingUpZip ? "..." : "Buscar"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="street">Rua/Avenida</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) =>
                  updateFormData({
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                placeholder="Nome da rua"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={formData.address.number}
                onChange={(e) =>
                  updateFormData({
                    address: { ...formData.address, number: e.target.value },
                  })
                }
                placeholder="Número"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.address.complement}
                onChange={(e) =>
                  updateFormData({
                    address: { ...formData.address, complement: e.target.value },
                  })
                }
                placeholder="Sala, andar, etc."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.address.neighborhood}
                onChange={(e) =>
                  updateFormData({
                    address: { ...formData.address, neighborhood: e.target.value },
                  })
                }
                placeholder="Bairro"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  updateFormData({
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                placeholder="Cidade"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) =>
                  updateFormData({
                    address: { ...formData.address, state: e.target.value },
                  })
                }
                placeholder="Estado"
                className="mt-1"
              />
            </div>
          </div>

          {/* Map Preview (placeholder) */}
          <div className="mt-4">
            <Label>Localização no Mapa</Label>
            <div className="mt-2 border rounded-md h-[200px] flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin className="w-10 h-10 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">
                  Mapa será exibido aqui após confirmação do endereço
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Informações de Contato</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone Principal</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email de Contato</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="contato@empresa.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website (opcional)</Label>
              <div className="relative mt-1">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData({ website: e.target.value })}
                  placeholder="www.empresa.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Social Media (optional) */}
          <div>
            <h4 className="text-md font-medium mt-6 mb-2">Redes Sociais (opcional)</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.socialMedia.facebook}
                  onChange={(e) =>
                    updateFormData({
                      socialMedia: {
                        ...formData.socialMedia,
                        facebook: e.target.value,
                      },
                    })
                  }
                  placeholder="facebook.com/suaempresa"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) =>
                    updateFormData({
                      socialMedia: {
                        ...formData.socialMedia,
                        instagram: e.target.value,
                      },
                    })
                  }
                  placeholder="instagram.com/suaempresa"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Horários de Funcionamento</h3>
          
          <div className="border rounded-md p-4">
            <div className="space-y-4">
              {days.map((day) => (
                <div key={day.key} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`is-open-${day.key}`}
                        checked={formData.workingHours[day.key]?.isOpen}
                        onChange={(e) =>
                          handleWorkingHoursUpdate(
                            day.key,
                            "isOpen",
                            e.target.checked
                          )
                        }
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor={`is-open-${day.key}`}>{day.label}</label>
                    </div>
                  </div>

                  {formData.workingHours[day.key]?.isOpen ? (
                    <>
                      <div className="md:col-span-4">
                        <Label htmlFor={`open-${day.key}`}>Abertura</Label>
                        <Input
                          id={`open-${day.key}`}
                          type="time"
                          value={formData.workingHours[day.key]?.open}
                          onChange={(e) =>
                            handleWorkingHoursUpdate(
                              day.key,
                              "open",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <Label htmlFor={`close-${day.key}`}>Fechamento</Label>
                        <Input
                          id={`close-${day.key}`}
                          type="time"
                          value={formData.workingHours[day.key]?.close}
                          onChange={(e) =>
                            handleWorkingHoursUpdate(
                              day.key,
                              "close",
                              e.target.value
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-8 text-gray-500">
                      Fechado
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrev}>
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={onNext} 
          disabled={!isFormValid()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};
