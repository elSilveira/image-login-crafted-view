
import React from "react";
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
import { Clock, Check } from "lucide-react";

interface StepSettingsProps {
  formData: CompanyFormData;
  updateFormData: (data: Partial<CompanyFormData>) => void;
  onSubmit: () => void;
  onPrev: () => void;
}

// Mock payment methods
const paymentMethods = [
  "Dinheiro",
  "Cartão de Crédito",
  "Cartão de Débito",
  "PIX",
  "Transferência Bancária",
  "PayPal",
  "PagSeguro",
  "Mercado Pago",
];

export const StepSettings: React.FC<StepSettingsProps> = ({
  formData,
  updateFormData,
  onSubmit,
  onPrev,
}) => {
  // Toggle payment method selection
  const handlePaymentMethodToggle = (method: string) => {
    const updatedMethods = formData.paymentMethods.includes(method)
      ? formData.paymentMethods.filter((m) => m !== method)
      : [...formData.paymentMethods, method];
    
    updateFormData({ paymentMethods: updatedMethods });
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      formData.cancellationPolicy.trim() !== "" &&
      formData.paymentMethods.length > 0 &&
      formData.termsAccepted
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">4. Configurações e Termos</h2>

      <div className="space-y-6">
        {/* Booking Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações de Agendamento</h3>
          
          <div className="flex items-start space-x-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="service-padding">
                Intervalo entre Serviços (minutos)
              </Label>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <Input
                  id="service-padding"
                  type="number"
                  min="0"
                  max="60"
                  step="5"
                  value={formData.bookingSettings.servicePadding}
                  onChange={(e) =>
                    updateFormData({
                      bookingSettings: {
                        ...formData.bookingSettings,
                        servicePadding: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  placeholder="15"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Período de intervalo entre os agendamentos para preparação
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="space-y-2">
          <Label htmlFor="cancellation-policy">Política de Cancelamento</Label>
          <Select
            value={formData.cancellationPolicy}
            onValueChange={(value) =>
              updateFormData({ cancellationPolicy: value })
            }
          >
            <SelectTrigger id="cancellation-policy">
              <SelectValue placeholder="Selecione a política de cancelamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flexible">
                Flexível (cancelamento até 1h antes)
              </SelectItem>
              <SelectItem value="moderate">
                Moderada (cancelamento até 24h antes)
              </SelectItem>
              <SelectItem value="strict">
                Rigorosa (cancelamento até 48h antes)
              </SelectItem>
              <SelectItem value="custom">Personalizada</SelectItem>
            </SelectContent>
          </Select>
          
          {formData.cancellationPolicy === "custom" && (
            <Textarea
              className="mt-2"
              placeholder="Descreva sua política de cancelamento personalizada"
              value={formData.cancellationPolicy === "custom" ? "" : formData.cancellationPolicy}
              onChange={(e) =>
                updateFormData({ cancellationPolicy: e.target.value })
              }
            />
          )}
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <Label>Métodos de Pagamento Aceitos</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {paymentMethods.map((method) => (
              <div
                key={method}
                className={`border rounded-md p-3 cursor-pointer ${
                  formData.paymentMethods.includes(method)
                    ? "bg-iazi-primary text-white border-iazi-primary"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
                onClick={() => handlePaymentMethodToggle(method)}
              >
                <div className="flex items-center">
                  {formData.paymentMethods.includes(method) && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  <span>{method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Terms */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Termos da Plataforma</h3>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <div className="space-y-4">
              <h4 className="font-medium">Termos de Uso e Comissão</h4>
              <p className="text-sm text-gray-600">
                Ao registrar sua empresa na plataforma, você concorda com nossos termos de uso e política de comissões. A plataforma cobra uma comissão de 10% sobre cada serviço agendado através da nossa plataforma.
              </p>
              
              <div className="pt-2">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      updateFormData({ termsAccepted: e.target.checked })
                    }
                    className="mt-1 mr-2"
                  />
                  <span className="text-sm">
                    Eu li e concordo com os{" "}
                    <a href="#" className="text-iazi-primary hover:underline">
                      Termos de Uso
                    </a>{" "}
                    e{" "}
                    <a href="#" className="text-iazi-primary hover:underline">
                      Política de Privacidade
                    </a>{" "}
                    da plataforma, incluindo a comissão de 10% sobre os serviços agendados.
                  </span>
                </label>
              </div>
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
          onClick={onSubmit} 
          disabled={!isFormValid()}
        >
          Finalizar Cadastro
        </Button>
      </div>
    </div>
  );
};
