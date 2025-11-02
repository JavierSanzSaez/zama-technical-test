import React from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const containerClasses = [
    'flex',
    'flex-col',
    'gap-2',
    fullWidth ? 'w-full' : 'w-auto',
  ].join(' ');

  const labelClasses = [
    'text-sm',
    'font-medium',
    'text-gray-300',
  ].join(' ');

  const inputClasses = [
    'w-full',
    'text-base',
    'px-4',
    'py-3',
    'border',
    'rounded-md',
    'outline-none',
    'transition-colors',
    'duration-200',
    'focus:ring-2',
    'focus:ring-offset-2',
    'bg-dark-800',
    'text-gray-200',
    'focus:ring-offset-dark-800',
    error
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
      : 'border-dark-600 focus:border-warm-500 focus:ring-warm-500',
    className,
  ]
    .join(' ');

  const errorClasses = [
    'text-sm',
    'text-red-400',
  ].join(' ');

  return (
    <div className={containerClasses}>
      {label && <label className={labelClasses}>{label}</label>}
      <input
        className={inputClasses}
        {...props}
      />
      {error && <span className={errorClasses}>{error}</span>}
    </div>
  );
};
