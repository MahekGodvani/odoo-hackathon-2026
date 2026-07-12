// src/pages/ChangePassword.tsx
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const fieldStyle: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  padding: '10px 12px',
  fontSize: 14,
  color: theme.colors.text.primary,
  background: '#fff',
  outline: 'none',
  fontFamily: theme.font,
  boxSizing: 'border-box'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: theme.colors.text.secondary,
  marginBottom: 7,
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const checks = useMemo(() => [
    { label: 'At least 8 characters', done: newPassword.length >= 8 },
    { label: 'Contains uppercase letter', done: /[A-Z]/.test(newPassword) },
    { label: 'Contains number', done: /\d/.test(newPassword) },
    { label: 'Passwords match', done: Boolean(newPassword) && newPassword === confirmPassword },
  ], [newPassword, confirmPassword]);

  const canSave = currentPassword.length > 0 && checks.every((item) => item.done) && !saving;

  const handleUpdatePassword = async () => {
    if (!canSave) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setSuccessMsg('Your security password has been updated. Redirecting in a moment...');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update security credentials.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            style={{ border: 'none', background: 'transparent', color: theme.colors.primary, fontFamily: theme.font, fontSize: 13, fontWeight: 700, cursor: 'pointer', padding: 0, marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Icons.ArrowRight />
            Back to Profile
          </button>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Change Password</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Update your password and keep administrator access secure</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => navigate('/profile')}>Cancel</Button>
          <Button variant="primary" icon={<Icons.Lock />} disabled={!canSave} onClick={handleUpdatePassword}>
            {saving ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(320px, 0.8fr)', gap: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icons.Lock />
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Password Details</h2>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <label>
              <span style={labelStyle}>Current Password *</span>
              <input type="password" style={fieldStyle} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
            </label>
            <label>
              <span style={labelStyle}>New Password *</span>
              <input type="password" style={fieldStyle} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
            </label>
            <label>
              <span style={labelStyle}>Confirm New Password *</span>
              <input type="password" style={fieldStyle} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
            </label>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Password Rules</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {checks.map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: item.done ? theme.colors.success.main : theme.colors.text.light }}>
                    {item.done ? <Icons.CheckCircle /> : <Icons.Clock />}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: item.done ? theme.colors.text.primary : theme.colors.text.muted }}>{item.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Security Notes</h2>
            <div style={{ display: 'grid', gap: 10, fontSize: 13, color: theme.colors.text.secondary }}>
              <div>Use a password you do not use on other systems.</div>
              <div>After updating, all future admin sessions should use the new password.</div>
              <div>Keep profile email and phone updated for account recovery.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
