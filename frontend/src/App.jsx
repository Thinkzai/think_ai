import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import LandingPage from "./pages/public/Landingpage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppRoutes from "./routes/AppRoutes";
import LiveClassStudioPage from "./pages/LiveClassStudioPage";

function RolePlaceholder({ label }) {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0B0F19] text-white">
      <p className="text-lg">{label} dashboard — coming soon.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/org-login" element={<RolePlaceholder label="Organization Login" />} />

      {/* Live Class Studio — accessible directly */}
      <Route path="/studio/:sessionId" element={<LiveClassStudioPage />} />
      <Route path="/studio" element={<LiveClassStudioPage />} />

      {/* Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={["Admin"]}><AppRoutes /></ProtectedRoute>
      } />

      {/* Learner */}
      <Route path="/learner/*" element={
        <ProtectedRoute allowedRoles={["Learner"]}><RolePlaceholder label="Learner" /></ProtectedRoute>
      } />

      {/* Instructor */}
      <Route path="/instructor/*" element={
        <ProtectedRoute allowedRoles={["Instructor"]}><RolePlaceholder label="Instructor" /></ProtectedRoute>
      } />

      {/* TA */}
      <Route path="/ta/*" element={
        <ProtectedRoute allowedRoles={["TA"]}><RolePlaceholder label="TA" /></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;