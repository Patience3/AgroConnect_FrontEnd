import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Phone, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import authService from '@/services/authService';

const VerifyPhonePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await authService.verifyPhone(phoneNumber, otpCode);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await authService.resendOTP(phoneNumber);
      setError('');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

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
          <p className="text-neutral-400">Verify your phone number</p>
        </div>

        <Card>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="text-accent-cyan" size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Enter Verification Code</h2>
            <p className="text-sm text-neutral-400">
              We sent a code to {phoneNumber}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-primary-light border-2 border-neutral-700 rounded-lg focus:border-accent-cyan focus:outline-none transition-colors"
                />
              ))}
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              disabled={isLoading}
            >
              Verify Phone Number
            </Button>

            <div className="text-center">
              <p className="text-sm text-neutral-400 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-sm text-accent-cyan hover:text-accent-teal font-medium disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VerifyPhonePage;