// src/components/shared/ProductCard.jsx
import { useState } from 'react';
import { Edit, Trash2, Eye, Package, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { PRODUCT_STATUS, QUALITY_GRADES } from '@/types';
import clsx from 'clsx';

const ProductCard = ({ product, viewMode = 'grid', onEdit, onDelete, onView, showActions = true }) => {
  const [imageError, setImageError] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      [PRODUCT_STATUS.AVAILABLE]: { label: 'Available', variant: 'success' },
      [PRODUCT_STATUS.OUT_OF_STOCK]: { label: 'Out of Stock', variant: 'error' },
      [PRODUCT_STATUS.DISCONTINUED]: { label: 'Discontinued', variant: 'default' },
    };
    const badge = badges[status] || badges[PRODUCT_STATUS.AVAILABLE];
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const isLowStock = product.quantity_available < 10;

  if (viewMode === 'list') {
    return (
      <Card hover padding="none">
        <div className="flex items-center gap-4 p-4">
          {/* Product Image */}
          <div className="w-20 h-20 rounded-lg bg-neutral-800 flex-shrink-0 overflow-hidden">
            {product.images?.[0] && !imageError ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                <Package size={32} />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-neutral-400 line-clamp-1">{product.description}</p>
              </div>
              {getStatusBadge(product.status)}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-neutral-500">
                Stock: <span className={clsx(
                  'font-mono',
                  isLowStock ? 'text-warning' : 'text-accent-cyan'
                )}>
                  {product.quantity_available} {product.unit_of_measure}
                </span>
              </span>
              <span className="text-neutral-700">•</span>
              <span className="price">
                {formatCurrency(product.price_per_unit)}/{product.unit_of_measure}
              </span>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-2">
              {onView && (
                <Button size="sm" variant="ghost" icon={Eye} onClick={() => onView(product)} />
              )}
              {onEdit && (
                <Button size="sm" variant="secondary" icon={Edit} onClick={() => onEdit(product)} />
              )}
              {onDelete && (
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(product.id)} />
              )}
            </div>
          )}
        </div>

        {isLowStock && (
          <div className="px-4 pb-4">
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-2 flex items-center gap-2">
              <AlertCircle size={16} className="text-warning flex-shrink-0" />
              <span className="text-xs text-warning">Low stock alert</span>
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Grid View
  return (
    <Card hover padding="none" className="overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 bg-neutral-800">
        {product.images?.[0] && !imageError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={() => setImageError()}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            <Package size={48} />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {getStatusBadge(product.status)}
          {product.is_organic && <Badge variant="success">Organic</Badge>}
          {product.quality_grade && product.quality_grade !== QUALITY_GRADES.STANDARD && (
            <Badge variant="info">{product.quality_grade}</Badge>
          )}
        </div>

        {isLowStock && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning">
              <AlertCircle size={12} className="mr-1" />
              Low Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-neutral-400 mb-3 line-clamp-2">{product.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Stock:</span>
            <span className={clsx(
              'font-mono font-semibold',
              isLowStock ? 'text-warning' : 'text-accent-cyan'
            )}>
              {product.quantity_available} {product.unit_of_measure}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">Price:</span>
            <span className="price text-xl">
              {formatCurrency(product.price_per_unit)}
            </span>
          </div>

          {product.harvest_date && (
            <div className="text-xs text-neutral-600">
              Harvested: {formatDate(product.harvest_date)}
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-neutral-800">
            {onView && (
              <Button size="sm" variant="secondary" icon={Eye} onClick={() => onView(product)} fullWidth>
                View
              </Button>
            )}
            {onEdit && (
              <Button size="sm" variant="secondary" icon={Edit} onClick={() => onEdit(product)} fullWidth>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                onClick={() => onDelete(product.id)}
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProductCard;