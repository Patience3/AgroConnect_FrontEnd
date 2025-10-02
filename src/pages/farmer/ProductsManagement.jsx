import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, MoreVertical } from 'lucide-react';
import productsService from '@/services/productsService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { PRODUCT_STATUS } from '@/types';
import clsx from 'clsx';

const ProductsManagement = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      // This would fetch the current farmer's products
      const data = await productsService.getFarmerProducts('current');
      setProducts(data.products || data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <div className="absolute right-0 mt-2 w-48 bg-primary-light border border-neutral-800 rounded-lg shadow-card z-10">
                      <button
                        onClick={() => {}}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-primary-dark flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                      <button
                        onClick={() => {}}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-primary-dark flex items-center gap-2"
                      >
                        <Edit size={16} />
                        Edit Product
                      </button>
                      <button
                        onClick={() => {}}
                        className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
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
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Product
        </Button>
      </div>

      {/* Search */}
      <Card>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </Card>

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
          <p className="text-neutral-400 mb-4">No products found</p>
          <Button onClick={() => setShowAddModal(true)}>
            Add Your First Product
          </Button>
        </Card>
      )}

      {/* Add Product Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form className="space-y-4">
              <Input
                label="Product Name"
                placeholder="e.g., Fresh Tomatoes"
                required
              />
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your product..."
                  className="input"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price per Unit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Unit of Measure
                  </label>
                  <select className="input">
                    <option value="kg">Kilogram (kg)</option>
                    <option value="gram">Gram</option>
                    <option value="liter">Liter</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                    <option value="bunch">Bunch</option>
                  </select>
                </div>
              </div>
              <Input
                label="Quantity Available"
                type="number"
                placeholder="100"
                required
              />
              
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" fullWidth>
                  Add Product
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;