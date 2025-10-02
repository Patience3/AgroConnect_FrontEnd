import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/utils/helpers';
import { PAYMENT_METHODS } from '@/types';
import clsx from 'clsx';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    delivery_address: '',
    phone_number: '',
    special_instructions: '',
    payment_method: PAYMENT_METHODS.MOBILE_MONEY,
  });

  // Mock cart data
  const cartItems = [
    {
      id: '1',
      name: 'Fresh Tomatoes',
      price: 5.50,
      quantity: 10,
      unit: 'kg',
      image: null,
    },
    {
      id: '2',
      name: 'Organic Spinach',
      price: 3.00,
      quantity: 5,
      unit: 'kg',
      image: null,
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit order logic
    setStep(3);
  };

  const paymentMethods = [
    { value: PAYMENT_METHODS.MOBILE_MONEY, label: 'Mobile Money', icon: '📱' },
    { value: PAYMENT_METHODS.CARD, label: 'Card Payment', icon: '💳' },
    { value: PAYMENT_METHODS.CASH_ON_DELIVERY, label: 'Cash on Delivery', icon: '💵' },
  ];

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-success" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-neutral-400 mb-2">
            Order #ORD-2025-00123
          </p>
          <p className="text-neutral-500 mb-8">
            You'll receive a confirmation shortly
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard/orders')}>
              View Orders
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard/marketplace')}>
              Continue Shopping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-neutral-400">Complete your order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card
            title="Delivery Address"
            headerAction={
              <div className="flex items-center gap-2 text-accent-cyan">
                <MapPin size={20} />
              </div>
            }
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Address"
                name="delivery_address"
                placeholder="123 Main St, Accra"
                value={orderData.delivery_address}
                onChange={(e) =>
                  setOrderData({ ...orderData, delivery_address: e.target.value })
                }
                required
              />

              <Input
                label="Phone Number"
                name="phone_number"
                type="tel"
                placeholder="+233501234567"
                value={orderData.phone_number}
                onChange={(e) =>
                  setOrderData({ ...orderData, phone_number: e.target.value })
                }
                required
              />

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="special_instructions"
                  rows="3"
                  placeholder="Any special delivery instructions..."
                  value={orderData.special_instructions}
                  onChange={(e) =>
                    setOrderData({
                      ...orderData,
                      special_instructions: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>
            </form>
          </Card>

          {/* Payment Method */}
          <Card
            title="Payment Method"
            headerAction={
              <div className="flex items-center gap-2 text-accent-cyan">
                <CreditCard size={20} />
              </div>
            }
          >
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.value}
                  onClick={() =>
                    setOrderData({ ...orderData, payment_method: method.value })
                  }
                  className={clsx(
                    'w-full p-4 rounded-lg border-2 transition-all text-left',
                    orderData.payment_method === method.value
                      ? 'border-accent-cyan bg-accent-cyan/10'
                      : 'border-neutral-700 hover:border-accent-teal/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card
            title="Order Summary"
            headerAction={
              <div className="flex items-center gap-2 text-accent-cyan">
                <Package size={20} />
              </div>
            }
          >
            <div className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pb-3 border-b border-neutral-800 last:border-0"
                  >
                    <div className="w-16 h-16 rounded-lg bg-neutral-800 flex-shrink-0 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-neutral-500">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-sm font-mono text-accent-cyan mt-1">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-neutral-800">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Subtotal</span>
                  <span className="font-mono">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Delivery Fee</span>
                  <span className="font-mono">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-800">
                  <span>Total</span>
                  <span className="price text-2xl">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button fullWidth size="lg" onClick={handleSubmit}>
                Place Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;