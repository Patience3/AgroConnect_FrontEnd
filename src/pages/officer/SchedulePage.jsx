import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatDate, formatRelativeTime } from '@/utils/helpers';
import { VISIT_STATUS, VISIT_TYPES } from '@/types';
import clsx from 'clsx';

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  
  const [visits, setVisits] = useState([
    {
      id: '1',
      farmer_name: 'John Kwame',
      farm_name: 'Green Valley Farm',
      visit_type: VISIT_TYPES.VERIFICATION,
      status: VISIT_STATUS.SCHEDULED,
      scheduled_date: '2025-10-05T10:00:00',
      location: 'Accra Central',
      notes: 'Initial farm verification visit',
    },
    {
      id: '2',
      farmer_name: 'Mary Mensah',
      farm_name: 'Organic Harvest',
      visit_type: VISIT_TYPES.ADVISORY,
      status: VISIT_STATUS.SCHEDULED,
      scheduled_date: '2025-10-05T14:00:00',
      location: 'Kumasi',
      notes: 'Consultation on organic certification',
    },
    {
      id: '3',
      farmer_name: 'David Osei',
      farm_name: 'Fresh Fields',
      visit_type: VISIT_TYPES.INSPECTION,
      status: VISIT_STATUS.COMPLETED,
      scheduled_date: '2025-10-03T09:00:00',
      location: 'Takoradi',
      notes: 'Quality inspection completed successfully',
    },
  ]);

  const [formData, setFormData] = useState({
    farmer_id: '',
    visit_type: VISIT_TYPES.ADVISORY,
    scheduled_date: '',
    location: '',
    notes: '',
  });

  const getStatusBadge = (status) => {
    const badges = {
      [VISIT_STATUS.REQUESTED]: { label: 'Requested', class: 'badge-warning' },
      [VISIT_STATUS.SCHEDULED]: { label: 'Scheduled', class: 'badge-info' },
      [VISIT_STATUS.COMPLETED]: { label: 'Completed', class: 'badge-success' },
      [VISIT_STATUS.CANCELLED]: { label: 'Cancelled', class: 'badge-error' },
    };
    const badge = badges[status] || { label: status, class: 'badge' };
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

  const filteredVisits = visits.filter(visit => {
    if (filterType === 'all') return true;
    return visit.visit_type === filterType;
  });

  const handleCompleteVisit = (visitId) => {
    setVisits(visits.map(v => 
      v.id === visitId ? { ...v, status: VISIT_STATUS.COMPLETED } : v
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add visit logic
    setShowAddModal(false);
  };

  const VisitCard = ({ visit }) => (
    <Card hover>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-accent-teal/20 rounded-lg flex items-center justify-center text-2xl">
              {getVisitTypeIcon(visit.visit_type)}
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{visit.farmer_name}</h3>
              <p className="text-sm text-neutral-400">{visit.farm_name}</p>
            </div>
          </div>
          {getStatusBadge(visit.status)}
        </div>

        <div className="p-4 bg-primary-dark rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon size={16} className="text-neutral-500" />
            <span className="text-neutral-300">{formatDate(visit.scheduled_date, 'PPp')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-neutral-500" />
            <span className="text-neutral-300">{visit.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="badge-cyan text-xs capitalize">{visit.visit_type}</span>
          </div>
        </div>

        {visit.notes && (
          <p className="text-sm text-neutral-400 italic">"{visit.notes}"</p>
        )}

        <div className="flex gap-2">
          {visit.status === VISIT_STATUS.SCHEDULED && (
            <>
              <Button
                size="sm"
                icon={CheckCircle}
                onClick={() => handleCompleteVisit(visit.id)}
                fullWidth
              >
                Complete
              </Button>
              <Button size="sm" variant="secondary" icon={Edit} fullWidth>
                Edit
              </Button>
            </>
          )}
          {visit.status === VISIT_STATUS.COMPLETED && (
            <Button size="sm" variant="secondary" fullWidth>
              View Report
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Schedule</h1>
          <p className="text-neutral-400">Manage farm visits and appointments</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Schedule Visit
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterType('all')}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            filterType === 'all'
              ? 'bg-accent-cyan text-primary-dark'
              : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
          )}
        >
          All Visits
        </button>
        {Object.entries(VISIT_TYPES).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setFilterType(value)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize',
              filterType === value
                ? 'bg-accent-cyan text-primary-dark'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-cyan">
              {visits.filter(v => v.status === VISIT_STATUS.SCHEDULED).length}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Scheduled</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {visits.filter(v => v.status === VISIT_STATUS.REQUESTED).length}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Requested</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {visits.filter(v => v.status === VISIT_STATUS.COMPLETED).length}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Completed</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-500">
              {visits.length}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Total</p>
          </div>
        </Card>
      </div>

      {/* Visits List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVisits.map((visit) => (
          <VisitCard key={visit.id} visit={visit} />
        ))}
      </div>

      {/* Add Visit Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <h2 className="text-2xl font-bold mb-6">Schedule New Visit</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Farmer
                  </label>
                  <select
                    className="input"
                    value={formData.farmer_id}
                    onChange={(e) => setFormData({ ...formData, farmer_id: e.target.value })}
                    required
                  >
                    <option value="">Select farmer</option>
                    <option value="1">John Kwame - Green Valley Farm</option>
                    <option value="2">Mary Mensah - Organic Harvest</option>
                    <option value="3">David Osei - Fresh Fields</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Visit Type
                  </label>
                  <select
                    className="input"
                    value={formData.visit_type}
                    onChange={(e) => setFormData({ ...formData, visit_type: e.target.value })}
                    required
                  >
                    {Object.entries(VISIT_TYPES).map(([key, value]) => (
                      <option key={key} value={value} className="capitalize">
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Date & Time"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  required
                />

                <Input
                  label="Location"
                  type="text"
                  placeholder="Farm location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  icon={MapPin}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Visit notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowAddModal(false)}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  <Button type="submit" fullWidth>
                    Schedule Visit
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;