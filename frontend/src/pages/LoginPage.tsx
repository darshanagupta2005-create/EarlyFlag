import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft
} from 'lucide-react';

interface LoginPageProps {
  onBackToLanding: () => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBackToLanding, onLoginSuccess }) => {
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [teacherId, setTeacherId] = useState('TCH1024');
  const [password, setPassword] = useState('earlyflag2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('EF94');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const refreshCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleDemoFill = () => {
    setTeacherId('TCH1024');
    setPassword('earlyflag2026');
    setCaptchaInput(captchaCode);
    setErrorMsg(null);
    showToast({
      type: 'info',
      title: 'Demo Credentials Loaded',
      message: 'Logged in as Dr. Priya Sharma (TCH1024)'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!teacherId.trim()) {
      setErrorMsg('Please enter your Teacher ID or College Email.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your portal password.');
      return;
    }
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setErrorMsg('Invalid verification CAPTCHA code. Please try again.');
      refreshCaptcha();
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(teacherId, password);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Welcome Back!',
          message: 'Signed into EarlyFlag Teacher Risk Portal.'
        });
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Could not connect to authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const passStrength = getPasswordStrength(newPassword);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-app)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1rem',
        position: 'relative'
      }}
    >
      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="btn btn-secondary btn-sm"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          gap: '0.4rem'
        }}
      >
        <ArrowLeft size={14} />
        <span>Back to EarlyFlag Home</span>
      </button>

      {/* Main Login Card */}
      <div
        className="ef-card animate-fade"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-surface)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-strong)'
        }}
      >
        {/* Logo & Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-light))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem auto',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)'
            }}
          >
            <ShieldAlert size={26} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            EarlyFlag Teacher Portal
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            "Identify Early. Intervene Better. Support Every Student."
          </p>
        </div>

        {/* Demo 1-Click Quick Fill Button */}
        <div
          style={{
            background: 'var(--brand-primary-soft)',
            border: '1px dashed var(--brand-primary-light)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--brand-primary-light)' }}>
              ⚡ Demo Teacher Account
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Dr. Priya Sharma (TCH1024)
            </div>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDemoFill}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            Fill Demo
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              background: 'var(--risk-high-bg)',
              border: '1px solid var(--risk-high-border)',
              color: 'var(--risk-high-text)',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem'
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Teacher ID / Email */}
          <div className="form-group">
            <label className="form-label">Teacher ID or College Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TCH1024 or priya@earlyflag.edu"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-primary-light)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '2.5rem' }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Verification CAPTCHA */}
          <div className="form-group">
            <label className="form-label">Security Verification</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.85rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'line-through'
                }}
              >
                {captchaCode}
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={refreshCaptcha}
                title="Refresh CAPTCHA"
                style={{ padding: '0.5rem' }}
              >
                <RefreshCw size={16} />
              </button>
              <input
                type="text"
                className="form-input"
                placeholder="Enter code"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                maxLength={4}
                style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}
              />
            </div>
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Keep me signed in on this workstation
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            disabled={isLoading}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={16} className="animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            🔒 Authorized Academic Staff Only • 256-Bit SSL Encrypted
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
          onClick={() => setShowForgotPassword(false)}
        >
          <div
            className="ef-card animate-fade"
            style={{ width: '100%', maxWidth: '400px', background: 'var(--bg-surface)', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Password Reset Request
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Enter your registered Teacher ID or College Email to receive a verification reset link.
            </p>

            {forgotSubmitted ? (
              <div style={{ background: 'var(--risk-low-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--risk-low-text)', textAlign: 'center' }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Reset Link Sent!</div>
                <p style={{ fontSize: '0.78rem', marginTop: '0.25rem' }}>
                  Check your inbox at <strong>{forgotEmail || 'priya.sharma@earlyflag.edu'}</strong>.
                </p>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ marginTop: '1rem', width: '100%' }}
                  onClick={() => {
                    setForgotSubmitted(false);
                    setShowForgotPassword(false);
                    setShowResetPassword(true);
                  }}
                >
                  Proceed to Reset Screen
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!forgotEmail.trim()) {
                    showToast({ type: 'error', message: 'Please provide Teacher ID or Email' });
                    return;
                  }
                  setForgotSubmitted(true);
                }}
              >
                <div className="form-group">
                  <label className="form-label">Teacher ID / Email</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="TCH1024 or email@college.edu"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForgotPassword(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reset Password Screen Simulation */}
      {showResetPassword && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem'
          }}
          onClick={() => setShowResetPassword(false)}
        >
          <div
            className="ef-card animate-fade"
            style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-surface)', padding: '1.5rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Set New Portal Password
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Please choose a strong password containing letters, numbers, and symbols.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPassword.length < 6) {
                  showToast({ type: 'error', message: 'Password must be at least 6 characters long' });
                  return;
                }
                if (newPassword !== confirmPassword) {
                  showToast({ type: 'error', message: 'Passwords do not match!' });
                  return;
                }
                showToast({ type: 'success', title: 'Password Updated', message: 'You can now sign in with your new password.' });
                setShowResetPassword(false);
              }}
            >
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {/* Strength Meter */}
                {newPassword && (
                  <div style={{ marginTop: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '3px' }}>
                      {[1, 2, 3, 4].map(step => (
                        <div
                          key={step}
                          style={{
                            flex: 1,
                            borderRadius: '2px',
                            background: step <= passStrength
                              ? passStrength > 2 ? 'var(--risk-low)' : passStrength === 2 ? 'var(--risk-med)' : 'var(--risk-high)'
                              : 'var(--border-subtle)'
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Strength: {passStrength > 2 ? 'Strong' : passStrength === 2 ? 'Moderate' : 'Weak'}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowResetPassword(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
