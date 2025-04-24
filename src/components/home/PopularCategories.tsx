
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { User, Clock, Star } from "lucide-react";

export const PopularCategories = () => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4">Categorias Populares</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-[#4664EA] hover:text-white group shadow-sm"
          >
            <User className="h-8 w-8 group-hover:text-white" />
            <span className="text-xs font-medium">Cabelo</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-[#4664EA] hover:text-white group shadow-sm"
          >
            <Clock className="h-8 w-8 group-hover:text-white" />
            <span className="text-xs font-medium">Barba</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 w-20 flex flex-col items-center justify-center gap-2 p-0 shrink-0 bg-white hover:bg-[#4664EA] hover:text-white group shadow-sm"
          >
            <Star className="h-8 w-8 group-hover:text-white" />
            <span className="text-xs font-medium">Manicure</span>
          </Button>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
};
