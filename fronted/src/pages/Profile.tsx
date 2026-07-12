// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get<any>('/auth/profile');
        setProfile(res || null);
      } catch (e) {
        console.error('Failed to load profile:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Profile</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Manage profile details, password, and system preferences</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" icon={<Icons.Lock />} onClick={() => navigate('/profile/change-password')}>
            Change Password
          </Button>
          <Button variant="primary" icon={<Icons.Edit />} onClick={() => navigate('/profile/edit')}>
            Edit Profile
          </Button>
        </div>
      </div>

      {loading ? (
        <Card>
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            Retrieving profile information...
          </div>
        </Card>
      ) : profile === null ? (
        <Card>
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            Unable to load profile. Please verify your authentication.
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: 24 }}>
          {/* User Card */}
          <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', background: theme.colors.primaryLight,
              color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, marginBottom: 16
            }}>
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: theme.colors.text.primary }}>{profile.name}</h2>
            <div style={{ fontSize: 13, color: theme.colors.text.muted, marginBottom: 14 }}>{profile.email}</div>
            <Badge variant="info">{profile.Role?.name || 'System User'}</Badge>

            <div style={{ width: '100%', borderTop: `1px solid ${theme.colors.borderLight}`, marginTop: 24, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: theme.colors.text.muted }}>Account Status</span>
                <strong style={{ color: theme.colors.success.main }}>{profile.status || 'Active'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: theme.colors.text.muted }}>Database ID</span>
                <strong style={{ color: theme.colors.text.primary }}>USR-{profile.id}</strong>
              </div>
            </div>
          </Card>

          {/* Details Card */}
          <Card>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Account Information</h3>
            <div style={{ display: 'grid', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary, marginBottom: 4 }}>Full Name</label>
                <div style={{ fontSize: 14, color: theme.colors.text.primary, padding: '8px 0', borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                  {profile.name}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary, marginBottom: 4 }}>Email Address</label>
                <div style={{ fontSize: 14, color: theme.colors.text.primary, padding: '8px 0', borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                  {profile.email}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary, marginBottom: 4 }}>Designation / System Role</label>
                <div style={{ fontSize: 14, color: theme.colors.text.primary, padding: '8px 0', borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                  {profile.Role?.name || 'System User'}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary, marginBottom: 4 }}>Role Description</label>
                <div style={{ fontSize: 14, color: theme.colors.text.muted, padding: '8px 0', borderBottom: `1px solid ${theme.colors.borderLight}`, lineHeight: 1.4 }}>
                  {profile.Role?.description || 'No system details provided.'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
