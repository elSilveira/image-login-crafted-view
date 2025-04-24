
import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviewFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  serviceId: number;
}

const ReviewForm = ({ onClose }: ReviewFormProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Star className="h-6 w-6" />
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Seu comentário</Label>
        <Textarea
          id="comment"
          placeholder="Conte-nos sobre sua experiência..."
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button>Enviar avaliação</Button>
      </div>
    </div>
  );
};

export default ReviewForm;
