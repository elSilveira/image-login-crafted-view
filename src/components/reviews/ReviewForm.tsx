import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createReview } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Rating, CreateReviewData } from "@/types/reviews";

interface ReviewFormProps {
  onClose: () => void;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  userId?: string;
  appointmentId?: string;
  onSuccess?: () => void;
  reviewType?: "professional" | "user";
}

const ReviewForm = ({ 
  onClose, 
  serviceId, 
  professionalId, 
  companyId,
  userId,
  appointmentId, 
  onSuccess,
  reviewType = "professional"
}: ReviewFormProps) => {
  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState<Rating | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Verifica se pelo menos um ID foi fornecido
  const hasValidId = Boolean(
    (reviewType === "professional" && (serviceId || professionalId || companyId)) ||
    (reviewType === "user" && userId)
  );

  const handleRatingHover = (hoverRating: Rating) => {
    setHoveredRating(hoverRating);
  };

  const handleRatingLeave = () => {
    setHoveredRating(null);
  };

  const handleRatingClick = (selectedRating: Rating) => {
    setRating(selectedRating);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((value) => {
      const starValue = value as Rating;
      const isActive = (hoveredRating !== null && starValue <= hoveredRating) || 
                      (hoveredRating === null && rating !== null && starValue <= rating);
      
      return (
        <Button
          key={value}
          variant="ghost"
          size="sm"
          className="p-1 relative"
          onMouseEnter={() => handleRatingHover(starValue)}
          onMouseLeave={handleRatingLeave}
          onClick={() => handleRatingClick(starValue)}
          type="button"
        >
          <Star 
            className={`h-7 w-7 transition-all duration-150 ${
              isActive ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground"
            }`} 
          />
        </Button>
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: "Avaliação necessária",
        description: "Por favor, selecione uma classificação de 1 a 5 estrelas.",
        variant: "destructive",
      });
      return;
    }

    if (!hasValidId) {
      toast({
        title: "Erro na avaliação",
        description: reviewType === "user" 
          ? "É necessário fornecer userId para criar a avaliação."
          : "É necessário fornecer serviceId, professionalId ou companyId para criar a avaliação.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Preparar os dados conforme a documentação
      const reviewData: CreateReviewData = {
        rating,
        serviceId,
        professionalId,
        companyId,
        userId,
        appointmentId,
        reviewType,
      };
      
      // Adicionar comentário se não estiver vazio
      if (comment.trim()) {
        reviewData.comment = comment.trim();
      }
      
      await createReview(reviewData);
      
      toast({
        title: "Avaliação enviada",
        description: "Sua avaliação foi registrada com sucesso!",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error: any) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro ao enviar avaliação",
        description: error.message || "Ocorreu um erro ao enviar sua avaliação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center">
        <Label className="block mb-3 font-medium">Como você avalia sua experiência?</Label>
        <div className="flex justify-center gap-1 mb-3">
          {renderStars()}
        </div>
        <div className={`text-sm font-medium transition-opacity duration-200 ${rating ? 'opacity-100' : 'opacity-0'}`}>
          {rating ? `${rating} estrela${rating !== 1 ? 's' : ''}` : ''}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comment">Seu comentário (opcional)</Label>
        <Textarea
          id="comment"
          placeholder="Conte-nos sobre sua experiência..."
          className="min-h-[120px] resize-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting || !rating || !hasValidId}
          className="bg-iazi-primary hover:bg-iazi-primary-hover"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar avaliação"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ReviewForm;
