// src/components/dashboard/WelcomeBanner.tsx
import React from 'react';
import { theme } from '../../styles/theme';

export const WelcomeBanner: React.FC = () => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(79,70,229,0.92) 0%, rgba(124,58,237,0.88) 50%, rgba(139,92,246,0.92) 100%)',
    borderRadius: theme.radius.xl,
    padding: '32px 36px',
    marginBottom: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Decorative circles */}
    {[
      { top: -40, right: -20, size: 200, opacity: 0.08 },
      { top: 60, right: 80, size: 80, opacity: 0.05 },
      { bottom: -60, right: 120, size: 160, opacity: 0.05 },
    ].map((c, i) => (
      <div key={i} style={{
        position: 'absolute',
        top: c.top, right: c.right, bottom: c.bottom,
        width: c.size, height: c.size,
        borderRadius: '50%',
        background: `rgba(255,255,255,${c.opacity})`,
        pointerEvents: 'none',
      }}/>
    ))}

    <div style={{ position: 'relative', zIndex: 1 }}>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
        Good Morning, John 👋
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, margin: '6px 0 0', fontWeight: 400 }}>
        Welcome back, Asset Manager. Here's your daily overview.
      </p>
      <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
        {[
          { label: 'Pending Approvals', value: '12' },
          { label: 'Due Today', value: '8' },
          { label: 'Active Alerts', value: '3' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: '10px 20px',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: 110,
          }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500 }}>{stat.label}</div>
            <div style={{ color: '#fff', fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Illustration */}
    <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
      <div style={{
        width: 120, height: 120, borderRadius: 24,
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <div style={{ fontSize: 42 }}>📊</div>
        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500 }}>Live Dashboard</div>
      </div>
    </div>
  </div>
);