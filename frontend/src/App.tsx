import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/Auth/LoginForm';
import { Timer } from './components/TimeTracker/Timer';
import { ManualEntry } from './components/TimeTracker/ManualEntry';
import { TimeEntryList } from './components/TimeTracker/TimeEntryList';
import { InternList } from './components/Admin/InternList';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { useAuthStore } from './store/authStore';
import { SignUpForm } from './components/Auth/SignUpForm';
import { User } from './store/authStore';
import { OtpValidation } from './components/Auth/OtpValidation';
import { AdminLogin } from './components/Auth/AdminLogin';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { PasswordReset } from './components/Auth/PasswordReset';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const user = useAuthStore(state => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return <DashboardLayout>{children}</DashboardLayout>;
}

function InternDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Timer />
        <ManualEntry />
      </div>
      <TimeEntryList />
    </div>
  );
}

function App() {
  const user = useAuthStore((state) => (state.user || ''));
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <HashRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
            ) : showSignUp ? (
              <SignUpForm onBackToLogin={() => setShowSignUp(false)} />
            ) : (
              <LoginForm onSwitchToSignUp={() => setShowSignUp(true)} />
            )
          } 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InternDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <InternList />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/" 
          element={
            user 
              ? <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
              : <Navigate to="/login" replace />
          } 
        />

        <Route path="/otp" element={<OtpValidation />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        {/* <Route path="/PasswordReset" element={<PasswordReset />} /> */}<Route
    path="/PasswordReset"
    element={<PasswordReset/>}
/>
    
      </Routes>
    </HashRouter>
  );
}

export default App;
