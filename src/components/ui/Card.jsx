import clsx from 'clsx';

const Card = ({
  children,
  title,
  subtitle,
  hover = false,
  padding = 'normal',
  className,
  headerAction,
  footer,
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    normal: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={clsx(
        'bg-primary-light rounded-lg shadow-card border border-neutral-800',
        hover && 'card-hover',
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-neutral-800">
          <div>
            {title && (
              <h3 className="text-xl font-semibold text-neutral-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div>{children}</div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-neutral-800">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;