
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyBooking from "./pages/CompanyBooking";
import CompanyServices from "./pages/CompanyServices";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Reviews from "./pages/Reviews";
import Gamification from "./pages/Gamification";
import ProfessionalProfileSettings from "./pages/ProfessionalProfileSettings";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyDashboard from "./pages/CompanyDashboard";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/professional/:id" element={<ProfessionalProfile />} />
              <Route path="/company/:id" element={<CompanyProfile />} />
              <Route path="/company/:id/services" element={<CompanyServices />} />
              <Route path="/company/register" element={<CompanyRegister />} />
              <Route path="/company/my-company/dashboard" element={<CompanyDashboard />} />
              <Route path="/booking/company/:companyId" element={<CompanyBooking />} />
              <Route path="/service/:id" element={<ServiceDetails />} />
              <Route path="/services" element={<Navigate to="/search?type=service" />} />
              <Route path="/booking/:serviceId" element={<Booking />} />
              <Route path="/booking-history" element={<BookingHistory />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/professional/settings" element={<ProfessionalProfileSettings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings/*" element={<Settings />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
