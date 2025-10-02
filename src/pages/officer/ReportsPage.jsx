import { useState } from 'react';
import { Download, Filter, TrendingUp, Users, CheckCircle, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatNumber, formatDate } from '@/utils/helpers';

const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const stats = {
    total_farmers: 156,
    verified_farmers: 124,
    pending_verifications: 32,
    total_visits: 89,
    completed_visits: 67,
    scheduled_visits: 12,
    cancelled_visits: 10,
    average_rating: 4.7,
  };

  const monthlyData = [
    { month: 'Jan', visits: 12, verifications: 8 },
    { month: 'Feb', visits: 15, verifications: 10 },
    { month: 'Mar', visits: 18, verifications: 12 },
    { month: 'Apr', visits: 14, verifications: 9 },
    { month: 'May', visits: 20, verifications: 15 },
    { month: 'Jun', visits: 22, verifications: 18 },
  ];

  const topFarmers = [
    { name: 'John Kwame', farm: 'Green Valley Farm', products: 45, orders: 234, rating: 4.9 },
    { name: 'Mary Mensah', farm: 'Organic Harvest', products: 38, orders: 189, rating: 4.8 },
    { name: 'David Osei', farm: 'Fresh Fields', products: 32, orders: 156, rating: 4.7 },
    { name: 'Grace Adu', farm: 'Sunset Farm', products: 28, orders: 142, rating: 4.6 },
    { name: 'Peter Boateng', farm: 'Golden Acres', products: 25, orders: 128, rating: 4.5 },
  ];

  const recentActivities = [
    { date: '2025-10-01', activity: 'Verified Green Valley Farm', type: 'verification' },
    { date: '2025-09-28', activity: 'Completed training session at Organic Harvest', type: 'training' },
    { date: '2025-09-25', activity: 'Advisory visit to Fresh Fields', type: 'advisory' },
    { date: '2025-09-22', activity: 'Emergency inspection at Sunset Farm', type: 'emergency' },
    { date: '2025-09-20', activity: 'Quality assessment at Golden Acres', type: 'inspection' },
  ];

  const handleExportReport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
          <p className="text-neutral-400">Track performance and generate reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Filter}>
            Filter
          </Button>
          <Button icon={Download}>
            Export
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'quarter', 'year'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              selectedPeriod === period
                ? 'bg-accent-cyan text-primary-dark'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Farmers</p>
              <p className="text-3xl font-bold">{formatNumber(stats.total_farmers)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <Users className="text-accent-cyan" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <TrendingUp size={16} />
            <span>+12% this {selectedPeriod}</span>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Verified Farmers</p>
              <p className="text-3xl font-bold">{formatNumber(stats.verified_farmers)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
              <CheckCircle className="text-success" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <TrendingUp size={16} />
            <span>+8% this {selectedPeriod}</span>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Visits</p>
              <p className="text-3xl font-bold">{formatNumber(stats.total_visits)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-teal/20 flex items-center justify-center">
              <Calendar className="text-accent-teal" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <TrendingUp size={16} />
            <span>+15% this {selectedPeriod}</span>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Avg. Rating</p>
              <p className="text-3xl font-bold">{stats.average_rating}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <TrendingUp size={16} />
            <span>+0.2 this {selectedPeriod}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card title="Monthly Activity">
          <div className="space-y-4">
            {monthlyData.map((data, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-400">{data.month}</span>
                  <div className="flex gap-4">
                    <span className="text-accent-cyan">{data.visits} visits</span>
                    <span className="text-success">{data.verifications} verified</span>
                  </div>
                </div>
                <div className="flex gap-2 h-2">
                  <div
                    className="bg-accent-cyan rounded-full"
                    style={{ width: `${(data.visits / 25) * 100}%` }}
                  />
                  <div
                    className="bg-success rounded-full"
                    style={{ width: `${(data.verifications / 25) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Visit Status Breakdown */}
        <Card title="Visit Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-success/10 border border-success/30 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-success" size={24} />
                <span className="font-medium">Completed</span>
              </div>
              <span className="text-2xl font-bold text-success">{stats.completed_visits}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-info/10 border border-info/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="text-info" size={24} />
                <span className="font-medium">Scheduled</span>
              </div>
              <span className="text-2xl font-bold text-info">{stats.scheduled_visits}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-error/10 border border-error/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✗</span>
                <span className="font-medium">Cancelled</span>
              </div>
              <span className="text-2xl font-bold text-error">{stats.cancelled_visits}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Performing Farmers */}
      <Card title="Top Performing Farmers">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Rank</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Farmer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Products</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Orders</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Rating</th>
              </tr>
            </thead>
            <tbody>
              {topFarmers.map((farmer, idx) => (
                <tr key={idx} className="border-b border-neutral-800 hover:bg-neutral-900">
                  <td className="py-3 px-4">
                    <span className="font-mono text-accent-cyan">#{idx + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{farmer.name}</p>
                      <p className="text-sm text-neutral-500">{farmer.farm}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">{farmer.products}</td>
                  <td className="py-3 px-4 font-mono">{farmer.orders}</td>
                  <td className="py-3 px-4">
                    <span className="badge-success">{farmer.rating} ⭐</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card title="Recent Activities">
        <div className="space-y-3">
          {recentActivities.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-3 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <div className="w-2 h-2 bg-accent-cyan rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-neutral-300">{activity.activity}</p>
                <p className="text-xs text-neutral-500 mt-1">{formatDate(activity.date)}</p>
              </div>
              <span className="badge-cyan text-xs capitalize">{activity.type}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Options */}
      <Card title="Export Reports">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => handleExportReport('pdf')}
            fullWidth
          >
            Export as PDF
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => handleExportReport('excel')}
            fullWidth
          >
            Export as Excel
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => handleExportReport('csv')}
            fullWidth
          >
            Export as CSV
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;