import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import '../assets/styles/LoginPage.css';

/* ─── Inline SVG icon helpers ─────────────────────────────────── */
const QuoteIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="lp-quote-icon" aria-hidden="true">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="lp-social-icon" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const ChromeIcon = () => (
  <svg viewBox="0 0 24 24" className="lp-social-icon" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" className="lp-help-arrow" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" className="lp-help-arrow" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" className="lp-checkbox-checkmark" aria-hidden="true">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

/* ─── Component ───────────────────────────────────────────────── */
const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/api/auth/google';
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /* Wire up email/password auth here if needed */
  };

  return (
    <div className="lp-root">
      <div className="lp-wrapper">

        {/* ── LEFT PANEL ── */}
        <div className="lp-left">
          <div className="lp-left-bg" />
          <div className="lp-left-glow-tl" />
          <div className="lp-left-glow-br" />
          <div className="lp-grid-overlay" />

          {/* Logo */}
          <div className="lp-left-logo">
            <Link to="/" className="lp-left-logo-text">ASKIT</Link>
          </div>

          {/* Testimonial */}
          <div className="lp-left-quote">
            <QuoteIcon />
            <p className="lp-quote-text">
              "AskIT has completely transformed how our team finds answers.
              It understands context like a senior engineer and delivers
              instant, accurate responses every time."
            </p>
            <div className="lp-quote-author">
              <div className="lp-author-avatar">RK</div>
              <div>
                <p className="lp-author-name">Rajesh Kayal</p>
                <p className="lp-author-title">Founder, AskIT</p>
              </div>
            </div>
          </div>

          {/* Footer meta */}
          <div className="lp-left-footer">
            <span>AI Status: Online</span>
            <span>© {new Date().getFullYear()} AskIT</span>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lp-right">
          {/* Mobile logo */}
          <Link to="/" className="lp-mobile-logo">ASKIT</Link>

          {/* Back to Home link */}
          <Link to="/" className="lp-back-link">
            <ArrowLeftIcon />
            <span className="lp-help-label">Back to Home</span>
          </Link>

          <div className="lp-form-card">

            {/* Header */}
            <div className="lp-header">
              <h1 className="lp-title">Welcome back</h1>
              <p className="lp-subtitle">Sign in to your AskIT account and start asking smarter questions.</p>
            </div>

            {/* Form */}
            <form className="lp-form" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="lp-field">
                <label htmlFor="lp-email" className="lp-label">Email address</label>
                <input
                  id="lp-email"
                  type="email"
                  className="lp-input"
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="lp-field">
                <label htmlFor="lp-password" className="lp-label">Password</label>
                <input
                  id="lp-password"
                  type="password"
                  className="lp-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              {/* Remember / Forgot */}
              <div className="lp-actions-row">
                <label className="lp-checkbox-label">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <div className="lp-checkbox-box">
                    <CheckIcon />
                  </div>
                  <span className="lp-checkbox-text">Remember for 30 days</span>
                </label>
                <a href="#" className="lp-forgot-link">Forgot password?</a>
              </div>

              {/* Submit */}
              <button type="submit" className="lp-submit-btn">
                Sign in
              </button>
            </form>

            {/* Divider */}
            <div className="lp-divider">
              <div className="lp-divider-line" />
              <span className="lp-divider-text">Or continue with</span>
              <div className="lp-divider-line" />
            </div>

            {/* Social buttons */}
            <div className="lp-social-grid">
              {/* GitHub – coming soon, disabled */}
              <button
                type="button"
                className="lp-social-btn lp-social-btn--disabled"
                disabled
                aria-label="GitHub sign-in coming soon"
                title="GitHub login coming soon"
              >
                <GitHubIcon />
                <span className="lp-social-label">GitHub</span>
              </button>
              <button
                type="button"
                className="lp-social-btn"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                aria-label="Sign in with Google"
              >
                <ChromeIcon />
                <span className="lp-social-label">
                  {isLoading ? 'Redirecting…' : 'Google'}
                </span>
              </button>
            </div>

            {/* Footer */}
            <p className="lp-footer-text">
              New to AskIT?{' '}
              <Link to="/register" className="lp-footer-link">Create an account</Link>
            </p>

          </div>

          {/* Help link */}
          <a href="#" className="lp-help-link">
            <span className="lp-help-label">Help &amp; Support</span>
            <ArrowRightIcon />
          </a>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;