import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
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
    professionalName,
    companyName,
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
    : `Compartilhe sua experiência sobre ${serviceName || "este serviço"}${professionalName ? ` com ${professionalName}` : ''}${companyName ? ` na ${companyName}` : ''}.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-2 text-iazi-primary mb-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="border-t pt-4 mt-2">
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentReviewDialog;
