
// src/components/search/SearchCategories.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface SearchCategoriesProps {
  selectedCategory: string;
  allCategories: string[]; // This should be an array of strings, not category objects
  onCategoryChange: (category: string) => void;
}

export const SearchCategories = ({
  selectedCategory,
  allCategories,
  onCategoryChange,
}: SearchCategoriesProps) => {
  const handleCategoryClick = (category: string) => {
    onCategoryChange(category === selectedCategory ? "" : category);
  };

  return (
    <div className="mb-6">
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-3">
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full",
              selectedCategory === "" ? "bg-iazi-primary text-white hover:bg-iazi-primary-hover" : "text-iazi-text hover:text-iazi-primary border-iazi-border"
            )}
            onClick={() => onCategoryChange("")}
          >
            Todas
          </Button>
          
          {allCategories.map((categoryName, index) => {
            // Ensure categoryName is a string
            const displayName = typeof categoryName === 'string' ? categoryName : 'Categoria';
            
            return (
              <Button
                key={index}
                variant={selectedCategory === displayName ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full",
                  selectedCategory === displayName 
                    ? "bg-iazi-primary text-white hover:bg-iazi-primary-hover" 
                    : "text-iazi-text hover:text-iazi-primary hover:border-iazi-primary border-iazi-border"
                )}
                onClick={() => handleCategoryClick(displayName)}
              >
                {displayName}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
