import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { Button, Input } from '../components/UI';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ForgotPassword() {
  usePageTitle('Forgot Password');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      // Always show neutral confirmation state to prevent account enumeration
      setSubmitted(true);
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        // Backend returns 404 if email not found; show neutral message as required by plan
        setSubmitted(true);
      } else {
        setError(
          err.response?.data?.message ||
            'Failed to dispatch reset link. Please check your network and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
          Reset password.
        </h1>
        <p className="text-muted text-sm mt-1">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="space-y-6">
        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-surface border border-border text-text flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-text">
              Check your email inbox
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              If an account exists for <strong className="text-text">{email}</strong>, we have sent a secure password reset link. The link expires in 5 minutes.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-accent-warm/10 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Account email address"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
            />

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full !rounded-lg"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          Remembered your password?{' '}
          <Link
            to="/login"
            className="text-text font-medium underline underline-offset-4 decoration-border hover:decoration-text"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
