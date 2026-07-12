// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { loginUser, clearError } from '../store/authSlice';
import { theme } from '../styles/theme';
import { Button } from '../components/ui/Button';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@assetflow.com', name: 'System Admin' },
  { role: 'Manager', email: 'manager@assetflow.com', name: 'Jane Manager' },
  { role: 'Technician', email: 'tech@assetflow.com', name: 'Tom Technician' },
  { role: 'Employee', email: 'john@assetflow.com', name: 'John Employee' },
];

export const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password123'); // Default seeded password

  // Clear errors when the login component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch(() => {
        // Error is automatically set in the Redux state by extraReducers
      });
  };

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123');
    dispatch(clearError());
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 20%, rgb(87, 108, 117) 0%, rgb(37, 50, 55) 100.2%)',
      fontFamily: theme.font,
      padding: 20,
    }}>
      {/* Background blobs for glassmorphism */}
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        filter: 'blur(80px)',
        opacity: 0.45,
        top: '20%',
        left: '25%',
        zIndex: 0,
      }} />
      <div style={{
        position: 'absolute',
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
        filter: 'blur(80px)',
        opacity: 0.35,
        bottom: '15%',
        right: '20%',
        zIndex: 0,
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        borderRadius: 24,
        padding: 40,
        zIndex: 1,
        boxSizing: 'border-box',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.3)',
          }}>
            {/* Minimalist logo shape */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ width: 16, height: 3, background: '#fff', borderRadius: 2 }} />
              <div style={{ width: 12, height: 3, background: '#fff', borderRadius: 2 }} />
              <div style={{ width: 18, height: 3, background: '#fff', borderRadius: 2 }} />
            </div>
          </div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: theme.colors.text.primary, letterSpacing: '-0.03em' }}>
            AssetFlow Portal
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: theme.colors.text.muted }}>
            Sign in to manage and track enterprise resources
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 14,
            marginBottom: 20,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.text.secondary, marginBottom: 6 }}>
              Corporate Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@assetflow.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid #D1D5DB',
                background: '#fff',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                fontFamily: theme.font,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(79, 70, 229, 0.15)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: theme.colors.text.secondary, marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid #D1D5DB',
                background: '#fff',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                fontFamily: theme.font,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary;
                e.target.style.boxShadow = `0 0 0 3px rgba(79, 70, 229, 0.15)`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{
              padding: '13px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 6,
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        {/* Demo Accounts Quick-Select */}
        <div style={{ marginTop: 28, borderTop: '1px solid #E5E7EB', paddingTop: 24 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center', marginBottom: 16 }}>
            Quick Select Seeded Roles
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() => handleDemoSelect(account.email)}
                style={{
                  background: email === account.email ? 'rgba(79, 70, 229, 0.08)' : 'rgba(0, 0, 0, 0.02)',
                  border: email === account.email ? `1px solid ${theme.colors.primary}` : '1px solid #E5E7EB',
                  borderRadius: 10,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  fontFamily: theme.font,
                }}
                onMouseEnter={(e) => {
                  if (email !== account.email) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#D1D5DB';
                  }
                }}
                onMouseLeave={(e) => {
                  if (email !== account.email) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>
                  {account.role}
                </div>
                <div style={{ fontSize: 11, color: theme.colors.text.muted, marginTop: 2 }}>
                  {account.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
