// src/components/dashboard/MaintenanceList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { maintenanceRequests } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge, getPriorityVariant } from '../ui/Badge';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

export const MaintenanceList: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B' }}/>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>Maintenance Requests</h3>
        </div>
        <button
          onClick={() => navigate('/maintenance')}
          style={{ background: 'none', border: 'none', color: theme.colors.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: theme.font, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          View All <Icons.ArrowRight />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {maintenanceRequests.map((item, i) => {
          const statusColor = { Completed: '#059669', 'In Progress': '#4F46E5', Pending: '#D97706', Scheduled: '#0891B2' }[item.status] || '#6B7280';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 14px', borderRadius: 12,
              background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>{item.asset}</span>
                  <Badge variant={getPriorityVariant(item.priority)}>{item.priority}</Badge>
                </div>
                <div style={{ fontSize: 12, color: theme.colors.text.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.User /> {item.assignee}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor }}/>
                <span style={{ fontSize: 12, color: statusColor, fontWeight: 600 }}>{item.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
