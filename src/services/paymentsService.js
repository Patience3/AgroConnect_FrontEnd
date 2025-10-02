// paymentsService.js
// Service for handling payment operations in the agricultural marketplace

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Configure axios instance with auth headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const paymentsService = {
  /**
   * Initialize a payment for an order
   * @param {Object} paymentData - Payment details
   * @returns {Promise} Payment initialization response
   */
  initiatePayment: async (paymentData) => {
    try {
      const response = await apiClient.post('/payments/initiate', {
        order_id: paymentData.orderId,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod,
        provider: paymentData.provider, // e.g., 'mtn_momo', 'vodafone_cash', 'airtel_tigo'
        phone_number: paymentData.phoneNumber,
        customer_name: paymentData.customerName
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Payment verification response
   */
  verifyPayment: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/verify`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get payment details
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Payment details
   */
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get payment history for the current user
   * @param {Object} filters - Optional filters (status, date range, etc.)
   * @returns {Promise} List of payments
   */
  getPaymentHistory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/payments?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get payment methods available
   * @returns {Promise} List of payment methods
   */
  getPaymentMethods: async () => {
    try {
      const response = await apiClient.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Request a refund for a payment
   * @param {Object} refundData - Refund request data
   * @returns {Promise} Refund request response
   */
  requestRefund: async (refundData) => {
    try {
      const response = await apiClient.post('/payments/refund', {
        payment_id: refundData.paymentId,
        order_id: refundData.orderId,
        amount: refundData.amount,
        reason: refundData.reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check escrow status for a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Escrow status details
   */
  getEscrowStatus: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/escrow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Release escrow payment (for admin/system use)
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Escrow release response
   */
  releaseEscrow: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/escrow/release`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Generate payment receipt
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Receipt data
   */
  generateReceipt: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/receipt`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Download receipt as PDF
   * @param {string} paymentId - Payment ID
   * @returns {Promise} PDF blob
   */
  downloadReceipt: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}/receipt/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get transaction summary for a period
   * @param {Object} period - Date range
   * @returns {Promise} Transaction summary
   */
  getTransactionSummary: async (period = {}) => {
    try {
      const params = new URLSearchParams();
      if (period.startDate) params.append('start_date', period.startDate);
      if (period.endDate) params.append('end_date', period.endDate);

      const response = await apiClient.get(`/payments/summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Process mobile money payment
   * @param {Object} momoData - Mobile money payment data
   * @returns {Promise} Payment processing response
   */
  processMobileMoneyPayment: async (momoData) => {
    try {
      const response = await apiClient.post('/payments/mobile-money', {
        order_id: momoData.orderId,
        amount: momoData.amount,
        provider: momoData.provider, // 'mtn', 'vodafone', 'airteltigo'
        phone_number: momoData.phoneNumber,
        network: momoData.network
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Check mobile money payment status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} Payment status
   */
  checkMobileMoneyStatus: async (transactionId) => {
    try {
      const response = await apiClient.get(`/payments/mobile-money/${transactionId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get wallet balance (for farmers receiving payments)
   * @returns {Promise} Wallet balance details
   */
  getWalletBalance: async () => {
    try {
      const response = await apiClient.get('/payments/wallet/balance');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Request wallet withdrawal
   * @param {Object} withdrawalData - Withdrawal request data
   * @returns {Promise} Withdrawal request response
   */
  requestWithdrawal: async (withdrawalData) => {
    try {
      const response = await apiClient.post('/payments/wallet/withdraw', {
        amount: withdrawalData.amount,
        payment_method: withdrawalData.paymentMethod,
        account_details: withdrawalData.accountDetails
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get withdrawal history
   * @returns {Promise} List of withdrawals
   */
  getWithdrawalHistory: async () => {
    try {
      const response = await apiClient.get('/payments/wallet/withdrawals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default paymentsService;