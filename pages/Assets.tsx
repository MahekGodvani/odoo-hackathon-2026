// src/pages/Assets.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { allAssets } from '../data/mockData';
import { theme } from '../styles/theme';

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const statuses = ['All', 'Available', 'Allocated', 'Maintenance', 'Overdue'];
  const filtered = allAssets.filter(a =>
    (selectedStatus === 'All' || a.status === selectedStatus) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
            Assets
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>
            Manage and track all organizational assets
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" icon={<Icons.Download />}>Export</Button>
          <Button variant="primary" icon={<Icons.Plus />} onClick={() => navigate('/assets/register')}>Register Asset</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Assets', value: '2,131', color: '#4F46E5', bg: '#EEF2FF' },
          { label: 'Available', value: '1,284', color: '#10B981', bg: '#ECFDF5' },
          { label: 'Allocated', value: '847', color: '#06B6D4', bg: '#ECFEFF' },
          { label: 'In Maintenance', value: '23', color: '#F59E0B', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: theme.radius.lg, padding: '16px 20px', boxShadow: theme.shadow.sm, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              <Icons.Package />
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <Card padding="16px 20px" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.colors.background, borderRadius: 10, padding: '8px 14px', flex: 1, border: `1px solid ${theme.colors.border}` }}>
            <Icons.Search />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets by name or ID..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: theme.colors.text.primary, width: '100%', fontFamily: theme.font }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', fontFamily: theme.font,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                  background: selectedStatus === s ? theme.colors.primary : '#F3F4F6',
                  color: selectedStatus === s ? '#fff' : theme.colors.text.muted,
                }}
              >{s}</button>
            ))}
          </div>
          <Button variant="secondary" icon={<Icons.Filter />}>Filter</Button>
        </div>
      </Card>

      {/* Assets Table */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>
            {filtered.length} assets found
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAFBFC' }}>
                {['Asset ID', 'Name', 'Category', 'Department', 'Assignee', 'Status', 'Location', 'Value', 'Actions'].map(col => (
                  <th key={col} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600,
                    color: theme.colors.text.muted, letterSpacing: '0.04em', textTransform: 'uppercase',
                    borderBottom: `1px solid ${theme.colors.borderLight}`,
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr key={asset.id} style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.primary, background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>{asset.id}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{asset.name}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.muted }}>{asset.category}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.muted }}>{asset.dept}</td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.secondary }}>{asset.assignee}</td>
                  <td style={{ padding: '14px 20px' }}><Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge></td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icons.MapPin />{asset.location}
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>{asset.value}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                        <Icons.Eye />
                      </button>
                      <button style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                        <Icons.Edit />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Assets;
