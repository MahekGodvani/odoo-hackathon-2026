import React from 'react';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

type IconKey = keyof typeof Icons;

interface KPICardsProps {
  data?: {
    summary?: {
      totalAssets: number;
      assignedAssets: number;
      underMaintenance: number;
      warrantyExpiring: number;
      activeRepairs: number;
      totalDepartments: number;
      totalEmployees: number;
    }
  }
}

export const KPICards: React.FC<KPICardsProps> = ({ data }) => {
  const summary = data?.summary;
  
  const total = summary?.totalAssets || 0;
  const assigned = summary?.assignedAssets || 0;
  const available = Math.max(0, total - assigned - (summary?.underMaintenance || 0));
  const activeRepairs = summary?.activeRepairs || 0;

  const cards = [
    {
      label: 'Available Assets',
      value: available.toLocaleString(),
      subtitle: `${total > 0 ? Math.round((available / total) * 100) : 0}% stock available`,
      color: '#10B981',
      bg: '#ECFDF5',
      iconKey: 'Package',
    },
    {
      label: 'Allocated Assets',
      value: assigned.toLocaleString(),
      subtitle: `${total > 0 ? Math.round((assigned / total) * 100) : 0}% utilization rate`,
      color: '#4F46E5',
      bg: '#EEF2FF',
      iconKey: 'Users',
    },
    {
      label: 'Active Repair Requests',
      value: activeRepairs.toLocaleString(),
      subtitle: 'Awaiting technician resolution',
      color: '#F59E0B',
      bg: '#FFFBEB',
      iconKey: 'AlertTriangle',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
      {cards.map((item) => {
        const Icon = Icons[item.iconKey as IconKey] ?? Icons.Package;

        return (
          <div
            key={item.label}
            style={{
              background: theme.colors.white,
              border: `1px solid ${theme.colors.borderLight}`,
              borderRadius: theme.radius.lg,
              boxShadow: theme.shadow.sm,
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: item.bg,
                color: item.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Icon />
            </div>
            <div>
              <div style={{ fontSize: 13, color: theme.colors.text.muted, marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 26, lineHeight: 1.15, fontWeight: 800, color: theme.colors.text.primary }}>
                {item.value}
              </div>
              <div style={{ fontSize: 12, color: item.color, fontWeight: 600, marginTop: 4 }}>{item.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

