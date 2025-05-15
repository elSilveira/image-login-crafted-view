// src/components/company/calendar/staff/StaffCalendarContent.tsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarView } from "@/components/company/calendar/CalendarView";
import { ViewType, FilterType, StaffMember } from "@/components/company/calendar/types"; // Assuming StaffMember type is defined here
import { StaffCalendarHeader } from "./StaffCalendarHeader";
import { StaffCalendarSelector } from "./StaffCalendarSelector";
import { StaffCalendarSidebar } from "./StaffCalendarSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
// Removed: import { mockStaff } from "@/components/company/calendar/mock-data";

// Define API structure for a single professional (staff member)
interface ApiProfessional {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  companyId: string;
  // Add other relevant fields like working hours, services offered, etc.
}

// Adapt API data to StaffMember type used in components
// Assuming StaffMember type matches or can be adapted from ApiProfessional
const adaptApiProfessionalToStaffMember = (apiProf: ApiProfessional): StaffMember => ({
    // Map fields from ApiProfessional to StaffMember
    id: apiProf.id,
    name: apiProf.name,
    email: apiProf.email ?? undefined,
    phone: apiProf.phone ?? undefined,
    bio: apiProf.bio ?? undefined,
    imageUrl: apiProf.imageUrl ?? undefined,
    // Add default/placeholder values for fields not in ApiProfessional if needed
    // e.g., services: [], workingHours: [], etc.
});

interface StaffCalendarContentProps {
  staffId: string;
  companyId: string; // Need companyId to pass down
}

export const StaffCalendarContent: React.FC<StaffCalendarContentProps> = ({ staffId, companyId }) => {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  // const [selectedResource, setSelectedResource] = useState<string>("all"); // Resource filter removed
  const [filters, setFilters] = useState<FilterType>({
    status: "all",
    serviceId: "all", // Use serviceId instead of service
    // staff filter is implicitly the current staffId, handled by CalendarView
  });

  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the specific staff member's data
  useEffect(() => {
    if (!staffId) {
        setError("ID do profissional não fornecido.");
        setIsLoading(false);
        return;
    }

    const fetchStaffMember = async () => {
      setIsLoading(true);
      setError(null);
      try {        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3002/api"}/professionals/${staffId}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Profissional não encontrado.");
            }
            throw new Error(`Erro HTTP ${response.status}: Falha ao buscar dados do profissional`);
        }
        const data: ApiProfessional = await response.json();
        if (!data) {
            throw new Error("Dados do profissional inválidos.");
        }
        setStaffMember(adaptApiProfessionalToStaffMember(data));
      } catch (err: any) {
        console.error("Erro ao buscar profissional:", err);
        setError(err.message || "Erro ao carregar dados do profissional.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffMember();
  }, [staffId]);

  if (isLoading) {
    return (
        <div className="space-y-6 p-4">
            <Skeleton className="h-20 w-full" /> {/* Header Skeleton */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-10 w-full" /> {/* Selector Skeleton */}
                    <Skeleton className="h-[500px] w-full" /> {/* Calendar View Skeleton */}
                </div>
                <div className="w-full lg:w-80">
                    <Skeleton className="h-[400px] w-full" /> {/* Sidebar Skeleton */}
                </div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive" className="m-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Erro ao Carregar Página</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (!staffMember) {
    // This case might be redundant if error handles not found, but kept for safety
    return <div className="p-4">Profissional não encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <StaffCalendarHeader staffMember={staffMember} />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="bg-card rounded-lg border shadow-sm p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              {/* Pass companyId to selector if needed */}
              <StaffCalendarSelector
                selectedView={selectedView}
                onViewChange={setSelectedView}
                // selectedResource={selectedResource} // Removed
                // onResourceChange={setSelectedResource} // Removed
                companyId={companyId} // Pass companyId if selector needs it
              />
              {/* Add CalendarFilters here if needed for status/service */}
              {/* <CalendarFilters filters={filters} onFilterChange={setFilters} companyId={companyId} /> */}
            </div>

            <CalendarView
              viewType={selectedView}
              staffFilter={staffId} // Pass the specific staffId
              // resourceFilter={selectedResource} // Removed
              filters={filters} // Pass status/service filters
              companyId={companyId} // Pass companyId
            />
          </div>
        </div>

        <div className="w-full lg:w-80">
          {/* Pass companyId to sidebar if needed */}
          <StaffCalendarSidebar staffMember={staffMember} companyId={companyId} />
        </div>
      </div>
    </div>
  );
};

