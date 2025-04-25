
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
import { Upload, Image } from "lucide-react";

// Mock categories
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

// Mock subcategories
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
  formData: CompanyFormData;
  updateFormData: (data: Partial<CompanyFormData>) => void;
  onNext: () => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(formData.logo || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(formData.coverImage || null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(formData.subCategories);
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>(
    formData.mainCategory ? subCategoriesMap[formData.mainCategory] || [] : []
  );

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLogoPreview(result);
        updateFormData({ logo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image upload
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCoverPreview(result);
        updateFormData({ coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    updateFormData({ 
      mainCategory: value,
      subCategories: [] 
    });
    setSelectedSubCategories([]);
    setAvailableSubCategories(subCategoriesMap[value] || []);
  };

  // Handle subcategory selection
  const handleSubCategoryToggle = (subCategory: string) => {
    const updatedSelection = selectedSubCategories.includes(subCategory)
      ? selectedSubCategories.filter(item => item !== subCategory)
      : [...selectedSubCategories, subCategory];
    
    setSelectedSubCategories(updatedSelection);
    updateFormData({ subCategories: updatedSelection });
  };

  // Form validation
  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.cnpj.trim() !== "" &&
      formData.mainCategory.trim() !== "" &&
      formData.description.trim() !== ""
    );
  };

  // Handle next step
  const handleNext = () => {
    if (isFormValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">1. Informações Básicas</h2>

      <div className="space-y-6">
        {/* Logo Upload */}
        <div>
          <Label htmlFor="logo-upload">Logo da Empresa</Label>
          <div className="mt-2 flex items-center">
            {logoPreview ? (
              <div className="relative w-32 h-32">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => {
                    setLogoPreview(null);
                    updateFormData({ logo: "" });
                  }}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <label
                htmlFor="logo-upload"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-10 h-10 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload</span>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </label>
            )}
            <p className="ml-4 text-sm text-gray-500">
              Faça upload do logo da sua empresa. Recomendado: formato quadrado, tamanho mínimo 200x200px.
            </p>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div>
          <Label htmlFor="cover-upload">Imagem de Capa</Label>
          <div className="mt-2">
            {coverPreview ? (
              <div className="relative w-full h-48">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-full object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => {
                    setCoverPreview(null);
                    updateFormData({ coverImage: "" });
                  }}
                >
                  Remover
                </Button>
              </div>
            ) : (
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Image className="w-10 h-10 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Upload de imagem de capa</span>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
              </label>
            )}
            <p className="mt-2 text-sm text-gray-500">
              Faça upload de uma imagem de capa para sua empresa. Recomendado: formato retangular, tamanho mínimo 1200x400px.
            </p>
          </div>
        </div>

        {/* Company Name */}
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

        {/* CNPJ */}
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

        {/* Main Category */}
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

        {/* Subcategories */}
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

        {/* Description */}
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

        {/* Founding Year */}
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
