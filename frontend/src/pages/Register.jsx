import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { usePageTitle } from '../utils/pageUtils';
import { Button, Input } from '../components/UI';
import { Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  usePageTitle('Create Account');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password rules validation
  const passwordRules = [
    { label: 'At least 8 characters long', valid: form.password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(form.password) },
    { label: 'One lowercase letter', valid: /[a-z]/.test(form.password) },
    { label: 'One special character (!@#$%^&*)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password) },
    { label: 'Passwords match', valid: Boolean(form.password && form.password === form.confirmPassword) },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGlobalError('');

    // Client-side pre-validations
    if (!form.terms) {
      setErrors((prev) => ({ ...prev, terms: 'You must accept the terms and conditions' }));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        terms: form.terms === true,
      });

      if (res.data?.success && res.data?.userId) {
        // Automatically trigger OTP email upon successful registration
        try {
          await api.post('/auth/generate-otp', { userId: res.data.userId });
        } catch {
          // VerifyOtp page handles sending manually if generate-otp fails
        }
        navigate('/verify-otp', {
          state: {
            userId: res.data.userId,
            email: form.email.trim(),
            justRegistered: true,
          },
        });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {};
        data.errors.forEach((errItem) => {
          mapped[errItem.field] = errItem.message;
        });
        setErrors(mapped);
      } else {
        setGlobalError(
          data?.message || 'Unable to register account. Please check your inputs and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Two-tone header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
          Create an account.
        </h1>
        <p className="text-muted text-sm mt-1">
          Join Digifello to comment on articles and request custom tools.
        </p>
      </div>

      <div className="space-y-6">
        {globalError && (
          <div className="p-3 mb-6 rounded-lg bg-accent-warm/10 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{globalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              name="firstName"
              type="text"
              required
              value={form.firstName}
              onChange={handleChange}
              placeholder="e.g. Alex"
              error={errors.firstName}
            />
            <Input
              label="Last name"
              name="lastName"
              type="text"
              required
              value={form.lastName}
              onChange={handleChange}
              placeholder="e.g. Chen"
              error={errors.lastName}
            />
          </div>

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

          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted hover:text-text text-xs"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Input
            label="Confirm password"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            required
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
          />

          {/* Live Password Checklist */}
          {form.password && (
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

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                className="mt-0.5 rounded border-border text-text focus:ring-text bg-surface"
              />
              <span>
                I agree to the{' '}
                <Link to="/privacy" className="text-text underline hover:decoration-text" target="_blank">
                  Privacy Policy
                </Link>{' '}
                and terms of service.
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-accent-warm mt-1.5">{errors.terms}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full !rounded-lg"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted">
          Already have an account?{' '}
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
