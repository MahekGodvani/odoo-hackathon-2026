// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { quickActions } from '../../data/mockData';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

const iconMap: Record<string, React.FC> = {
  Plus: Icons.Plus,
  Send: Icons.Send,
  Booking: Icons.Booking,
  Maintenance: Icons.Maintenance,
  Audit: Icons.Audit,
  FileText: Icons.FileText,
};

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <div style={{
      background: '#fff',
      borderRadius: theme.radius.lg,
      padding: '24px',
      boxShadow: theme.shadow.sm,
      border: `1px solid ${theme.colors.borderLight}`,
      marginBottom: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>Quick Actions</h3>
        <span style={{ fontSize: 13, color: theme.colors.text.muted }}>Shortcuts to common tasks</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {quickActions.map((action) => {
          const IconComp = iconMap[action.iconKey] || Icons.Plus;
          const isHovered = hovered === action.label;
          return (
            <button
              key={action.label}
              onClick={() => navigate(action.route)}
              onMouseEnter={() => setHovered(action.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: '20px 12px', borderRadius: 14,
                border: isHovered ? `1px solid ${action.color}30` : `1px solid ${theme.colors.borderLight}`,
                background: isHovered ? action.bg : '#FAFBFC',
                cursor: 'pointer', fontFamily: theme.font,
                transition: 'all 0.2s ease',
                transform: isHovered ? 'translateY(-2px)' : 'none',
                boxShadow: isHovered ? theme.shadow.sm : 'none',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: action.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: action.color,
              }}>
                <IconComp />
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: theme.colors.text.secondary, textAlign: 'center', lineHeight: 1.3 }}>
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};