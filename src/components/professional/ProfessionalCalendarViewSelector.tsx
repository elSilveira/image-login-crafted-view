// src/components/professional/ProfessionalCalendarViewSelector.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ViewType } from "@/components/company/calendar/types";
import { Calendar, LayoutGrid, List } from "lucide-react";

interface ProfessionalCalendarViewSelectorProps {
  selectedView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const ProfessionalCalendarViewSelector: React.FC<ProfessionalCalendarViewSelectorProps> = ({
  selectedView,
  onViewChange,
}) => {
  return (
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
  );
};

export default ProfessionalCalendarViewSelector;
