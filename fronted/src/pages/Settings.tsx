// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const settingsSections = [
  { id: 'general', label: 'General', icon: Icons.Settings },
  { id: 'security', label: 'Security', icon: Icons.Shield },
];

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [config, setConfig] = useState<any>({
    company_name: 'AssetFlow Corp',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.get<any>('/settings');
      if (res) {
        setConfig({
          company_name: res.company_name || 'AssetFlow Corp',
          currency: res.currency || 'USD'
        });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.put('/settings', config);
      setSuccessMsg('System configurations updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update preferences.');
    } finally {
      setSaving(false);
    }
  };

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
              
              {successMsg && (
                <div style={{ fontSize: 13, color: '#10B981', background: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontWeight: 500 }}>
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontWeight: 500 }}>
                  {errorMsg}
                </div>
              )}

              {loading ? (
                <div style={{ padding: 20, fontSize: 14, color: theme.colors.text.muted }}>Loading configurations...</div>
              ) : (
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: theme.colors.text.secondary, marginBottom: 6 }}>Organization / Company Name</label>
                    <input
                      type="text"
                      value={config.company_name}
                      onChange={e => setConfig({ ...config, company_name: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: `1px solid ${theme.colors.border}`, fontSize: 14,
                        color: theme.colors.text.primary, fontFamily: theme.font,
                        outline: 'none', boxSizing: 'border-box',
                        background: '#FAFBFC',
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: theme.colors.text.secondary, marginBottom: 6 }}>System Default Currency</label>
                    <input
                      type="text"
                      value={config.currency}
                      onChange={e => setConfig({ ...config, currency: e.target.value })}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: `1px solid ${theme.colors.border}`, fontSize: 14,
                        color: theme.colors.text.primary, fontFamily: theme.font,
                        outline: 'none', boxSizing: 'border-box',
                        background: '#FAFBFC',
                      }}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                    <Button variant="primary" type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )}

          {activeSection === 'security' && (
            <Card>
              <h3 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: theme.colors.text.primary }}>Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your Admin portal', enabled: true },
                  { label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity', enabled: true },
                  { label: 'IP Access restrictions', desc: 'Restrict database modification access to local IPs', enabled: false },
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
        </div>
      </div>
    </div>
  );
};

export default Settings;