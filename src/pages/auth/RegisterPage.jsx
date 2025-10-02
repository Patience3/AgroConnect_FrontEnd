import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthProvider';
import { Phone, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import clsx from 'clsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthContext();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    password: '',
    confirm_password: '',
    roles: [],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      value: 'buyer',
      title: 'Buyer',
      description: 'Purchase fresh products from local farmers',
      icon: '🛒',
    },
    {
      value: 'farmer',
      title: 'Farmer',
      description: 'Sell your agricultural products directly to buyers',
      icon: '🌾',
    },
    {
      value: 'officer',
      title: 'Extension Officer',
      description: 'Support and verify farmers in your area',
      icon: '👨‍🌾',
    },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRoleToggle = (role) => {
    setFormData({
      ...formData,
      roles: formData.roles.includes(role)
        ? formData.roles.filter((r) => r !== role)
        : [...formData.roles, role],
    });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.roles.length === 0) {
      setError('Please select at least one role');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      setError('');
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4 kente-pattern">
      <div className="w-full max-w-2xl animate-fade-in">
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
          <p className="text-neutral-400">Create your account</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold',
                  step >= 1
                    ? 'bg-accent-cyan text-primary-dark'
                    : 'bg-primary-light text-neutral-500'
                )}
              >
                {step > 1 ? <Check size={20} /> : '1'}
              </div>
              <span className="text-sm text-neutral-300">Basic Info</span>
            </div>
            <div className="w-16 h-0.5 bg-neutral-700"></div>
            <div className="flex items-center gap-2">
              <div
                className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center font-semibold',
                  step >= 2
                    ? 'bg-accent-cyan text-primary-dark'
                    : 'bg-primary-light text-neutral-500'
                )}
              >
                2
              </div>
              <span className="text-sm text-neutral-300">Select Role</span>
            </div>
          </div>
        </div>

        <Card>
          {error && (
            <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
              <Input
                label="Full Name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Phone Number"
                name="phone_number"
                type="tel"
                placeholder="+233501234567"
                value={formData.phone_number}
                onChange={handleChange}
                icon={Phone}
                helperText="Include country code"
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                helperText="Must be at least 8 characters"
                required
              />

              <Input
                label="Confirm Password"
                name="confirm_password"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirm_password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Button type="submit" fullWidth>
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: Role Selection */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-100">
                  Select Your Role(s)
                </h3>
                <p className="text-sm text-neutral-400 mb-4">
                  You can select multiple roles
                </p>

                <div className="space-y-3">
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleToggle(role.value)}
                      className={clsx(
                        'w-full p-4 rounded-lg border-2 transition-all text-left',
                        formData.roles.includes(role.value)
                          ? 'border-accent-cyan bg-accent-cyan/10'
                          : 'border-neutral-700 hover:border-accent-teal/50'
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{role.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-100 mb-1">
                            {role.title}
                          </h4>
                          <p className="text-sm text-neutral-400">
                            {role.description}
                          </p>
                        </div>
                        <div
                          className={clsx(
                            'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                            formData.roles.includes(role.value)
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-neutral-600'
                          )}
                        >
                          {formData.roles.includes(role.value) && (
                            <Check size={16} className="text-primary-dark" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  fullWidth
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Create Account
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent-cyan hover:text-accent-teal font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;