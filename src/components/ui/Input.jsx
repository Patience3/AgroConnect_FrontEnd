import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  className,
  ...props
}, ref) => {
  return (
    <div className={clsx('space-y-1', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-neutral-300">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={clsx(
            'input',
            Icon && iconPosition === 'left' && 'pl-10',
            Icon && iconPosition === 'right' && 'pr-10',
            error && 'input-error',
            className
          )}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-neutral-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;