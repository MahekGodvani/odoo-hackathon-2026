import React from 'react';
import { kpiCards } from '../../data/mockData';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

type IconKey = keyof typeof Icons;

export const KPICards: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
    {kpiCards.map((item) => {
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
