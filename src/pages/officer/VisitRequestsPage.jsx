import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Calendar, Phone, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatDate, formatRelativeTime } from '@/utils/helpers';
import { VISIT_TYPES } from '@/types';
import clsx from 'clsx';

const VisitRequestsPage = () => {
  const [requests, setRequests] = useState([
    {
      id: '1',
      farmer_name: 'John Kwame',
      farm_name: 'Green Valley Farm',
      phone_number: '+233501234567',
      visit_type: VISIT_TYPES.VERIFICATION,
      reason: 'Need initial farm verification to start selling on the platform',
      preferred_date: '2025-10-10T10:00:00',
      location: 'Accra Central',
      urgency: 'high',
      requested_at: new Date(Date.now() - 172800000).toISOString(),
      status: 'pending',
    },
    {
      id: '2',
      farmer_name: 'Mary Mensah',
      farm_name: 'Organic Harvest',
      phone_number: '+233507654321',
      visit_type: VISIT_TYPES.ADVISORY,
      reason: 'Seeking advice on organic certification process',
      preferred_date: '2025-10-12T14:00:00',
      location: 'Kumasi',
      urgency: 'medium',
      requested_at: new Date(Date.now() - 86400000).toISOString(),
      status: 'pending',
    },
    {
      id: '3',
      farmer_name: 'David Osei',
      farm_name: 'Fresh Fields',
      phone_number: '+233509876543',
      visit_type: VISIT_TYPES.EMERGENCY,
      reason: 'Crop disease outbreak - urgent assistance needed',
      preferred_date: '2025-10-06T09:00:00',
      location: 'Takoradi',
      urgency: 'urgent',
      requested_at: new Date(Date.now() - 3600000).toISOString(),
      status: 'pending',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleApprove = (requestId) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'approved' } : r
    ));
  };

  const handleReject = (requestId) => {
    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' } : r
    ));
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      urgent: { label: 'Urgent', class: 'badge-error' },
      high: { label: 'High', class: 'badge-warning' },
      medium: { label: 'Medium', class: 'badge-info' },
      low: { label: 'Low', class: 'badge' },
    };
    const badge = badges[urgency] || badges.medium;
    return <span className={badge.class}>{badge.label}</span>;
  };

  const getVisitTypeIcon = (type) => {
    switch (type) {
      case VISIT_TYPES.VERIFICATION:
        return '✓';
      case VISIT_TYPES.ADVISORY:
        return '💡';
      case VISIT_TYPES.INSPECTION:
        return '🔍';
      case VISIT_TYPES.TRAINING:
        return '📚';
      case VISIT_TYPES.EMERGENCY:
        return '🚨';
      default:
        return '📋';
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const RequestCard = ({ request }) => (
    <Card hover className={clsx(
      request.urgency === 'urgent' && 'border-2 border-error'
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-accent-teal/20 rounded-lg flex items-center justify-center text-2xl">
              {getVisitTypeIcon(request.visit_type)}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{request.farmer_name}</h3>
              <p className="text-sm text-neutral-400">{request.farm_name}</p>
            </div>
          </div>
          {getUrgencyBadge(request.urgency)}
        </div>

        {/* Visit Type */}
        <div className="flex items-center gap-2">
          <span className="badge-cyan text-xs capitalize">{request.visit_type}</span>
          <span className="text-xs text-neutral-500">
            {formatRelativeTime(request.requested_at)}
          </span>
        </div>

        {/* Details */}
        <div className="p-4 bg-primary-dark rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={16} className="text-neutral-500" />
            <span className="text-neutral-300">{request.phone_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-neutral-500" />
            <span className="text-neutral-300">
              Preferred: {formatDate(request.preferred_date, 'PPp')}
            </span>
          </div>
        </div>

        {/* Reason */}
        <div>
          <p className="text-sm font-medium text-neutral-400 mb-2">Reason:</p>
          <p className="text-sm text-neutral-300 italic">"{request.reason}"</p>
        </div>

        {/* Actions */}
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              icon={CheckCircle}
              onClick={() => handleApprove(request.id)}
              fullWidth
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              icon={XCircle}
              onClick={() => handleReject(request.id)}
              fullWidth
            >
              Reject
            </Button>
            <Button
              size="sm"
              variant="secondary"
              icon={MessageSquare}
              onClick={() => setSelectedRequest(request)}
            >
              Contact
            </Button>
          </div>
        )}

        {request.status === 'approved' && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-3 text-sm text-success">
            ✓ Approved - Schedule a visit
          </div>
        )}

        {request.status === 'rejected' && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-3 text-sm text-error">
            ✗ Request declined
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Visit Requests</h1>
        <p className="text-neutral-400">Review and respond to farmer visit requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">{pendingRequests.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Pending</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">{approvedRequests.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Approved</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-error">{rejectedRequests.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Rejected</p>
          </div>
        </Card>
      </div>

      {/* Urgent Requests Alert */}
      {requests.some(r => r.urgency === 'urgent' && r.status === 'pending') && (
        <Card className="bg-error/10 border-error/30">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-error/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock size={20} className="text-error" />
            </div>
            <div>
              <h3 className="font-semibold text-error mb-1">Urgent Requests Pending</h3>
              <p className="text-sm text-neutral-300">
                You have {requests.filter(r => r.urgency === 'urgent' && r.status === 'pending').length} urgent request(s) 
                requiring immediate attention.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingRequests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-neutral-400">No pending requests</p>
          </Card>
        )}
      </div>

      {/* Processed Requests */}
      {(approvedRequests.length > 0 || rejectedRequests.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Processed Requests</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...approvedRequests, ...rejectedRequests].map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-4">Contact Farmer</h2>
              <div className="space-y-4">
                <div className="p-4 bg-primary-dark rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedRequest.farmer_name}</h3>
                  <p className="text-sm text-neutral-400 mb-3">{selectedRequest.farm_name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-accent-cyan" />
                    <a
                      href={`tel:${selectedRequest.phone_number}`}
                      className="text-accent-cyan hover:text-accent-teal"
                    >
                      {selectedRequest.phone_number}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Send Message
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Type your message..."
                    className="input"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedRequest(null)}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button fullWidth>
                    Send Message
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitRequestsPage;