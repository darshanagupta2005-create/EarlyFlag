import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: number;
  radius?: string;
  style?: React.CSSProperties;
}

// Deterministic palette pick so the same student always gets the same color.
const PALETTE = [
  '#1e3a8a', // brand-primary
  '#0284c7', // brand-accent
  '#059669', // risk-low
  '#d97706', // risk-med
  '#7c3aed',
  '#be185d',
  '#0f766e',
  '#4338ca'
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, size = 36, radius = '50%', style }) => {
  const initials = getInitials(name);
  const bg = getColor(name || '?');

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: radius,
        backgroundColor: bg,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: `${Math.max(10, size * 0.38)}px`,
        letterSpacing: '0.02em',
        flexShrink: 0,
        userSelect: 'none',
        ...style
      }}
      aria-label={name}
      title={name}
    >
      {initials}
    </div>
  );
};
