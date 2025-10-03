import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Laptop,
  ArrowRight,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/helpers';
import clsx from 'clsx';


const OfficerDashboard = () => {
  const [stats] = useState({
    totalFarmers: 156,
    verifiedFarmers: 124,
    pendingVisits: 8,
    completedVisits: 45,
  });

  const [upcomingVisits] = useState([
    {
      id: '1',
      farmer_name: 'John Kwame',
      farm_name: 'Green Valley Farm',
      visit_type: 'verification',
      scheduled_date: new Date(Date.now() + 86400000).toISOString(),
      location: 'Accra Central',
    },
    {
      id: '2',
      farmer_name: 'Mary Mensah',
      farm_name: 'Organic Harvest',
      visit_type: 'advisory',
      scheduled_date: new Date(Date.now() + 172800000).toISOString(),
      location: 'Kumasi',
    },
  ]);

  const [pendingVerifications] = useState([
    {
      id: '1',
      farmer_name: 'David Osei',
      farm_name: 'Fresh Fields',
      requested_date: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '2',
      farmer_name: 'Grace Adu',
      farm_name: 'Sunset Farm',
      requested_date: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card hover className="relative overflow-hidden">
      <div
        className={clsx(
          'absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-20',
          color === 'cyan' && 'bg-accent-cyan',
          color === 'teal' && 'bg-accent-teal',
          color === 'success' && 'bg-success',
          color === 'warning' && 'bg-warning'
        )}
      />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-neutral-400 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div
            className={clsx(
              'w-12 h-12 rounded-lg flex items-center justify-center',
              color === 'cyan' && 'bg-accent-cyan/20 text-accent-cyan',
              color === 'teal' && 'bg-accent-teal/20 text-accent-teal',
              color === 'success' && 'bg-success/20 text-success',
              color === 'warning' && 'bg-warning/20 text-warning'
            )}
          >
            <Icon size={24} />
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Officer Dashboard</h1>
        <p className="text-neutral-400">Manage farmers and schedule visits</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Farmers"
          value={stats.totalFarmers}
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Verified Farmers"
          value={stats.verifiedFarmers}
          icon={CheckCircle}
          color="success"
        />
        <StatCard
          title="Pending Visits"
          value={stats.pendingVisits}
          icon={Clock}
          color="warning"
        />
        <StatCard
          title="Completed Visits"
          value={stats.completedVisits}
          icon={Award}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Visits */}
        <Card
          title="Upcoming Visits"
          headerAction={
            <Link to="/dashboard/officer/schedule">
              <Button size="sm" variant="ghost" icon={ArrowRight} iconPosition="right">
                View Schedule
              </Button>
            </Link>
          }
        >
          {upcomingVisits.length > 0 ? (
            <div className="space-y-3">
              {upcomingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold mb-1">{visit.farmer_name}</h4>
                      <p className="text-sm text-neutral-400">{visit.farm_name}</p>
                    </div>
                    <span
                      className={clsx(
                        'text-xs px-2 py-1 rounded-full capitalize',
                        visit.visit_type === 'verification' && 'badge-info',
                        visit.visit_type === 'advisory' && 'badge-success'
                      )}
                    >
                      {visit.visit_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(visit.scheduled_date)}</span>
                    </div>
                    <span>•</span>
                    <span>{visit.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">No upcoming visits</p>
          )}
        </Card>

        {/* Pending Verifications */}
        <Card
          title="Pending Verifications"
          headerAction={
            <Link to="/dashboard/officer/farmers">
              <Button size="sm" variant="ghost" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          }
        >
          {pendingVerifications.length > 0 ? (
            <div className="space-y-3">
              {pendingVerifications.map((verification) => (
                <div
                  key={verification.id}
                  className="p-4 bg-warning/10 border border-warning/30 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold mb-1">
                        {verification.farmer_name}
                      </h4>
                      <p className="text-sm text-neutral-400">
                        {verification.farm_name}
                      </p>
                    </div>
                    <Clock size={20} className="text-warning" />
                  </div>
                  <p className="text-xs text-neutral-500 mb-3">
                    Requested {formatDate(verification.requested_date)}
                  </p>
                  <Button size="sm" fullWidth>
                    Schedule Visit
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No pending verifications
            </p>
          )}
        </Card>
      </div>

            {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* View Farmers */}
          <Link to="/dashboard/officer/farmers">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <Users className="text-accent-cyan mb-3" size={32} />
              <h3 className="font-semibold mb-1">View Farmers</h3>
              <p className="text-sm text-neutral-400">Manage farmer list</p>
            </button>
          </Link>

          {/* Visit Requests */}
          <Link to="/dashboard/officer/visit-requests">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <CheckCircle className="text-accent-green mb-3" size={32} />
              <h3 className="font-semibold mb-1">Visit Requests</h3>
              <p className="text-sm text-neutral-400">Handle farm visit requests</p>
            </button>
          </Link>

          {/* Virtual Consultation */}
          <Link to="/dashboard/officer/consultation">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <Laptop className="text-accent-blue mb-3" size={32} />
              <h3 className="font-semibold mb-1">Virtual Consultation</h3>
              <p className="text-sm text-neutral-400">Assist farmers remotely</p>
            </button>
          </Link>

          {/* Schedule Visit */}
          <Link to="/dashboard/officer/schedule">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <Calendar className="text-accent-teal mb-3" size={32} />
              <h3 className="font-semibold mb-1">Schedule Visit</h3>
              <p className="text-sm text-neutral-400">Plan farm visits</p>
            </button>
          </Link>
          {/*<button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
            <CheckCircle className="text-success mb-3" size={32} />
            <h3 className="font-semibold mb-1">Verify Farmer</h3>
            <p className="text-sm text-neutral-400">Process verifications</p>
          </button>*/}


          {/* Reports */}
          <Link to="/dashboard/officer/reports">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <TrendingUp className="text-warning mb-3" size={32} />
              <h3 className="font-semibold mb-1">View Reports</h3>
              <p className="text-sm text-neutral-400">Access analytics</p>
            </button>
          </Link>
          
        </div>
      </Card>
    </div>
  );
};

export default OfficerDashboard;