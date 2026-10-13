import type { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#741324] bg-[#150407] p-6 shadow-2xl">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-xl text-[#9e6b74] transition hover:text-white"
            aria-label="Закрыть"
          >
            ×
          </button>
        )}

        {children}
      </div>
    </div>
  );
}