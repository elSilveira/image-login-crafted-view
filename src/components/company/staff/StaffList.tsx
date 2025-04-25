
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { StaffMemberCard } from "./StaffMemberCard";
import { AddStaffDialog } from "./AddStaffDialog";

type StaffStatus = "active" | "inactive" | "vacation";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  status: StaffStatus;
  image: string;
  hireDate: string;
  rating: number;
  appointmentsCount: number;
}

const mockStaff: StaffMember[] = [
  {
    id: 1,
    name: "João Silva",
    role: "Cabeleireiro",
    status: "active",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    hireDate: "2024-01-15",
    rating: 4.8,
    appointmentsCount: 156,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    role: "Manicure",
    status: "vacation",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    hireDate: "2024-02-01",
    rating: 4.9,
    appointmentsCount: 203,
  },
];

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
        {mockStaff.map((staff) => (
          <StaffMemberCard
            key={staff.id}
            id={staff.id.toString()}
            name={staff.name}
            role={staff.role}
            email={`${staff.name.toLowerCase().replace(' ', '.')}@example.com`}
            image={staff.image}
          />
        ))}
      </div>

      <AddStaffDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};
