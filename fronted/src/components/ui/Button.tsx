// src/components/ui/Button.tsx
import React from 'react';
import { theme } from '../../styles/theme';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', onClick, icon, style, disabled, type = 'button'
}) => {
  const [hovered, setHovered] = React.useState(false);

  const sizes = { sm: '7px 14px', md: '9px 18px', lg: '11px 22px' };
  const fontSizes = { sm: '12px', md: '14px', lg: '15px' };

  const variants = {
    primary: {
      background: hovered ? theme.colors.primaryDark : theme.colors.primary,
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: hovered ? '#F3F4F6' : '#fff',
      color: theme.colors.text.secondary,
      border: `1px solid ${theme.colors.border}`,
    },
    ghost: {
      background: 'none',
      color: hovered ? theme.colors.primary : theme.colors.text.muted,
      border: 'none',
    },
    danger: {
      background: hovered ? '#DC2626' : '#EF4444',
      color: '#fff',
      border: 'none',
    },
  };

  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: sizes[size],
        fontSize: fontSizes[size],
        fontWeight: 600,
        fontFamily: theme.font,
        borderRadius: theme.radius.md,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        ...v,
        ...style,
      }}
    >
      {icon && icon}
      {children}
    </button>
  );
};