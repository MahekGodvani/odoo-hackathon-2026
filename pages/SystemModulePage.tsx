import React from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

type IconKey = keyof typeof Icons;

interface ModuleAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconKey;
  onClick?: () => void;
}

interface ModuleStat {
  label: string;
  value: string;
  color: string;
  bg: string;
  icon: IconKey;
}

interface ModuleRecord {
  id: string;
  title: string;
  subtitle: string;
  meta: string[];
  status?: string;
}

interface SystemModulePageProps {
  title: string;
  description: string;
  icon: IconKey;
  actions: ModuleAction[];
  stats: ModuleStat[];
  workflow?: string[];
  features: string[];
  records: ModuleRecord[];
}

const statusVariant = (status: string) => {
  const value = status.toLowerCase();

  if (['active', 'completed', 'approved', 'available', 'healthy'].includes(value)) {
    return 'success';
  }

  if (['pending', 'scheduled', 'due soon', 'review'].includes(value)) {
    return 'warning';
  }

  if (['expired', 'lost', 'critical', 'failed'].includes(value)) {
    return 'error';
  }

  if (['assigned', 'in progress', 'transferred', 'open'].includes(value)) {
    return 'info';
  }

  return 'default';
};

export const SystemModulePage: React.FC<SystemModulePageProps> = ({
  title,
  description,
  icon,
  actions,
  stats,
  workflow,
  features,
  records,
}) => {
  const HeaderIcon = Icons[icon];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderIcon />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>{description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {actions.map((action) => {
            const ActionIcon = action.icon ? Icons[action.icon] : undefined;

            return (
              <Button key={action.label} variant={action.variant ?? 'secondary'} icon={ActionIcon ? <ActionIcon /> : undefined} onClick={action.onClick}>
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {stats.map((stat) => {
          const StatIcon = Icons[stat.icon];

          return (
            <Card key={stat.label} padding="16px 20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StatIcon />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{stat.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{stat.value}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: workflow ? 'minmax(0, 1.6fr) minmax(320px, 1fr)' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="0">
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>Records</span>
              <span style={{ fontSize: 12, color: theme.colors.text.muted }}>{records.length} items</span>
            </div>
            <div>
              {records.map((record, index) => (
                <div
                  key={record.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '16px 20px',
                    borderBottom: index < records.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FAFBFC', color: theme.colors.primary, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HeaderIcon />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>{record.title}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.primary, background: theme.colors.primaryLight, padding: '2px 8px', borderRadius: 99 }}>{record.id}</span>
                      {record.status && <Badge variant={statusVariant(record.status)}>{record.status}</Badge>}
                    </div>
                    <div style={{ fontSize: 13, color: theme.colors.text.muted, marginBottom: 6 }}>{record.subtitle}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: theme.colors.text.light }}>
                      {record.meta.map((item) => <span key={item}>{item}</span>)}
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" icon={<Icons.Eye />}>View</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {workflow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Workflow</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {workflow.map((step, index) => (
                  <div key={step} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 99, background: index === 0 ? theme.colors.primary : '#F3F4F6', color: index === 0 ? '#fff' : theme.colors.text.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        {index + 1}
                      </div>
                      {index < workflow.length - 1 && <div style={{ width: 1, height: 22, background: theme.colors.border, marginTop: 6 }} />}
                    </div>
                    <div style={{ paddingTop: 4, fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>{step}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Features</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {features.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: theme.colors.success.main }}><Icons.CheckCircle /></span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.secondary }}>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
