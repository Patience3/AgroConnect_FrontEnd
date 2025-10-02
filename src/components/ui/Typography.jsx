import clsx from 'clsx';

export const Heading = ({ level = 1, children, className, ...props }) => {
  const Tag = `h${level}`;
  
  const styles = {
    1: 'text-4xl md:text-5xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-semibold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-medium',
    6: 'text-base md:text-lg font-medium',
  };

  return (
    <Tag className={clsx(styles[level], 'text-neutral-100', className)} {...props}>
      {children}
    </Tag>
  );
};

export const Text = ({ size = 'base', weight = 'normal', children, className, ...props }) => {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const weightStyles = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  return (
    <p
      className={clsx(
        sizeStyles[size],
        weightStyles[weight],
        'text-neutral-300',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export const Label = ({ children, required, className, ...props }) => {
  return (
    <label className={clsx('block text-sm font-medium text-neutral-300', className)} {...props}>
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
};

export const Caption = ({ children, className, ...props }) => {
  return (
    <span className={clsx('text-xs text-neutral-500', className)} {...props}>
      {children}
    </span>
  );
};

export const Link = ({ href, children, external, className, ...props }) => {
  return (
    <a
      href={href}
      className={clsx(
        'text-accent-cyan hover:text-accent-teal transition-colors underline',
        className
      )}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

const Typography = {
  Heading,
  Text,
  Label,
  Caption,
  Link,
};

export default Typography;