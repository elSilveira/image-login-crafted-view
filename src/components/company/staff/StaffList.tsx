
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StaffMemberCard } from "./StaffMemberCard";
import { AddStaffDialog } from "./AddStaffDialog";
import { mockCompany } from "@/lib/mock-company";

export const StaffList = () => {
  const [showAddDialog, setShowAddDialog] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setShowAddDialog(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Adicionar Funcionário
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCompany.staff.map((staff) => (
          <StaffMemberCard
            key={staff.id}
            id={staff.id}
            name={staff.name}
            role={staff.role}
            email={`${staff.name.toLowerCase().replace(' ', '.')}@barbeariavintage.com.br`}
            image={staff.image}
          />
        ))}
      </div>

      <AddStaffDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};
