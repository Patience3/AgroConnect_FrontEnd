import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, MoreVertical } from 'lucide-react';
import productsService from '@/services/productsService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { PRODUCT_STATUS } from '@/types';
import clsx from 'clsx';

const ProductsManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getFarmerProducts('current');
      setProducts(data.products || data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productsService.deleteProduct(productId);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    // Filter by search term
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    let matchesStatus = true;
    if (filterStatus === 'available') {
      matchesStatus = product.status === PRODUCT_STATUS.AVAILABLE;
    } else if (filterStatus === 'out_of_stock') {
      matchesStatus = product.status === PRODUCT_STATUS.OUT_OF_STOCK;
    } else if (filterStatus === 'discontinued') {
      matchesStatus = product.status === PRODUCT_STATUS.DISCONTINUED;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const badges = {
      [PRODUCT_STATUS.AVAILABLE]: { label: 'Available', class: 'badge-success' },
      [PRODUCT_STATUS.OUT_OF_STOCK]: { label: 'Out of Stock', class: 'badge-error' },
      [PRODUCT_STATUS.DISCONTINUED]: { label: 'Discontinued', class: 'badge' },
    };

    const badge = badges[status] || { label: status, class: 'badge' };
    return <span className={badge.class}>{badge.label}</span>;
  };

  const ProductRow = ({ product }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="card hover:bg-neutral-900 transition-colors">
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 rounded-lg bg-neutral-800 flex-shrink-0 overflow-hidden">
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                <span className="text-2xl">📦</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-neutral-400 mb-2 line-clamp-1">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-neutral-500">
                    Stock: <span className="font-mono text-accent-cyan">
                      {product.quantity_available} {product.unit_of_measure}
                    </span>
                  </span>
                  <span className="text-neutral-700">•</span>
                  <span className="price">
                    {formatCurrency(product.price_per_unit)}/{product.unit_of_measure}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(product.status)}
                
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-accent-cyan transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showActions && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowActions(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-primary-light border border-neutral-800 rounded-lg shadow-card z-20">
                        <button
                          onClick={() => {
                            navigate(`/dashboard/product/${product.id}`);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-primary-dark flex items-center gap-2"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            navigate(`/dashboard/farmer/products/${product.id}/edit`);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-primary-dark flex items-center gap-2"
                        >
                          <Edit size={16} />
                          Edit Product
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteProduct(product.id);
                            setShowActions(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Management</h1>
          <p className="text-neutral-400">Manage your product listings</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/dashboard/farmer/products/new')}>
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="discontinued">Discontinued</option>
        </select>
      </div>

      {/* Products List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={40} className="text-neutral-600" />
          </div>
          <p className="text-neutral-400 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'No products match your filters' 
              : 'No products found'}
          </p>
          <Button onClick={() => navigate('/dashboard/farmer/products/new')}>
            Add Your First Product
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProductsManagement;