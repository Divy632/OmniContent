import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import AppLayout from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateCatalogPage from './pages/CreateCatalogPage';
import CreateFormPage from './pages/CreateFormPage';
import CreationResultPage from './pages/CreationResultPage';
import CreationsListPage from './pages/CreationsListPage';
import PreferencesPage from './pages/PreferencesPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing & Auth Routes */}
            <Route element={<AppLayout requireAuth={false} />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected Universal Workspace Routes (Appendix B) */}
            <Route element={<AppLayout requireAuth={true} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create" element={<CreateCatalogPage />} />
              <Route path="/create/:contentType" element={<CreateFormPage />} />
              <Route path="/creations" element={<CreationsListPage />} />
              <Route path="/creations/:id" element={<CreationResultPage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
