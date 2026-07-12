// src/pages/Notifications.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

const allNotifications = [
  { id: 1, type: 'success', title: 'Asset Registration Complete', desc: 'MacBook Pro #2847 successfully registered by Sarah Chen', time: '2 min ago', read: false },
  { id: 2, type: 'warning', title: 'Maintenance Overdue', desc: 'HP LaserJet Pro maintenance is past scheduled date', time: '30 min ago', read: false },
  { id: 3, type: 'reminder', title: 'Upcoming Audit', desc: 'IT Department audit starts tomorrow at 9:00 AM', time: '1 hour ago', read: false },
  { id: 4, type: 'info', title: 'Booking Confirmed', desc: 'Conference Room A booked for Dec 20, 2024', time: '3 hours ago', read: false },
  { id: 5, type: 'warning', title: 'Asset Return Overdue', desc: 'Dell Monitor #1923 assigned to Mike Johnson is overdue', time: '5 hours ago', read: true },
  { id: 6, type: 'success', title: 'Maintenance Completed', desc: 'Epson Projector maintenance completed by Anna Lee', time: '1 day ago', read: true },
  { id: 7, type: 'info', title: 'Transfer Request Approved', desc: 'iPad Pro transfer to Marketing department approved', time: '2 days ago', read: true },
];

const notifStyles = {
  success: { bg: '#ECFDF5', border: '#10B981', label: '✓', labelBg: '#10B981', icon: Icons.CheckCircle },
  warning: { bg: '#FFFBEB', border: '#F59E0B', label: '!', labelBg: '#F59E0B', icon: Icons.AlertTriangle },
  reminder: { bg: '#EEF2FF', border: '#4F46E5', label: '🔔', labelBg: '#4F46E5', icon: Icons.Bell },
  info: { bg: '#ECFEFF', border: '#06B6D4', label: 'i', labelBg: '#06B6D4', icon: Icons.Info },
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(allNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ background: '#EF4444', color: '#fff', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                {unreadCount} unread
              </span>
            )}
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Stay updated with your system alerts</p>
        </div>
        <Button variant="secondary" onClick={markAllRead}>Mark all as read</Button>
      </div>

      <Card padding="0">
        {notifications.map((notif, i) => {
          const s = notifStyles[notif.type as keyof typeof notifStyles];
          return (
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 16, padding: '18px 24px',
                borderBottom: i < notifications.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
                background: notif.read ? '#fff' : s.bg,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.labelBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                {s.label}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{notif.title}</span>
                  {!notif.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.primary, flexShrink: 0 }}/>}
                </div>
                <div style={{ fontSize: 13, color: theme.colors.text.muted }}>{notif.desc}</div>
                <div style={{ fontSize: 12, color: theme.colors.text.light, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.Clock /> {notif.time}
                </div>
              </div>
              <button
                onClick={e => { e.stopPropagation(); setNotifications(prev => prev.filter(n => n.id !== notif.id)); }}
                style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.light }}
              >
                <Icons.X />
              </button>
            </div>
          );
        })}
      </Card>
    </div>
  );
};

export default Notifications;