
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileImages } from "./professional/ProfileImages";
import { ProfessionalInfo } from "./professional/ProfessionalInfo";
import { ExperienceSection } from "./professional/ExperienceSection";
import { EducationSection } from "./professional/EducationSection";
import { ServicesSection } from "./professional/ServicesSection";
import { AvailabilitySection } from "./professional/AvailabilitySection";
import { PortfolioSection } from "./professional/PortfolioSection";

export const UserProfessionalInfo = () => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <ProfileImages
        coverImage={coverImage}
        avatarImage={avatarImage}
        onCoverImageChange={setCoverImage}
        onAvatarImageChange={setAvatarImage}
      />
      <ProfessionalInfo />
      <ExperienceSection />
      <EducationSection />
      <ServicesSection />
      <AvailabilitySection />
      <PortfolioSection />

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancelar</Button>
        <Button>Salvar Alterações</Button>
      </div>
    </div>
  );
};
