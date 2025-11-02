import React from 'react';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  padding?: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | '20' | '24';
  hover?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = '6',
  hover = false,
  className = '',
}) => {
  const paddingClasses = {
    '0': 'p-0',
    '1': 'p-1',
    '2': 'p-2',
    '3': 'p-3',
    '4': 'p-4',
    '5': 'p-5',
    '6': 'p-6',
    '8': 'p-8',
    '10': 'p-10',
    '12': 'p-12',
    '16': 'p-16',
    '20': 'p-20',
    '24': 'p-24',
  };

  const classes = [
    'bg-dark-800',
    'rounded-lg',
    'shadow-lg',
    'transition-all',
    'duration-200',
    paddingClasses[padding],
    hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '',
    className,
  ]
    .join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
