
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  href: string;
}

export const CategoryCard = ({ title, icon: Icon, href }: CategoryCardProps) => {
  return (
    <Button
      variant="outline"
      className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-iazi-primary hover:text-white group shadow-sm border-iazi-border"
      asChild
    >
      <Link to={href}>
        <Icon className="h-8 w-8 group-hover:text-white" />
        <span className="text-xs font-medium font-inter">{title}</span>
      </Link>
    </Button>
  );
};
