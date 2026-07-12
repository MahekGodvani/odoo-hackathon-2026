// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import type { RootState, AppDispatch } from './store';
import { initializeAuth } from './store/authSlice';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import Organization from './pages/Organization';
import Assets from './pages/Assets';
import RegisterAsset from './pages/RegisterAsset';
import Categories from './pages/Categories';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Assignments from './pages/Assignments';
import QRTracking from './pages/QRTracking';
import Transfers from './pages/Transfers';
import ResourceBooking from './pages/ResourceBooking';
import Maintenance from './pages/Maintenance';
import MaintenanceDetail from './pages/MaintenanceDetail';
import RepairRequests from './pages/RepairRequests';
import Vendors from './pages/Vendors';
import Warranty from './pages/Warranty';
import ServiceHistory from './pages/ServiceHistory';
import Audits from './pages/Audits';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import AIAssistant from './pages/AIAssistant';
import AssetRequests from './pages/AssetRequests';

// Helper component for Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16, fontWeight: 600, color: '#4F46E5', background: '#F6F8FC',
      }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Inner App component that runs inside Provider
const AppContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Common tabs for everyone */}
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="profile/change-password" element={<ChangePassword />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="assets" element={<Assets />} />
          <Route path="resource-booking" element={<ResourceBooking />} />
          <Route path="repairs" element={<RepairRequests />} />
          <Route path="asset-requests" element={<AssetRequests />} />

          {/* Admin and Manager only */}
          <Route path="organization" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Organization /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Categories /></ProtectedRoute>} />
          <Route path="departments" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Departments /></ProtectedRoute>} />
          <Route path="employees" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Employees /></ProtectedRoute>} />
          <Route path="assignments" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Assignments /></ProtectedRoute>} />
          <Route path="transfers" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Transfers /></ProtectedRoute>} />
          <Route path="vendors" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Vendors /></ProtectedRoute>} />
          <Route path="warranty" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Warranty /></ProtectedRoute>} />
          <Route path="audits" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Audits /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><Reports /></ProtectedRoute>} />
          <Route path="assets/register" element={<ProtectedRoute allowedRoles={['Admin', 'Manager']}><RegisterAsset /></ProtectedRoute>} />

          {/* Admin, Manager and Technician only */}
          <Route path="qr-tracking" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Technician']}><QRTracking /></ProtectedRoute>} />
          <Route path="maintenance" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Technician']}><Maintenance /></ProtectedRoute>} />
          <Route path="maintenance/:requestId" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Technician']}><MaintenanceDetail /></ProtectedRoute>} />
          <Route path="service-history" element={<ProtectedRoute allowedRoles={['Admin', 'Manager', 'Technician']}><ServiceHistory /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="settings" element={<ProtectedRoute allowedRoles={['Admin']}><Settings /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;

