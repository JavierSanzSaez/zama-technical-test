import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { colors, spacing, borderRadius, transitions, typography, shadows } from '../styles/tokens';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  disabled,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontWeight: typography.fontWeight.medium,
    border: 'none',
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: transitions.base,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      backgroundColor: colors.primary[600],
      color: '#ffffff',
      boxShadow: shadows.sm,
      ...(disabled
        ? {}
        : {
            ':hover': {
              backgroundColor: colors.primary[700],
            },
          }),
    },
    secondary: {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[900],
      border: `1px solid ${colors.neutral[300]}`,
    },
    danger: {
      backgroundColor: colors.error.DEFAULT,
      color: '#ffffff',
      boxShadow: shadows.sm,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.neutral[700],
    },
  };

  const sizes = {
    sm: {
      fontSize: typography.fontSize.sm,
      padding: `${spacing[2]} ${spacing[3]}`,
    },
    md: {
      fontSize: typography.fontSize.base,
      padding: `${spacing[3]} ${spacing[4]}`,
    },
    lg: {
      fontSize: typography.fontSize.lg,
      padding: `${spacing[4]} ${spacing[6]}`,
    },
  };

  const style = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  };

  return (
    <button
      style={style}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = colors.primary[700];
        } else if (!disabled && variant === 'secondary') {
          e.currentTarget.style.backgroundColor = colors.neutral[200];
        } else if (!disabled && variant === 'danger') {
          e.currentTarget.style.backgroundColor = colors.error.dark;
        } else if (!disabled && variant === 'ghost') {
          e.currentTarget.style.backgroundColor = colors.neutral[100];
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = colors.primary[600];
        } else if (variant === 'secondary') {
          e.currentTarget.style.backgroundColor = colors.neutral[100];
        } else if (variant === 'danger') {
          e.currentTarget.style.backgroundColor = colors.error.DEFAULT;
        } else if (variant === 'ghost') {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};
