import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProfessionalAreaLayout from "@/components/ProfessionalAreaLayout";
import { NetworkStatus } from "@/components/ui/network-status";
import { PwaUpdateNotification } from "@/components/ui/pwa-update-notification";
import { InstallAppBanner } from "@/components/ui/install-app-banner";
import { registerServiceWorker } from "@/lib/register-sw";
import ProtectedRoute from "@/components/ProtectedRoute";

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

// Simple error boundary component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Component error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Algo deu errado</h1>
            <p className="text-gray-700 mb-4">
              Ocorreu um erro ao carregar esta página. Tente novamente mais tarde.
            </p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => this.setState({ hasError: false })}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function PwaApp() {
  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker();
  }, []);

  console.log("PwaApp rendering");
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
              <Route path="/service/:id" element={<ProtectedRoute><ServiceDetails /></ProtectedRoute>} />
              <Route path="/professional/:id" element={<ProtectedRoute><ProfessionalProfile /></ProtectedRoute>} />
              <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
              <Route path="/booking/:serviceId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
              <Route path="/booking/company/:companyId" element={<ProtectedRoute><CompanyBooking /></ProtectedRoute>} />
              <Route path="/booking/reschedule/:appointmentId" element={<ProtectedRoute><BookingReschedule /></ProtectedRoute>} />
              <Route path="/company/:id" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
              <Route path="/company/register" element={<ProtectedRoute><CompanyRegister /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
              <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
              <Route path="/professionals" element={<ProtectedRoute><Professionals /></ProtectedRoute>} />
              
              {/* Professional area submenu routes */}
              <Route path="/profile/professional" element={<ProtectedRoute><ProfessionalAreaLayout /></ProtectedRoute>}>
                {/* Perfil tab */}
                <Route index element={<ProfessionalProfileSettings />} />
                {/* Serviços tab */}
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
              </Route>
              
              {/* Company Admin Routes */}
              <Route path="/company/my-company/dashboard" element={<ProtectedRoute><CompanyDashboard /></ProtectedRoute>} />
              <Route path="/company/my-company/services" element={<ProtectedRoute><CompanyServicesAdmin /></ProtectedRoute>} />
              <Route path="/company/my-company/profile" element={<ProtectedRoute><CompanyProfileAdmin /></ProtectedRoute>} />
              <Route path="/company/my-company/settings" element={<ProtectedRoute><CompanySettingsAdmin /></ProtectedRoute>} />
              <Route path="/company/my-company/reviews" element={<ProtectedRoute><CompanyReviewsAdmin /></ProtectedRoute>} />
              <Route path="/company/my-company/reports" element={<ProtectedRoute><CompanyReportsAdmin /></ProtectedRoute>} />
              <Route path="/company/my-company/staff" element={<ProtectedRoute><CompanyStaff /></ProtectedRoute>} />
              <Route path="/company/my-company/calendar" element={<ProtectedRoute><CompanyCalendar /></ProtectedRoute>} />
              <Route path="/company/my-company/staff/:staffId/calendar" element={<ProtectedRoute><StaffCalendar /></ProtectedRoute>} />
              <Route path="/company/:id/services" element={<ProtectedRoute><CompanyServices /></ProtectedRoute>} />
              
              {/* Test routes */}
              <Route path="/test/bookings" element={<ProtectedRoute><TestBookingsList /></ProtectedRoute>} />
              <Route path="/test/debug-bookings" element={<ProtectedRoute><DebugBookingsPage /></ProtectedRoute>} />
              <Route path="/profile/professional/schedule" element={<ProtectedRoute><ProfessionalAreaLayout /></ProtectedRoute>} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* PWA and global UI components */}
            <Toaster />
            <NetworkStatus />
            <PwaUpdateNotification />
            <InstallAppBanner />
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default PwaApp;
