// src/pages/Organization.tsx
import React from 'react';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

const departments = [
  { name: 'Engineering', head: 'Sarah Chen', employees: 45, assets: 234, color: '#4F46E5', bg: '#EEF2FF' },
  { name: 'Design', head: 'Mike Johnson', employees: 18, assets: 89, color: '#8B5CF6', bg: '#F5F3FF' },
  { name: 'Marketing', head: 'Emily Davis', employees: 22, assets: 112, color: '#EC4899', bg: '#FDF2F8' },
  { name: 'Sales', head: 'Alex Wong', employees: 38, assets: 167, color: '#10B981', bg: '#ECFDF5' },
  { name: 'Operations', head: 'Tom Richards', employees: 31, assets: 203, color: '#F59E0B', bg: '#FFFBEB' },
  { name: 'IT', head: 'Lisa Park', employees: 14, assets: 342, color: '#06B6D4', bg: '#ECFEFF' },
];

const Organization: React.FC = () => (
  <div>
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Organization</h1>
      <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>View and manage departments and team structure</p>
    </div>

    {/* Company Overview */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
      {[
        { label: 'Total Employees', value: '168', icon: Icons.Users, color: '#4F46E5', bg: '#EEF2FF' },
        { label: 'Departments', value: '6', icon: Icons.Organization, color: '#10B981', bg: '#ECFDF5' },
        { label: 'Total Assets', value: '1,147', icon: Icons.Package, color: '#F59E0B', bg: '#FFFBEB' },
        { label: 'Locations', value: '3', icon: Icons.MapPin, color: '#8B5CF6', bg: '#F5F3FF' },
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

    {/* Departments Grid */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      {departments.map(dept => (
        <Card key={dept.name} hoverable>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: dept.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dept.color, fontSize: 22, fontWeight: 700 }}>
              {dept.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>{dept.name}</div>
              <div style={{ fontSize: 13, color: theme.colors.text.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icons.User /> {dept.head}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#FAFBFC', borderRadius: 12, border: `1px solid ${theme.colors.borderLight}` }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: dept.color }}>{dept.employees}</div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>Employees</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#FAFBFC', borderRadius: 12, border: `1px solid ${theme.colors.borderLight}` }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: dept.color }}>{dept.assets}</div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>Assets</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Organization;