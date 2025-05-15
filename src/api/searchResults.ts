// Mock search results for API testing (to be replaced with real API)
import { fetchSearchResults } from "@/lib/api";

// Interface for quick booking search
export interface QuickBookingResult {
  id: string;
  type: "services" | "professional" | "company";
  name: string;
  subtitle?: string;
  category?: string;
  availability?: string;
  price?: string;
  rating?: number;
  directBooking: boolean;
}

// Function to get quick booking options for the search dropdown
export const getQuickBookingOptions = async (query: string): Promise<QuickBookingResult[]> => {
  try {
    // Use the existing search API with a special parameter for quick booking results
    const results = await fetchSearchResults({
      q: query,
      quickBooking: true,
      limit: 5
    });
    
    // Transform the results into QuickBookingResults
    const quickResults: QuickBookingResult[] = [];
    
    // Add directly bookable services first
    if (results.services) {
      results.services.slice(0, 2).forEach((service: any) => {
        quickResults.push({
          id: service.id,
          type: "services",
          name: service.name || "Serviço sem nome",
          subtitle: service.company?.name || service.professional?.name,
          category: typeof service.category === 'object' ? service.category?.name : service.category,
          price: service.price,
          rating: service.rating,
          directBooking: true
        });
      });
    }
    
    // Add professionals
    if (results.professionals) {
      results.professionals.slice(0, 2).forEach((professional: any) => {
        quickResults.push({
          id: professional.id,
          type: "professional",
          name: professional.name || "Profissional sem nome",
          subtitle: professional.company?.name || professional.role,
          rating: professional.rating,
          directBooking: professional.services && professional.services.length > 0
        });
      });
    }
    
    // Add companies
    if (results.companies) {
      results.companies.slice(0, 1).forEach((company: any) => {
        quickResults.push({
          id: company.id,
          type: "company",
          name: company.name || "Empresa sem nome",
          subtitle: company.specialty || company.address?.city,
          rating: company.rating,
          directBooking: false
        });
      });
    }
    
    return quickResults;
    
  } catch (error) {
    console.error("Error fetching quick booking options:", error);
    return [];
  }
};

// Add more search-related functions as needed
