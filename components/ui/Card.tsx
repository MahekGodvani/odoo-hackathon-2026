// src/components/ui/Card.tsx
import React from 'react';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  padding?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, padding = '24px', hoverable = false }) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => hoverable && setHovered(false)}
      style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding,
        boxShadow: hovered ? theme.shadow.md : theme.shadow.sm,
        border: `1px solid ${theme.colors.borderLight}`,
        transition: 'all 0.2s ease',
        transform: hovered && hoverable ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
};