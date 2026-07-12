// src/pages/EditProfile.tsx
import React, { useState, useEffect } from 'react';
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

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get<any>('/auth/profile');
        setProfile(res);
        setName(res.name || '');
        setEmail(res.email || '');
      } catch (e) {
        console.error('Failed to load profile details:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Full Name and Email Address are required.');
      return;
    }
    setSaving(true);
    setErrorMsg('');
    try {
      await api.put('/auth/profile', { name, email });
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  const canSave = name.trim() && email.trim() && !saving;

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
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Edit Profile</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Update your account information and profile details</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => navigate('/profile')}>Cancel</Button>
          <Button variant="primary" icon={<Icons.CheckCircle />} disabled={!canSave} onClick={handleSave}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontWeight: 500 }}>
          {errorMsg}
        </div>
      )}

      {loading ? (
        <Card>
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            Loading edit controls...
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.8fr)', gap: 20 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.User />
              </div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Profile Information</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label>
                <span style={labelStyle}>Full Name *</span>
                <input style={fieldStyle} value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                <span style={labelStyle}>Email Address *</span>
                <input type="email" style={fieldStyle} value={email} onChange={(event) => setEmail(event.target.value)} />
              </label>
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', background: theme.colors.primaryLight,
                color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, fontWeight: 800, margin: '0 auto 16px'
              }}>
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: theme.colors.text.primary }}>{name || 'User Profile'}</h3>
              <span style={{ fontSize: 12, color: theme.colors.text.muted }}>{profile?.Role?.name || 'Standard User'}</span>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
