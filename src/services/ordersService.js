import api from './api';

const ordersService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get all orders with filters
  getOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`/orders?${queryParams.toString()}`);
    return response.data;
  },

  // Get single order
  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId, status, notes = '') => {
    const response = await api.put(`/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId, reason) => {
    const response = await api.post(`/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data;
  },

  // Get buyer's orders
  getBuyerOrders: async (params = {}) => {
    return ordersService.getOrders(params);
  },

  // Get farmer's orders
  getFarmerOrders: async (params = {}) => {
    return ordersService.getOrders(params);
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber) => {
    const response = await api.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Update delivery date
  updateDeliveryDate: async (orderId, deliveryDate) => {
    const response = await api.patch(`/orders/${orderId}/delivery-date`, {
      delivery_date: deliveryDate,
    });
    return response.data;
  },

  // Update delivery address
  updateDeliveryAddress: async (orderId, address) => {
    const response = await api.patch(`/orders/${orderId}/delivery-address`, {
      delivery_address: address,
    });
    return response.data;
  },

  // Get order statistics
  getOrderStats: async (params = {}) => {
    const response = await api.get('/orders/stats', { params });
    return response.data;
  },

  // Track order
  trackOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },

  // Rate order
  rateOrder: async (orderId, rating, review) => {
    const response = await api.post(`/orders/${orderId}/rate`, {
      rating,
      review,
    });
    return response.data;
  },

  // Request refund
  requestRefund: async (orderId, reason, items = []) => {
    const response = await api.post(`/orders/${orderId}/refund`, {
      reason,
      items,
    });
    return response.data;
  },

  // Confirm delivery
  confirmDelivery: async (orderId, confirmationCode) => {
    const response = await api.post(`/orders/${orderId}/confirm-delivery`, {
      confirmation_code: confirmationCode,
    });
    return response.data;
  },

  // Report issue
  reportIssue: async (orderId, issueData) => {
    const response = await api.post(`/orders/${orderId}/report-issue`, issueData);
    return response.data;
  },
};

export default ordersService;