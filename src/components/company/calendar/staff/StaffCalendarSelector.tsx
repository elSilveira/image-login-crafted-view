// src/components/company/calendar/staff/StaffCalendarSelector.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/components/company/calendar/types";
import { Calendar, LayoutGrid, List } from "lucide-react";
// Removed mock import and resource-related imports/types
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { mockResources } from "@/components/company/calendar/mock-data";

interface StaffCalendarSelectorProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
  // Resource filter props removed as the feature seems unimplemented
  // selectedResource: string;
  // onResourceChange: (resourceId: string) => void;
}

export const StaffCalendarSelector: React.FC<StaffCalendarSelectorProps> = ({
  selectedView,
  onViewChange,
  // selectedResource, // Removed
  // onResourceChange, // Removed
}) => {
  // Resource fetching logic removed

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      {/* View Type Buttons */} 
      <div className="flex items-center space-x-1 border rounded-md p-1">
        <Button
          variant={selectedView === "day" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("day")}
          className="h-8"
          title="Dia"
        >
          <Calendar className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Dia</span>
        </Button>
        <Button
          variant={selectedView === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("week")}
          className="h-8"
          title="Semana"
        >
          <LayoutGrid className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Semana</span>
        </Button>
        <Button
          variant={selectedView === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("month")}
          className="h-8"
          title="Mês"
        >
          <Calendar className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Mês</span>
        </Button>
        <Button
          variant={selectedView === "list" ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewChange("list")}
          className="h-8"
          title="Lista"
        >
          <List className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Lista</span>
        </Button>
      </div>

      {/* Resource Filter Select (Removed) */} 
      {/* <div className="flex gap-2">
        <Select value={selectedResource} onValueChange={onResourceChange} disabled>
          <SelectTrigger className="w-[140px] sm:w-[180px] h-9">
            <SelectValue placeholder="Todos os recursos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os recursos</SelectItem>
            {/* Resource options would go here */}
          {/* </SelectContent>
        </Select>
      </div> */}
    </div>
  );
};

