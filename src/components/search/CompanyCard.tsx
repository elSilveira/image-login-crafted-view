
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Briefcase, Star, User } from "lucide-react";

interface CompanyCardProps {
  company: {
    id: number;
    name: string;
    specialty: string;
    services: string[];
    professionals: string[];
    professional_ids?: number[];
    image: string;
    rating: number;
    reviews: number;
    availability: string;
  };
  isHighlighted: boolean;
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

export const CompanyCard = ({ company, isHighlighted }: CompanyCardProps) => {
  const companyId = company.id.toString();
  
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-300 border-l-4 border-l-[#4664EA] ${
      isHighlighted ? "ring-2 ring-[#4664EA]" : ""
    }`}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-[#f8f9ff]">
            <Avatar className="h-24 w-24 mb-3 border-2 border-[#eef1ff] shadow-sm">
              <AvatarImage src={company.image} alt={company.name} />
              <AvatarFallback className="bg-[#4664EA] text-white">
                <Briefcase className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-1 mb-1">
              {renderStars(company.rating)}
            </div>
            <div className="text-sm text-center">
              <span className="font-semibold">{company.rating}</span>
              <span className="text-gray-500"> ({company.reviews})</span>
            </div>
          </div>
          
          <div className="md:w-3/4 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-playfair font-semibold mb-1 text-iazi-text">{company.name}</h3>
                <p className="text-[#4664EA] text-sm font-inter mb-2">{company.specialty}</p>
              </div>
              <Badge className="bg-[#eef1ff] text-[#4664EA] hover:bg-[#e5eaff]">Empresa</Badge>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {company.services && company.services.slice(0, 3).map((service: string, i: number) => (
                <Badge key={i} variant="outline" className="bg-gray-50">
                  {service}
                </Badge>
              ))}
            </div>
            
            <p className="text-sm text-gray-600 font-inter mb-3">
              <span className="font-medium">Profissionais:</span>{" "}
              {company.professionals && company.professionals.map((prof: string, index: number) => (
                <Link
                  key={index}
                  to={`/professional/${company.professional_ids && company.professional_ids[index] ? company.professional_ids[index] : index}`}
                  className="hover:text-iazi-primary"
                >
                  {prof}{index < company.professionals.length - 1 ? ", " : ""}
                </Link>
              ))}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4 font-inter">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Disponível: {company.availability}</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={`/professional/${company.id}`}>
                  Ver detalhes
                </Link>
              </Button>
              <Button className="flex-1 bg-[#4664EA] hover:bg-[#3a52c7]" asChild>
                <Link to={`/booking/1?company=true`}>
                  <User className="h-4 w-4 mr-1" />
                  Selecionar Profissional
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
