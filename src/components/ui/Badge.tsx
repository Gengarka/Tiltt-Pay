import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-[#741324] bg-[#300912] px-3 py-1 text-xs font-medium text-[#ff8fa1]">
      {children}
    </span>
  );
}