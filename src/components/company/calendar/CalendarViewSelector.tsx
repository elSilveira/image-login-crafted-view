
import React from "react";
import { Button } from "@/components/ui/button";
import { ViewType } from "./types";
import { Calendar, LayoutGrid, List, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockStaff, mockResources } from "./mock-data";

interface CalendarViewSelectorProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  selectedStaff: string;
  onStaffChange: (staffId: string) => void;
  selectedResource: string;
  onResourceChange: (resourceId: string) => void;
}

export const CalendarViewSelector: React.FC<CalendarViewSelectorProps> = ({
  selectedView,
  onViewChange,
  selectedStaff,
  onStaffChange,
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
        <Select value={selectedStaff} onValueChange={onStaffChange}>
          <SelectTrigger className="w-[140px] sm:w-[180px]">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Todos os profissionais" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os profissionais</SelectItem>
            {mockStaff.map(staff => (
              <SelectItem key={staff.id} value={staff.id}>
                {staff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
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
