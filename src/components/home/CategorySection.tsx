
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Wrench, Home, Brush, Car, GraduationCap, Utensils, Palette, Code, HeartPulse, Loader2, AlertCircle } from "lucide-react";
import React from "react"; // Import React for Lucide icons

// Define an interface for the Category data from the API
interface Category {
  id: number;
  name: string;
  icon?: string | null; // Assuming the API might provide an icon name string
}

// Helper to map icon names (strings) to Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  wrench: Wrench,
  home: Home,
  brush: Brush,
  car: Car,
  graduationcap: GraduationCap,
  utensils: Utensils,
  palette: Palette,
  code: Code,
  heartpulse: HeartPulse,
  // Add more mappings as needed based on potential icon names from the API
};

export const CategorySection = () => {
  // Fetch categories using React Query
  const { data: categories, isLoading, isError, error } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity, // Categories usually don't change often, cache indefinitely
  });

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-playfair font-semibold mb-4 text-iazi-text">Categorias Populares</h2>
      
      {isLoading && (
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center h-24 bg-destructive/10 border border-destructive rounded-md p-4">
          <AlertCircle className="h-6 w-6 text-destructive mr-2" />
          <span className="text-destructive text-sm">Erro ao carregar categorias: {error.message}</span>
        </div>
      )}

      {!isLoading && !isError && categories && (
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4"> {/* Added padding-bottom for scrollbar visibility */}
            {categories.length > 0 ? (
              categories.map((category) => {
                // Get the corresponding Lucide icon, default to a generic one if not found
                const IconComponent = category.icon ? iconMap[category.icon.toLowerCase()] || Wrench : Wrench;
                
                // Make sure to extract category.name as a string for display
                const categoryName = typeof category.name === 'string' ? category.name : 'Categoria';
                
                return (
                  <CategoryCard 
                    key={category.id} 
                    title={categoryName} 
                    icon={IconComponent} // Pass the component itself
                    // Construct href based on category name or ID
                    href={`/search?category=${encodeURIComponent(categoryName.toLowerCase())}`}
                  />
                );
              })
            ) : (
              <p className="text-muted-foreground italic">Nenhuma categoria encontrada.</p>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </section>
  );
};
