import React from 'react';
import { Card } from '../ui/Card';
import { theme } from '../../styles/theme';

const departmentAssets = [
  { label: 'Computer', value: 642, color: '#4F46E5' },
  { label: 'Civil', value: 218, color: '#06B6D4' },
  { label: 'Mechanical', value: 184, color: '#10B981' },
  { label: 'Accounts', value: 96, color: '#F59E0B' },
  { label: 'Library', value: 72, color: '#EC4899' },
];

const monthlyPurchases = [
  { label: 'Jan', value: 28 },
  { label: 'Feb', value: 42 },
  { label: 'Mar', value: 34 },
  { label: 'Apr', value: 58 },
  { label: 'May', value: 47 },
  { label: 'Jun', value: 68 },
  { label: 'Jul', value: 51 },
  { label: 'Aug', value: 74 },
];

const maintenanceCost = [
  { label: 'Jan', value: 4.2 },
  { label: 'Feb', value: 5.8 },
  { label: 'Mar', value: 3.9 },
  { label: 'Apr', value: 7.4 },
  { label: 'May', value: 6.1 },
  { label: 'Jun', value: 8.8 },
  { label: 'Jul', value: 7.2 },
  { label: 'Aug', value: 9.6 },
];

const assetDistribution = [
  { label: 'Assigned', value: 847, color: '#4F46E5' },
  { label: 'Available', value: 1284, color: '#10B981' },
  { label: 'Maintenance', value: 23, color: '#F59E0B' },
  { label: 'Lost', value: 9, color: '#EF4444' },
  { label: 'Disposed', value: 64, color: '#6B7280' },
];

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text.primary,
};

const cardSubTitleStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: 12,
  color: theme.colors.text.muted,
};

const ChartHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div style={{ marginBottom: 18 }}>
    <h3 style={cardTitleStyle}>{title}</h3>
    <p style={cardSubTitleStyle}>{subtitle}</p>
  </div>
);

const DepartmentBarChart = () => {
  const maxValue = Math.max(...departmentAssets.map((item) => item.value));

  return (
    <Card>
      <ChartHeader title="Department Assets" subtitle="Assets grouped by owning department" />
      <div style={{ display: 'grid', gap: 13 }}>
        {departmentAssets.map((item) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>{item.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.primary }}>{item.value}</span>
            </div>
            <div style={{ height: 9, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden' }}>
              <div style={{ width: `${(item.value / maxValue) * 100}%`, height: '100%', borderRadius: 99, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MonthlyPurchasesChart = () => {
  const maxValue = Math.max(...monthlyPurchases.map((item) => item.value));

  return (
    <Card>
      <ChartHeader title="Monthly Purchases" subtitle="New assets purchased over time" />
      <div style={{ height: 190, display: 'flex', alignItems: 'end', gap: 10, paddingTop: 10 }}>
        {monthlyPurchases.map((item) => (
          <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: '100%', height: 142, display: 'flex', alignItems: 'end' }}>
              <div
                title={`${item.label}: ${item.value}`}
                style={{
                  width: '100%',
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: 18,
                  borderRadius: '8px 8px 3px 3px',
                  background: 'linear-gradient(180deg, #4F46E5 0%, #06B6D4 100%)',
                }}
              />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.muted }}>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

const MaintenanceCostChart = () => {
  const maxValue = Math.max(...maintenanceCost.map((item) => item.value));
  const points = maintenanceCost
    .map((item, index) => {
      const x = 18 + index * (284 / (maintenanceCost.length - 1));
      const y = 142 - (item.value / maxValue) * 112;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Card>
      <ChartHeader title="Maintenance Cost" subtitle="Monthly service spend in thousands" />
      <svg viewBox="0 0 320 170" style={{ width: '100%', height: 190, display: 'block' }}>
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="18" x2="302" y1={34 + line * 34} y2={34 + line * 34} stroke="#F0F0F5" strokeWidth="1" />
        ))}
        <polyline points={points} fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {maintenanceCost.map((item, index) => {
          const x = 18 + index * (284 / (maintenanceCost.length - 1));
          const y = 142 - (item.value / maxValue) * 112;

          return (
            <g key={item.label}>
              <circle cx={x} cy={y} r="5" fill="#fff" stroke="#10B981" strokeWidth="3" />
              <text x={x} y="164" textAnchor="middle" fontSize="11" fontWeight="700" fill="#6B7280">{item.label}</text>
            </g>
          );
        })}
      </svg>
    </Card>
  );
};

const DistributionChart = () => {
  const total = assetDistribution.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  return (
    <Card>
      <ChartHeader title="Asset Distribution" subtitle="Current lifecycle status mix" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ position: 'relative', width: 136, height: 136, flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" style={{ width: 136, height: 136, transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="16" />
            {assetDistribution.map((item) => {
              const dash = (item.value / total) * circumference;
              const segment = (
                <circle
                  key={item.label}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
              offset += dash;
              return segment;
            })}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: theme.colors.text.primary }}>{total.toLocaleString()}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.muted }}>Assets</span>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 10, flex: 1 }}>
          {assetDistribution.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: item.color }} />
                {item.label}
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: theme.colors.text.primary }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export const DashboardCharts: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginBottom: 28 }}>
    <DepartmentBarChart />
    <MonthlyPurchasesChart />
    <MaintenanceCostChart />
    <DistributionChart />
  </div>
);
