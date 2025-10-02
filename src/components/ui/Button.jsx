import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  className,
  ...props
}) => {
  const baseStyles = 'btn inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-accent-cyan text-primary-dark hover:bg-accent-teal focus:ring-accent-cyan shadow-glow-cyan hover:shadow-glow-teal',
    secondary: 'bg-primary-light text-accent-cyan border border-accent-teal hover:bg-accent-teal hover:text-primary-dark focus:ring-accent-teal',
    outline: 'bg-transparent text-accent-cyan border-2 border-accent-teal hover:bg-accent-teal/10 focus:ring-accent-teal',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error',
    ghost: 'bg-transparent text-neutral-300 hover:bg-primary-light hover:text-accent-cyan',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-lg',
    xl: 'px-8 py-4 text-xl rounded-xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <div className={clsx('spinner', iconSizes[size])} />
      )}
      
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className={iconSizes[size]} />
      )}
      
      <span>{children}</span>
      
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className={iconSizes[size]} />
      )}
    </button>
  );
};

export default Button;