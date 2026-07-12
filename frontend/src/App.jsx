import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Styling
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Assignments from './pages/Assignments';
import Transfers from './pages/Transfers';
import Maintenance from './pages/Maintenance';
import Repairs from './pages/Repairs';
import Vendors from './pages/Vendors';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';

// Route Guard Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/assets" element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          } />

          <Route path="/assignments" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <Assignments />
            </ProtectedRoute>
          } />

          <Route path="/transfers" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <Transfers />
            </ProtectedRoute>
          } />

          <Route path="/maintenance" element={
            <ProtectedRoute>
              <Maintenance />
            </ProtectedRoute>
          } />

          <Route path="/repairs" element={
            <ProtectedRoute>
              <Repairs />
            </ProtectedRoute>
          } />

          <Route path="/vendors" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <Vendors />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['Admin', 'Manager']}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Users />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: 'var(--bg-surface)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
        }
      }} />
    </AuthProvider>
  );
};

export default App;
