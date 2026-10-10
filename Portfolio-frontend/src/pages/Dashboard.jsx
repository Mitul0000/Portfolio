import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../utils/AuthContext';
import { usePageTitle } from '../utils/pageUtils';
import { Badge, Button, Spinner, EmptyState, ErrorState } from '../components/UI';
import { PlusCircle, LogOut, Calendar, MessageSquare, DollarSign, Clock, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  usePageTitle('My Requests');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/request/get-requests');
      setRequests(res.data?.requests || []);
    } catch (err) {
      setError('Unable to fetch your tool requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      
      {/* Header and User Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6 mb-10">
        <div>
          <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-1">
            Client Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-normal text-text tracking-tight">
            My Tool Requests
          </h1>
          <p className="text-xs text-muted mt-1">
            Logged in as <strong className="text-text font-medium">{user?.email || 'User'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/tool-request">
            <Button variant="primary" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" /> New Tool Request
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLogout}
            title="Log out of account"
          >
            <LogOut className="w-4 h-4 mr-1.5 text-accent-warm" /> Logout
          </Button>
        </div>
      </div>

      {/* Requests List Area */}
      {loading ? (
        <div className="py-24 text-center">
          <Spinner size="lg" />
          <p className="text-xs text-muted mt-3">Fetching your requests...</p>
        </div>
      ) : error ? (
        <ErrorState
          title="Could not load requests"
          message={error}
          onRetry={fetchRequests}
        />
      ) : requests.length === 0 ? (
        <EmptyState
          title="No tool requests yet"
          description="You haven't submitted any custom tool requests. Have an automation idea or specialized utility you need built?"
          action={
            <Link to="/tool-request">
              <Button variant="primary" size="sm">
                Submit Your First Request
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-muted pb-3 border-b border-border/70">
            <span>SHOWING {requests.length} SUBMITTED {requests.length === 1 ? 'REQUEST' : 'REQUESTS'}</span>
            <button
              onClick={fetchRequests}
              className="hover:text-text inline-flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="divide-y divide-border/60">
            {requests.map((req) => (
              <div
                key={req._id}
                className="py-8 space-y-4"
              >
                {/* Header: Status + Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        req.status === 'APPROVED'
                          ? 'approved'
                          : req.status === 'REJECTED'
                          ? 'rejected'
                          : 'pending'
                      }
                    >
                      {req.status}
                    </Badge>
                    <span className="text-xs text-muted font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Recently'}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-medium text-text flex items-center gap-1.5">
                    <span className="text-muted">Target Budget:</span>
                    <span className="text-text font-semibold">${req.budget}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted mb-1.5">
                    SPECIFICATION
                  </h3>
                  <p className="text-sm text-text/90 leading-relaxed whitespace-pre-wrap">
                    {req.toolDescription}
                  </p>
                </div>

                {/* Admin Note Box */}
                <div className="p-3.5 bg-surface/50 border border-border/80 flex items-start gap-2.5 text-xs">
                  <MessageSquare className="w-4 h-4 text-muted shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-text font-mono">Developer Note:</span>
                    <p className="text-muted leading-relaxed">
                      {req.adminMessage || 'No comment'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
