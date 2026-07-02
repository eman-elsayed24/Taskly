import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import CloseIcon from '../../assets/icons/close.svg?react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  variant?: 'modal' | 'bottomSheet';
}

export default function Modal({
  isOpen,
  onClose,
  children,
  maxWidth = '3xl',
  variant = 'modal',
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  if (variant === 'bottomSheet') {
    const content = (
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="hidden md:flex md:items-center md:justify-center md:h-full md:p-4">
          <div
            className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </div>
        </div>

        <div className="md:hidden flex items-end h-full">
          <div
            className="w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3">
              <div className="h-1 w-12 rounded-full bg-slate-light" />
            </div>
            {children}
          </div>
        </div>
      </div>
    );

    return createPortal(content, document.getElementById('modal-root')!);
  }

  const content = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-xl overflow-hidden`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.getElementById('modal-root')!);
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose: () => void;
  showCloseButton?: boolean;
}

export function ModalHeader({
  children,
  onClose,
  showCloseButton = true,
}: ModalHeaderProps) {
  return (
    <div className="relative p-4 sm:p-6 border-b border-slate-light/20 md:border-b">
      <div className={showCloseButton ? 'pr-10' : ''}>{children}</div>
      {showCloseButton && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-medium hover:text-error transition-colors p-2 cursor-pointer "
          aria-label="Close modal"
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export function ModalContent({ children, className = '' }: ModalContentProps) {
  return (
    <div className={`p-4 sm:p-6 overflow-y-auto max-h-[70vh] ${className}`}>
      {children}
    </div>
  );
}
