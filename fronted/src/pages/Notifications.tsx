// src/pages/Notifications.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const notifStyles = {
  success: { bg: '#ECFDF5', border: '#10B981', label: '✓', labelBg: '#10B981', icon: Icons.CheckCircle },
  warning: { bg: '#FFFBEB', border: '#F59E0B', label: '!', labelBg: '#F59E0B', icon: Icons.AlertTriangle },
  reminder: { bg: '#EEF2FF', border: '#4F46E5', label: '🔔', labelBg: '#4F46E5', icon: Icons.Bell },
  info: { bg: '#ECFEFF', border: '#06B6D4', label: 'i', labelBg: '#06B6D4', icon: Icons.Info },
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get<any[]>('/notifications');
      setNotifications(res || []);
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    try {
      await api.get('/notifications/read-all');
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const markRead = async (id: number) => {
    try {
      await api.get(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

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
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            Loading notification logs...
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            No new alerts in your notification queue.
          </div>
        ) : (
          notifications.map((notif, i) => {
            const styleKey = (notif.type || 'info') as keyof typeof notifStyles;
            const s = notifStyles[styleKey] || notifStyles.info;
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
                  onClick={e => { e.stopPropagation(); deleteNotification(notif.id); }}
                  style={{ width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.light }}
                >
                  <Icons.X />
                </button>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
};

export default Notifications;