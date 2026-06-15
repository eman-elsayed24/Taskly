import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Badge = ({ children, className, variant = 'primary' }: BadgeProps) => {
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'text-primary bg-surface-highest',
    ghost: 'text-slate-medium bg-slate-light/20',
  };

  return (
    <div
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full uppercase text-xs font-bold tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default Badge;
