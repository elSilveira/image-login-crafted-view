
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CategoryCard } from "@/components/home/CategoryCard";
import { User, Scissors, Star, HeartPulse, Sparkle } from "lucide-react";

export const CategorySection = () => {
  const categories = [
    { title: "Cabelo", icon: User, href: "/search?category=cabelo" },
    { title: "Barba", icon: Scissors, href: "/search?category=barba" },
    { title: "Manicure", icon: Star, href: "/search?category=manicure" },
    { title: "Massagem", icon: HeartPulse, href: "/search?category=massagem" },
    { title: "Estética", icon: Sparkle, href: "/search?category=estetica" },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-xl font-playfair font-semibold mb-4 text-iazi-text">Categorias Populares</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          {categories.map((category) => (
            <CategoryCard 
              key={category.title} 
              title={category.title} 
              icon={category.icon}
              href={category.href}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
