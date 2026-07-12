// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
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
import { api } from '../utils/api';
import { theme } from '../styles/theme';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<any>('/reports/dashboard');
        setDashboardData(res);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: theme.font }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: theme.colors.text.primary, marginBottom: 8 }}>Loading Dashboard...</div>
        <div style={{ fontSize: 13, color: theme.colors.text.muted }}>Retrieving live statistics and calculations...</div>
      </div>
    );
  }

  return (
    <div>
      <WelcomeBanner />
      <KPICards data={dashboardData} />
      <DashboardCharts charts={dashboardData?.charts} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 28 }}>
        <OverdueReturns data={dashboardData?.overdue} />
        <MaintenanceList data={dashboardData?.repairs} />
        <TodaysBookings data={dashboardData?.bookings} />
      </div>
      <QuickActions />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <RecentActivity data={dashboardData?.recentActivity} />
        <NotificationsPanel data={dashboardData?.notifications} />
      </div>
      <BottomSummary data={dashboardData?.summary} />
    </div>
  );
};

export default Dashboard;
