// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#4F46E5',
    primaryLight: '#EEF2FF',
    primaryDark: '#4338CA',
    sidebar: '#111827',
    background: '#F6F8FC',
    white: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F0F0F5',
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280',
      light: '#9CA3AF',
    },
    success: { main: '#10B981', light: '#ECFDF5' },
    warning: { main: '#F59E0B', light: '#FFFBEB' },
    error: { main: '#EF4444', light: '#FEF2F2' },
    info: { main: '#06B6D4', light: '#ECFEFF' },
    purple: { main: '#8B5CF6', light: '#F5F3FF' },
    pink: { main: '#EC4899', light: '#FDF2F8' },
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 8px 24px rgba(0,0,0,0.10)',
  },
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export type Theme = typeof theme;