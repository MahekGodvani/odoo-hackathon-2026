// src/pages/Reports.tsx
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

const reportTypes = [
  { title: 'Asset Utilization Report', desc: 'Overview of asset usage and allocation rates', icon: Icons.Package, color: '#4F46E5', bg: '#EEF2FF', lastGenerated: '2 hours ago' },
  { title: 'Maintenance Summary', desc: 'Summary of all maintenance activities and costs', icon: Icons.Maintenance, color: '#F59E0B', bg: '#FFFBEB', lastGenerated: '1 day ago' },
  { title: 'Booking Analytics', desc: 'Resource booking trends and peak usage periods', icon: Icons.Booking, color: '#06B6D4', bg: '#ECFEFF', lastGenerated: '3 hours ago' },
  { title: 'Audit Compliance Report', desc: 'Audit completion rates and compliance scores', icon: Icons.Audit, color: '#8B5CF6', bg: '#F5F3FF', lastGenerated: '1 week ago' },
  { title: 'Asset Depreciation', desc: 'Financial depreciation analysis for all assets', icon: Icons.TrendingUp, color: '#10B981', bg: '#ECFDF5', lastGenerated: '5 days ago' },
  { title: 'Transfer & Returns Log', desc: 'Complete history of asset transfers and returns', icon: Icons.RotateCcw, color: '#EC4899', bg: '#FDF2F8', lastGenerated: '4 hours ago' },
];

const Reports: React.FC = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Reports</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Generate and download enterprise reports</p>
      </div>
      <Button variant="primary" icon={<Icons.Plus />}>Custom Report</Button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
      {reportTypes.map((report, i) => (
        <Card key={i} hoverable>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: report.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: report.color }}>
              <report.icon />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{report.title}</div>
              <div style={{ fontSize: 12, color: theme.colors.text.light }}>Last: {report.lastGenerated}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: theme.colors.text.muted, margin: '0 0 16px', lineHeight: 1.5 }}>{report.desc}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" style={{ flex: 1 }} icon={<Icons.FileText />}>Generate</Button>
            <Button variant="secondary" size="sm" icon={<Icons.Download />}>Download</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default Reports;