import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">IAZI Home Page</h1>
        <p className="text-gray-700">Basic Home page is working.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
