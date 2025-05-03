
import React, { useState, useEffect } from "react";
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
import { CompanyFormData } from "../CompanyRegisterForm"; // Assuming this will be updated
import { Image as ImageIcon } from "lucide-react";

// Mock categories (Keep as is)
const categories = [
  "Estética e Beleza",
  "Saúde",
  "Fitness",
  "Gastronomia",
  "Casa e Decoração",
  "Tecnologia",
  "Educação",
  "Automotivo",
  "Eventos",
  "Outro",
];

// Mock subcategories (Keep as is)
const subCategoriesMap: Record<string, string[]> = {
  "Estética e Beleza": [
    "Cabeleireiros",
    "Manicure e Pedicure",
    "Estética Facial",
    "Maquiagem",
    "Depilação",
    "Barbearia",
  ],
  "Saúde": [
    "Massagem Terapêutica",
    "Acupuntura",
    "Quiropraxia",
    "Fisioterapia",
    "Nutrição",
    "Psicologia",
  ],
  "Fitness": [
    "Personal Trainer",
    "Yoga",
    "Pilates",
    "Crossfit",
    "Funcional",
    "Musculação",
  ],
};

interface StepBasicInfoProps {
  formData: CompanyFormData; // This interface needs logo_url, cover_image_url
  updateFormData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  // State for subcategories remains the same
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(formData.subCategories);
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>(
    formData.mainCategory ? subCategoriesMap[formData.mainCategory] || [] : []
  );

  // Handle category change (remains the same)
  const handleCategoryChange = (value: string) => {
    updateFormData({ 
      mainCategory: value,
      subCategories: [] 
    });
    setSelectedSubCategories([]);
    setAvailableSubCategories(subCategoriesMap[value] || []);
  };

  // Handle subcategory selection (remains the same)
  const handleSubCategoryToggle = (subCategory: string) => {
    const updatedSelection = selectedSubCategories.includes(subCategory)
      ? selectedSubCategories.filter(item => item !== subCategory)
      : [...selectedSubCategories, subCategory];
    
    setSelectedSubCategories(updatedSelection);
    updateFormData({ subCategories: updatedSelection });
  };

  // Form validation (remains the same, assuming URL fields are optional or handled)
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.cnpj.trim() !== "" &&
      formData.mainCategory.trim() !== "" &&
      formData.description.trim() !== ""
    );
  };

  // Handle next step (remains the same)
  const handleNext = () => {
    if (isFormValid()) {
      onNext();
    }
  };

  // Get image URLs from formData for preview
  const logoUrl = formData.logo_url;
  const coverImageUrl = formData.cover_image_url;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">1. Informações Básicas</h2>

      <div className="space-y-6">
        {/* Logo URL Input */}
        <div className="space-y-2">
          <Label htmlFor="logo_url">URL do Logo da Empresa</Label>
          <Input
            id="logo_url"
            type="url"
            value={formData.logo_url || ""} // Use logo_url
            onChange={(e) => updateFormData({ logo_url: e.target.value })} // Update logo_url
            placeholder="https://exemplo.com/logo.png"
            className="mt-1"
          />
          <div className="mt-2 flex justify-center">
            <div className="h-32 w-32 bg-muted rounded-md overflow-hidden relative border">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Prévia do Logo" 
                  className="w-full h-full object-contain" 
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
           <p className="text-sm text-gray-500">
              Insira a URL do logo da sua empresa. Recomendado: formato quadrado.
            </p>
        </div>

        {/* Cover Image URL Input */}
        <div className="space-y-2">
          <Label htmlFor="cover_image_url">URL da Imagem de Capa</Label>
          <Input
            id="cover_image_url"
            type="url"
            value={formData.cover_image_url || ""} // Use cover_image_url
            onChange={(e) => updateFormData({ cover_image_url: e.target.value })} // Update cover_image_url
            placeholder="https://exemplo.com/capa.jpg"
            className="mt-1"
          />
          <div className="mt-2 h-48 w-full bg-muted rounded-lg overflow-hidden relative border">
            {coverImageUrl ? (
              <img 
                src={coverImageUrl} 
                alt="Prévia da Capa" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                onLoad={(e) => { e.currentTarget.style.display = 'block'; }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            )}
          </div>
           <p className="text-sm text-gray-500">
              Insira a URL da imagem de capa. Recomendado: formato retangular.
            </p>
        </div>

        {/* Company Name (remains the same) */}
        <div>
          <Label htmlFor="company-name">Nome da Empresa</Label>
          <Input
            id="company-name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Digite o nome da sua empresa"
            className="mt-1"
            required
          />
        </div>

        {/* CNPJ (remains the same) */}
        <div>
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            value={formData.cnpj}
            onChange={(e) => updateFormData({ cnpj: e.target.value })}
            placeholder="Digite o CNPJ da empresa"
            className="mt-1"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Digite apenas os números, sem pontuação.
          </p>
        </div>

        {/* Main Category (remains the same) */}
        <div>
          <Label htmlFor="category">Categoria Principal</Label>
          <Select
            value={formData.mainCategory}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Selecione a categoria principal" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategories (remains the same) */}
        {availableSubCategories.length > 0 && (
          <div>
            <Label>Subcategorias</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableSubCategories.map((subCategory) => (
                <div
                  key={subCategory}
                  className={`border rounded-md p-2 cursor-pointer text-sm ${
                    selectedSubCategories.includes(subCategory)
                      ? "bg-iazi-primary text-white border-iazi-primary"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                  onClick={() => handleSubCategoryToggle(subCategory)}
                >
                  {subCategory}
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Selecione uma ou mais subcategorias para sua empresa.
            </p>
          </div>
        )}

        {/* Description (remains the same) */}
        <div>
          <Label htmlFor="description">Descrição da Empresa</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Descreva sua empresa, seus diferenciais e valores"
            className="mt-1 min-h-[120px]"
            required
          />
        </div>

        {/* Founding Year (remains the same) */}
        <div>
          <Label htmlFor="founding-year">Ano de Fundação</Label>
          <Input
            id="founding-year"
            type="number"
            value={formData.foundingYear}
            onChange={(e) => updateFormData({ foundingYear: e.target.value })}
            placeholder="Ano de fundação"
            className="mt-1"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <Button 
          type="button" 
          onClick={handleNext} 
          disabled={!isFormValid()}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
};

