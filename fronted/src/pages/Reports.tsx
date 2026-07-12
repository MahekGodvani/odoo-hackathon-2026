// src/pages/Reports.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

const reportTypes = [
  { type: 'excel', title: 'Asset Utilization Excel', desc: 'Detailed breakdown spreadsheet of asset usage, allocation rates, and purchases.', icon: Icons.Package, color: '#4F46E5', bg: '#EEF2FF', lastGenerated: '2 hours ago' },
  { type: 'pdf', title: 'PDF Compliance Report', desc: 'Official print-ready audit compliance report and inventory catalog.', icon: Icons.Audit, color: '#8B5CF6', bg: '#F5F3FF', lastGenerated: 'Just now' },
  { type: 'excel', title: 'Maintenance Cost Summary', desc: 'Summary spreadsheet of all maintenance activities, service repairs, and costs.', icon: Icons.Maintenance, color: '#F59E0B', bg: '#FFFBEB', lastGenerated: '1 day ago' },
];

const Reports: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: string) => {
    setDownloading(type);
    try {
      const endpoint = type === 'pdf' ? '/reports/export/pdf' : '/reports/export/excel';
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Server returned error generating file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = type === 'pdf' ? 'assetflow_report.pdf' : 'assetflow_report.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Reports</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Generate and download enterprise inventory and audit reports</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {reportTypes.map((report, i) => (
          <Card key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: report.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: report.color }}>
                <report.icon />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{report.title}</div>
                <div style={{ fontSize: 12, color: theme.colors.text.light }}>Format: {report.type.toUpperCase()}</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: theme.colors.text.muted, margin: '0 0 16px', lineHeight: 1.5, minHeight: 40 }}>{report.desc}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                variant="primary"
                size="sm"
                style={{ flex: 1 }}
                icon={<Icons.Download />}
                disabled={downloading !== null}
                onClick={() => handleDownload(report.type)}
              >
                {downloading === report.type ? 'Exporting...' : 'Export & Download'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;