import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

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
    'focus:ring-2',
    'focus:ring-offset-2',
    disabled ? 'cursor-not-allowed opacity-50' : '',
    fullWidth ? 'w-full' : '',
  ];

  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'shadow-sm',
      !disabled ? 'hover:bg-blue-700 focus:ring-blue-500' : '',
    ],
    secondary: [
      'bg-gray-100',
      'text-gray-900',
      'border',
      'border-gray-300',
      !disabled ? 'hover:bg-gray-200 focus:ring-gray-500' : '',
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'shadow-sm',
      !disabled ? 'hover:bg-red-700 focus:ring-red-500' : '',
    ],
    ghost: [
      'bg-transparent',
      'text-gray-700',
      !disabled ? 'hover:bg-gray-100 focus:ring-gray-500' : '',
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
