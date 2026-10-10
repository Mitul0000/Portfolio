import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../utils/AuthContext';
import { usePageTitle } from '../utils/pageUtils';
import { Button, Input } from '../components/UI';
import { CheckCircle2, AlertCircle, ArrowRight, Clock, ShieldCheck, DollarSign } from 'lucide-react';

export default function ToolRequest() {
  usePageTitle('Request a Custom Tool');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: user?.email || '',
    toolDescription: '',
    budget: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const budgetNum = Number(form.budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError('Please specify a valid positive budget number (USD or INR).');
      return;
    }

    if (form.toolDescription.trim().length < 20) {
      setError('Please provide a slightly more descriptive specification (at least 20 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/request/tool-request', {
        name: form.name.trim(),
        email: form.email.trim(),
        toolDescription: form.toolDescription.trim(),
        budget: budgetNum, // explicitly number per backend contract
      });

      if (res.data?.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit tool request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      
      {/* Two-tone headline */}
      <div className="max-w-2xl mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight leading-tight">
          Request custom tool engineering.
        </h1>
        <p className="text-2xl sm:text-3xl lg:text-4xl font-normal text-muted mt-2 tracking-tight">
          Tell us what problem you want solved and your target budget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="space-y-6">
            {success ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-normal text-text">
                  Tool Request Submitted Successfully
                </h2>
                <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                  Your request has been added to our queue. We evaluate feasibility and post update messages directly to your dashboard.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="primary" size="sm">
                      Go to Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSuccess(false);
                      setForm({
                        name: '',
                        email: user?.email || '',
                        toolDescription: '',
                        budget: '',
                      });
                    }}
                  >
                    Submit Another Request
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-lg bg-accent-warm/10 border border-accent-warm/40 text-accent-warm text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <Input
                  label="Your full name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Chen"
                />

                <Input
                  label="Contact email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  hint="Pre-filled with your account email address."
                />

                <div>
                  <label
                    htmlFor="toolDescription"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
                  >
                    Tool Description &amp; Scope <span className="text-accent-warm">*</span>
                  </label>
                  <textarea
                    id="toolDescription"
                    name="toolDescription"
                    required
                    rows={4}
                    value={form.toolDescription}
                    onChange={handleChange}
                    placeholder="Describe the utility you need, expected inputs, desired outputs, or third-party APIs involved..."
                    className="w-full bg-surface border border-border rounded-lg p-3.5 text-text placeholder-muted/60 text-sm focus:outline-none focus:border-text focus:ring-1 focus:ring-text/20 transition-colors resize-y"
                  />
                  <p className="text-xs text-muted mt-1.5">
                    Minimum 20 characters describing the problem to be solved.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2"
                  >
                    Target Budget (USD or equivalent) <span className="text-accent-warm">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <input
                      id="budget"
                      name="budget"
                      type="number"
                      required
                      min={1}
                      step="any"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      className="w-full bg-surface border border-border rounded-lg pl-9 pr-3.5 py-2.5 text-text placeholder-muted/60 text-sm focus:outline-none focus:border-text focus:ring-1 focus:ring-text/20 transition-colors"
                    />
                  </div>
                  <p className="text-xs text-muted mt-1.5">
                    Propose your target budget for design, implementation, and handover.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="w-full !rounded-lg"
                  >
                    {loading ? 'Submitting request...' : 'Submit Tool Request'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Informational Beside Column */}
        <div className="lg:col-span-5 space-y-8 lg:border-l lg:border-border/60 lg:pl-10">
          <div className="space-y-6">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted border-b border-border/70 pb-3">
              WHAT HAPPENS NEXT // WORKFLOW
            </h2>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text shrink-0 text-xs font-mono font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text">Review within 48h</h3>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  We evaluate architectural complexity, required APIs, and suitability against your proposed budget.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text shrink-0 text-xs font-mono font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text">Status &amp; Admin Notes</h3>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  Your request is marked as PENDING, APPROVED, or REJECTED. Any notes from the developer appear in your dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-7 h-7 rounded-full border border-border bg-surface flex items-center justify-center text-text shrink-0 text-xs font-mono font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text">Prototyping &amp; Delivery</h3>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  Once approved, development initiates and deliverables are hosted on the tools catalog or provided directly.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-start gap-3 text-xs text-muted">
            <ShieldCheck className="w-5 h-5 text-muted shrink-0 mt-0.5" />
            <p>
              All tool briefs remain confidential. We do not disclose client specifications without prior approval.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
