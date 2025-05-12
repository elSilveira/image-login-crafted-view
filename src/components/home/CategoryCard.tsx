
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon; // Accept a Lucide icon component
  href: string;
  className?: string;
}

export const CategoryCard = ({
  title,
  icon: Icon, // Destructure as Icon for clearer usage
  href,
  className,
}: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg text-center min-w-[120px] hover:border-primary hover:shadow-md transition-all',
        className
      )}
    >
      <div className="p-3 bg-primary/10 rounded-full mb-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <span className="text-sm font-medium">{title}</span>
    </Link>
  );
};
