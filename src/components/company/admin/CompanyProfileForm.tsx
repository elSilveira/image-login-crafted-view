
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { mockCompany } from "@/lib/mock-company";
import { BasicInfoFormSection } from "./profile/BasicInfoFormSection";
import { DescriptionFormSection } from "./profile/DescriptionFormSection";
import { AddressFormSection } from "./profile/AddressFormSection";

type CompanyProfileFormValues = {
  name: string;
  description: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

export function CompanyProfileForm() {
  const form = useForm<CompanyProfileFormValues>({
    defaultValues: {
      name: mockCompany.name,
      description: mockCompany.description,
      email: mockCompany.email,
      phone: mockCompany.phone,
      street: mockCompany.address.street,
      number: mockCompany.address.number,
      complement: mockCompany.address.complement,
      neighborhood: mockCompany.address.neighborhood,
      city: mockCompany.address.city,
      state: mockCompany.address.state,
      zipCode: mockCompany.address.zipCode,
    },
  });

  const onSubmit = (data: CompanyProfileFormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoFormSection control={form.control} />
        <DescriptionFormSection control={form.control} />
        <AddressFormSection control={form.control} />
        
        <div className="flex justify-end">
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </Form>
  );
}
