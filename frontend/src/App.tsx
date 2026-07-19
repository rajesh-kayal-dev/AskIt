import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { ChatPage } from './pages/ChatPage';
import { LandingPage } from './pages/LandingPage';
import { useAuth } from './features/auth/hooks/useAuth';

/* ─── Page Transition Spinner ────────────────────────────────────── */
const spinnerStyles = `
@keyframes askit-spin {
  to { transform: rotate(360deg); }
}
@keyframes askit-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes askit-fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.askit-page-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  background: #0a0a0c;
  animation: askit-fade-in 0.15s ease forwards;
}
.askit-page-loader.leaving {
  animation: askit-fade-out 0.25s ease forwards;
}
.askit-spinner-svg {
  width: 48px;
  height: 48px;
  animation: askit-spin 0.75s linear infinite;
  color: #f5b8d0;
}
.askit-spinner-svg circle {
  stroke: currentColor;
  stroke-width: 4;
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: -35;
}
.askit-spinner-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(245, 184, 208, 0.5);
}
`;

const PageLoader: React.FC<{ leaving?: boolean }> = ({ leaving }) => (
  <div className={`askit-page-loader${leaving ? ' leaving' : ''}`}>
    <svg className="askit-spinner-svg" viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" />
    </svg>
    <span className="askit-spinner-label">AskIT</span>
  </div>
);

/**
 * PageTransition — listens for route changes, shows a 1-second spinner
 * on every navigation so the experience feels intentional and smooth.
 */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const prevPath = useRef(location.pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (location.pathname === prevPath.current) return;

    // Skip transition spinner if navigating between / and /c/:uuid (same ChatPage view)
    const isChatPath = (p: string) => p === '/' || p.startsWith('/c/');
    if (isChatPath(location.pathname) && isChatPath(prevPath.current)) {
      prevPath.current = location.pathname;
      return;
    }

    prevPath.current = location.pathname;

    // Clear any in-progress timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setLeaving(false);
    setLoading(true);

    // After 0.85 s start fade-out animation (0.25 s), then unmount
    timerRef.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => setLoading(false), 260);
    }, 850);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  return (
    <>
      {loading && <PageLoader leaving={leaving} />}
      {children}
    </>
  );
};

/* ─── SmartHome ──────────────────────────────────────────────────── */
const SmartHome: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0a0a0c',
      }}>
        <svg className="askit-spinner-svg" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" />
        </svg>
      </div>
    );
  }

  return isAuthenticated ? <ChatPage /> : <LandingPage />;
};

/* ─── ProtectedChatPage ───────────────────────────────────────────── */
const ProtectedChatPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a0c' }}>
        <svg className="askit-spinner-svg" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" />
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <ChatPage />;
};

/* ─── App ────────────────────────────────────────────────────────── */
const App: React.FC = () => {
  return (
    <>
      {/* Inject spinner keyframes once */}
      <style>{spinnerStyles}</style>

      <PageTransition>
        <Routes>
          <Route path="/"              element={<SmartHome />} />
          <Route path="/c/:uuid"       element={<ProtectedChatPage />} />
          <Route path="/chat"          element={<Navigate to="/" replace />} />
          <Route path="/chat/:uuid"    element={<Navigate to="/c/:uuid" replace />} />
          <Route path="/login"         element={<LoginPage />} />
          <Route path="/register"      element={<RegisterPage />} />
          <Route path="*"              element={<Navigate to="/login" replace />} />
        </Routes>
      </PageTransition>
    </>
  );
};

export default App;