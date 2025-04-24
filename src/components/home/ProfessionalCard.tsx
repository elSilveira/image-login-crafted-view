
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Star } from "lucide-react";

interface ProfessionalCardProps {
  name: string;
  rating: number;
  image: string | null;
}

export const ProfessionalCard = ({ name, rating, image }: ProfessionalCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all border-iazi-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-outfit font-semibold mb-1 text-iazi-text">{name}</h3>
            <div className="flex items-center text-sm text-yellow-500 mb-2">
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-1 font-inter">{rating}</span>
            </div>
            <Button size="sm" className="w-full bg-iazi-primary hover:bg-iazi-primary-hover text-white">
              Ver Perfil
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
