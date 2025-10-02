import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthProvider';
import { Phone, Lock, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({
    phone_number: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid phone number or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 kente-pattern">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-cyan rounded-lg flex items-center justify-center">
              <span className="text-primary-dark font-bold text-2xl">A</span>
            </div>
            <span className="text-3xl font-bold gradient-text">
              AgroConnect
            </span>
          </Link>
          <p className="text-neutral-400">Sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <Input
              label="Phone Number"
              name="phone_number"
              type="tel"
              placeholder="+233501234567"
              value={formData.phone_number}
              onChange={handleChange}
              icon={Phone}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-700 bg-primary-light text-accent-cyan focus:ring-accent-teal"
                />
                <span className="text-sm text-neutral-300">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-accent-cyan hover:text-accent-teal"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-sm text-neutral-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-accent-cyan hover:text-accent-teal font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;