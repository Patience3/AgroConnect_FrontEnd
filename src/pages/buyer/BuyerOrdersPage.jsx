import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import ordersService from '@/services/ordersService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/helpers';
import { ORDER_STATUS } from '@/types';
import clsx from 'clsx';

const BuyerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const params = {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      };
      const data = await ordersService.getBuyerOrders(params);
      setOrders(data.orders || data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      [ORDER_STATUS.PENDING]: { label: 'Pending', class: 'badge-warning' },
      [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', class: 'badge-info' },
      [ORDER_STATUS.PREPARING]: { label: 'Preparing', class: 'badge-info' },
      [ORDER_STATUS.IN_TRANSIT]: { label: 'In Transit', class: 'badge-info' },
      [ORDER_STATUS.DELIVERED]: { label: 'Delivered', class: 'badge-success' },
      [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', class: 'badge-error' },
    };

    const badge = badges[status] || { label: status, class: 'badge' };
    return <span className={badge.class}>{badge.label}</span>;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUS.DELIVERED:
        return <CheckCircle className="text-success" size={20} />;
      case ORDER_STATUS.CANCELLED:
        return <XCircle className="text-error" size={20} />;
      default:
        return <Clock className="text-warning" size={20} />;
    }
  };

  const statusFilters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: ORDER_STATUS.PENDING },
    { label: 'In Progress', value: ORDER_STATUS.IN_TRANSIT },
    { label: 'Delivered', value: ORDER_STATUS.DELIVERED },
    { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
  ];

  {/*const filteredOrders = orders.filter(order => {
  if (filterStatus === 'all') return true;
  return order.status === filterStatus;
});*/}

  const OrderCard = ({ order }) => (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getStatusIcon(order.status)}
              <h3 className="font-semibold text-lg">
                Order #{order.order_number}
              </h3>
            </div>
            <p className="text-sm text-neutral-400">
              Placed {formatRelativeTime(order.created_at)}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Items */}
        <div className="space-y-2">
          {order.items?.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 text-sm"
            >
              <Package size={16} className="text-neutral-500" />
              <span className="text-neutral-300">
                {item.product_name} x {item.quantity}
              </span>
            </div>
          ))}
          {order.items?.length > 3 && (
            <p className="text-sm text-neutral-500 pl-7">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <div>
            <p className="text-sm text-neutral-400">Total</p>
            <p className="price text-xl">{formatCurrency(order.total_amount)}</p>
          </div>
          <Button size="sm" variant="secondary" icon={Eye}>
            View Details
          </Button>
        </div>

        {/* Delivery Info */}
        {order.delivery_date && (
          <div className="bg-accent-teal/10 border border-accent-teal/30 rounded-lg p-3 text-sm">
            <p className="text-neutral-300">
              Expected Delivery: {formatDate(order.delivery_date)}
            </p>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-neutral-400">Track and manage your orders</p>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedStatus(filter.value)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              selectedStatus === filter.value
                ? 'bg-accent-cyan text-primary-dark'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-32 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-neutral-600" />
          </div>
          <p className="text-neutral-400 mb-4">No orders found</p>
          <Button onClick={() => window.location.href = '/dashboard/marketplace'}>
            Start Shopping
          </Button>
        </Card>
      )}
    </div>
  );
};

export default BuyerOrdersPage;