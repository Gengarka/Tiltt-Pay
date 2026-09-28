import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'rounded-xl px-5 py-3 text-sm font-semibold transition-colors';

  const variantStyles = {
    primary: 'bg-[#e5092f] text-white hover:bg-[#ff1744]',
    secondary:
      'border border-[#741324] bg-[#26070d] text-white hover:bg-[#3a0a12]',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}