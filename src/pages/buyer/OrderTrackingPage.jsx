import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, Truck, CheckCircle, MapPin, Phone } from 'lucide-react';
import ordersService from '@/services/ordersService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/helpers';
import { ORDER_STATUS } from '@/types';
import clsx from 'clsx';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const data = await ordersService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.PENDING:
        return Clock;
      case ORDER_STATUS.CONFIRMED:
      case ORDER_STATUS.PREPARING:
        return Package;
      case ORDER_STATUS.IN_TRANSIT:
        return Truck;
      case ORDER_STATUS.DELIVERED:
        return CheckCircle;
      default:
        return Package;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      [ORDER_STATUS.PENDING]: { label: 'Pending', variant: 'warning' },
      [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', variant: 'info' },
      [ORDER_STATUS.PREPARING]: { label: 'Preparing', variant: 'info' },
      [ORDER_STATUS.IN_TRANSIT]: { label: 'In Transit', variant: 'info' },
      [ORDER_STATUS.DELIVERED]: { label: 'Delivered', variant: 'success' },
      [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', variant: 'error' },
    };
    const badge = badges[status] || { label: status, variant: 'default' };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const trackingSteps = [
    { status: ORDER_STATUS.PENDING, label: 'Order Placed', icon: Package },
    { status: ORDER_STATUS.CONFIRMED, label: 'Order Confirmed', icon: CheckCircle },
    { status: ORDER_STATUS.PREPARING, label: 'Preparing', icon: Package },
    { status: ORDER_STATUS.IN_TRANSIT, label: 'Out for Delivery', icon: Truck },
    { status: ORDER_STATUS.DELIVERED, label: 'Delivered', icon: CheckCircle },
  ];

  const getCurrentStepIndex = (status) => {
    return trackingSteps.findIndex(step => step.status === status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <Card className="text-center py-12">
        <p className="text-neutral-400 mb-4">Order not found</p>
        <Button onClick={() => navigate('/dashboard/orders')}>
          Back to Orders
        </Button>
      </Card>
    );
  }

  const currentStepIndex = getCurrentStepIndex(order.status);
  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button
        variant="ghost"
        icon={ArrowLeft}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      {/* Order Header */}
      <Card>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Track Order</h1>
            <p className="text-neutral-400">Order #{order.order_number}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Order Date</p>
            <p className="font-medium">{formatDate(order.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Total Amount</p>
            <p className="price text-xl">{formatCurrency(order.total_amount)}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Expected Delivery</p>
            <p className="font-medium">
              {order.delivery_date ? formatDate(order.delivery_date) : 'TBD'}
            </p>
          </div>
        </div>
      </Card>

      {/* Tracking Timeline */}
      <Card title="Order Status">
        <div className="relative">
          {trackingSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.status} className="relative flex gap-4 pb-8 last:pb-0">
                {/* Connector Line */}
                {index < trackingSteps.length - 1 && (
                  <div
                    className={clsx(
                      'absolute left-6 top-12 w-0.5 h-full -ml-px',
                      isCompleted ? 'bg-accent-cyan' : 'bg-neutral-800'
                    )}
                  />
                )}

                {/* Icon */}
                <div
                  className={clsx(
                    'relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                    isCompleted
                      ? 'bg-accent-cyan text-primary-dark'
                      : 'bg-neutral-800 text-neutral-500',
                    isCurrent && 'ring-4 ring-accent-cyan/20'
                  )}
                >
                  <Icon size={24} />
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3
                    className={clsx(
                      'font-semibold mb-1',
                      isCompleted ? 'text-neutral-100' : 'text-neutral-500'
                    )}
                  >
                    {step.label}
                  </h3>
                  {isCompleted && (
                    <p className="text-sm text-neutral-400">
                      {isCurrent ? 'In progress' : 'Completed'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery Information */}
        <Card title="Delivery Information">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-accent-cyan flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-neutral-500 mb-1">Delivery Address</p>
                <p className="text-neutral-300">{order.delivery_address}</p>
              </div>
            </div>

            {order.special_instructions && (
              <div className="p-3 bg-primary-dark rounded-lg">
                <p className="text-sm text-neutral-500 mb-1">Special Instructions</p>
                <p className="text-sm text-neutral-300">{order.special_instructions}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Farmer Information */}
        <Card title="Farmer Details">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent-teal/20 flex items-center justify-center">
                <span className="text-2xl">👨‍🌾</span>
              </div>
              <div>
                <h4 className="font-semibold">{order.farmer?.farm_name || 'Local Farm'}</h4>
                <p className="text-sm text-neutral-400">{order.farmer?.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-accent-cyan" />
              <a
                href={`tel:${order.farmer?.phone_number}`}
                className="text-accent-cyan hover:text-accent-teal"
              >
                {order.farmer?.phone_number}
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Items */}
      <Card title="Order Items">
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-primary-dark rounded-lg"
            >
              <div className="flex-1">
                <h4 className="font-medium mb-1">{item.product_name}</h4>
                <p className="text-sm text-neutral-400">
                  Quantity: {item.quantity} × {formatCurrency(item.unit_price)}
                </p>
              </div>
              <span className="font-mono text-accent-cyan font-semibold">
                {formatCurrency(item.line_total)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="price text-2xl">{formatCurrency(order.total_amount)}</span>
        </div>
      </Card>

      {/* Actions */}
      {order.status === ORDER_STATUS.DELIVERED && (
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Order Delivered!</h3>
            <p className="text-neutral-400 mb-4">
              How was your experience with this order?
            </p>
            <div className="flex gap-4 justify-center">
              <Button>Rate Order</Button>
              <Button variant="secondary">Contact Support</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrderTrackingPage;