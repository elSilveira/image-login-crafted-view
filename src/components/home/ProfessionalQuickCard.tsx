import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Calendar } from 'lucide-react';

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

// Redesigned card for displaying professionals with improved layout
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
  const serviceCount = services?.length || 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
              <AvatarImage src={image || ''} alt={name} />
              <AvatarFallback className="bg-[#4664EA] text-white text-lg font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              {role && <p className="text-sm text-gray-600">{role}</p>}
              {rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-3">
            {company && (
              <div className="flex items-center text-sm gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Link to={`/company/${company.id}`} className="text-iazi-primary hover:underline truncate">
                  {company.name}
                </Link>
              </div>
            )}

            {hasServices && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {serviceCount} {serviceCount === 1 ? 'serviço disponível' : 'serviços disponíveis'}
                </span>
                {serviceCount > 0 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Disponível para agendamento
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 text-sm" asChild>
                <Link to={`/professional/${id}`}>Ver perfil</Link>
              </Button>
              
              {hasServices && (
                <Button size="sm" className="flex-1 text-sm" asChild>
                  <Link to={`/professional/${id}?tab=availability`}>
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Agendar
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
