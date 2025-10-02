import { useState, useEffect } from 'react';
import { Download, CreditCard, CheckCircle, XCircle, Clock, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { PAYMENT_STATUS, PAYMENT_METHODS } from '@/types';
import clsx from 'clsx';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [filterStatus]);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      const mockPayments = [
        {
          id: '1',
          order_number: 'ORD-2025-00456',
          amount: 125.50,
          payment_method: PAYMENT_METHODS.MOBILE_MONEY,
          status: PAYMENT_STATUS.PAID,
          transaction_id: 'TXN-2025-789456',
          processed_at: '2025-10-01T14:30:00',
          created_at: '2025-10-01T14:25:00',
        },
        {
          id: '2',
          order_number: 'ORD-2025-00432',
          amount: 89.00,
          payment_method: PAYMENT_METHODS.CARD,
          status: PAYMENT_STATUS.PAID,
          transaction_id: 'TXN-2025-789234',
          processed_at: '2025-09-28T10:15:00',
          created_at: '2025-09-28T10:12:00',
        },
        {
          id: '3',
          order_number: 'ORD-2025-00421',
          amount: 156.75,
          payment_method: PAYMENT_METHODS.MOBILE_MONEY,
          status: PAYMENT_STATUS.PENDING,
          transaction_id: 'TXN-2025-789123',
          created_at: '2025-09-25T16:45:00',
        },
        {
          id: '4',
          order_number: 'ORD-2025-00398',
          amount: 67.50,
          payment_method: PAYMENT_METHODS.CARD,
          status: PAYMENT_STATUS.REFUNDED,
          transaction_id: 'TXN-2025-788901',
          processed_at: '2025-09-20T12:00:00',
          created_at: '2025-09-20T11:55:00',
        },
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      [PAYMENT_STATUS.PAID]: { label: 'Paid', variant: 'success' },
      [PAYMENT_STATUS.PENDING]: { label: 'Pending', variant: 'warning' },
      [PAYMENT_STATUS.PROCESSING]: { label: 'Processing', variant: 'info' },
      [PAYMENT_STATUS.FAILED]: { label: 'Failed', variant: 'error' },
      [PAYMENT_STATUS.REFUNDED]: { label: 'Refunded', variant: 'default' },
    };
    const badge = badges[status] || { label: status, variant: 'default' };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      [PAYMENT_METHODS.MOBILE_MONEY]: 'Mobile Money',
      [PAYMENT_METHODS.CARD]: 'Card Payment',
      [PAYMENT_METHODS.CASH_ON_DELIVERY]: 'Cash on Delivery',
    };
    return labels[method] || method;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return <CheckCircle className="text-success" size={20} />;
      case PAYMENT_STATUS.PENDING:
      case PAYMENT_STATUS.PROCESSING:
        return <Clock className="text-warning" size={20} />;
      case PAYMENT_STATUS.FAILED:
        return <XCircle className="text-error" size={20} />;
      default:
        return <CreditCard className="text-neutral-500" size={20} />;
    }
  };

  const handleDownloadReceipt = (paymentId) => {
    console.log('Downloading receipt for payment:', paymentId);
    // Implement download logic
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === 'all') return true;
    return payment.status === filterStatus;
  });

  const totalPaid = payments
    .filter(p => p.status === PAYMENT_STATUS.PAID)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === PAYMENT_STATUS.PENDING)
    .reduce((sum, p) => sum + p.amount, 0);

  const PaymentCard = ({ payment }) => (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {getStatusIcon(payment.status)}
            <div>
              <h3 className="font-semibold mb-1">
                Order #{payment.order_number}
              </h3>
              <p className="text-sm text-neutral-400">
                {formatDate(payment.created_at, 'PPp')}
              </p>
            </div>
          </div>
          {getStatusBadge(payment.status)}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-primary-dark rounded-lg">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Amount</p>
            <p className="price text-lg font-semibold">
              {formatCurrency(payment.amount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Payment Method</p>
            <p className="text-sm font-medium">
              {getPaymentMethodLabel(payment.payment_method)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-neutral-500 mb-1">Transaction ID</p>
            <p className="text-sm font-mono">{payment.transaction_id}</p>
          </div>
        </div>

        {/* Actions */}
        {payment.status === PAYMENT_STATUS.PAID && (
          <Button
            size="sm"
            variant="secondary"
            icon={Download}
            onClick={() => handleDownloadReceipt(payment.id)}
            fullWidth
          >
            Download Receipt
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-neutral-400">View all your transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card hover>
          <div className="text-center">
            <p className="text-sm text-neutral-400 mb-2">Total Paid</p>
            <p className="price text-3xl">{formatCurrency(totalPaid)}</p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-sm text-neutral-400 mb-2">Pending</p>
            <p className="text-3xl font-bold text-warning">
              {formatCurrency(totalPending)}
            </p>
          </div>
        </Card>
        <Card hover>
          <div className="text-center">
            <p className="text-sm text-neutral-400 mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-accent-cyan">
              {payments.length}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', PAYMENT_STATUS.PAID, PAYMENT_STATUS.PENDING, PAYMENT_STATUS.REFUNDED].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors capitalize',
              filterStatus === status
                ? 'bg-accent-cyan text-primary-dark'
                : 'bg-primary-light text-neutral-300 hover:bg-neutral-800'
            )}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Payments List */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPayments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CreditCard}
          title="No payments found"
          description="You haven't made any payments yet"
        />
      )}

      {/* Export Options */}
      {payments.length > 0 && (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Export Payment History</h3>
              <p className="text-sm text-neutral-400">
                Download your transaction records
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={Download}>
                Export CSV
              </Button>
              <Button variant="secondary" size="sm" icon={Download}>
                Export PDF
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PaymentHistoryPage;