import React from 'react';
import errorMascot from '../assets/Error.webp';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const base =
    'relative overflow-hidden inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    // Primary: Color sweep gradient fill transition on hover + lift
    primary:
      'btn-pill-primary',
    // Secondary: Color tint slide-up fill transition + white border
    secondary:
      'btn-pill-secondary',
    ghost:
      'rounded-lg text-muted hover:text-text hover:bg-surface/50 transition-colors',
    link:
      'text-text underline decoration-border decoration-1 underline-offset-4 hover:decoration-text p-0 transition-colors',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${variant !== 'link' && variant !== 'ghost' ? sizes[size] : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
}

export function Input({
  label,
  id,
  error,
  hint,
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          {label} {required && <span className="text-accent-warm">*</span>}
        </label>
      )}
      <input
        id={inputId}
        required={required}
        className={`w-full bg-surface border ${
          error ? 'border-accent-warm ring-1 ring-accent-warm/40' : 'border-border hover:border-white/50'
        } rounded-lg px-3.5 py-2.5 text-text placeholder-muted/60 text-sm focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-muted mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-accent-warm mt-1.5">{error}</p>}
    </div>
  );
}

export function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    free: 'text-text border-white/40 bg-white/5',
    paid: 'text-accent-sun border-accent-sun/40 bg-accent-sun/10',
    neutral: 'text-muted border-border bg-surface/50',
    pending: 'text-accent-sun border-accent-sun/40 bg-accent-sun/10',
    approved: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    rejected: 'text-accent-warm border-accent-warm/40 bg-accent-warm/10',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border uppercase tracking-wider ${
        variants[variant] || variants.neutral
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };
  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-white border-r-white border-b-transparent border-l-transparent ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function EmptyState({ title = 'No items found', description = 'There is currently nothing to display.', action }) {
  return (
    <div className="text-center py-16 px-4 border border-dashed border-border rounded-xl bg-surface/30">
      <h3 className="text-lg font-medium text-text mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mx-auto mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Failed to load', message = 'An unexpected error occurred.', onRetry }) {
  return (
    <div className="text-center py-12 px-4 max-w-xl mx-auto space-y-5">
      <div className="flex justify-center mb-2">
        <img
          src={errorMascot}
          alt="Error character"
          className="w-56 h-56 sm:w-72 sm:h-72 object-contain select-none pointer-events-none drop-shadow-lg"
        />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-normal text-text tracking-tight">{title}</h3>
        <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            className="!px-6"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
