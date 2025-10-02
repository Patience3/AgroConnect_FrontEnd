// visitService.js
// Service for managing extension officer visit requests and scheduling

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
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const visitService = {
  /**
   * Request a visit from an extension officer
   * @param {Object} visitData - Visit request details
   * @returns {Promise} Visit request response
   */
  requestVisit: async (visitData) => {
    try {
      const response = await apiClient.post('/visits/request', {
        visit_type: visitData.visit_type,
        preferred_date: visitData.preferred_date,
        preferred_time: visitData.preferred_time,
        purpose: visitData.purpose,
        location: visitData.location,
        special_requirements: visitData.special_requirements,
        farm_size: visitData.farm_size,
        crop_type: visitData.crop_type
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all visit requests for the current user (farmer)
   * @param {Object} filters - Optional filters
   * @returns {Promise} List of visit requests
   */
  getMyVisits: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('start_date', filters.startDate);
      if (filters.endDate) params.append('end_date', filters.endDate);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/visits/my-visits?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get assigned visits for extension officer
   * @param {Object} filters - Optional filters
   * @returns {Promise} List of assigned visits
   */
  getAssignedVisits: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.date) params.append('date', filters.date);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.get(`/visits/assigned?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get details of a specific visit
   * @param {string} visitId - Visit ID
   * @returns {Promise} Visit details
   */
  getVisitDetails: async (visitId) => {
    try {
      const response = await apiClient.get(`/visits/${visitId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update visit status (for extension officers)
   * @param {string} visitId - Visit ID
   * @param {Object} updateData - Status update data
   * @returns {Promise} Update response
   */
  updateVisitStatus: async (visitId, updateData) => {
    try {
      const response = await apiClient.put(`/visits/${visitId}/status`, {
        status: updateData.status,
        notes: updateData.notes,
        scheduled_date: updateData.scheduledDate,
        scheduled_time: updateData.scheduledTime
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Confirm a visit (for extension officers)
   * @param {string} visitId - Visit ID
   * @param {Object} confirmationData - Confirmation details
   * @returns {Promise} Confirmation response
   */
  confirmVisit: async (visitId, confirmationData) => {
    try {
      const response = await apiClient.post(`/visits/${visitId}/confirm`, {
        scheduled_date: confirmationData.scheduledDate,
        scheduled_time: confirmationData.scheduledTime,
        estimated_duration: confirmationData.estimatedDuration,
        officer_notes: confirmationData.officerNotes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cancel a visit request
   * @param {string} visitId - Visit ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Cancellation response
   */
  cancelVisit: async (visitId, reason) => {
    try {
      const response = await apiClient.post(`/visits/${visitId}/cancel`, {
        cancellation_reason: reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Complete a visit and add report (for extension officers)
   * @param {string} visitId - Visit ID
   * @param {Object} reportData - Visit report data
   * @returns {Promise} Completion response
   */
  completeVisit: async (visitId, reportData) => {
    try {
      const response = await apiClient.post(`/visits/${visitId}/complete`, {
        visit_report: reportData.report,
        findings: reportData.findings,
        recommendations: reportData.recommendations,
        follow_up_required: reportData.followUpRequired,
        follow_up_date: reportData.followUpDate,
        images: reportData.images,
        farmer_signature: reportData.farmerSignature
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Add notes to a visit
   * @param {string} visitId - Visit ID
   * @param {string} notes - Notes to add
   * @returns {Promise} Response
   */
  addVisitNotes: async (visitId, notes) => {
    try {
      const response = await apiClient.post(`/visits/${visitId}/notes`, {
        notes: notes,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get visit report
   * @param {string} visitId - Visit ID
   * @returns {Promise} Visit report data
   */
  getVisitReport: async (visitId) => {
    try {
      const response = await apiClient.get(`/visits/${visitId}/report`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Download visit report as PDF
   * @param {string} visitId - Visit ID
   * @returns {Promise} PDF blob
   */
  downloadVisitReport: async (visitId) => {
    try {
      const response = await apiClient.get(`/visits/${visitId}/report/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get available time slots for a specific date
   * @param {string} date - Date to check
   * @param {string} officerId - Optional specific officer ID
   * @returns {Promise} Available time slots
   */
  getAvailableSlots: async (date, officerId = null) => {
    try {
      const params = new URLSearchParams();
      params.append('date', date);
      if (officerId) params.append('officer_id', officerId);

      const response = await apiClient.get(`/visits/available-slots?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get list of available extension officers
   * @param {Object} filters - Optional filters (location, specialization, etc.)
   * @returns {Promise} List of officers
   */
  getAvailableOfficers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.specialization) params.append('specialization', filters.specialization);
      if (filters.date) params.append('date', filters.date);

      const response = await apiClient.get(`/visits/officers?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Reschedule a visit
   * @param {string} visitId - Visit ID
   * @param {Object} rescheduleData - New schedule data
   * @returns {Promise} Reschedule response
   */
  rescheduleVisit: async (visitId, rescheduleData) => {
    try {
      const response = await apiClient.put(`/visits/${visitId}/reschedule`, {
        new_date: rescheduleData.newDate,
        new_time: rescheduleData.newTime,
        reason: rescheduleData.reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Rate a completed visit (for farmers)
   * @param {string} visitId - Visit ID
   * @param {Object} ratingData - Rating and feedback
   * @returns {Promise} Rating response
   */
  rateVisit: async (visitId, ratingData) => {
    try {
      const response = await apiClient.post(`/visits/${visitId}/rate`, {
        rating: ratingData.rating,
        feedback: ratingData.feedback,
        service_quality: ratingData.serviceQuality,
        helpfulness: ratingData.helpfulness
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get visit statistics (for officers/admin)
   * @param {Object} period - Date range
   * @returns {Promise} Visit statistics
   */
  getVisitStatistics: async (period = {}) => {
    try {
      const params = new URLSearchParams();
      if (period.startDate) params.append('start_date', period.startDate);
      if (period.endDate) params.append('end_date', period.endDate);

      const response = await apiClient.get(`/visits/statistics?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Request urgent visit
   * @param {Object} urgentVisitData - Urgent visit details
   * @returns {Promise} Urgent visit response
   */
  requestUrgentVisit: async (urgentVisitData) => {
    try {
      const response = await apiClient.post('/visits/urgent', {
        issue_type: urgentVisitData.issueType,
        severity: urgentVisitData.severity,
        description: urgentVisitData.description,
        location: urgentVisitData.location,
        contact_number: urgentVisitData.contactNumber,
        images: urgentVisitData.images
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get upcoming visits (next 7 days)
   * @returns {Promise} List of upcoming visits
   */
  getUpcomingVisits: async () => {
    try {
      const response = await apiClient.get('/visits/upcoming');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Send reminder for visit
   * @param {string} visitId - Visit ID
   * @returns {Promise} Reminder response
   */
  sendVisitReminder: async (visitId) => {
    try {
      const response = await apiClient.post(`/visits/${visitId}/remind`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default visitService;