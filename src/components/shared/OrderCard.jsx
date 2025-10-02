import React, { useState } from 'react';
import { Package, Calendar, MapPin, User, CreditCard, ChevronDown, ChevronUp, CheckCircle, XCircle, Clock, Truck } from 'lucide-react';

const OrderCard = ({ order, userRole, onStatusUpdate, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Package className="w-5 h-5" />;
      case 'shipped':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(order.id, newStatus);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(order.status).replace('text-', 'bg-').replace('100', '50')}`}>
              {getStatusIcon(order.status)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Order #{order.order_number}</h3>
              <p className="text-sm text-gray-600">
                <Calendar className="inline w-3 h-3 mr-1" />
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
            <CreditCard className="inline w-3 h-3 mr-1" />
            Payment: {order.payment_status}
          </span>
        </div>

        {/* Summary Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-xl font-bold text-gray-900">₵{order.total_amount.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Items</p>
            <p className="text-xl font-bold text-gray-900">{order.items?.length || 0}</p>
          </div>
        </div>

        {/* User Info */}
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          {userRole === 'farmer' && order.buyer_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Buyer: {order.buyer_name}</span>
            </div>
          )}
          {userRole === 'buyer' && order.farmer_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Farmer: {order.farmer_name}</span>
            </div>
          )}
          {order.delivery_address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5" />
              <span className="flex-1">{order.delivery_address}</span>
            </div>
          )}
          {order.delivery_date && (
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <span>Expected: {formatDate(order.delivery_date)}</span>
            </div>
          )}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            {/* Order Items */}
            {order.items && order.items.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} {item.unit_of_measure} × ₵{item.unit_price}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">₵{item.line_total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {order.special_instructions && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Special Instructions:</p>
                <p className="text-sm text-blue-800">{order.special_instructions}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(order.id)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  View Details
                </button>
              )}

              {/* Farmer Actions */}
              {userRole === 'farmer' && order.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusChange('confirmed')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Confirm Order
                  </button>
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel Order
                  </button>
                </>
              )}

              {userRole === 'farmer' && order.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusChange('processing')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Mark as Processing
                </button>
              )}

              {userRole === 'farmer' && order.status === 'processing' && (
                <button
                  onClick={() => handleStatusChange('shipped')}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  Mark as Shipped
                </button>
              )}

              {userRole === 'farmer' && order.status === 'shipped' && (
                <button
                  onClick={() => handleStatusChange('delivered')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Mark as Delivered
                </button>
              )}

              {/* Buyer Actions */}
              {userRole === 'buyer' && order.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Cancel Order
                </button>
              )}

              {userRole === 'buyer' && order.status === 'shipped' && (
                <button
                  onClick={() => handleStatusChange('delivered')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Confirm Delivery
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;