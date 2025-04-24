
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import BookingHistory from "./pages/BookingHistory";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
            <Route path="/service/:id" element={<ServiceDetails />} />
            <Route path="/professionals" element={<Navigate to="/search?type=company" />} />
            <Route path="/services" element={<Navigate to="/search?type=service" />} />
            <Route path="/booking/:serviceId" element={<Booking />} />
            <Route path="/booking-history" element={<BookingHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
