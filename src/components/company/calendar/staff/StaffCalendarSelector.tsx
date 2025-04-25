
import React from "react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/components/company/calendar/types";
import { Calendar, LayoutGrid, List } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockResources } from "@/components/company/calendar/mock-data";

interface StaffCalendarSelectorProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedResource: string;
  onResourceChange: (resourceId: string) => void;
}

export const StaffCalendarSelector: React.FC<StaffCalendarSelectorProps> = ({
  selectedView,
  onViewChange,
  selectedResource,
  onResourceChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <div className="flex items-center space-x-1 border rounded-md p-1">
        <Button
          variant={selectedView === "day" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("day")}
          className="h-8"
        >
          <Calendar className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Dia</span>
        </Button>
        <Button
          variant={selectedView === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("week")}
          className="h-8"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Semana</span>
        </Button>
        <Button
          variant={selectedView === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("month")}
          className="h-8"
        >
          <Calendar className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Mês</span>
        </Button>
        <Button
          variant={selectedView === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("list")}
          className="h-8"
        >
          <List className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Lista</span>
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Select value={selectedResource} onValueChange={onResourceChange}>
          <SelectTrigger className="w-[140px] sm:w-[180px]">
            <SelectValue placeholder="Todos os recursos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os recursos</SelectItem>
            {mockResources.map(resource => (
              <SelectItem key={resource.id} value={resource.id}>
                {resource.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
