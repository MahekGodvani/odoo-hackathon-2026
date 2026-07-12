import React from 'react';
import { Card } from '../ui/Card';
import { theme } from '../../styles/theme';

interface DashboardChartsProps {
  charts?: {
    categoryDistribution?: { categoryName: string | null; count: number }[];
    departmentDistribution?: { departmentName: string | null; count: number }[];
    monthlyPurchases?: { month: number; totalCost: string | number }[];
    costs?: {
      maintenance: number;
      repairs: number;
    };
  };
}

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

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ charts }) => {
  // 1. Department Allocation
  const rawDept = charts?.departmentDistribution || [];
  const departmentAssets = rawDept.length > 0
    ? rawDept.map((item, index) => ({
        label: item.departmentName || 'Inventory',
        value: Number(item.count),
        color: colors[index % colors.length],
      }))
    : [
        { label: 'Computer', value: 6, color: '#4F46E5' },
        { label: 'Civil', value: 3, color: '#06B6D4' },
        { label: 'Accounts', value: 2, color: '#10B981' },
      ];

  const maxDeptValue = Math.max(1, ...departmentAssets.map((item) => item.value));

  // 2. Monthly Purchases
  const rawPurchases = charts?.monthlyPurchases || [];
  const monthlyPurchases = rawPurchases.length > 0
    ? rawPurchases.map((item) => ({
        label: monthNames[(Number(item.month) - 1) % 12],
        value: Math.round(Number(item.totalCost)),
      }))
    : [
        { label: 'Jan', value: 1200 },
        { label: 'Feb', value: 2400 },
        { label: 'Mar', value: 800 },
        { label: 'Apr', value: 3200 },
      ];

  const maxPurchaseValue = Math.max(1, ...monthlyPurchases.map((item) => item.value));

  // 3. Maintenance Cost Trend
  const maintenanceCostVal = charts?.costs?.maintenance || 0;
  const repairsCostVal = charts?.costs?.repairs || 0;

  // 4. Category Breakdown
  const rawCat = charts?.categoryDistribution || [];
  const assetDistribution = rawCat.length > 0
    ? rawCat.map((item, index) => ({
        label: item.categoryName || 'General',
        value: Number(item.count),
        color: colors[(index + 2) % colors.length],
      }))
    : [
        { label: 'Laptops', value: 8, color: '#4F46E5' },
        { label: 'Furniture', value: 3, color: '#10B981' },
        { label: 'Servers', value: 2, color: '#F59E0B' },
      ];

  const totalAssetsCount = assetDistribution.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 20, marginBottom: 28 }}>
      
      {/* Chart 1: Department Assets */}
      <Card>
        <ChartHeader title="Department Assets" subtitle="Live assets grouped by owning department" />
        <div style={{ display: 'grid', gap: 13 }}>
          {departmentAssets.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.primary }}>{item.value}</span>
              </div>
              <div style={{ height: 9, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden' }}>
                <div style={{ width: `${(item.value / maxDeptValue) * 100}%`, height: '100%', borderRadius: 99, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart 2: Monthly Purchases */}
      <Card>
        <ChartHeader title="Monthly Spending" subtitle="Value of assets purchased this year ($)" />
        <div style={{ height: 190, display: 'flex', alignItems: 'end', gap: 10, paddingTop: 10 }}>
          {monthlyPurchases.map((item) => (
            <div key={item.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: '100%', height: 142, display: 'flex', alignItems: 'end' }}>
                <div
                  title={`${item.label}: $${item.value}`}
                  style={{
                    width: '100%',
                    height: `${(item.value / maxPurchaseValue) * 100}%`,
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

      {/* Chart 3: Cost Comparison */}
      <Card>
        <ChartHeader title="Operational Costs" subtitle="Maintenance records vs repair costs ($)" />
        <div style={{ height: 190, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
          {[
            { label: 'Scheduled Maintenance', cost: maintenanceCostVal, color: '#10B981', desc: 'Preventive service' },
            { label: 'Unscheduled Repairs', cost: repairsCostVal, color: '#EF4444', desc: 'Breakdown issues' },
          ].map((item) => {
            const totalCost = Math.max(1, maintenanceCostVal + repairsCostVal);
            const pct = Math.round((item.cost / totalCost) * 100);
            return (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>{item.label}</span>
                    <div style={{ fontSize: 11, color: theme.colors.text.muted }}>{item.desc}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: theme.colors.text.primary }}>${item.cost.toLocaleString()}</span>
                </div>
                <div style={{ height: 12, borderRadius: 99, background: '#F3F4F6', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: item.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Chart 4: Asset Distribution */}
      <Card>
        <ChartHeader title="Category Mix" subtitle="Organizational items by category" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative', width: 136, height: 136, flexShrink: 0 }}>
            <svg viewBox="0 0 120 120" style={{ width: 136, height: 136, transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="16" />
              {assetDistribution.map((item) => {
                const dash = totalAssetsCount > 0 ? (item.value / totalAssetsCount) * circumference : 0;
                const segment = dash > 0 ? (
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
                ) : null;
                offset += dash;
                return segment;
              })}
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: theme.colors.text.primary }}>{totalAssetsCount}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.muted }}>Assets</span>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10, flex: 1, maxHeight: 150, overflowY: 'auto' }}>
            {assetDistribution.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: item.color, flexShrink: 0 }} />
                  {item.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: theme.colors.text.primary }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

    </div>
  );
};
