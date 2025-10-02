import { useState, useEffect } from 'react';
import { Check, X, Eye, Phone, MapPin } from 'lucide-react';
import ordersService from '@/services/ordersService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/helpers';
import { ORDER_STATUS } from '@/types';
import clsx from 'clsx';

const FarmerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const params = {
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      };
      const data = await ordersService.getFarmerOrders(params);
      setOrders(data.orders || data);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await ordersService.updateOrderStatus(orderId, newStatus);
      loadOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      [ORDER_STATUS.PENDING]: { label: 'Pending', class: 'badge-warning' },
      [ORDER_STATUS.CONFIRMED]: { label: 'Confirmed', class: 'badge-info' },
      [ORDER_STATUS.PREPARING]: { label: 'Preparing', class: 'badge-info' },
      [ORDER_STATUS.READY]: { label: 'Ready', class: 'badge-success' },
      [ORDER_STATUS.IN_TRANSIT]: { label: 'In Transit', class: 'badge-info' },
      [ORDER_STATUS.DELIVERED]: { label: 'Delivered', class: 'badge-success' },
      [ORDER_STATUS.CANCELLED]: { label: 'Cancelled', class: 'badge-error' },
    };

    const badge = badges[status] || { label: status, class: 'badge' };
    return <span className={badge.class}>{badge.label}</span>;
  };

  const statusFilters = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: ORDER_STATUS.PENDING },
    { label: 'In Progress', value: ORDER_STATUS.PREPARING },
    { label: 'Completed', value: ORDER_STATUS.DELIVERED },
  ];

  const OrderCard = ({ order }) => (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Order #{order.order_number}
            </h3>
            <p className="text-sm text-neutral-400">
              {formatRelativeTime(order.created_at)}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Customer Info */}
        <div className="p-4 bg-primary-dark rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-neutral-500" />
            <span className="text-neutral-300">{order.buyer?.phone_number}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={16} className="text-neutral-500 flex-shrink-0 mt-0.5" />
            <span className="text-neutral-300">{order.delivery_address}</span>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-400">Order Items</h4>
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-neutral-300">
                {item.product_name} x {item.quantity}
              </span>
              <span className="font-mono text-accent-cyan">
                {formatCurrency(item.line_total)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <span className="font-medium">Total</span>
          <span className="price text-xl">{formatCurrency(order.total_amount)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {order.status === ORDER_STATUS.PENDING && (
            <>
              <Button
                size="sm"
                icon={Check}
                onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CONFIRMED)}
                fullWidth
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={X}
                onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.CANCELLED)}
                fullWidth
              >
                Decline
              </Button>
            </>
          )}

          {order.status === ORDER_STATUS.CONFIRMED && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.PREPARING)}
              fullWidth
            >
              Mark as Preparing
            </Button>
          )}

          {order.status === ORDER_STATUS.PREPARING && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.READY)}
              fullWidth
            >
              Mark as Ready
            </Button>
          )}

          {order.status === ORDER_STATUS.READY && (
            <Button
              size="sm"
              onClick={() => handleUpdateStatus(order.id, ORDER_STATUS.IN_TRANSIT)}
              fullWidth
            >
              Mark as In Transit
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            icon={Eye}
            onClick={() => setSelectedOrder(order)}
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Orders Management</h1>
        <p className="text-neutral-400">Manage incoming orders</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-neutral-800 rounded"></div>
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
          <p className="text-neutral-400 mb-4">No orders found</p>
        </Card>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Order #{selectedOrder.order_number}
                  </h2>
                  <p className="text-neutral-400">
                    Placed on {formatDate(selectedOrder.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-neutral-400 hover:text-neutral-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Status
                  </h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>

                {/* Customer */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Customer Information
                  </h3>
                  <div className="p-4 bg-primary-dark rounded-lg space-y-2">
                    <p className="text-neutral-300">
                      {selectedOrder.buyer?.full_name}
                    </p>
                    <p className="text-sm text-neutral-400">
                      {selectedOrder.buyer?.phone_number}
                    </p>
                  </div>
                </div>

                {/* Delivery */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-neutral-300">
                    {selectedOrder.delivery_address}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">
                    Order Items
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-primary-dark rounded-lg"
                      >
                        <span className="text-neutral-300">
                          {item.product_name} x {item.quantity}
                        </span>
                        <span className="font-mono text-accent-cyan">
                          {formatCurrency(item.line_total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-neutral-800">
                  <div className="flex items-center justify-between text-xl font-semibold">
                    <span>Total</span>
                    <span className="price">
                      {formatCurrency(selectedOrder.total_amount)}
                    </span>
                  </div>
                </div>

                <Button
                  fullWidth
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrdersPage;