import api from './api';

const visitService = {
  /**
   * Request a visit from an extension officer
   * @param {Object} visitData - Visit request details
   * @returns {Promise} Visit request response
   */
  requestVisit: async (visitData) => {
    const response = await api.post('/visits/request', {
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
  },

  /**
   * Get all visit requests for the current user (farmer)
   * @param {Object} filters - Optional filters
   * @returns {Promise} List of visit requests
   */
  getMyVisits: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/visits/my-visits?${params.toString()}`);
    return response.data;
  },

  /**
   * Get assigned visits for extension officer
   * @param {Object} filters - Optional filters
   * @returns {Promise} List of assigned visits
   */
  getAssignedVisits: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await api.get(`/visits/assigned?${params.toString()}`);
    return response.data;
  },

  /**
   * Get details of a specific visit
   * @param {string} visitId - Visit ID
   * @returns {Promise} Visit details
   */
  getVisitDetails: async (visitId) => {
    const response = await api.get(`/visits/${visitId}`);
    return response.data;
  },

  /**
   * Update visit status (for extension officers)
   * @param {string} visitId - Visit ID
   * @param {Object} updateData - Status update data
   * @returns {Promise} Update response
   */
  updateVisitStatus: async (visitId, updateData) => {
    const response = await api.put(`/visits/${visitId}/status`, {
      status: updateData.status,
      notes: updateData.notes,
      scheduled_date: updateData.scheduledDate,
      scheduled_time: updateData.scheduledTime
    });
    return response.data;
  },

  /**
   * Confirm a visit (for extension officers)
   * @param {string} visitId - Visit ID
   * @param {Object} confirmationData - Confirmation details
   * @returns {Promise} Confirmation response
   */
  confirmVisit: async (visitId, confirmationData) => {
    const response = await api.post(`/visits/${visitId}/confirm`, {
      scheduled_date: confirmationData.scheduledDate,
      scheduled_time: confirmationData.scheduledTime,
      estimated_duration: confirmationData.estimatedDuration,
      officer_notes: confirmationData.officerNotes
    });
    return response.data;
  },

  /**
   * Cancel a visit request
   * @param {string} visitId - Visit ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Cancellation response
   */
  cancelVisit: async (visitId, reason) => {
    const response = await api.post(`/visits/${visitId}/cancel`, {
      cancellation_reason: reason
    });
    return response.data;
  },

  /**
   * Complete a visit and add report (for extension officers)
   * @param {string} visitId - Visit ID
   * @param {Object} reportData - Visit report data
   * @returns {Promise} Completion response
   */
  completeVisit: async (visitId, reportData) => {
    const response = await api.post(`/visits/${visitId}/complete`, {
      visit_report: reportData.report,
      findings: reportData.findings,
      recommendations: reportData.recommendations,
      follow_up_required: reportData.followUpRequired,
      follow_up_date: reportData.followUpDate,
      images: reportData.images,
      farmer_signature: reportData.farmerSignature
    });
    return response.data;
  },

  /**
   * Add notes to a visit
   * @param {string} visitId - Visit ID
   * @param {string} notes - Notes to add
   * @returns {Promise} Response
   */
  addVisitNotes: async (visitId, notes) => {
    const response = await api.post(`/visits/${visitId}/notes`, {
      notes: notes,
      timestamp: new Date().toISOString()
    });
    return response.data;
  },

  /**
   * Get visit report
   * @param {string} visitId - Visit ID
   * @returns {Promise} Visit report data
   */
  getVisitReport: async (visitId) => {
    const response = await api.get(`/visits/${visitId}/report`);
    return response.data;
  },

  /**
   * Download visit report as PDF
   * @param {string} visitId - Visit ID
   * @returns {Promise} PDF blob
   */
  downloadVisitReport: async (visitId) => {
    const response = await api.get(`/visits/${visitId}/report/download`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `visit_report_${visitId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  },

  /**
   * Get available time slots for a specific date
   * @param {string} date - Date to check
   * @param {string} officerId - Optional specific officer ID
   * @returns {Promise} Available time slots
   */
  getAvailableSlots: async (date, officerId = null) => {
    const params = new URLSearchParams();
    params.append('date', date);
    if (officerId) params.append('officer_id', officerId);

    const response = await api.get(`/visits/available-slots?${params.toString()}`);
    return response.data;
  },

  /**
   * Get list of available extension officers
   * @param {Object} filters - Optional filters (location, specialization, etc.)
   * @returns {Promise} List of officers
   */
  getAvailableOfficers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.specialization) params.append('specialization', filters.specialization);
    if (filters.date) params.append('date', filters.date);

    const response = await api.get(`/visits/officers?${params.toString()}`);
    return response.data;
  },

  /**
   * Reschedule a visit
   * @param {string} visitId - Visit ID
   * @param {Object} rescheduleData - New schedule data
   * @returns {Promise} Reschedule response
   */
  rescheduleVisit: async (visitId, rescheduleData) => {
    const response = await api.put(`/visits/${visitId}/reschedule`, {
      new_date: rescheduleData.newDate,
      new_time: rescheduleData.newTime,
      reason: rescheduleData.reason
    });
    return response.data;
  },

  /**
   * Rate a completed visit (for farmers)
   * @param {string} visitId - Visit ID
   * @param {Object} ratingData - Rating and feedback
   * @returns {Promise} Rating response
   */
  rateVisit: async (visitId, ratingData) => {
    const response = await api.post(`/visits/${visitId}/rate`, {
      rating: ratingData.rating,
      feedback: ratingData.feedback,
      service_quality: ratingData.serviceQuality,
      helpfulness: ratingData.helpfulness
    });
    return response.data;
  },

  /**
   * Get visit statistics (for officers/admin)
   * @param {Object} period - Date range
   * @returns {Promise} Visit statistics
   */
  getVisitStatistics: async (period = {}) => {
    const params = new URLSearchParams();
    if (period.startDate) params.append('start_date', period.startDate);
    if (period.endDate) params.append('end_date', period.endDate);

    const response = await api.get(`/visits/statistics?${params.toString()}`);
    return response.data;
  },

  /**
   * Request urgent visit
   * @param {Object} urgentVisitData - Urgent visit details
   * @returns {Promise} Urgent visit response
   */
  requestUrgentVisit: async (urgentVisitData) => {
    const response = await api.post('/visits/urgent', {
      issue_type: urgentVisitData.issueType,
      severity: urgentVisitData.severity,
      description: urgentVisitData.description,
      location: urgentVisitData.location,
      contact_number: urgentVisitData.contactNumber,
      images: urgentVisitData.images
    });
    return response.data;
  },

  /**
   * Get upcoming visits (next 7 days)
   * @returns {Promise} List of upcoming visits
   */
  getUpcomingVisits: async () => {
    const response = await api.get('/visits/upcoming');
    return response.data;
  },

  /**
   * Send reminder for visit
   * @param {string} visitId - Visit ID
   * @returns {Promise} Reminder response
   */
  sendVisitReminder: async (visitId) => {
    const response = await api.post(`/visits/${visitId}/remind`);
    return response.data;
  }
};

export default visitService;