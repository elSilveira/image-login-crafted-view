
import { Badge } from "@/components/ui/badge";

interface SearchCategoriesProps {
  selectedCategory: string;
  allCategories: string[];
  onCategoryChange: (category: string) => void;
}

export const SearchCategories = ({ 
  selectedCategory, 
  allCategories, 
  onCategoryChange 
}: SearchCategoriesProps) => {
  return (
    <div className="mb-6">
      <h2 className="font-medium mb-3">Categorias populares</h2>
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={!selectedCategory ? "default" : "outline"} 
          className="px-3 py-1.5 cursor-pointer"
          onClick={() => onCategoryChange("")}
        >
          Todas
        </Badge>
        {allCategories.map((category, index) => (
          <Badge 
            key={index}
            variant={selectedCategory === category ? "default" : "outline"} 
            className="px-3 py-1.5 cursor-pointer"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};
