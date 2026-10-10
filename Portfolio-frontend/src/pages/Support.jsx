import React from 'react';
import { usePageTitle } from '../utils/pageUtils';
import { siteContent } from '../data/siteContent';
import { Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Support() {
  usePageTitle('Support & Help');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
      <div className="space-y-3">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            COMMUNICATIONS // ASSISTANCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-normal text-text tracking-tight">
            Help &amp; Support
          </h1>
        </div>
        <p className="text-muted text-base max-w-xl">
          Have questions about a tool, your account, or custom project requests? We are here to assist.
        </p>
      </div>

      <div className="divide-y divide-border/60">
        {/* Direct Email Channel */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
          <div className="md:col-span-4 space-y-1">
            <span className="text-xs font-mono text-muted tracking-wider block">
              CHANNEL // 01
            </span>
            <h2 className="text-xl font-normal text-text">Direct Inquiries</h2>
          </div>
          <div className="md:col-span-8 space-y-3">
            <p className="text-sm text-text/85 leading-relaxed">
              For account issues, password problems, or general technical feedback regarding any tool or pipeline.
            </p>
            <div>
              <a
                href={`mailto:${siteContent.consultancy.contact.email}`}
                className="text-xs font-mono text-text hover:underline inline-flex items-center gap-1.5 pt-1"
              >
                {siteContent.consultancy.contact.email} <ArrowRight className="w-3.5 h-3.5 text-muted" />
              </a>
            </div>
          </div>
        </div>

        {/* Consultancy & Custom Tool Channel */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 space-y-1">
            <span className="text-xs font-mono text-muted tracking-wider block">
              CHANNEL // 02
            </span>
            <h2 className="text-xl font-normal text-text">Consultancy &amp; Builds</h2>
          </div>
          <div className="md:col-span-8 space-y-3">
            <p className="text-sm text-text/85 leading-relaxed">
              Need dedicated technical scoping, bespoke agent workflows, or custom software development?
            </p>
            <div>
              <Link
                to="/consultancy"
                className="text-xs font-mono text-text hover:underline inline-flex items-center gap-1.5 pt-1"
              >
                View Consultancy Options <ArrowRight className="w-3.5 h-3.5 text-muted" />
              </Link>
            </div>
          </div>
        </div>

        {/* Working Hours */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-4 space-y-1">
            <span className="text-xs font-mono text-muted tracking-wider block">
              AVAILABILITY // SLA
            </span>
            <h2 className="text-xl font-normal text-text">Response Time</h2>
          </div>
          <div className="md:col-span-8 space-y-2">
            <p className="text-sm text-text/85 leading-relaxed">
              Inquiries are monitored between {siteContent.consultancy.contact.workingHours}. We strive to respond to all inquiries within {siteContent.consultancy.contact.replyTime.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
