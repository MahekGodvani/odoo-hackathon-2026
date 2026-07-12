import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { FiBox, FiUserCheck, FiAlertTriangle, FiActivity, FiDollarSign } from 'react-icons/fi';
import { FaWrench } from 'react-icons/fa';
import toast from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/reports/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const summary = stats?.summary || {};
  const charts = stats?.charts || {};

  // Doughnut Chart Data (Category Distribution)
  const categoryLabels = charts.categoryDistribution?.map(c => c.categoryName) || [];
  const categoryData = charts.categoryDistribution?.map(c => c.count) || [];

  const doughnutData = {
    labels: categoryLabels,
    datasets: [{
      data: categoryData,
      backgroundColor: ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      borderColor: 'rgba(11, 15, 25, 0.8)',
      borderWidth: 2,
    }],
  };

  // Bar Chart Data (Maintenance vs Repairs)
  const barData = {
    labels: ['Preventative Maintenance', 'Corrective Repairs'],
    datasets: [{
      label: 'Total Expenses ($)',
      data: [charts.costs?.maintenance || 0, charts.costs?.repairs || 0],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderColor: ['#10b981', '#ef4444'],
      borderWidth: 1.5,
    }],
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Dashboard Insights" />
        
        <div className="row mt-4 g-4 animated-fade-in">
          {/* KPI Card 1 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card dashboard-kpi-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small font-weight-bold">Total Catalog Assets</span>
                <h2 className="font-weight-bold text-white mt-1 mb-0">{summary.totalAssets || 0}</h2>
              </div>
              <div className="kpi-icon-container" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
                <FiBox />
              </div>
            </div>
          </div>

          {/* KPI Card 2 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card dashboard-kpi-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small font-weight-bold">Assigned to Staff</span>
                <h2 className="font-weight-bold text-white mt-1 mb-0">{summary.assignedAssets || 0}</h2>
              </div>
              <div className="kpi-icon-container" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' }}>
                <FiUserCheck />
              </div>
            </div>
          </div>

          {/* KPI Card 3 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card dashboard-kpi-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small font-weight-bold">Under Service</span>
                <h2 className="font-weight-bold text-white mt-1 mb-0">{summary.underMaintenance || 0}</h2>
              </div>
              <div className="kpi-icon-container" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                <FaWrench />
              </div>
            </div>
          </div>

          {/* KPI Card 4 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="glass-card dashboard-kpi-card d-flex align-items-center justify-content-between">
              <div>
                <span className="text-muted small font-weight-bold">Warranty Expiring (30d)</span>
                <h2 className="font-weight-bold text-white mt-1 mb-0">{summary.warrantyExpiring || 0}</h2>
              </div>
              <div className="kpi-icon-container" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                <FiAlertTriangle />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Activities */}
        <div className="row mt-4 g-4 animated-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 h-100">
              <h5 className="font-weight-bold text-white mb-3">Asset Allocation by Category</h5>
              <div style={{ maxHeight: '300px', display: 'flex', justifyContent: 'center' }}>
                <Doughnut 
                  data={doughnutData} 
                  options={{
                    plugins: {
                      legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans' } } }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="glass-card p-4 h-100">
              <h5 className="font-weight-bold text-white mb-3">Expense Tracking ($)</h5>
              <div style={{ maxHeight: '300px' }}>
                <Bar 
                  data={barData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
