import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { Button } from '../components/UI';
import { CheckCircle2, AlertCircle, RefreshCw, Mail } from 'lucide-react';

export default function VerifyOtp() {
  usePageTitle('Verify Email');
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId || '';
  const email = location.state?.email || '';
  const justRegistered = location.state?.justRegistered || false;

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [message, setMessage] = useState(
    justRegistered ? 'We sent a 6-digit verification code to your email.' : ''
  );
  const [error, setError] = useState('');
  const [isVerifiedSuccess, setIsVerifiedSuccess] = useState(false);

  const inputRefs = useRef([]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index, value) => {
    // Only accept numeric
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Single digit input
    const char = clean.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    setError('');

    // Advance focus
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const next = [...digits];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) next[i] = char;
    });
    setDigits(next);
    setError('');

    const targetIndex = Math.min(pasteData.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  const fullOtp = digits.join('');

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }
    if (!userId) {
      setError('No user ID found. Please register or log in first.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/verify-otp', {
        userId,
        otpReceiver: fullOtp,
      });

      if (res.data?.success || res.status === 200) {
        setIsVerifiedSuccess(true);
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', {
            state: { verifiedNotice: 'Your email has been verified. You may now log in.' },
          });
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid or expired verification code. Please check your email or resend.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;
    if (!userId) {
      setError('No user identifier found. Please register again.');
      return;
    }

    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/generate-otp', { userId });
      setMessage(res.data?.message || 'New 6-digit OTP code sent to your email.');
      setCooldown(30);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send new code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
          Verify your email.
        </h1>
        <p className="text-muted text-sm mt-1">
          {email ? `Enter the 6-digit code sent to ${email}` : 'Enter the 6-digit code sent to your email.'}
        </p>
      </div>

      <div className="space-y-6">
        {message && (
          <div className="p-3 mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 mb-6 rounded-lg bg-accent-warm/10 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!userId ? (
          <div className="text-center py-6 text-sm text-muted">
            <p className="mb-4">No active verification session found.</p>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Register New Account
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 Digit Input Boxes */}
            <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={isVerifiedSuccess || loading}
                  className="w-12 h-14 text-center text-xl font-mono font-semibold rounded-lg bg-surface border border-border text-text focus:outline-none focus:border-text focus:ring-1 focus:ring-text/20 transition-all disabled:opacity-50"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || fullOtp.length !== 6 || isVerifiedSuccess}
              className="w-full !rounded-lg"
            >
              {loading ? 'Verifying code...' : 'Confirm Verification Code'}
            </Button>

            {/* Resend with cooldown */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resendLoading || isVerifiedSuccess}
                className="text-xs text-muted hover:text-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : resendLoading
                  ? 'Sending...'
                  : 'Resend verification code'}
              </button>
            </div>
          </form>
        )}

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          Need to change email or switch accounts?{' '}
          <Link
            to="/login"
            className="text-text font-medium underline underline-offset-4 decoration-border hover:decoration-text"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
