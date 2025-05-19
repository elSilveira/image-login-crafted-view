import React, { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProfessionalAreaLayout from "@/components/ProfessionalAreaLayout";
import { NetworkStatus } from "@/components/ui/network-status";
import { PwaUpdateNotification } from "@/components/ui/pwa-update-notification";
import { InstallAppBanner } from "@/components/ui/install-app-banner";
import { registerServiceWorker } from "@/lib/register-sw";

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

// Simple fallback component for loading
function Loading() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-4">
        <div className="text-xl font-semibold text-gray-700">Carregando...</div>
        <div className="mt-2 text-sm text-gray-500">Por favor, aguarde enquanto carregamos o conteúdo.</div>
      </div>
    </div>
  );
}

// Simple fallback if Home component fails to load
function FallbackComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">IAZI Fallback</h1>
        <p className="text-gray-700 mb-4">
          Este é um componente de fallback. Se você está vendo isto, significa
          que o componente não carregou corretamente.
        </p>
      </div>
    </div>
  );
}

// Error boundary component with proper TypeScript typing
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component error caught:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <FallbackComponent />;
    }
    return this.props.children;
  }
}

// Wrap component with error boundary
function withErrorBoundary(Component: React.ComponentType<any>) {
  return function WrappedComponent(props: any) {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

function WorkingApp() {
  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);

  console.log("WorkingApp rendering");
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<withErrorBoundary(Home) />} />
            <Route path="/login" element={<withErrorBoundary(Login) />} />
            <Route path="/register" element={<withErrorBoundary(Register) />} />
            <Route path="/forgot-password" element={<withErrorBoundary(ForgotPassword) />} />
            <Route path="/profile" element={<withErrorBoundary(UserProfile) />} />
            <Route path="/services" element={<withErrorBoundary(Services) />} />
            <Route path="/service/:id" element={<withErrorBoundary(ServiceDetails) />} />
            <Route path="/professional/:id" element={<withErrorBoundary(ProfessionalProfile) />} />
            <Route path="/booking-history" element={<withErrorBoundary(BookingHistory) />} />
            <Route path="/booking/:serviceId" element={<withErrorBoundary(Booking) />} />
            <Route path="/booking/company/:companyId" element={<withErrorBoundary(CompanyBooking) />} />
            <Route path="/booking/reschedule/:appointmentId" element={<withErrorBoundary(BookingReschedule) />} />
            <Route path="/company/:id" element={<withErrorBoundary(CompanyProfile) />} />
            <Route path="/company/register" element={<withErrorBoundary(CompanyRegister) />} />
            <Route path="/search" element={<withErrorBoundary(Search) />} />
            <Route path="/notifications" element={<withErrorBoundary(Notifications) />} />
            <Route path="/settings" element={<withErrorBoundary(Settings) />} />
            <Route path="/reviews" element={<withErrorBoundary(Reviews) />} />
            <Route path="/gamification" element={<withErrorBoundary(Gamification) />} />
            <Route path="/professionals" element={<withErrorBoundary(Professionals) />} />
            
            {/* Professional area submenu routes */}
            <Route path="/profile/professional" element={<withErrorBoundary(ProfessionalAreaLayout) />}>
              {/* Perfil tab */}
              <Route index element={<withErrorBoundary(ProfessionalProfileSettings) />} />
              {/* Serviços tab */}
              <Route path="services" element={<withErrorBoundary(ProfessionalServicesAdmin) />} />
              {/* Dashboard tab */}
              <Route path="dashboard" element={<withErrorBoundary(ProfessionalDashboard) />} />
              {/* Agenda tab */}
              <Route path="calendar" element={<withErrorBoundary(ProfessionalCalendar) />} />
              {/* Agendamentos tab */}
              <Route path="bookings" element={<withErrorBoundary(ProfessionalBookings) />} />
              {/* Avaliações tab */}
              <Route path="reviews" element={<withErrorBoundary(Reviews) />} />
              {/* Relatórios tab */}
              <Route path="reports" element={<withErrorBoundary(ProfessionalReports) />} />
              {/* Configurações tab */}
              <Route path="settings" element={<withErrorBoundary(ProfessionalSettings) />} />
            </Route>
            {/* End professional area submenu */}
            
            {/* Company Admin Routes */}
            <Route path="/company/my-company/dashboard" element={<withErrorBoundary(CompanyDashboard) />} />
            <Route path="/company/my-company/services" element={<withErrorBoundary(CompanyServicesAdmin) />} />
            <Route path="/company/my-company/profile" element={<withErrorBoundary(CompanyProfileAdmin) />} />
            <Route path="/company/my-company/settings" element={<withErrorBoundary(CompanySettingsAdmin) />} />
            <Route path="/company/my-company/reviews" element={<withErrorBoundary(CompanyReviewsAdmin) />} />
            <Route path="/company/my-company/reports" element={<withErrorBoundary(CompanyReportsAdmin) />} />
            <Route path="/company/my-company/staff" element={<withErrorBoundary(CompanyStaff) />} />
            <Route path="/company/my-company/calendar" element={<withErrorBoundary(CompanyCalendar) />} />
            <Route path="/company/my-company/staff/:staffId/calendar" element={<withErrorBoundary(StaffCalendar) />} />
            <Route path="/company/:id/services" element={<withErrorBoundary(CompanyServices) />} />
            
            {/* Test routes */}
            <Route path="/test/bookings" element={<withErrorBoundary(TestBookingsList) />} />
            <Route path="/test/debug-bookings" element={<withErrorBoundary(DebugBookingsPage) />} />
            <Route path="/profile/professional/schedule" element={<withErrorBoundary(ProfessionalAreaLayout) />} />
            
            {/* 404 route */}
            <Route path="*" element={<withErrorBoundary(NotFound) />} />
          </Routes>
          
          {/* PWA and global UI components */}
          <Toaster />
          <NetworkStatus />
          <PwaUpdateNotification />
          <InstallAppBanner />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default WorkingApp;
