// src/components/layout/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { theme } from '../../styles/theme';

export const Layout: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: theme.font,
      background: theme.colors.background,
      overflow: 'hidden',
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 40px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};