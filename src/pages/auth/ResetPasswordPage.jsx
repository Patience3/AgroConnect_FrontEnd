import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import authService from '@/services/authService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { label: 'Contains number', met: /\d/.test(formData.password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = formData.password === formData.confirm_password && formData.password !== '';

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

    if (!allRequirementsMet) {
      setError('Password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword(token, formData.password);
      // Show success and redirect
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
        <Card className="text-center max-w-md">
          <AlertCircle className="text-error mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-neutral-400 mb-4">
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password">
            <Button fullWidth>Request New Link</Button>
          </Link>
        </Card>
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
          <p className="text-neutral-400">Create a new password</p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

          {error && (
            <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative">
                <Input
                  label="New Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3 p-3 bg-primary-dark rounded-lg">
                  <p className="text-xs text-neutral-400 mb-2">Password must have:</p>
                  <div className="space-y-1">
                    {passwordRequirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckCircle size={14} className="text-success" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-600" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-success' : 'text-neutral-500'}`}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Input
                label="Confirm New Password"
                name="confirm_password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={formData.confirm_password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              {formData.confirm_password && (
                <div className="mt-2 flex items-center gap-2">
                  {passwordsMatch ? (
                    <>
                      <CheckCircle size={14} className="text-success" />
                      <span className="text-xs text-success">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-error" />
                      <span className="text-xs text-error">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading || !allRequirementsMet || !passwordsMatch}
            >
              Reset Password
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

export default ResetPasswordPage;