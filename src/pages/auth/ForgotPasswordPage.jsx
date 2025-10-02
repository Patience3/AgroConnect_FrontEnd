import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import authService from '@/services/authService';

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(identifier);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 kente-pattern">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="text-center">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Check Your Inbox</h2>
            <p className="text-neutral-400 mb-6">
              We've sent password reset instructions to {identifier}
            </p>
            <Button onClick={() => setSuccess(false)} variant="secondary" fullWidth>
              Send Again
            </Button>
            <div className="mt-4">
              <Link
                to="/login"
                className="text-sm text-accent-cyan hover:text-accent-teal"
              >
                Back to Login
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 kente-pattern">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-cyan rounded-lg flex items-center justify-center">
              <span className="text-primary-dark font-bold text-2xl">A</span>
            </div>
            <span className="text-3xl font-bold gradient-text">
              AgroConnect
            </span>
          </Link>
          <p className="text-neutral-400">Reset your password</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
          <p className="text-sm text-neutral-400 mb-6">
            Enter your phone number or email and we'll send you instructions to reset your password.
          </p>

          {error && (
            <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Phone Number or Email"
              type="text"
              placeholder="+233501234567 or email@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError('');
              }}
              icon={identifier.includes('@') ? Mail : Phone}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Send Reset Instructions
            </Button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-accent-cyan hover:text-accent-teal"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;