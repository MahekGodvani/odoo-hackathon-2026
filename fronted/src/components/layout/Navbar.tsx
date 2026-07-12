// src/components/layout/Navbar.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';
import { Button } from '../ui/Button';
import type { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../store/authSlice';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const hasRole = (allowedRoles: string[]) => {
    return user ? allowedRoles.includes(user.role) : false;
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header style={{
      height: 64,
      minHeight: 64,
      background: '#fff',
      borderBottom: `1px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Search */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: '#F6F8FC', borderRadius: 10,
        padding: '8px 16px', width: 360,
        border: `1px solid ${theme.colors.border}`,
      }}>
        <span style={{ color: theme.colors.text.light }}><Icons.Search /></span>
        <input
          type="text"
          placeholder="Search assets, resources, bookings..."
          style={{
            border: 'none', background: 'transparent', outline: 'none',
            fontSize: 14, color: theme.colors.text.primary, width: '100%', fontFamily: theme.font,
          }}
        />
        <span style={{
          background: theme.colors.border, color: theme.colors.text.light,
          fontSize: 11, padding: '2px 6px', borderRadius: 4, fontWeight: 500,
        }}>⌘K</span>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {hasRole(['Admin', 'Manager']) && (
          <Button
            variant="primary"
            icon={<Icons.Plus />}
            onClick={() => navigate('/assets/register')}
          >
            Register Asset
          </Button>
        )}

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: 40, height: 40, borderRadius: 10,
              border: `1px solid ${theme.colors.border}`,
              background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.colors.text.muted,
            }}
          >
            <Icons.Bell />
          </button>
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 8, height: 8, borderRadius: '50%',
            background: '#EF4444', border: '2px solid #fff',
          }}/>
          {notifOpen && (
            <div style={{
              position: 'absolute', top: 48, right: 0,
              background: '#fff', borderRadius: 16, width: 340,
              boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              border: `1px solid ${theme.colors.border}`,
              zIndex: 999, padding: 16,
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: theme.colors.text.primary, marginBottom: 12 }}>
                Notifications
              </div>
              {['Asset #2847 registered successfully', 'Maintenance overdue: HP LaserJet', 'Audit starts tomorrow at 9 AM', 'Booking confirmed: Room A'].map((n, i) => (
                <div key={i} style={{
                  padding: '10px 12px', borderRadius: 10,
                  background: i === 0 ? '#ECFDF5' : '#F9FAFB',
                  marginBottom: 8, fontSize: 13, color: theme.colors.text.secondary,
                  cursor: 'pointer',
                }}>
                  {n}
                </div>
              ))}
              <button
                onClick={() => { navigate('/notifications'); setNotifOpen(false); }}
                style={{
                  width: '100%', marginTop: 4, padding: '8px',
                  background: '#F3F4F6', borderRadius: 10, border: 'none',
                  fontSize: 13, fontWeight: 600, color: theme.colors.primary,
                  cursor: 'pointer', fontFamily: theme.font,
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile Info card */}
        <div 
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 12px 6px 6px', borderRadius: 10,
            border: `1px solid ${theme.colors.border}`, cursor: 'pointer',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>
            {user ? getInitials(user.name) : 'JD'}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: theme.colors.text.secondary }}>
            {user ? user.name : 'Guest User'}
          </span>
          <Icons.ChevronDown />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title="Sign Out"
          style={{
            width: 40, height: 40, borderRadius: 10,
            border: `1px solid ${theme.colors.error.main}`,
            background: 'rgba(239, 68, 68, 0.04)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: theme.colors.error.main,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
};