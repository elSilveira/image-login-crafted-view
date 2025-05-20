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
  };
  onSuccess?: () => void;
}

const AppointmentReviewDialog = ({
  open,
  onOpenChange,
  appointmentData,
  onSuccess,
}: AppointmentReviewDialogProps) => {
  const { serviceId, professionalId, companyId, serviceName } = appointmentData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Avaliar Serviço</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiência sobre {serviceName || "este serviço"}.
            Sua avaliação ajuda outros usuários e o profissional a melhorar.
          </DialogDescription>
        </DialogHeader>
        <ReviewForm
          onClose={() => onOpenChange(false)}
          serviceId={serviceId}
          professionalId={professionalId}
          companyId={companyId}
          appointmentId={appointmentData.id}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentReviewDialog; 