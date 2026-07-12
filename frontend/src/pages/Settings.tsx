// src/pages/Settings.tsx
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

const settingsSections = [
  { id: 'general', label: 'General', icon: Icons.Settings },
  { id: 'security', label: 'Security', icon: Icons.Shield },
  { id: 'notifications', label: 'Notifications', icon: Icons.Bell },
  { id: 'integrations', label: 'Integrations', icon: Icons.Globe },
  { id: 'database', label: 'Data & Storage', icon: Icons.Database },
];

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Settings</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Manage your account and system preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <Card padding="12px">
          {settingsSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                marginBottom: 4, fontFamily: theme.font, fontSize: 14, fontWeight: 500,
                background: activeSection === s.id ? '#EEF2FF' : 'transparent',
                color: activeSection === s.id ? theme.colors.primary : theme.colors.text.muted,
                transition: 'all 0.15s',
              }}
            >
              <s.icon /> {s.label}
            </button>
          ))}
        </Card>

        {/* Content */}
        <div>
          {activeSection === 'general' && (
            <Card>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: theme.colors.text.primary }}>General Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { label: 'Organization Name', value: 'Acme Corporation', type: 'text' },
                  { label: 'Admin Email', value: 'admin@acmecorp.com', type: 'email' },
                  { label: 'System Timezone', value: 'UTC+05:30 (IST)', type: 'text' },
                  { label: 'Date Format', value: 'DD/MM/YYYY', type: 'text' },
                ].map(field => (
                  <div key={field.label}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: theme.colors.text.secondary, marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.type}
                      defaultValue={field.value}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: `1px solid ${theme.colors.border}`, fontSize: 14,
                        color: theme.colors.text.primary, fontFamily: theme.font,
                        outline: 'none', boxSizing: 'border-box',
                        background: '#FAFBFC',
                      }}
                    />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                  <Button variant="primary">Save Changes</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: theme.colors.text.primary }}>Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', enabled: true },
                  { label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity', enabled: true },
                  { label: 'IP Whitelist', desc: 'Restrict access to specific IP addresses', enabled: false },
                  { label: 'Audit Log Retention', desc: 'Keep logs for 1 year', enabled: true },
                ].map(setting => (
                  <div key={setting.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#FAFBFC', borderRadius: 12, border: `1px solid ${theme.colors.borderLight}` }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>{setting.label}</div>
                      <div style={{ fontSize: 13, color: theme.colors.text.muted, marginTop: 2 }}>{setting.desc}</div>
                    </div>
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: setting.enabled ? theme.colors.primary : '#D1D5DB',
                      position: 'relative', cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 3, left: setting.enabled ? 23 : 3,
                        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeSection !== 'general' && activeSection !== 'security' && (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: theme.colors.text.primary, marginBottom: 8 }}>
                  {settingsSections.find(s => s.id === activeSection)?.label} Settings
                </div>
                <div style={{ fontSize: 14, color: theme.colors.text.muted }}>This section is coming soon.</div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;