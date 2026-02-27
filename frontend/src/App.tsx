import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/AuthContext'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Companies from './pages/Companies.tsx'
import Projects from './pages/Projects.tsx'
import Messages from './pages/Messages.tsx'
import ServiceRequests from './pages/ServiceRequests.tsx'
import Users from './pages/Users.tsx'
import Profile from './pages/Profile.tsx'
import Layout from './layout/Layout'

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { token, user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0f1d] gap-6">
      <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400 animate-pulse">Initializing Secure Session...</span>
    </div>
  );
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Companies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-requests"
        element={
          <ProtectedRoute allowedRoles={['admin', 'client']}>
            <ServiceRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
