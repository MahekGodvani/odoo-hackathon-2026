// src/pages/Dashboard.tsx
import React from 'react';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { KPICards } from '../components/dashboard/KPICards';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { OverdueReturns } from '../components/dashboard/OverdueReturns';
import { MaintenanceList } from '../components/dashboard/MaintenanceList';
import { TodaysBookings } from '../components/dashboard/TodaysBookings';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { NotificationsPanel } from '../components/dashboard/NotificationsPanel';
import { BottomSummary } from '../components/dashboard/BottomSummary';

const Dashboard: React.FC = () => (
  <div>
    <WelcomeBanner />
    <KPICards />
    <DashboardCharts />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
      <OverdueReturns />
      <MaintenanceList />
      <TodaysBookings />
    </div>
    <QuickActions />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <RecentActivity />
      <NotificationsPanel />
    </div>
    <BottomSummary />
  </div>
);

export default Dashboard;
