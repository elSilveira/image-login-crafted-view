import React, { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProfessionalAreaLayout from "@/components/ProfessionalAreaLayout";

// Routes
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetails = lazy(() => import("./pages/ServiceDetails"));
const ProfessionalProfile = lazy(() => import("./pages/ProfessionalProfile"));
const ProfessionalProfileSettings = lazy(() => import("./pages/ProfessionalProfileSettings"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingReschedule = lazy(() => import("./pages/BookingReschedule"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const CompanyRegister = lazy(() => import("./pages/CompanyRegister"));
const Search = lazy(() => import("./pages/Search"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Settings = lazy(() => import("./pages/Settings"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Gamification = lazy(() => import("./pages/Gamification"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Professionals = lazy(() => import("./pages/Professionals"));
const CompanyBooking = lazy(() => import("./pages/CompanyBooking"));

// Company Admin Routes
const CompanyDashboard = lazy(() => import("./pages/CompanyDashboard"));
const CompanyServicesAdmin = lazy(() => import("./pages/CompanyServicesAdmin"));
const ProfessionalServicesAdmin = lazy(() => import("./pages/ProfessionalServicesAdmin"));
const CompanyProfileAdmin = lazy(() => import("./pages/CompanyProfileAdmin"));
const CompanySettingsAdmin = lazy(() => import("./pages/CompanySettingsAdmin"));
const CompanyReviewsAdmin = lazy(() => import("./pages/CompanyReviewsAdmin"));
const CompanyReportsAdmin = lazy(() => import("./pages/CompanyReportsAdmin"));
const CompanyStaff = lazy(() => import("./pages/CompanyStaff"));
const CompanyCalendar = lazy(() => import("./pages/CompanyCalendar"));
const StaffCalendar = lazy(() => import("./pages/StaffCalendar"));
const CompanyServices = lazy(() => import("./pages/CompanyServices"));

// Professional pages
const ProfessionalDashboard = lazy(() => import("./pages/ProfessionalDashboard"));
const ProfessionalCalendar = lazy(() => import("./pages/ProfessionalCalendar"));
const ProfessionalBookings = lazy(() => import("./pages/ProfessionalBookings"));
const ProfessionalReports = lazy(() => import("./pages/ProfessionalReports"));
const ProfessionalSettings = lazy(() => import("./pages/ProfessionalSettings"));

// Test pages
const TestBookingsList = lazy(() => import("./pages/TestBookingsList"));
const DebugBookingsPage = lazy(() => import("./pages/DebugBookingsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Retry failed queries once
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center">Carregando...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/services" element={<Services />} />
              <Route path="/service/:id" element={<ServiceDetails />} />
              <Route path="/professional/:id" element={<ProfessionalProfile />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/booking/:serviceId" element={<Booking />} />
              <Route path="/booking/company/:companyId" element={<CompanyBooking />} />
              <Route path="/booking/reschedule/:appointmentId" element={<BookingReschedule />} />
              <Route path="/company/:id" element={<CompanyProfile />} />
              <Route path="/company/register" element={<CompanyRegister />} />
              <Route path="/search" element={<Search />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="/professionals" element={<Professionals />} />
              
              {/* Professional area submenu routes */}
              <Route path="/profile/professional" element={<ProfessionalAreaLayout />}
                >
                {/* Perfil tab */}
                <Route index element={<ProfessionalProfileSettings />} />                {/* Serviços tab */}
                <Route path="services" element={<ProfessionalServicesAdmin />} />
                {/* Dashboard tab */}
                <Route path="dashboard" element={<ProfessionalDashboard />} />
                {/* Agenda tab */}
                <Route path="calendar" element={<ProfessionalCalendar />} />
                {/* Agendamentos tab */}
                <Route path="bookings" element={<ProfessionalBookings />} />
                {/* Avaliações tab */}
                <Route path="reviews" element={<Reviews />} />
                {/* Relatórios tab */}
                <Route path="reports" element={<ProfessionalReports />} />
                {/* Configurações tab */}
                <Route path="settings" element={<ProfessionalSettings />} />
                {/* Calendário tab */}
                <Route path="calendar" element={<ProfessionalCalendar />} />
              </Route>
              {/* End professional area submenu */}
              
              {/* Company Admin Routes */}
              <Route path="/company/my-company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/my-company/services" element={<CompanyServicesAdmin />} />
              <Route path="/company/my-company/profile" element={<CompanyProfileAdmin />} />
              <Route path="/company/my-company/settings" element={<CompanySettingsAdmin />} />
              <Route path="/company/my-company/reviews" element={<CompanyReviewsAdmin />} />
              <Route path="/company/my-company/reports" element={<CompanyReportsAdmin />} />
              <Route path="/company/my-company/staff" element={<CompanyStaff />} />
              <Route path="/company/my-company/calendar" element={<CompanyCalendar />} />              <Route path="/company/my-company/staff/:staffId/calendar" element={<StaffCalendar />} />
              <Route path="/company/:id/services" element={<CompanyServices />} />
                {/* Test routes */}
              <Route path="/test/bookings" element={<TestBookingsList />} />
              <Route path="/test/debug-bookings" element={<DebugBookingsPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Suspense>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
