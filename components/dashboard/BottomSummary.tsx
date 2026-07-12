// src/components/dashboard/BottomSummary.tsx
import React from 'react';
import { bottomSummary } from '../../data/mockData';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

const iconMap: Record<string, React.FC> = {
  Users: Icons.Users,
  Package: Icons.Package,
  Activity: Icons.Activity,
  Shield: Icons.Shield,
};

export const BottomSummary: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 28 }}>
    {bottomSummary.map((item) => {
      const IconComp = iconMap[item.iconKey] || Icons.Package;
      return (
        <div key={item.label} style={{
          background: '#fff',
          borderRadius: theme.radius.lg,
          padding: '20px 22px',
          boxShadow: theme.shadow.sm,
          border: `1px solid ${theme.colors.borderLight}`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: item.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: item.color, flexShrink: 0,
          }}>
            <IconComp />
          </div>
          <div>
            <div style={{ fontSize: 12, color: theme.colors.text.muted, fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {item.value}
            </div>
            <div style={{ fontSize: 11, color: item.color, fontWeight: 500, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }}/>
              {item.status}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);