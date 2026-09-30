import React, { useState } from 'react';
import { X, Mail, Lock, User, ChevronDown, LogIn, UserPlus, UserCog } from 'lucide-react';
import { USER_ROLES as CONSTANT_USER_ROLES } from '../../constants/roles';
import './AuthModal.css';

// Fallback list of all 7 SIH roles if constants file is missing or partial
const DEFAULT_USER_ROLES = [
  'Principal Investigator',
  'Study Coordinator',
  'Monitor',
  'Ethics Committee',
  'Pharmacovigilance',
  'Administration',
  'Read-only Regulator',
];

const USER_ROLES = (Array.isArray(CONSTANT_USER_ROLES) && CONSTANT_USER_ROLES.length > 0)
  ? CONSTANT_USER_ROLES
  : DEFAULT_USER_ROLES;

export default function AuthModal({ mode, onClose, onSwitchMode, onSuccess }) {
  const isLogin = mode === 'login';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(USER_ROLES[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password || !role) {
      setError('Please complete all required fields.');
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    onSuccess({
      name: isLogin ? email.split('@')[0] : name.trim(),
      email: email.trim(),
      role: (role || '').trim(),
    });
  };

  return (
    <div className="auth-overlay" onClick={onClose} role="presentation">
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <h2 id="auth-title">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
        <p className="auth-modal-sub">
          {isLogin
            ? 'Sign in to AyuDrishti with your institutional role.'
            : 'Register to access Ayurveda clinical research workflows.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <div className="auth-input-wrap">
                <User size={16} />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Dr. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="you@aiia.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                id="auth-password"
                type={isLogin ? 'password' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="auth-field">
              <label htmlFor="auth-confirm">Confirm password</label>
              <div className="auth-input-wrap">
                <Lock size={16} />
                <input
                  id="auth-confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-role">Role</label>
            <div className="auth-input-wrap">
              <UserCog size={16} />
              <select
                id="auth-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                {USER_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="auth-select-chevron" />
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary auth-submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? (
            <>
              New to AyuDrishti?
              <button type="button" onClick={() => onSwitchMode('register')}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already registered?
              <button type="button" onClick={() => onSwitchMode('login')}>
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}