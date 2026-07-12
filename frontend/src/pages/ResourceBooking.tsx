// src/pages/ResourceBooking.tsx
import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { allBookings } from '../data/mockData';
import { theme } from '../styles/theme';

const ResourceBooking: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Resource Booking</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Book and manage shared resources</p>
        </div>
        <Button variant="primary" icon={<Icons.Plus />}>New Booking</Button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: "Today's Bookings", value: '56', color: '#06B6D4', bg: '#ECFEFF', icon: Icons.Booking },
          { label: 'Confirmed', value: '38', color: '#10B981', bg: '#ECFDF5', icon: Icons.CheckCircle },
          { label: 'Pending Approval', value: '8', color: '#F59E0B', bg: '#FFFBEB', icon: Icons.Clock },
          { label: 'Available Resources', value: '24', color: '#8B5CF6', bg: '#F5F3FF', icon: Icons.Package },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: theme.radius.lg, padding: '16px 20px', boxShadow: theme.shadow.sm, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              <s.icon />
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>All Bookings</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" icon={<Icons.Filter />} size="sm">Filter</Button>
          </div>
        </div>
        <div>
          {allBookings.map((booking, i) => (
            <div key={booking.id} style={{
              display: 'flex', alignItems: 'center', padding: '16px 20px',
              borderBottom: i < allBookings.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
              transition: 'background 0.1s', cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFEFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891B2', marginRight: 16, flexShrink: 0 }}>
                {booking.type === 'Vehicle' ? <Icons.Truck /> : booking.type === 'Equipment' ? <Icons.Package /> : <Icons.Organization />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{booking.resource}</span>
                  <Badge variant="default">{booking.type}</Badge>
                </div>
                <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.User /> {booking.bookedBy}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Clock /> {booking.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Calendar /> {booking.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>{booking.id}</span>
                <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                    <Icons.Eye />
                  </button>
                  <button style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                    <Icons.Edit />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ResourceBooking;
