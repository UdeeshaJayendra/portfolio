/**
 * ============================================================
 *  components/AuthModal.js — Admin Login Modal
 * ============================================================
 *
 * This is a simple admin-only login modal.
 * There is NO register option — only the admin (you) logs in.
 * Your account is created once via seed.js on the backend.
 *
 * Visitors see the full portfolio without logging in.
 * You log in to get admin controls (add/delete projects, etc.)
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function AuthModal({ onClose, onSuccess }) {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login } = useAuth();

  const update = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name}!`);
      onSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '16px', padding: '36px', width: '100%', maxWidth: '380px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '4px' }}>Admin Sign In</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Portfolio owner access only</p>
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {/* Lock icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', marginBottom: '24px',
        }}>🔑</div>

        {/* Error message */}
        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: '16px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px', color: '#ef4444', fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Email
            </label>
            <input name="email" type="email" value={form.email} onChange={update} required
              style={inputStyle} placeholder="admin@yourdomain.com" autoComplete="email"
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <div>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <input name="password" type="password" value={form.password} onChange={update} required
              style={inputStyle} placeholder="••••••••" autoComplete="current-password"
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
