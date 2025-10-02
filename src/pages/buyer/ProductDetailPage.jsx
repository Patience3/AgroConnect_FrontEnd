import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  MapPin,
  Calendar,
  Award,
  Minus,
  Plus,
  Phone,
  Star,
} from 'lucide-react';
import productsService from '@/services/productsService';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/utils/helpers';
import clsx from 'clsx';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const data = await productsService.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    const min = product?.minimum_order_quantity || 1;
    const max = product?.quantity_available || 1000;
    
    if (newQty >= min && newQty <= max) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log('Add to cart:', { product, quantity });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <Card className="text-center py-12">
        <p className="text-neutral-400 mb-4">Product not found</p>
        <Button onClick={() => navigate('/dashboard/marketplace')}>
          Back to Marketplace
        </Button>
      </Card>
    );
  }

  const images = product.images || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        icon={ArrowLeft}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <Card padding="none" className="overflow-hidden">
            <div className="aspect-square bg-neutral-800 relative">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  <span className="text-8xl">📦</span>
                </div>
              )}

              <button
                onClick={() => {}}
                className="absolute top-4 right-4 w-10 h-10 bg-primary-dark/80 rounded-full flex items-center justify-center text-neutral-300 hover:text-accent-cyan transition-colors"
              >
                <Heart size={20} />
              </button>
            </div>
          </Card>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={clsx(
                    'aspect-square rounded-lg overflow-hidden border-2 transition-colors',
                    selectedImage === idx
                      ? 'border-accent-cyan'
                      : 'border-transparent hover:border-accent-teal/50'
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.is_organic && (
                <span className="badge-success">Organic</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-400">
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{product.location || 'Local'}</span>
              </div>
              {product.quality_grade && (
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  <span className="capitalize">{product.quality_grade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price */}
          <Card>
            <div className="flex items-baseline gap-2">
              <span className="price text-4xl">
                {formatCurrency(product.price_per_unit)}
              </span>
              <span className="text-neutral-400">per {product.unit_of_measure}</span>
            </div>
            
            {product.minimum_order_quantity > 1 && (
              <p className="text-sm text-neutral-500 mt-2">
                Minimum order: {product.minimum_order_quantity} {product.unit_of_measure}
              </p>
            )}
          </Card>

          {/* Quantity Selector */}
          <Card>
            <div className="flex items-center justify-between">
              <span className="font-medium">Quantity</span>
              <div className="flex items-center gap-4">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Minus}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= (product.minimum_order_quantity || 1)}
                />
                <span className="font-mono text-xl w-12 text-center">
                  {quantity}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Plus}
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity_available}
                />
              </div>
            </div>
            
            <div className="mt-2 text-sm text-neutral-500">
              Available: {product.quantity_available} {product.unit_of_measure}
            </div>
          </Card>

          {/* Total */}
          <Card className="bg-accent-teal/10 border-accent-teal/30">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Total</span>
              <span className="price text-3xl">
                {formatCurrency(product.price_per_unit * quantity)}
              </span>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              fullWidth
              icon={ShoppingCart}
              onClick={handleAddToCart}
              size="lg"
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={Phone}
            >
              Contact
            </Button>
          </div>

          {/* Additional Info */}
          <div className="space-y-3 pt-6 border-t border-neutral-800">
            {product.harvest_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-neutral-500" />
                <span className="text-neutral-400">
                  Harvested: {formatDate(product.harvest_date)}
                </span>
              </div>
            )}
            
            {product.expiry_date && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-neutral-500" />
                <span className="text-neutral-400">
                  Best before: {formatDate(product.expiry_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-neutral-300 leading-relaxed">
            {product.description}
          </p>
        </Card>
      )}

      {/* Farmer Info */}
      <Card>
        <h2 className="text-xl font-semibold mb-4">About the Farmer</h2>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-accent-teal/20 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👨‍🌾</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">
              {product.farmer?.farm_name || 'Local Farm'}
            </h3>
            <p className="text-sm text-neutral-400 mb-3">
              {product.farmer?.farming_experience_years} years of experience
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-warning fill-warning" />
                <span className="text-sm font-medium">4.8</span>
              </div>
              <span className="text-sm text-neutral-500">(124 reviews)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;