// src/components/dashboard/TodaysBookings.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { todaysBookings } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge, getStatusVariant } from '../ui/Badge';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

export const TodaysBookings: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#06B6D4' }}/>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>Today's Bookings</h3>
        </div>
        <button
          onClick={() => navigate('/resource-booking')}
          style={{ background: 'none', border: 'none', color: theme.colors.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: theme.font, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          View All <Icons.ArrowRight />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {todaysBookings.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12,
            background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891B2' }}>
                <Icons.Booking />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>{item.resource}</div>
                <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.Clock /> {item.time}
                </div>
              </div>
            </div>
            <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};