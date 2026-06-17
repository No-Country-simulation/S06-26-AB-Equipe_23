import React from 'react';

type BadgeVariant = 'diversidade' | 'esg' | 'nivel' | 'antivies';

interface BadgeProps {
  label: string;
  variant: BadgeVariant;
  size?: 'sm' | 'md';
}

const VARIANT_STYLES: Record<BadgeVariant, React.CSSProperties> = {
  diversidade: { background: '#EEE9FC', color: '#534AB7' },
  esg:         { background: '#EAF3DE', color: '#3B6D11' },
  nivel:       { background: '#f3f4f6', color: '#4b5563' },
  antivies:    { background: '#EEE9FC', color: '#534AB7' },
};

export default function Badge({ label, variant, size = 'sm' }: BadgeProps) {
  return (
    <span style={{
      ...VARIANT_STYLES[variant],
      padding: size === 'md' ? '4px 12px' : '2px 8px',
      borderRadius: 99,
      fontSize: size === 'md' ? 12 : 10,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}
