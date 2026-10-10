import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, PlusCircle, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Apply theme class to document with transition support
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Handle outside click for user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tools', label: 'Tools' },
    { to: '/blogs', label: 'Blogs' },
    { to: '/services', label: 'Services' },
    { to: '/consultancy', label: 'Consultancy' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-bg/90 backdrop-blur-md transition-colors">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Wordmark + Small Search Button (Requirement 1) */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="text-lg font-bold tracking-tight text-text hover:opacity-85 transition-opacity flex items-center gap-1.5"
            >
              <span>Digifello</span>
            </Link>

            {/* Compact 34px round search button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="btn-icon"
              title="Search (tools & articles)"
              aria-label="Search site"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center: Main Nav Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right: Theme Toggle + Profile Button (Requirement 1 & 2) */}
          <div className="flex items-center gap-2.5">
            {/* Small 34px round theme toggle button */}
            <button
              onClick={toggleTheme}
              className="btn-icon"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Profile Avatar Button with Google One RGB rotating border on hover */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="profile-avatar-wrapper group relative w-[34px] h-[34px] rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-border transition-all active:scale-95"
                  title="Account menu"
                  aria-label="Open user menu"
                >
                  {/* Google One / Subscription 4-color RGB circular conic gradient ring */}
                  <div className="google-rgb-ring absolute inset-0 rounded-full transition-opacity duration-300 opacity-80 group-hover:opacity-100" />

                  {/* Inner Avatar Face */}
                  <div className="relative w-full h-full rounded-full bg-surface border border-border/50 flex items-center justify-center text-text font-semibold text-[11px] uppercase z-10">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-xl shadow-xl py-2 z-50 text-sm animate-fadeIn">
                    <div className="px-3.5 py-2 border-b border-border text-xs text-muted truncate font-mono">
                      {user.email || 'Logged in'}
                    </div>
                    <Link
                      to="/tool-request"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-text hover:bg-bg/80 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-text" />
                      Request a Tool
                    </Link>
                    <Link
                      to="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-text hover:bg-bg/80 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent-sun" />
                      My Requests
                    </Link>
                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-accent-warm hover:bg-bg/80 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <Link
                  to="/login"
                  className="text-muted hover:text-text underline underline-offset-4 decoration-border hover:decoration-text transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-full bg-text hover:bg-text/85 text-bg font-semibold text-xs border border-transparent transition-all shadow-sm hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn-icon"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-md px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-base font-medium py-1.5 transition-colors ${
                      isActive ? 'text-text font-semibold' : 'text-muted hover:text-text'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-border pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-muted mb-2 font-mono">{user.email}</div>
                  <Link
                    to="/tool-request"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-text hover:opacity-80 py-1"
                  >
                    Request a Tool
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm text-text hover:opacity-80 py-1"
                  >
                    My Requests
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block text-sm text-accent-warm py-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full border border-border text-text text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 rounded-full bg-text text-bg text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
