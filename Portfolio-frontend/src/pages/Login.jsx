import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../utils/AuthContext';
import { usePageTitle } from '../utils/pageUtils';
import { Button, Input } from '../components/UI';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Login() {
  usePageTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityNotice, setSecurityNotice] = useState('');
  const [verifiedNotice, setVerifiedNotice] = useState(location.state?.verifiedNotice || '');

  // Detect 419 token reuse notice stored in sessionStorage
  useEffect(() => {
    const notice = sessionStorage.getItem('auth_notice');
    if (notice) {
      setSecurityNotice(notice);
      sessionStorage.removeItem('auth_notice');
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError('');
    setSecurityNotice('');
    setVerifiedNotice('');

    try {
      const res = await api.post('/auth/login', {
        email: form.email.trim(),
        password: form.password,
      });

      if (res.data?.success && res.data?.token) {
        login(res.data.userId, res.data.token, form.email.trim());

        // Redirect back to intended page if redirected
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect') || '/dashboard';
        navigate(redirect, { replace: true });
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      // 403: Email not verified -> forward to /verify-otp and trigger code
      if (status === 403 && data?.userId) {
        try {
          await api.post('/auth/generate-otp', { userId: data.userId });
        } catch {
          // VerifyOtp page handles manual resend if needed
        }
        navigate('/verify-otp', {
          state: {
            userId: data.userId,
            email: form.email.trim(),
            justRegistered: false,
          },
        });
        return;
      }

      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {};
        data.errors.forEach((e) => {
          mapped[e.field] = e.message;
        });
        setErrors(mapped);
      } else {
        setGlobalError(
          data?.message || 'Invalid email or password. Please try again.'
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
          Welcome back.
        </h1>
        <p className="text-muted text-sm mt-1">
          Log in to manage custom tool requests and comment on articles.
        </p>
      </div>

      <div className="space-y-6">
        {/* Security Alert (e.g. 419 token reuse) */}
        {securityNotice && (
          <div className="p-3.5 mb-6 rounded-lg bg-accent-warm/15 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Security Alert</p>
              <p className="mt-0.5">{securityNotice}</p>
            </div>
          </div>
        )}

        {/* Verification Success Notice */}
        {verifiedNotice && (
          <div className="p-3 mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{verifiedNotice}</span>
          </div>
        )}

        {/* Global Error Notice */}
        {globalError && (
          <div className="p-3 mb-6 rounded-lg bg-accent-warm/10 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="alex@example.com"
            error={errors.email}
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-muted"
              >
                Password <span className="text-accent-warm">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-muted hover:text-text underline underline-offset-4 decoration-border"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-surface border ${
                errors.password ? 'border-accent-warm ring-1 ring-accent-warm/40' : 'border-border'
              } rounded-lg px-3.5 py-2.5 text-text placeholder-muted/60 text-sm focus:outline-none focus:border-text focus:ring-1 focus:ring-text/20 transition-colors`}
            />
            {errors.password && (
              <p className="text-xs text-accent-warm mt-1.5">{errors.password}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full !rounded-lg"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </Button>
          </div>
        </form>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="text-text font-medium underline underline-offset-4 decoration-border hover:decoration-text"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
