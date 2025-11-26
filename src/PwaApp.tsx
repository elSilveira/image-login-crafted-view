import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import ProfessionalAreaLayout from "@/components/ProfessionalAreaLayout";
import { NetworkStatus } from "@/components/ui/network-status";
import { PwaUpdateNotification } from "@/components/ui/pwa-update-notification";
import { InstallAppBanner } from "@/components/ui/install-app-banner";
import { ClearCacheButton } from "@/components/ui/clear-cache-button";
import { registerServiceWorker } from "@/lib/register-sw";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

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

// Componente wrapper para gerenciar histórico de navegação
function AppWrapper() {
  // Register service worker for PWA functionality - with significant delay
  useEffect(() => {
    // Delay service worker registration to ensure React is fully mounted
    // This prevents the "useRef null" error that occurs when SW triggers reload during mount
    const swRegistrationDelay = setTimeout(() => {
      // Verificar se estamos no Safari do iOS
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
      const isSafari = /Safari/i.test(ua) && !/Chrome/i.test(ua);
      const isSafariOnIOS = isIOS && isSafari;
      
      // Verificar se a página já foi recarregada recentemente
      const hasReloaded = sessionStorage.getItem('app_initial_load_complete');
      
      // Marcar a primeira carga concluída
      if (!hasReloaded) {
        console.log('Primeira carga da aplicação - marcando sessão');
        sessionStorage.setItem('app_initial_load_complete', 'true');
      }
      
      // Em iOS, só registrar o service worker se não for primeira carga
      if (isSafariOnIOS && !hasReloaded) {
        console.log('Primeira carga no Safari iOS - adiando registro do Service Worker');
        // Na primeira carga do Safari iOS, adiar o registro do SW para evitar problemas
        setTimeout(() => {
          console.log('Registrando Service Worker após atraso inicial');
          registerServiceWorker();
        }, 3000);
      } else {
        // Para outros navegadores ou após a primeira carga, registrar normalmente
        registerServiceWorker();
      }
    }, 2000); // Wait 2 seconds before even starting SW registration
    
    return () => clearTimeout(swRegistrationDelay);
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

// Componente de conteúdo principal que pode acessar hooks de roteamento
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Manipular redirecionamentos baseados na autenticação e na rota atual
  useEffect(() => {
    // Rotas de autenticação (redirecionar para home se logado)
    const authRoutes = ['/login', '/register', '/forgot-password'];
    const isAuthRoute = authRoutes.some(route => location.pathname.startsWith(route));
    
    // Rotas públicas que qualquer um pode acessar
    const publicRoutes = [
      '/', '/search', '/services', '/service/', '/professional/', '/professionals',
      '/company/', '/reviews', '/login', '/register', '/forgot-password'
    ];
    const isPublicRoute = publicRoutes.some(route => 
      location.pathname === route || location.pathname.startsWith(route)
    );
    
    // Rotas que exigem autenticação
    const protectedRoutes = [
      '/profile', '/booking-history', '/booking/', '/notifications', 
      '/settings', '/gamification', '/company/register', '/company/my-company'
    ];
    const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
    
    // Se a página estiver carregando, não faça nada ainda
    if (isLoading) return;
    
    // Se o usuário não estiver autenticado e estiver em rota protegida, redirecione para login
    if (!isAuthenticated && isProtectedRoute) {
      console.log('Usuário não autenticado acessando rota protegida:', location.pathname);
      navigate('/login', { state: { from: location }, replace: true });
    }
    
    // Se o usuário estiver autenticado e tentar acessar rota de auth, redirecione para home
    if (isAuthenticated && isAuthRoute) {
      console.log('Usuário autenticado tentando acessar rota de auth:', location.pathname);
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Public routes - anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/professional/:id" element={<ProfessionalProfile />} />
          <Route path="/professionals" element={<Professionals />} />
          <Route path="/company/:id" element={<CompanyProfile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reviews" element={<Reviews />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
          <Route path="/booking/:serviceId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/booking/company/:companyId" element={<ProtectedRoute><CompanyBooking /></ProtectedRoute>} />
          <Route path="/booking/reschedule/:appointmentId" element={<ProtectedRoute><BookingReschedule /></ProtectedRoute>} />
          <Route path="/company/register" element={<ProtectedRoute><CompanyRegister /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/gamification" element={<ProtectedRoute><Gamification /></ProtectedRoute>} />
          
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
        
        {/* Botão para limpeza de cache - Visível apenas em Settings */}
        {location.pathname === '/settings' && (
          <div className="fixed bottom-28 right-4 z-50">
            <ClearCacheButton />
          </div>
        )}
      </Suspense>
    </ErrorBoundary>
  );
}

// Componente principal exportado
export default AppWrapper;
