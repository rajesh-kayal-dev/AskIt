import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import styles from '../assets/styles/LoginPage.module.css';
import logo from '../assets/AskIt_Logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Refs for parallax circles
  const circle1Ref = useRef<HTMLDivElement>(null);
  const circle2Ref = useRef<HTMLDivElement>(null);
  const circle3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      const circles = [
        { ref: circle1Ref, speed: 20 },
        { ref: circle2Ref, speed: 40 },
        { ref: circle3Ref, speed: 60 }
      ];

      circles.forEach(({ ref, speed }) => {
        if (ref.current) {
          ref.current.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGoogleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Redirect to backend after short delay to show spinner
    setTimeout(() => {
      window.location.href = '/api/auth/google';
    }, 800);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Animated Background Elements */}
      <div className={styles.bgGradient}></div>
      <div ref={circle1Ref} className={`${styles.bgCircle} ${styles.bgCircle1}`}></div>
      <div ref={circle2Ref} className={`${styles.bgCircle} ${styles.bgCircle2}`}></div>
      <div ref={circle3Ref} className={`${styles.bgCircle} ${styles.bgCircle3}`}></div>

      {/* Main Login Card */}
      <div className={styles.loginCard}>
        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="AskIT Logo" className={styles.logoImage} />
          <div className={styles.logoGlow}></div>
        </div>

        {/* Brand Name */}
        <h1 className={styles.brandName}>Ask<span className={styles.highlight}>IT</span></h1>

        {/* Tagline */}
        <p className={styles.tagline}>Your AI-Powered Knowledge Assistant</p>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine}></span>
          <span className={styles.dividerText}>Sign in to continue</span>
          <span className={styles.dividerLine}></span>
        </div>

        {/* Google Login Button */}
        <div className={styles.googleLoginWrapper}>
          {isLoading ? (
            <div className={styles.loadingSpinner}>
              <div className={styles.spinner}></div>
              <span>Authenticating...</span>
            </div>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className={styles.googleBtn}
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}
        </div>

        {/* Footer Text */}
        <p className={styles.footerText}>
          By continuing, you agree to our <br />
          <a href="/terms" className={styles.link}>Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>
        </p>
      </div>

      {/* Bottom Branding */}
      <div className={styles.bottomBranding}>
        <p>&copy; 2024 AskIT. Powered by AI</p>
      </div>
    </div>
  );
};

export default LoginPage;