
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReviewForm from "./ReviewForm";

interface AppointmentReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentData: {
    id: string;
    serviceId?: string;
    serviceName?: string;
    professionalId?: string;
    professionalName?: string;
    companyId?: string;
    companyName?: string;
    userId?: string;
    userName?: string;
    reviewType?: "professional" | "user";
  };
  onSuccess?: () => void;
}

const AppointmentReviewDialog = ({
  open,
  onOpenChange,
  appointmentData,
  onSuccess,
}: AppointmentReviewDialogProps) => {
  const { 
    serviceId, 
    professionalId, 
    companyId, 
    serviceName, 
    userId, 
    userName, 
    reviewType = "professional" 
  } = appointmentData;

  const isUserReview = reviewType === "user";
  
  // Determine title and description based on review type
  const title = isUserReview 
    ? "Avaliar Cliente" 
    : "Avaliar Serviço";
  
  const description = isUserReview
    ? `Compartilhe sua experiência sobre o atendimento a ${userName || "este cliente"}.`
    : `Compartilhe sua experiência sobre ${serviceName || "este serviço"}. Sua avaliação ajuda outros usuários e o profissional a melhorar.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          onClose={() => onOpenChange(false)}
          serviceId={serviceId}
          professionalId={professionalId}
          companyId={companyId}
          userId={isUserReview ? userId : undefined}
          appointmentId={appointmentData.id}
          onSuccess={onSuccess}
          reviewType={reviewType}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentReviewDialog;
