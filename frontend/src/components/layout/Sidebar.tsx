// src/components/layout/Sidebar.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icons } from '../../icons';
import { theme } from '../../styles/theme';

const navItems = [
  { icon: Icons.Dashboard, label: 'Dashboard', path: '/' },
  { icon: Icons.Assets, label: 'Assets', path: '/assets' },
  { icon: Icons.Tag, label: 'Categories', path: '/categories' },
  { icon: Icons.Organization, label: 'Departments', path: '/departments' },
  { icon: Icons.Users, label: 'Employees', path: '/employees' },
  { icon: Icons.Send, label: 'Assignments', path: '/assignments' },
  { icon: Icons.Database, label: 'QR Tracking', path: '/qr-tracking' },
  { icon: Icons.Truck, label: 'Transfers', path: '/transfers' },
  { icon: Icons.Maintenance, label: 'Maintenance', path: '/maintenance' },
  { icon: Icons.AlertTriangle, label: 'Repairs', path: '/repairs' },
  { icon: Icons.Globe, label: 'Vendors', path: '/vendors' },
  { icon: Icons.Shield, label: 'Warranty', path: '/warranty' },
  { icon: Icons.Activity, label: 'Service History', path: '/service-history' },
  { icon: Icons.Booking, label: 'Resource Booking', path: '/resource-booking' },
  { icon: Icons.Audit, label: 'Audits', path: '/audits' },
  { icon: Icons.Reports, label: 'Reports', path: '/reports' },
  { icon: Icons.Notifications, label: 'Notifications', path: '/notifications' },
  { icon: Icons.Cpu, label: 'AI Assistant', path: '/ai-assistant' },
  { icon: Icons.Settings, label: 'Settings', path: '/settings' },
  { icon: Icons.User, label: 'Profile', path: '/profile' },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hovered, setHovered] = React.useState<string | null>(null);

  return (
    <aside style={{
      width: 260,
      minWidth: 260,
      background: theme.colors.sidebar,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 24px 32px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#fff' }}><Icons.Layers /></span>
        </div>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
          AssetFlow
        </span>
      </div>

      {/* Nav Label */}
      <div style={{ padding: '0 24px 8px', color: '#4B5563', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        Navigation
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const isHovered = hovered === item.label;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHovered(item.label)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                background: isActive
                  ? 'rgba(79, 70, 229, 0.18)'
                  : isHovered
                  ? 'rgba(255,255,255,0.06)'
                  : 'transparent',
                color: isActive ? '#A5B4FC' : isHovered ? '#D1D5DB' : '#9CA3AF',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                fontFamily: theme.font,
                transition: 'all 0.15s ease',
                textAlign: 'left',
              }}
            >
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  width: 3,
                  height: 28,
                  background: '#4F46E5',
                  borderRadius: '0 4px 4px 0',
                }}/>
              )}
              <item.icon />
              {item.label}
              {item.label === 'Notifications' && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#EF4444',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 10,
                }}>4</span>
              )}
              {item.label === 'Maintenance' && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#F59E0B',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 10,
                }}>5</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 20px' }}/>

      {/* User Card */}
      <div style={{ padding: '12px 12px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.05)',
          cursor: 'pointer',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 13, fontWeight: 700,
          }}>JD</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#F3F4F6', fontSize: 13, fontWeight: 600 }}>John Doe</div>
            <div style={{ color: '#6B7280', fontSize: 11 }}>Asset Manager</div>
          </div>
          <span style={{ color: '#6B7280' }}><Icons.ChevronDown /></span>
        </div>
      </div>
    </aside>
  );
};
