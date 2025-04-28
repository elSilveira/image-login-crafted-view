
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SearchTabsProps {
  viewType: string;
  onTabChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  serviceCount: number;
  companyCount: number;
  children: React.ReactNode;
}

export const SearchTabs = ({
  viewType,
  onTabChange,
  sortBy,
  onSortChange,
  serviceCount,
  companyCount,
  children,
}: SearchTabsProps) => {
  return (
    <Tabs defaultValue={viewType} value={viewType} onValueChange={onTabChange} className="w-full">
      <TabsList>
        <TabsTrigger value="all">
          Todos ({serviceCount + companyCount})
        </TabsTrigger>
        <TabsTrigger value="service">
          Serviços ({serviceCount})
        </TabsTrigger>
        <TabsTrigger value="company">
          Empresas ({companyCount})
        </TabsTrigger>
      </TabsList>

      <div className="flex justify-between items-center mt-6 mb-4">
        <div className="mt-4 sm:mt-0">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Melhor avaliação</SelectItem>
              {viewType !== "company" && (
                <>
                  <SelectItem value="price-asc">Menor preço</SelectItem>
                  <SelectItem value="price-desc">Maior preço</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {children}
    </Tabs>
  );
};
