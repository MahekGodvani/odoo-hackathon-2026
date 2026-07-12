// src/pages/Maintenance.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge, getPriorityVariant, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { allMaintenanceRequests } from '../data/mockData';
import { theme } from '../styles/theme';

const Maintenance: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPriority, setSelectedPriority] = useState('All');
  const priorities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filtered = allMaintenanceRequests.filter(m =>
    selectedPriority === 'All' || m.priority === selectedPriority
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Maintenance</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Track and manage asset maintenance requests</p>
        </div>
        <Button variant="primary" icon={<Icons.Plus />}>Raise Request</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Requests', value: '23', color: '#4F46E5', bg: '#EEF2FF', icon: Icons.FileText },
          { label: 'Critical', value: '2', color: '#EF4444', bg: '#FEF2F2', icon: Icons.AlertTriangle },
          { label: 'In Progress', value: '7', color: '#06B6D4', bg: '#ECFEFF', icon: Icons.Activity },
          { label: 'Completed This Month', value: '18', color: '#10B981', bg: '#ECFDF5', icon: Icons.CheckCircle },
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

      {/* Filters */}
      <Card padding="14px 20px" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: theme.colors.text.muted, marginRight: 4 }}>Priority:</span>
          {priorities.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', fontFamily: theme.font,
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                background: selectedPriority === p ? theme.colors.primary : '#F3F4F6',
                color: selectedPriority === p ? '#fff' : theme.colors.text.muted,
              }}
            >{p}</button>
          ))}
        </div>
      </Card>

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((req) => (
          <Card key={req.id} hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}>
                <Icons.Maintenance />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>{req.asset}</span>
                  <Badge variant={getPriorityVariant(req.priority)}>{req.priority}</Badge>
                  <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
                  <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.primary, background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>{req.id}</span>
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 13, color: theme.colors.text.muted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Tag />{req.type}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.User />{req.assignee}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Organization />{req.dept}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Calendar />{req.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="secondary" size="sm" onClick={() => navigate(`/maintenance/${req.id}`)}>View Details</Button>
                <button style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                  <Icons.MoreVertical />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
