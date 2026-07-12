// src/components/dashboard/OverdueReturns.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { overdueReturns } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

export const OverdueReturns: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }}/>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>Overdue Returns</h3>
          <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 8 }}>
            {overdueReturns.length}
          </span>
        </div>
        <button
          onClick={() => navigate('/assets')}
          style={{ background: 'none', border: 'none', color: theme.colors.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: theme.font, display: 'flex', alignItems: 'center', gap: 4 }}
        >
          View All <Icons.ArrowRight />
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {overdueReturns.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: 12,
            background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}`,
            cursor: 'pointer', transition: 'background 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                <Icons.Package />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>{item.asset}</div>
                <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2 }}>
                  {item.assignee} · <span style={{ color: '#9CA3AF' }}>{item.dept}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ background: '#FEF2F2', color: '#DC2626', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 8, whiteSpace: 'nowrap' }}>
                {item.dueDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};