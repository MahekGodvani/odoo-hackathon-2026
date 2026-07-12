// src/components/ui/Avatar.tsx
import React from 'react';

interface AvatarProps {
  initials: string;
  color?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color = '#4F46E5', size = 36 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: size * 0.28,
    background: color + '20',
    border: `2px solid ${color}35`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color,
    fontSize: size * 0.33,
    fontWeight: 700,
    flexShrink: 0,
  }}>
    {initials}
  </div>
);