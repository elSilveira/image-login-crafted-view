
import { Link } from "react-router-dom";
import { Star, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ServiceCardProps {
  service: {
    id: number;
    name: string;
    category: string;
    company: string;
    professional: string;
    image: string;
    rating: number;
    reviews: number;
    price: string;
    duration: string;
    availability: string;
    company_id: string;
    professional_id: string;
  };
}

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`h-4 w-4 ${
          i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
        }`}
      />
    );
  }
  return stars;
};

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-gray-50">
            <div className="h-24 w-24 mb-3 rounded-md overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(service.rating)}
            </div>
            <div className="text-sm text-center">
              <span className="font-semibold">{service.rating}</span>
              <span className="text-gray-500"> ({service.reviews})</span>
            </div>
          </div>
          
          <div className="md:w-3/4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-playfair font-semibold mb-1 text-iazi-text">{service.name}</h3>
                <p className="text-[#4664EA] text-sm font-inter mb-2">{service.category}</p>
              </div>
              <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">Serviço</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-gray-50">
                {service.duration}
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {service.price}
              </Badge>
            </div>
            
            <Link 
              to={`/company/${service.company_id}/services`} 
              className="text-sm text-gray-600 hover:text-iazi-primary font-inter mb-3 block"
            >
              <span className="font-medium">Empresa:</span> {service.company}
            </Link>
            
            <Link
              to={`/professional/${service.professional_id}`}
              className="text-sm text-gray-600 hover:text-iazi-primary font-inter mb-3 block"
            >
              <span className="font-medium">Profissional:</span> {service.professional}
            </Link>
            
            <div className="flex items-center text-sm text-gray-500 mb-4 font-inter">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Disponível: {service.availability}</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/service/${service.id}`}>
                  Ver detalhes
                </Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to={`/booking/${service.id}`}>Agendar</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
