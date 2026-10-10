import React from 'react';
import { usePageTitle } from '../utils/pageUtils';
import { Link } from 'react-router-dom';
import { siteContent } from '../data/siteContent';

export default function Privacy() {
  usePageTitle('Privacy Policy');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      <div className="space-y-3">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            LEGAL // TRANSPARENCY
          </span>
          <h1 className="text-3xl sm:text-4xl font-normal text-text tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-muted text-sm font-mono">
          Last updated: October 2026 · Digifello Architecture
        </p>
      </div>

      <div className="divide-y divide-border/60 text-sm text-text/85 leading-relaxed">
        <section className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          <div className="md:col-span-4">
            <h2 className="text-base font-normal text-text font-mono">01 // OVERVIEW</h2>
          </div>
          <div className="md:col-span-8">
            <p>
              Digifello values and respects your personal privacy. This privacy notice explains how we collect, use, and safeguard personal information when you browse our tools, read technical write-ups, submit custom tool requests, or authenticate on the platform.
            </p>
          </div>
        </section>

        <section className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4">
            <h2 className="text-base font-normal text-text font-mono">02 // DATA COLLECTED</h2>
          </div>
          <div className="md:col-span-8 space-y-3">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-text">Account Information:</strong> When you register, we collect your first name, last name, email address, and a securely hashed password.
              </li>
              <li>
                <strong className="text-text">Tool Requests:</strong> When submitting custom tool briefs, we collect your name, email, project description, and target budget.
              </li>
              <li>
                <strong className="text-text">Session Data:</strong> We issue temporary JWT access tokens and rotating refresh tokens stored locally on your device to maintain your authenticated session.
              </li>
            </ul>
          </div>
        </section>

        <section className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4">
            <h2 className="text-base font-normal text-text font-mono">03 // PURPOSE OF USE</h2>
          </div>
          <div className="md:col-span-8">
            <p>
              Your information is strictly utilized to authenticate your identity, deliver verification OTPs to your inbox, process custom tool reviews, and attribute user comments on blog articles. We never sell or rent your personal information to third-party data brokers.
            </p>
          </div>
        </section>

        <section className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4">
            <h2 className="text-base font-normal text-text font-mono">04 // DATA SECURITY</h2>
          </div>
          <div className="md:col-span-8">
            <p>
              Passwords are cryptographically hashed using salted bcrypt prior to storage. Session families are monitored for reuse attacks. Refresh tokens are rotated on each renewal.
            </p>
          </div>
        </section>

        <section className="py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4">
            <h2 className="text-base font-normal text-text font-mono">05 // CONTACT &amp; ERASURE</h2>
          </div>
          <div className="md:col-span-8">
            <p>
              If you have questions or wish to request data deletion, contact us directly at{' '}
              <a
                href={`mailto:${siteContent.consultancy.contact.email}`}
                className="text-text underline decoration-border hover:decoration-text"
              >
                {siteContent.consultancy.contact.email}
              </a>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
