import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'surface';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  variant = 'primary',

  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  // Variant Styles
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-primary to-primary-container text-white hover:opacity-90 active:opacity-80',
    secondary:
      'bg-transparent text-primary   hover:bg-primary/10 active:bg-primary/20',
    ghost:
      'bg-transparent text-slate-medium hover:bg-surface-low active:bg-surface-highest',
    surface:
      'bg-primary-light text-slate-medium hover:bg-surface-high active:bg-surface-highest',
  };

  return (
    <button
      className={`
        ${variantStyles[variant]}
 
        ${fullWidth ? 'w-full' : ''}
        font-semibold text-[16px] px-5 py-3 rounded-sm cursor-pointer transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...rest}
    >
      {children}
    </button>
  );
}
