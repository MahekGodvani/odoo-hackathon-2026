import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

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
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@assetflow.test');
  const [phone, setPhone] = useState('+1 555 0199');
  const [department, setDepartment] = useState('Administration');
  const [designation, setDesignation] = useState('Asset Manager');
  const [location, setLocation] = useState('HQ Floor 3');
  const [bio, setBio] = useState('Responsible for asset lifecycle, assignment approvals, audits, and maintenance coordination.');

  const canSave = name.trim() && email.trim() && phone.trim() && department.trim() && designation.trim();

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
          <Button variant="primary" icon={<Icons.CheckCircle />} disabled={!canSave} onClick={() => navigate('/profile')}>Save Changes</Button>
        </div>
      </div>

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
              <span style={labelStyle}>Full Name</span>
              <input style={fieldStyle} value={name} onChange={(event) => setName(event.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Email</span>
              <input type="email" style={fieldStyle} value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Phone</span>
              <input style={fieldStyle} value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Department</span>
              <select style={fieldStyle} value={department} onChange={(event) => setDepartment(event.target.value)}>
                {['Administration', 'Computer', 'Civil', 'Mechanical', 'Accounts', 'HR', 'Library', 'Hostel'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <span style={labelStyle}>Designation</span>
              <input style={fieldStyle} value={designation} onChange={(event) => setDesignation(event.target.value)} />
            </label>
            <label>
              <span style={labelStyle}>Location</span>
              <input style={fieldStyle} value={location} onChange={(event) => setLocation(event.target.value)} />
            </label>
          </div>

          <label style={{ display: 'block', marginTop: 16 }}>
            <span style={labelStyle}>Profile Bio</span>
            <textarea style={{ ...fieldStyle, minHeight: 110, resize: 'vertical' }} value={bio} onChange={(event) => setBio(event.target.value)} />
          </label>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Profile Photo</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 72, height: 72, borderRadius: 18, background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>
                JD
              </div>
              <div>
                <Button variant="secondary" size="sm" icon={<Icons.Edit />}>Upload Photo</Button>
                <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 8 }}>PNG or JPG up to 2 MB</div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Account Summary</h2>
            {[
              ['Role', 'Admin'],
              ['Access', 'Full asset management'],
              ['Last Login', 'Today, 10:42 AM'],
              ['Assigned Assets', '4'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${theme.colors.borderLight}`, gap: 12 }}>
                <span style={{ fontSize: 13, color: theme.colors.text.muted }}>{label}</span>
                <strong style={{ fontSize: 13, color: theme.colors.text.primary, textAlign: 'right' }}>{value}</strong>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
