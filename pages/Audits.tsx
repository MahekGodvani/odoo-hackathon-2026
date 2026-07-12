// src/pages/Audits.tsx
import React from 'react';
import { Card } from '../components/ui/Card';
import { Badge, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { allAudits } from '../data/mockData';
import { theme } from '../styles/theme';

const Audits: React.FC = () => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Audits</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Schedule and track asset audits</p>
      </div>
      <Button variant="primary" icon={<Icons.Plus />}>Start Audit</Button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      {allAudits.map((audit) => {
        const pct = audit.assets > 0 ? Math.round((audit.completed / audit.assets) * 100) : 0;
        return (
          <Card key={audit.id} hoverable>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                  <Icons.Audit />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>{audit.title}</div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2 }}>{audit.dept} · {audit.type}</div>
                </div>
              </div>
              <Badge variant={getStatusVariant(audit.status)}>{audit.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: theme.colors.text.muted }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.User />{audit.auditor}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Calendar />{audit.startDate} → {audit.endDate}</span>
            </div>

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: theme.colors.text.muted }}>Progress</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text.primary }}>{audit.completed}/{audit.assets} assets</span>
              </div>
              <div style={{ height: 6, background: '#F3F4F6', borderRadius: 99 }}>
                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: audit.status === 'Overdue' ? '#EF4444' : audit.status === 'Completed' ? '#10B981' : '#4F46E5', transition: 'width 0.5s ease' }}/>
              </div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 6 }}>{pct}% complete</div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button variant="secondary" size="sm" icon={<Icons.Eye />}>View Report</Button>
              {audit.status !== 'Completed' && <Button variant="primary" size="sm">Continue</Button>}
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

export default Audits;  