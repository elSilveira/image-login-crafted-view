
import React, { useState } from "react";
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay, addDays, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DayCalendarView } from "./DayCalendarView";
import { WeekCalendarView } from "./WeekCalendarView";
import { MonthCalendarView } from "./MonthCalendarView";
import { ListCalendarView } from "./ListCalendarView";
import { ViewType, FilterType } from "./types";
import { mockAppointments } from "./mock-data";

interface CalendarViewProps {
  viewType: ViewType;
  staffFilter: string;
  resourceFilter: string;
  filters: FilterType;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  viewType,
  staffFilter,
  resourceFilter,
  filters,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Filter appointments based on filters
  const filteredAppointments = mockAppointments.filter(appointment => {
    if (filters.status !== "all" && appointment.status !== filters.status) {
      return false;
    }
    if (filters.service !== "all" && appointment.serviceId !== filters.service) {
      return false;
    }
    if (staffFilter !== "all" && appointment.staffId !== staffFilter) {
      return false;
    }
    if (resourceFilter !== "all" && appointment.resourceId !== resourceFilter) {
      return false;
    }
    return true;
  });
  
  const renderCalendarView = () => {
    switch (viewType) {
      case "day":
        return (
          <DayCalendarView 
            date={selectedDate} 
            appointments={filteredAppointments} 
          />
        );
      case "week":
        return (
          <WeekCalendarView 
            date={selectedDate} 
            appointments={filteredAppointments} 
          />
        );
      case "month":
        return (
          <MonthCalendarView 
            date={selectedDate} 
            appointments={filteredAppointments} 
          />
        );
      case "list":
        return (
          <ListCalendarView 
            date={selectedDate} 
            appointments={filteredAppointments} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {format(selectedDate, "MMMM yyyy")}
        </h2>
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="rounded-md border"
          />
        </div>
      </div>
      {renderCalendarView()}
    </div>
  );
};
