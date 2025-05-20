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
  appointmentId?: string; // Para associar a avaliação a um agendamento específico
  onSuccess?: () => void; // Função chamada após enviar com sucesso
}

const ReviewForm = ({ 
  onClose, 
  serviceId, 
  professionalId, 
  companyId, 
  appointmentId, 
  onSuccess 
}: ReviewFormProps) => {
  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState<Rating | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Verifica se pelo menos um ID foi fornecido
  const hasValidId = Boolean(serviceId || professionalId || companyId);

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
          className="p-2 relative"
          onMouseEnter={() => handleRatingHover(starValue)}
          onMouseLeave={handleRatingLeave}
          onClick={() => handleRatingClick(starValue)}
          type="button"
        >
          <Star 
            className={`h-6 w-6 transition-all duration-150 ${
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
        description: "É necessário fornecer serviceId, professionalId ou companyId para criar a avaliação.",
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="block mb-2">Sua avaliação</Label>
        <div className="flex gap-1 mb-1">
          {renderStars()}
        </div>
        <div className="text-sm text-muted-foreground">
          {rating ? `Você selecionou ${rating} estrela${rating !== 1 ? 's' : ''}` : 'Selecione uma classificação'}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comment">Seu comentário (opcional)</Label>
        <Textarea
          id="comment"
          placeholder="Conte-nos sobre sua experiência..."
          className="min-h-[100px]"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onClose} type="button" disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting || !rating || !hasValidId}>
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
