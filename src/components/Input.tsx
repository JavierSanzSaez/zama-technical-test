import React from 'react';
import type { InputHTMLAttributes } from 'react';
import { colors, spacing, borderRadius, typography } from '../styles/tokens';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.base,
    padding: `${spacing[3]} ${spacing[4]}`,
    border: `1px solid ${error ? colors.error.DEFAULT : colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    outline: 'none',
    transition: 'border-color 200ms ease-in-out',
    width: '100%',
  };

  const errorStyle: React.CSSProperties = {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.fontSize.sm,
    color: colors.error.DEFAULT,
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <input
        style={inputStyle}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = error ? colors.error.DEFAULT : colors.primary[500];
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.error.DEFAULT : colors.neutral[300];
        }}
        {...props}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};
