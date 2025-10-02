import Button from './Button';
import Card from './Card';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  className,
}) => {
  return (
    <Card className={`text-center py-12 ${className || ''}`}>
      {Icon && (
        <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon size={40} className="text-neutral-600" />
        </div>
      )}
      {title && (
        <h3 className="text-xl font-semibold text-neutral-300 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-neutral-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && actionLabel && (
        <Button onClick={action}>{actionLabel}</Button>
      )}
    </Card>
  );
};

export default EmptyState;