import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { Button, Input } from '../components/UI';
import { CheckCircle2, AlertCircle, Check } from 'lucide-react';

export default function ResetPassword() {
  usePageTitle('Reset Password');
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    New_password: '',
    Confirm_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password rules validation
  const passwordRules = [
    { label: 'At least 8 characters long', valid: form.New_password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(form.New_password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(form.New_password) },
    { label: 'One special character', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.New_password) },
    { label: 'Passwords match', valid: Boolean(form.New_password && form.New_password === form.Confirm_password) },
  ];

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.New_password !== form.Confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (form.New_password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post(`/auth/reset-password/${id}/${token}`, {
        New_password: form.New_password,
        Confirm_password: form.Confirm_password,
      });

      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login', {
            state: { verifiedNotice: 'Password has been reset successfully. Please log in.' },
          });
        }, 2000);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 500 || status === 404) {
        setError(
          'This password reset link is invalid or has expired. Please request a fresh reset link.'
        );
      } else {
        setError(
          err.response?.data?.message ||
            'Failed to reset password. Please verify the links and requirements.'
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
          Create new password.
        </h1>
        <p className="text-muted text-sm mt-1">
          Set a secure new password for your Digifello account.
        </p>
      </div>

      <div className="space-y-6">
        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-text">
              Password updated
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Your password has been changed. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3.5 mb-6 rounded-lg bg-accent-warm/10 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {!id || !token ? (
              <div className="text-center py-6 text-sm text-muted">
                <p className="text-accent-warm mb-4">
                  Invalid password reset link parameters.
                </p>
                <Link to="/forgot-password">
                  <Button variant="primary" size="sm">
                    Request New Reset Link
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New password"
                  name="New_password"
                  type="password"
                  required
                  value={form.New_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                <Input
                  label="Confirm new password"
                  name="Confirm_password"
                  type="password"
                  required
                  value={form.Confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                {/* Password strength checklist */}
                {form.New_password && (
                  <div className="p-3.5 rounded-lg bg-surface/50 border border-border/80 space-y-1.5 text-xs text-muted">
                    <span className="font-semibold text-text block mb-1">
                      Password requirements:
                    </span>
                    {passwordRules.map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                            rule.valid
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-surface text-muted border border-border'
                          }`}
                        >
                          {rule.valid && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className={rule.valid ? 'text-text' : 'text-muted'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !form.New_password}
                    className="w-full !rounded-lg"
                  >
                    {loading ? 'Updating password...' : 'Reset Password'}
                  </Button>
                </div>
              </form>
            )}
          </>
        )}

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          Need help?{' '}
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