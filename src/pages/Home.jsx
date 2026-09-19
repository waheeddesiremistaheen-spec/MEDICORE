import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import Field from '../components/Field';

export default function Home() {
  const { signup, login, session } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (session) return <Navigate to="/dashboard" replace />;

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = e => {
    e.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.');
      return;
    }
    if (mode === 'signup' && !form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (form.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const result =
      mode === 'signup'
        ? signup(form)
        : login({ email: form.email, password: form.password });

    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="home-shell">
      {/* ---- brand panel ---- */}
      <section className="home-brand">
        <div className="home-brand-inner">
          <div className="home-wordmark">MEDICORE</div>

          <h1 className="home-headline">
            Hospital management,<br />
            without the paperwork.
          </h1>

          <p className="home-sub">
            One place for your patients, doctors, appointments, and medical
            records. Runs entirely in your browser.
          </p>

          <ul className="home-features">
            <li><span>01</span> Register and search patients</li>
            <li><span>02</span> Manage doctors and availability</li>
            <li><span>03</span> Book appointments with live status</li>
            <li><span>04</span> Keep records grouped by patient</li>
          </ul>
        </div>
      </section>

      {/* ---- auth panel ---- */}
      <section className="home-auth">
        <div className="home-auth-inner">
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              className={'auth-tab' + (mode === 'signup' ? ' active' : '')}
              onClick={() => { setMode('signup'); setError(''); }}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={'auth-tab' + (mode === 'login' ? ' active' : '')}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Sign In
            </button>
          </div>

          <h2 className="auth-title">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="auth-sub">
            {mode === 'signup'
              ? 'Sign up to start managing your hospital records.'
              : 'Sign in to continue where you left off.'}
          </p>

          <form onSubmit={submit} noValidate>
            {mode === 'signup' && (
              <Field
                label="Full Name"
                name="name"
                value={form.name}
                onChange={set}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            )}

            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={set}
              placeholder="you@hospital.com"
              autoComplete="email"
            />

            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={set}
              placeholder="••••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit">
              {mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup');
                setError('');
              }}
            >
              {mode === 'signup' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}