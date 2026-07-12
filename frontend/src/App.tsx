// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
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

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="organization" element={<Organization />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/register" element={<RegisterAsset />} />
          <Route path="categories" element={<Categories />} />
          <Route path="departments" element={<Departments />} />
          <Route path="employees" element={<Employees />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="qr-tracking" element={<QRTracking />} />
          <Route path="transfers" element={<Transfers />} />
          <Route path="resource-booking" element={<ResourceBooking />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="maintenance/:requestId" element={<MaintenanceDetail />} />
          <Route path="repairs" element={<RepairRequests />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="warranty" element={<Warranty />} />
          <Route path="service-history" element={<ServiceHistory />} />
          <Route path="audits" element={<Audits />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/edit" element={<EditProfile />} />
          <Route path="profile/change-password" element={<ChangePassword />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
