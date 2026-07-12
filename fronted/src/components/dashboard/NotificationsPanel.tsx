// src/components/dashboard/NotificationsPanel.tsx
import React from 'react';
import { notifications } from '../../data/mockData';
import { Card } from '../ui/Card';
import { theme } from '../../styles/theme';

const notifStyles = {
  success: { bg: '#ECFDF5', border: '#10B981', label: '✓', labelBg: '#10B981' },
  warning: { bg: '#FFFBEB', border: '#F59E0B', label: '!', labelBg: '#F59E0B' },
  reminder: { bg: '#EEF2FF', border: '#4F46E5', label: '🔔', labelBg: '#4F46E5' },
  info: { bg: '#ECFEFF', border: '#06B6D4', label: 'i', labelBg: '#06B6D4' },
};

export const NotificationsPanel: React.FC<{ data?: any[] }> = ({ data }) => {
  const items = data || notifications;
  const unreadCount = items.filter((n: any) => !n.read).length;
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>Notifications</h3>
          {unreadCount > 0 && (
            <span style={{ background: '#EEF2FF', color: theme.colors.primary, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8 }}>
              {unreadCount} new
            </span>
          )}
        </div>
        <button style={{ background: 'none', border: 'none', color: theme.colors.text.muted, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: theme.font }}>
          Mark all read
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((notif, i) => {
        const s = notifStyles[notif.type as keyof typeof notifStyles];
        return (
          <div key={i} style={{
            display: 'flex', gap: 14, padding: '14px 16px',
            borderRadius: 12, background: s.bg,
            borderLeft: `3px solid ${s.border}`,
            cursor: 'pointer', transition: 'opacity 0.15s',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: s.labelBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>{s.label}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>{notif.title}</div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2 }}>{notif.desc}</div>
              <div style={{ fontSize: 11, color: theme.colors.text.light, marginTop: 4 }}>{notif.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
  );
};