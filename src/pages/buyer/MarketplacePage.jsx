import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, Heart, ShoppingCart } from 'lucide-react';
import productsService from '@/services/productsService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { PRODUCT_CATEGORIES } from '@/types';
import clsx from 'clsx';

const MarketplacePage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    is_organic: false,
    min_price: '',
    max_price: '',
  });

  // 🔑 Reload products whenever filters, category, or search term change
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, filters, searchTerm]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const params = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        is_organic: filters.is_organic || undefined,
        min_price: filters.min_price || undefined,
        max_price: filters.max_price || undefined,
        search: searchTerm || undefined,
      };

      const data = await productsService.getProducts(params);
      setProducts(data.products || data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ProductCard = ({ product }) => (
    <Link to={`/dashboard/product/${product.id}`}>
      <Card hover padding="none" className="overflow-hidden h-full">
        {/* Product Image */}
        <div className="relative h-48 bg-neutral-800">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-600">
              <span className="text-4xl">📦</span>
            </div>
          )}
          
          {product.is_organic && (
            <div className="absolute top-2 right-2">
              <span className="badge-success">Organic</span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle wishlist
            }}
            className="absolute top-2 left-2 w-8 h-8 bg-primary-dark/80 rounded-full flex items-center justify-center text-neutral-300 hover:text-accent-cyan transition-colors"
          >
            <Heart size={16} />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-neutral-100 mb-1 truncate">
            {product.name}
          </h3>
          
          <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-3">
            <MapPin size={14} />
            <span>{product.location || 'Local'}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="price text-2xl">
                {formatCurrency(product.price_per_unit)}
              </p>
              <p className="text-xs text-neutral-500">per {product.unit_of_measure}</p>
            </div>
            
            <Button size="sm" icon={ShoppingCart}>
              Add
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
        <p className="text-neutral-400">
          Fresh products from local farmers
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            icon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </form>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.is_organic}
                  onChange={(e) =>
                    setFilters({ ...filters, is_organic: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-neutral-700 bg-primary-light text-accent-cyan focus:ring-accent-teal"
                />
                <span className="text-sm text-neutral-300">Organic Only</span>
              </label>

              <Input
                type="number"
                placeholder="Min Price"
                value={filters.min_price}
                onChange={(e) =>
                  setFilters({ ...filters, min_price: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Max Price"
                value={filters.max_price}
                onChange={(e) =>
                  setFilters({ ...filters, max_price: e.target.value })
                }
              />
            </div>
          </Card>
        )}

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === 'all'
                ? 'bg-accent-cyan text-primary-dark'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
            )}
          >
            All
          </button>
          {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(value)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize',
                selectedCategory === value
                  ? 'bg-accent-cyan text-primary-dark'
                  : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-neutral-800 rounded mb-4"></div>
              <div className="h-4 bg-neutral-800 rounded mb-2"></div>
              <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-neutral-400 mb-4">No products found</p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setFilters({ is_organic: false, min_price: '', max_price: '' });
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      )}
    </div>
  );
};

export default MarketplacePage;
