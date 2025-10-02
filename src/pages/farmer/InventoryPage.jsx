// src/pages/farmer/InventoryPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import productsService from '@/services/productsService';
import ProductCard from '@/components/shared/ProductCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import LoadingScreen from '@/components/ui/LoadingScreen';
import EmptyState from '@/components/ui/EmptyState';
import Alert from '@/components/ui/Alert';
import useNotifications from '@/hooks/useNotifications';
import { formatCurrency } from '@/utils/helpers';
import { PRODUCT_CATEGORIES } from '@/types';
import clsx from 'clsx';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthContext();
  const { success, error: showError } = useNotifications();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    loadInventory();
    
    // Check if we should open add modal
    if (searchParams.get('action') === 'add') {
      navigate('/dashboard/farmer/products/new');
    }
  }, [searchParams]);

  const loadInventory = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const data = await productsService.getFarmerProducts(user.id);
      setProducts(data.products || data);
      calculateStats(data.products || data);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err.message || 'Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (productList) => {
    const totalProducts = productList.length;
    const totalValue = productList.reduce(
      (sum, p) => sum + p.price_per_unit * p.quantity_available,
      0
    );
    const lowStock = productList.filter((p) => p.quantity_available < 10).length;
    const expiringSoon = productList.filter((p) => {
      if (!p.expiry_date) return false;
      const daysUntilExpiry =
        (new Date(p.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry < 7;
    }).length;

    setStats({ totalProducts, totalValue, lowStock, expiringSoon });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsService.deleteProduct(productId);
      success('Success', 'Product deleted successfully');
      loadInventory();
    } catch (err) {
      showError('Error', err.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    navigate(`/dashboard/farmer/products/${product.id}/edit`);
  };

  const handleView = (product) => {
    navigate(`/dashboard/product/${product.id}`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return <LoadingScreen message="Loading inventory..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
          <p className="text-neutral-400">Manage your products and track inventory levels</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/dashboard/farmer/products/new')}>
          Add Product
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Products</p>
              <p className="text-3xl font-bold text-accent-cyan">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-cyan/20 flex items-center justify-center">
              <Package size={24} className="text-accent-cyan" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-success">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-success" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Low Stock</p>
              <p className="text-3xl font-bold text-warning">{stats.lowStock}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
              <AlertCircle size={24} className="text-warning" />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-neutral-400 mb-1">Expiring Soon</p>
              <p className="text-3xl font-bold text-error">{stats.expiringSoon}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-error/20 flex items-center justify-center">
              <AlertCircle size={24} className="text-error" />
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={20} className="text-neutral-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
                <option key={key} value={value} className="capitalize">
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-accent-cyan text-primary-dark'
                  : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
              )}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-accent-cyan text-primary-dark'
                  : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
              )}
            >
              List
            </button>
          </div>
        </div>
      </Card>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={
            searchTerm || filterCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first product to the inventory'
          }
          action={() => navigate('/dashboard/farmer/products/new')}
          actionLabel="Add Your First Product"
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;