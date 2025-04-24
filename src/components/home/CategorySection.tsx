
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Wrench, Home, Brush, Car, GraduationCap } from "lucide-react";

export const CategorySection = () => {
  const categories = [
    { title: "Manutenção", icon: Wrench, href: "/search?category=manutencao" },
    { title: "Casa", icon: Home, href: "/search?category=casa" },
    { title: "Estética", icon: Brush, href: "/search?category=estetica" },
    { title: "Automotivo", icon: Car, href: "/search?category=automotivo" },
    { title: "Educação", icon: GraduationCap, href: "/search?category=educacao" },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-playfair font-semibold mb-4 text-iazi-text">Categorias Populares</h2>
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
