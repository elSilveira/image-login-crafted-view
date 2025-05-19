
import React from "react";
import { SearchX } from "lucide-react";
import { categories } from "@/components/services/ServiceFilters";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function EmptyResults() {
  // Select a few categories to suggest
  const suggestedCategories = categories.slice(1, 5); // Skip "Todas categorias"

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white rounded-lg shadow-sm">
      <SearchX className="h-12 w-12 text-gray-300 mb-3" />
      <h3 className="text-lg font-semibold text-iazi-text mb-1">Nenhum resultado encontrado</h3>
      <p className="text-gray-600 mb-4 max-w-md text-sm">
        Não conseguimos encontrar o que você está procurando. Tente ajustar os filtros ou busque por outra palavra-chave.
      </p>

      <div className="space-y-3 w-full max-w-md">
        <div className="text-left">
          <h4 className="font-medium text-iazi-text mb-1 text-sm">Categorias populares:</h4>
          <div className="flex flex-wrap gap-1.5">
            {suggestedCategories.map((category) => (
              <Link key={category} to={`/search?category=${encodeURIComponent(category)}`}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 rounded-full border-iazi-border hover:bg-iazi-rosa-1 hover:text-iazi-text hover:border-iazi-rosa-medio text-xs"
                >
                  {category}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Link to="/">
            <Button className="bg-iazi-primary hover:bg-iazi-primary-hover text-white w-full h-9">
              Voltar para página inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
