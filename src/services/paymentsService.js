import api from './api';

const paymentsService = {
  /**
   * Initialize a payment for an order
   * @param {Object} paymentData - Payment details
   * @returns {Promise} Payment initialization response
   */
  initiatePayment: async (paymentData) => {
    const response = await api.post('/payments/initiate', {
      order_id: paymentData.orderId,
      amount: paymentData.amount,
      payment_method: paymentData.paymentMethod,
      provider: paymentData.provider,
      phone_number: paymentData.phoneNumber,
      customer_name: paymentData.customerName
    });
    return response.data;
  },

  /**
   * Verify payment status
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Payment verification response
   */
  verifyPayment: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/verify`);
    return response.data;
  },

  /**
   * Get payment details
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Payment details
   */
  getPaymentDetails: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  /**
   * Get payment history for the current user
   * @param {Object} filters - Optional filters (status, date range, etc.)
   * @returns {Promise} List of payments
   */
  getPaymentHistory: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/payments?${params.toString()}`);
    return response.data;
  },

  /**
   * Get payment methods available
   * @returns {Promise} List of payment methods
   */
  getPaymentMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },

  /**
   * Request a refund for a payment
   * @param {Object} refundData - Refund request data
   * @returns {Promise} Refund request response
   */
  requestRefund: async (refundData) => {
    const response = await api.post('/payments/refund', {
      payment_id: refundData.paymentId,
      order_id: refundData.orderId,
      amount: refundData.amount,
      reason: refundData.reason
    });
    return response.data;
  },

  /**
   * Check escrow status for a payment
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Escrow status details
   */
  getEscrowStatus: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/escrow`);
    return response.data;
  },

  /**
   * Release escrow payment (for admin/system use)
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Escrow release response
   */
  releaseEscrow: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/escrow/release`);
    return response.data;
  },

  /**
   * Generate payment receipt
   * @param {string} paymentId - Payment ID
   * @returns {Promise} Receipt data
   */
  generateReceipt: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/receipt`);
    return response.data;
  },

  /**
   * Download receipt as PDF
   * @param {string} paymentId - Payment ID
   * @returns {Promise} PDF blob
   */
  downloadReceipt: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/receipt/download`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt_${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },

  /**
   * Get transaction summary for a period
   * @param {Object} period - Date range
   * @returns {Promise} Transaction summary
   */
  getTransactionSummary: async (period = {}) => {
    const params = new URLSearchParams();
    if (period.startDate) params.append('start_date', period.startDate);
    if (period.endDate) params.append('end_date', period.endDate);

    const response = await api.get(`/payments/summary?${params.toString()}`);
    return response.data;
  },

  /**
   * Process mobile money payment
   * @param {Object} momoData - Mobile money payment data
   * @returns {Promise} Payment processing response
   */
  processMobileMoneyPayment: async (momoData) => {
    const response = await api.post('/payments/mobile-money', {
      order_id: momoData.orderId,
      amount: momoData.amount,
      provider: momoData.provider,
      phone_number: momoData.phoneNumber,
      network: momoData.network
    });
    return response.data;
  },

  /**
   * Check mobile money payment status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} Payment status
   */
  checkMobileMoneyStatus: async (transactionId) => {
    const response = await api.get(`/payments/mobile-money/${transactionId}/status`);
    return response.data;
  },

  /**
   * Get wallet balance (for farmers receiving payments)
   * @returns {Promise} Wallet balance details
   */
  getWalletBalance: async () => {
    const response = await api.get('/payments/wallet/balance');
    return response.data;
  },

  /**
   * Request wallet withdrawal
   * @param {Object} withdrawalData - Withdrawal request data
   * @returns {Promise} Withdrawal request response
   */
  requestWithdrawal: async (withdrawalData) => {
    const response = await api.post('/payments/wallet/withdraw', {
      amount: withdrawalData.amount,
      payment_method: withdrawalData.paymentMethod,
      account_details: withdrawalData.accountDetails
    });
    return response.data;
  },

  /**
   * Get withdrawal history
   * @returns {Promise} List of withdrawals
   */
  getWithdrawalHistory: async () => {
    const response = await api.get('/payments/wallet/withdrawals');
    return response.data;
  }
};

export default paymentsService;