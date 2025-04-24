
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CategoryCard } from "@/components/home/CategoryCard";
import { User, Scissors, Star, HeartPulse, Sparkle } from "lucide-react";

export const CategorySection = () => {
  const categories = [
    { title: "Cabelo", icon: User },
    { title: "Barba", icon: Scissors },
    { title: "Manicure", icon: Star },
    { title: "Massagem", icon: HeartPulse },
    { title: "Estética", icon: Sparkle },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-xl font-outfit font-semibold mb-4 text-iazi-text">Categorias Populares</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.title} 
              title={category.title} 
              icon={category.icon} 
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
