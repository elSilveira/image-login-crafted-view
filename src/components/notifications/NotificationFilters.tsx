
import { Calendar, Info, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NotificationFilters = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" className="gap-2">
        <Calendar className="h-4 w-4" />
        Agendamentos
      </Button>
      <Button variant="outline" className="gap-2">
        <Info className="h-4 w-4" />
        Sistema
      </Button>
      <Button variant="outline" className="gap-2">
        <Gift className="h-4 w-4" />
        Promoções
      </Button>
    </div>
  );
};
