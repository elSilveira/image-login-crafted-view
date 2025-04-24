
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  rating: number;
  price: number;
}

export const ServiceCard = ({ title, description, rating, price }: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all border-iazi-border">
      <CardContent className="p-0">
        <div className="aspect-video bg-gray-100" />
        <div className="p-4">
          <h3 className="font-outfit font-semibold mb-2 text-iazi-text">{title}</h3>
          <p className="text-sm font-inter text-gray-600 mb-3">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium font-inter">{rating}</span>
            </div>
            <span className="text-iazi-primary font-semibold font-inter">R$ {price},00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
