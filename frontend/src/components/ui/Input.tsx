import type { InputHTMLAttributes } from 'react';

export function Input({
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-[#5d111d] bg-[#170508] px-4 py-3 text-sm text-white outline-none placeholder:text-[#8c6269] focus:border-[#e5092f] ${className}`}
      {...props}
    />
  );
}