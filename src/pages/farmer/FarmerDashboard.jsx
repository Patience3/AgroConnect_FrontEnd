import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  AlertCircle,
  Users,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatNumber } from '@/utils/helpers';
import clsx from 'clsx';

const FarmerDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 12450.50,
    totalOrders: 87,
    activeProducts: 23,
    averageRating: 4.8,
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: '1',
      order_number: 'ORD-2025-00456',
      buyer_name: 'John Doe',
      total_amount: 125.50,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      order_number: 'ORD-2025-00455',
      buyer_name: 'Jane Smith',
      total_amount: 89.00,
      status: 'confirmed',
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [lowStockProducts, setLowStockProducts] = useState([
    { id: '1', name: 'Fresh Tomatoes', quantity: 5, unit: 'kg' },
    { id: '2', name: 'Organic Spinach', quantity: 3, unit: 'kg' },
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
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
        {trend && (
          <div className="flex items-center gap-1 text-sm text-success">
            <TrendingUp size={16} />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Farmer Dashboard</h1>
        <p className="text-neutral-400">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          color="cyan"
          trend="+12% this month"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats.totalOrders)}
          icon={ShoppingBag}
          color="teal"
          trend="+8 new"
        />
        <StatCard
          title="Active Products"
          value={stats.activeProducts}
          icon={Package}
          color="success"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Users}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card
          title="Recent Orders"
          headerAction={
            <Link to="/dashboard/farmer/orders">
              <Button size="sm" variant="ghost" icon={ArrowRight} iconPosition="right">
                View All
              </Button>
            </Link>
          }
        >
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors"
                >
                  <div>
                    <p className="font-medium mb-1">{order.order_number}</p>
                    <p className="text-sm text-neutral-400">{order.buyer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="price font-semibold">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <span
                      className={clsx(
                        'text-xs px-2 py-1 rounded-full',
                        order.status === 'pending' && 'badge-warning',
                        order.status === 'confirmed' && 'badge-info'
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">No recent orders</p>
          )}
        </Card>

        {/* Low Stock Alert */}
        <Card
          title="Low Stock Alert"
          headerAction={
            <Link to="/dashboard/farmer/products">
              <Button size="sm" variant="ghost" icon={ArrowRight} iconPosition="right">
                Manage
              </Button>
            </Link>
          }
        >
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-warning/10 border border-warning/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle size={20} className="text-warning" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-neutral-400">
                        Only {product.quantity} {product.unit} remaining
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Restock</Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              All products well stocked
            </p>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/dashboard/farmer/products?action=add">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <Package className="text-accent-cyan mb-3" size={32} />
              <h3 className="font-semibold mb-1">Add Product</h3>
              <p className="text-sm text-neutral-400">List new products</p>
            </button>
          </Link>

          <Link to="/dashboard/farmer/orders">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <ShoppingBag className="text-accent-teal mb-3" size={32} />
              <h3 className="font-semibold mb-1">View Orders</h3>
              <p className="text-sm text-neutral-400">Manage orders</p>
            </button>
          </Link>

          <Link to="/dashboard/farmer/products">
            <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
              <TrendingUp className="text-success mb-3" size={32} />
              <h3 className="font-semibold mb-1">Inventory</h3>
              <p className="text-sm text-neutral-400">Manage stock</p>
            </button>
          </Link>

          <button className="w-full p-6 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left">
            <Users className="text-warning mb-3" size={32} />
            <h3 className="font-semibold mb-1">Request Visit</h3>
            <p className="text-sm text-neutral-400">Get support</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default FarmerDashboard;