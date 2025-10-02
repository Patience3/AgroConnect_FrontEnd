import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

const Alert = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
  ...props
}) => {
  const variants = {
    success: {
      container: 'bg-success/10 border-success/30 text-success',
      icon: CheckCircle,
    },
    error: {
      container: 'bg-error/10 border-error/30 text-error',
      icon: AlertCircle,
    },
    warning: {
      container: 'bg-warning/10 border-warning/30 text-warning',
      icon: AlertTriangle,
    },
    info: {
      container: 'bg-info/10 border-info/30 text-info',
      icon: Info,
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border p-4 flex items-start gap-3',
        config.container,
        className
      )}
      role="alert"
      {...props}
    >
      <Icon className="flex-shrink-0 mt-0.5" size={20} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-semibold mb-1 text-neutral-100">{title}</h4>
        )}
        <div className="text-sm text-neutral-300">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-300 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;