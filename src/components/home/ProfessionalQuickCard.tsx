
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/services/ServiceCard';
import { Star } from 'lucide-react';

interface ProfessionalQuickCardProps {
  id: string;
  name: string;
  image?: string | null;
  rating?: number;
  services?: any[];
  company?: {
    id: string;
    name: string;
  };
  role?: string;
}

// Compact card for displaying professionals with their services
export const ProfessionalQuickCard = ({
  id,
  name,
  image,
  rating = 0,
  services = [],
  company,
  role
}: ProfessionalQuickCardProps) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const hasServices = services && services.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src={image || ''} alt={name} />
              <AvatarFallback className="bg-[#4664EA] text-white text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            )}
            <Button variant="outline" className="mt-3 w-full text-sm" asChild>
              <Link to={`/professional/${id}`}>Ver perfil</Link>
            </Button>
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <h3 className="font-semibold text-lg">{name}</h3>
              {role && <p className="text-sm text-gray-600">{role}</p>}
              {company && (
                <Link to={`/company/${company.id}`} className="text-sm text-iazi-primary hover:underline">
                  {company.name}
                </Link>
              )}
            </div>

            {hasServices ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500">Serviços disponíveis:</h4>
                {services.slice(0, 3).map((service) => (
                  <ServiceCard 
                    key={service.id || `${service.name}-${Math.random()}`} 
                    service={service} 
                    compact={true} 
                  />
                ))}
                {services.length > 3 && (
                  <div className="text-center mt-1">
                    <Button variant="link" size="sm" asChild>
                      <Link to={`/professional/${id}`}>
                        Ver todos os {services.length} serviços
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Este profissional não tem serviços cadastrados.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
