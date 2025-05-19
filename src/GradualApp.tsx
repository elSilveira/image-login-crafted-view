import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Lazy load the Home component for testing
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Simple fallback component for testing
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
function FallbackHome() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">IAZI Fallback Home</h1>
        <p className="text-gray-700 mb-4">
          Este é um componente de fallback para a página inicial. Se você está vendo isto, significa
          que o componente Home não carregou corretamente.
        </p>
      </div>
    </div>
  );
}

function GradualApp() {
  // Catch errors during lazy loading
  const [homeError, setHomeError] = React.useState(false);
  
  console.log("GradualApp rendering");

  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route 
              path="/" 
              element={
                homeError ? <FallbackHome /> : 
                  <React.Suspense fallback={<Loading />}>
                    <ErrorBoundary onError={() => setHomeError(true)}>
                      <Home />
                    </ErrorBoundary>
                  </React.Suspense>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error caught:", error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return <FallbackHome />;
    }
    return this.props.children;
  }
}

export default GradualApp;
