import React from 'react';
import { Link } from 'react-router-dom';
import { siteContent } from '../data/siteContent';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-bg text-muted mt-24">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="text-lg font-bold text-text hover:text-accent transition-colors">
              Digifello
            </Link>
            <p className="text-xs text-muted leading-relaxed">
              {siteContent.brand.tagline}
            </p>
            <div className="text-xs text-muted pt-2">
              Built by <span className="text-text font-medium">{siteContent.brand.ownerName}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tools" className="hover:text-text transition-colors">
                  Tools Showcase
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-text transition-colors">
                  Articles &amp; Blog
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-text transition-colors">
                  Engineering Services
                </Link>
              </li>
              <li>
                <Link to="/consultancy" className="hover:text-text transition-colors">
                  Consultancy &amp; Advisory
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-text transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* User & Requests */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text mb-3">
              Account &amp; Builds
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/tool-request" className="hover:text-text transition-colors">
                  Request a Custom Tool
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-text transition-colors">
                  Client Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-text transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-text transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text mb-3">
              Help &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/support" className="hover:text-text transition-colors">
                  Support &amp; Inquiries
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-text transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${siteContent.consultancy.contact.email}`}
                  className="hover:text-text transition-colors"
                >
                  {siteContent.consultancy.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} Digifello. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-text transition-colors">
              Privacy
            </Link>
            <Link to="/support" className="hover:text-text transition-colors">
              Support
            </Link>
            <a
              href={siteContent.consultancy.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}