import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = [
    'font-medium',
    'border-none',
    'rounded-md',
    'cursor-pointer',
    'transition-all',
    'duration-200',
    'inline-flex',
    'items-center',
    'justify-center',
    'focus:outline-none',
    disabled ? 'cursor-not-allowed opacity-50' : '',
    fullWidth ? 'w-full' : '',
  ];

  const variantClasses = {
    primary: [
      'bg-mono-200',
      'text-mono-950',
      'shadow-sm',
      !disabled ? 'hover:bg-mono-50' : '',
    ],
    secondary: [
      'bg-mono-800',
      'text-mono-200',
      'border',
      'border-mono-700',
      !disabled ? 'hover:bg-mono-700' : '',
    ],
    danger: [
      'bg-red-500',
      'text-white',
      'shadow-sm',
      !disabled ? 'hover:bg-red-600' : '',
    ],
    ghost: [
      'bg-transparent',
      'text-mono-300',
      !disabled ? 'hover:bg-mono-900' : '',
    ],
    success: [
      'bg-green-500',
      'text-white',
      'shadow-sm',
      !disabled ? 'hover:bg-green-600' : '',
    ],
  };

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-6 py-4',
  };

  const classes = [
    ...baseClasses,
    ...variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
