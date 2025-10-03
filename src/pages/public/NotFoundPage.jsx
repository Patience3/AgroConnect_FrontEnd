import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 kente-pattern">
      <div className="w-full max-w-2xl animate-fade-in">
        <Card className="text-center py-12">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-accent-cyan/20 mb-4">404</div>
            <div className="w-24 h-24 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-accent-cyan" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-neutral-400 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              size="lg"
              variant="secondary"
              icon={Home}
              onClick={() => navigate('/')}
            >
              Go Home
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-neutral-800">
            <p className="text-sm text-neutral-500 mb-4">
              Looking for something specific? Try these links:
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => navigate('/dashboard/marketplace')}
                className="text-sm text-accent-cyan hover:text-accent-teal transition-colors"
              >
                Marketplace
              </button>
              <span className="text-neutral-700">•</span>
              <button
                onClick={() => navigate('/dashboard/orders')}
                className="text-sm text-accent-cyan hover:text-accent-teal transition-colors"
              >
                Orders
              </button>
              <span className="text-neutral-700">•</span>
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-accent-cyan hover:text-accent-teal transition-colors"
              >
                Login
              </button>
              <span className="text-neutral-700">•</span>
              <button
                onClick={() => navigate('/register')}
                className="text-sm text-accent-cyan hover:text-accent-teal transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotFoundPage;