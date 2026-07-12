import type { CSSProperties, ReactNode } from 'react';
import { theme } from '../../styles/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  style?: CSSProperties;
}

const variants: Record<BadgeVariant, CSSProperties> = {
  default: {
    background: '#F3F4F6',
    color: theme.colors.text.secondary,
  },
  success: {
    background: theme.colors.success.light,
    color: theme.colors.success.main,
  },
  warning: {
    background: theme.colors.warning.light,
    color: theme.colors.warning.main,
  },
  error: {
    background: theme.colors.error.light,
    color: theme.colors.error.main,
  },
  info: {
    background: theme.colors.info.light,
    color: theme.colors.info.main,
  },
  purple: {
    background: theme.colors.purple.light,
    color: theme.colors.purple.main,
  },
};

export const Badge = ({ children, variant = 'default', style }: BadgeProps) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: theme.radius.full,
      padding: '3px 9px',
      fontSize: 11,
      fontWeight: 700,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',
      ...variants[variant],
      ...style,
    }}
  >
    {children}
  </span>
);

export const getStatusVariant = (status: string): BadgeVariant => {
  const normalized = status.toLowerCase();

  if (['available', 'confirmed', 'completed', 'active'].includes(normalized)) {
    return 'success';
  }

  if (['pending', 'scheduled', 'upcoming'].includes(normalized)) {
    return 'warning';
  }

  if (['overdue', 'critical'].includes(normalized)) {
    return 'error';
  }

  if (['allocated', 'in progress', 'maintenance'].includes(normalized)) {
    return 'info';
  }

  return 'default';
};

export const getPriorityVariant = (priority: string): BadgeVariant => {
  const normalized = priority.toLowerCase();

  if (normalized === 'critical') {
    return 'error';
  }

  if (normalized === 'high') {
    return 'warning';
  }

  if (normalized === 'medium') {
    return 'info';
  }

  if (normalized === 'low') {
    return 'success';
  }

  return 'default';
};
