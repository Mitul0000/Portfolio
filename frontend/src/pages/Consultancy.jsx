import React from 'react';
import { usePageTitle } from '../utils/pageUtils';
import { siteContent } from '../data/siteContent';
import { Mail, Phone, MapPin, Clock, Calendar, ExternalLink, ArrowRight, ShieldCheck, MessageSquare, Terminal } from 'lucide-react';
import { Button } from '../components/UI';
import { Link } from 'react-router-dom';

export default function Consultancy() {
  usePageTitle('Technical Consultancy');

  const { consultancy } = siteContent;
  const { contact } = consultancy;

  const contactItems = [
    {
      icon: <Mail className="w-4 h-4 text-text" />,
      label: 'Email Inquiries',
      sublabel: contact.replyTime,
      content: (
        <a
          href={`mailto:${contact.email}`}
          className="text-sm sm:text-base font-normal text-text hover:underline underline-offset-4 decoration-border transition-colors break-all"
        >
          {contact.email}
        </a>
      ),
    },
    ...(contact.phone
      ? [
          {
            icon: <Phone className="w-4 h-4 text-text" />,
            label: 'Direct Line / WhatsApp',
            sublabel: contact.workingHours,
            content: (
              <a
                href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                className="text-sm sm:text-base font-normal text-text hover:underline underline-offset-4 decoration-border transition-colors"
              >
                {contact.phone}
              </a>
            ),
          },
        ]
      : []),
    {
      icon: <MapPin className="w-4 h-4 text-text" />,
      label: 'Location',
      sublabel: 'Available for global remote technical engagements',
      content: <span className="text-sm sm:text-base font-normal text-text">{contact.location}</span>,
    },
    {
      icon: <Clock className="w-4 h-4 text-text" />,
      label: 'Availability',
      sublabel: `Typical response ${contact.replyTime}`,
      content: <span className="text-sm sm:text-base font-normal text-text">{contact.workingHours}</span>,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* ─── Hero Headline & Overview (Open Layout) ─── */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            Advisory Channel // Private Direct Link
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-text tracking-tight leading-tight">
            Direct advisory &amp; technical consultation.
          </h1>
        </div>
        <p className="text-xl sm:text-2xl font-normal text-muted tracking-tight pt-1">
          Pragmatic engineering guidance without the hype.
        </p>
        <p className="text-muted text-sm sm:text-base leading-relaxed pt-1 max-w-2xl">
          {consultancy.overview}
        </p>
      </div>

      {/* ─── Direct Contact Grid (Open Architecture - No Card Box) ─── */}
      <div className="space-y-10">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            Communication // Direct Channels
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
            Direct contact channels.
          </h2>
        </div>

        {/* 4 Open Contact Rows */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 divide-y md:divide-y-0 divide-border/60">
          {contactItems.map((item, idx) => (
            <div key={idx} className="pt-6 md:pt-0 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl border border-border bg-surface/50 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="space-y-1 min-w-0">
                <span className="text-xs font-mono uppercase tracking-wider text-muted block">
                  {item.label}
                </span>
                <div className="pt-0.5">{item.content}</div>
                <p className="text-xs text-muted/80">{item.sublabel}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Public Code Repositories & Profiles (Inline Strip) */}
        <div className="pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-mono uppercase tracking-wider text-muted">
            Profiles &amp; Code Repositories:
          </span>
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                GitHub <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </a>
            )}
            {contact.medium && (
              <a
                href={contact.medium}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                Medium <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </a>
            )}
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                LinkedIn <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </a>
            )}
            {contact.twitter && (
              <a
                href={contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text hover:underline underline-offset-4 decoration-border inline-flex items-center gap-1.5 transition-colors"
              >
                Twitter / X <ExternalLink className="w-3.5 h-3.5 text-muted" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ─── Frequently Asked Questions (Structured Open Accordion-Style Stream - No Box) ─── */}
      <div className="space-y-10 pt-4 border-t border-border/60">
        <div className="inline-block border-b border-border/70 pb-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted block mb-1">
            Inquiries // Consultation Guidelines
          </span>
          <h2 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
            Frequently asked questions.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 divide-y md:divide-y-0 divide-border/60">
          {consultancy.faqs.map((faq, i) => (
            <div key={i} className="pt-6 md:pt-0 space-y-2">
              <span className="text-xs font-mono text-muted block">
                0{i + 1} // FAQ
              </span>
              <h3 className="text-base sm:text-lg font-medium text-text tracking-tight">
                {faq.question}
              </h3>
              <p className="text-sm text-muted leading-relaxed pt-1">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Open Centered Action Section ─── */}
      <div className="pt-6 pb-12 flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-wider text-muted block">
          Initiate Engagement
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-text tracking-tight">
          Ready to review your architecture?
        </h2>
        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-xl mx-auto">
          Send an email with your project brief or submit a custom tool proposition. We reply within 24 business hours.
        </p>
        <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
          <a href={`mailto:${contact.email}`}>
            <Button variant="primary">
              Send Direct Email <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </a>
          <Link to="/tool-request">
            <Button variant="secondary">
              Submit Tool Request
            </Button>
          </Link>
        </div>
      </div>

    </div>
  );
}
