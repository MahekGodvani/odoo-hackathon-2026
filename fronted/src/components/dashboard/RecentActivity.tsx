// src/components/dashboard/RecentActivity.tsx
import React from 'react';
import { recentActivity } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

export const RecentActivity: React.FC<{ data?: any[] }> = ({ data }) => {
  const items = data || recentActivity;
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>Recent Activity</h3>
        <button style={{ background: 'none', border: 'none', color: theme.colors.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: theme.font }}>
          View All
        </button>
      </div>
      <div style={{ position: 'relative' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < items.length - 1 ? 20 : 0, position: 'relative' }}>
            {i < items.length - 1 && (
              <div style={{ position: 'absolute', left: 19, top: 42, bottom: 0, width: 2, background: '#E5E7EB' }}/>
            )}
            <Avatar initials={item.avatar} color={item.color} size={38} />
            <div style={{ flex: 1, paddingTop: 2 }}>
              <div style={{ fontSize: 13, color: theme.colors.text.secondary, lineHeight: 1.6 }}>
                <span style={{ fontWeight: 600, color: theme.colors.text.primary }}>{item.user}</span>{' '}
                {item.action}
              </div>
              <div style={{ fontSize: 12, color: theme.colors.text.light, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icons.Clock /> {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};