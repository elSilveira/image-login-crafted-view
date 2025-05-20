import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createReview } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ReviewFormProps {
  onClose: () => void;
  serviceId?: string;
  professionalId?: string;
  companyId?: string;
  appointmentId?: string;
  onSuccess?: () => void;
  reviewType?: "professional" | "user";
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  onClose, 
  serviceId, 
  professionalId, 
  companyId,
  appointmentId,
  onSuccess,
  reviewType = "professional"
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verifica se temos pelo menos um ID válido
  const hasValidId = !!(serviceId || professionalId || companyId);
  
  // Função para renderizar as estrelas interativas
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      const isFilled = rating !== null && starValue <= rating;
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          className="focus:outline-none"
          aria-label={`Avaliar ${starValue} estrela${starValue !== 1 ? 's' : ''}`}
        >
          <Star 
            className={`h-8 w-8 transition-all ${
              isFilled 
                ? "fill-yellow-400 text-yellow-400" 
                : "fill-gray-200 text-gray-200 hover:fill-yellow-200 hover:text-yellow-200"
            }`} 
          />
        </button>
      );
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating) {
      toast({
        title: "Avaliação obrigatória",
        description: "Por favor, selecione uma classificação de 1 a 5 estrelas.",
        variant: "destructive"
      });
      return;
    }
    
    if (!hasValidId) {
      toast({
        title: "Erro de configuração",
        description: "Não foi possível identificar o item a ser avaliado.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Criar objeto de dados da avaliação com apenas os campos necessários
      const reviewData = {
        rating,
        comment: comment.trim() || undefined, // Não enviar comentário vazio
        serviceId,
        professionalId,
        companyId
      };
      
      // Remover campos undefined
      Object.keys(reviewData).forEach(key => {
        if (reviewData[key as keyof typeof reviewData] === undefined) {
          delete reviewData[key as keyof typeof reviewData];
        }
      });
      
      await createReview(reviewData);
      
      // Invalidar queries relevantes para forçar recarregamento dos dados
      if (professionalId) {
        queryClient.invalidateQueries({ queryKey: ["reviews", professionalId] });
        queryClient.invalidateQueries({ queryKey: ["professionalDetails", professionalId] });
      }
      if (serviceId) {
        queryClient.invalidateQueries({ queryKey: ["reviews", serviceId] });
        queryClient.invalidateQueries({ queryKey: ["serviceDetails", serviceId] });
      }
      if (companyId) {
        queryClient.invalidateQueries({ queryKey: ["reviews", companyId] });
        queryClient.invalidateQueries({ queryKey: ["companyDetails", companyId] });
      }
      
      toast({
        title: "Avaliação enviada",
        description: "Obrigado pelo seu feedback!",
      });
      
      // Chamar callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
      
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast({
        title: "Erro ao enviar avaliação",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive"
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
