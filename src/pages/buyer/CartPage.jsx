import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import useCart from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/helpers';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

  const subtotal = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add some fresh products from local farmers to get started"
          action={() => navigate('/dashboard/marketplace')}
          actionLabel="Browse Marketplace"
        />
      </div>
    );
  }

  const CartItem = ({ item }) => (
    <div className="flex gap-4 p-4 bg-primary-dark rounded-lg">
      {/* Product Image */}
      <div className="w-24 h-24 rounded-lg bg-neutral-800 flex-shrink-0 overflow-hidden">
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">
            <span className="text-3xl">📦</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg mb-1 truncate">{item.name}</h3>
        <p className="text-sm text-neutral-400 mb-2 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="price text-xl">
            {formatCurrency(item.price_per_unit)}
          </span>
          <span className="text-neutral-500">per {item.unit_of_measure}</span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end gap-3">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-error hover:text-red-400 transition-colors"
        >
          <Trash2 size={20} />
        </button>

        <div className="flex items-center gap-2 bg-primary-light rounded-lg">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-accent-cyan disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={16} />
          </button>
          <span className="font-mono w-12 text-center font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            disabled={item.quantity >= (item.quantity_available || 100)}
            className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-accent-cyan disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm text-neutral-500 mb-1">Item Total</p>
          <p className="price text-lg font-bold">
            {formatCurrency(item.price_per_unit * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-neutral-400">{cartItems.length} items in your cart</p>
        </div>
        <Button variant="secondary" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card title="Order Summary" className="sticky top-6">
            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>

              {/* Delivery Fee */}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Delivery Fee</span>
                <span className="font-mono">{formatCurrency(deliveryFee)}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-neutral-800"></div>

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="price text-2xl">{formatCurrency(total)}</span>
              </div>

              {/* Checkout Button */}
              <Button
                fullWidth
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/dashboard/checkout')}
              >
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate('/dashboard/marketplace')}
              >
                Continue Shopping
              </Button>
            </div>
          </Card>

          {/* Delivery Info */}
          <Card>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Free delivery on orders over GHS 100</span>
              </div>
              <div className="flex items-center gap-2 text-info">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <span>Secure payment with escrow protection</span>
              </div>
              <div className="flex items-center gap-2 text-warning">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Fresh products delivered within 24-48 hours</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;