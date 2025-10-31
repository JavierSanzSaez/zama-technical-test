import React from 'react';
import type { ReactNode } from 'react';
import { spacing, borderRadius, shadows } from '../styles/tokens';

interface CardProps {
  children: ReactNode;
  padding?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = '6',
  hover = false,
}) => {
  const style: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing[padding],
    boxShadow: shadows.base,
    transition: 'box-shadow 200ms ease-in-out, transform 200ms ease-in-out',
  };

  return (
    <div
      style={style}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = shadows.base;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {children}
    </div>
  );
};
