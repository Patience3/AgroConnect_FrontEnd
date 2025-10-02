import { X } from 'lucide-react';
import { useEffect } from 'react';
import Card from './Card';
import clsx from 'clsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      <div
        className={clsx(
          'relative w-full animate-fade-in',
          sizeStyles[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className={className}>
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between mb-6">
              {title && (
                <h2 className="text-2xl font-bold text-neutral-100">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-300 transition-colors"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}
          
          <div>{children}</div>
        </Card>
      </div>
    </div>
  );
};

export default Modal;