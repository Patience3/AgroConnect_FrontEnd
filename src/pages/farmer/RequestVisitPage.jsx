// src/pages/farmer/RequestVisitPage.jsx
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, MessageSquare, CheckCircle, AlertCircle, User } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import visitService from '@/services/visitService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Alert from '@/components/ui/Alert';
import useNotifications from '@/hooks/useNotifications';
import { formatDate } from '@/utils/helpers';
import { VISIT_TYPES, VISIT_STATUS } from '@/types';

const RequestVisitPage = () => {
  const { user } = useAuthContext();
  const { success, error: showError } = useNotifications();

  const [formData, setFormData] = useState({
    visit_type: VISIT_TYPES.ADVISORY,
    preferred_date: '',
    preferred_time: 'morning',
    purpose: '',
    location: '',
    special_requirements: '',
  });

  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyVisits();
  }, []);

  const loadMyVisits = async () => {
    try {
      setIsLoading(true);
      const data = await visitService.getMyVisits();
      setVisits(data.visits || data);
    } catch (err) {
      console.error('Error loading visits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.preferred_date) {
      setError('Please select a preferred date');
      return;
    }

    if (!formData.purpose.trim()) {
      setError('Please describe the purpose of your visit');
      return;
    }

    if (!formData.location.trim()) {
      setError('Please provide your farm location');
      return;
    }

    setIsSubmitting(true);

    try {
      await visitService.requestVisit(formData);
      success('Success', 'Visit request submitted successfully!');
      
      // Reset form
      setFormData({
        visit_type: VISIT_TYPES.ADVISORY,
        preferred_date: '',
        preferred_time: 'morning',
        purpose: '',
        location: '',
        special_requirements: '',
      });

      // Reload visits
      loadMyVisits();
    } catch (err) {
      showError('Error', err.message || 'Failed to submit visit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      [VISIT_STATUS.REQUESTED]: { label: 'Pending', variant: 'warning', icon: Clock },
      [VISIT_STATUS.SCHEDULED]: { label: 'Scheduled', variant: 'info', icon: CheckCircle },
      [VISIT_STATUS.COMPLETED]: { label: 'Completed', variant: 'success', icon: CheckCircle },
      [VISIT_STATUS.CANCELLED]: { label: 'Cancelled', variant: 'error', icon: AlertCircle },
    };

    const badge = badges[status] || badges[VISIT_STATUS.REQUESTED];
    const Icon = badge.icon;

    return (
      <Badge variant={badge.variant}>
        <Icon size={12} className="mr-1" />
        {badge.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <LoadingScreen message="Loading visit requests..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Request Extension Officer Visit</h1>
        <p className="text-neutral-400">
          Schedule a visit from an agricultural extension officer for expert guidance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">New Visit Request</h2>

          {error && (
            <Alert variant="error" onClose={() => setError('')} className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Visit Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Visit Type
              </label>
              <select
                name="visit_type"
                value={formData.visit_type}
                onChange={handleInputChange}
                required
                className="input"
              >
                {Object.entries(VISIT_TYPES).map(([key, value]) => (
                  <option key={key} value={value} className="capitalize">
                    {value.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Date */}
            <Input
              label="Preferred Date"
              name="preferred_date"
              type="date"
              value={formData.preferred_date}
              onChange={handleInputChange}
              icon={Calendar}
              required
              min={new Date().toISOString().split('T')[0]}
            />

            {/* Preferred Time */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Preferred Time
              </label>
              <select
                name="preferred_time"
                value={formData.preferred_time}
                onChange={handleInputChange}
                required
                className="input"
              >
                <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                <option value="evening">Evening (4:00 PM - 6:00 PM)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Location/Farm Address
              </label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                rows="2"
                placeholder="Enter your farm address or location details"
                className="input"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Purpose of Visit
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                rows="3"
                placeholder="Describe what you need help with..."
                className="input"
              />
            </div>

            {/* Special Requirements */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Special Requirements (Optional)
              </label>
              <textarea
                name="special_requirements"
                value={formData.special_requirements}
                onChange={handleInputChange}
                rows="2"
                placeholder="Any specific requirements or preparations needed"
                className="input"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit Visit Request
            </Button>
          </form>
        </Card>

        {/* Visit History */}
        <Card>
          <h2 className="text-xl font-semibold mb-6">Your Visit Requests</h2>

          {visits.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
              <p className="text-neutral-500">No visit requests yet</p>
              <p className="text-sm text-neutral-400 mt-2">
                Submit your first request using the form
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {visits.map((visit) => (
                <Card key={visit.id} hover padding="sm">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold capitalize">
                          {visit.visit_type.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                          {visit.purpose}
                        </p>
                      </div>
                      {getStatusBadge(visit.status)}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Calendar size={14} />
                        <span>{formatDate(visit.preferred_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Clock size={14} />
                        <span className="capitalize">{visit.preferred_time}</span>
                      </div>
                      {visit.officer_name && (
                        <div className="flex items-center gap-2 text-neutral-400">
                          <User size={14} />
                          <span>Officer: {visit.officer_name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-neutral-400">
                        <MapPin size={14} />
                        <span className="line-clamp-1">{visit.location}</span>
                      </div>
                    </div>

                    {/* Officer Notes */}
                    {visit.officer_notes && (
                      <div className="p-3 bg-accent-teal/10 border border-accent-teal/30 rounded-lg">
                        <p className="text-xs font-semibold text-accent-cyan mb-1">
                          Officer Notes:
                        </p>
                        <p className="text-sm text-neutral-300">{visit.officer_notes}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RequestVisitPage;