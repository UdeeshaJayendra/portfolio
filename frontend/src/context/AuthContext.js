/**
 * ============================================================
 *  context/AuthContext.js — Global Authentication State
 * ============================================================
 *
 * Provides auth state to the entire app via React Context.
 * Any component can call useAuth() to access:
 *
 *   user       — logged-in user object { id, name, email, role } or null
 *   loading    — true while checking stored token on page load
 *   login()    — call with { email, password } to log in
 *   logout()   — clears token and user from state + localStorage
 *   isAdmin    — shortcut: user?.role === 'admin'
 *   isLoggedIn — shortcut: !!user
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getMe } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session from localStorage

  // ── Restore session on page load/refresh ──────────────────────
  // If a token exists in localStorage, verify it's still valid with the server.
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('portfolio_token');
      if (!token) return setLoading(false); // No token — stay logged out
      try {
        const res = await getMe(); // GET /api/auth/me — validates token server-side
        setUser(res.data);
      } catch {
        // Token expired or invalid — clean up silently
        localStorage.removeItem('portfolio_token');
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  // ── login() ───────────────────────────────────────────────────
  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const { token, user: loggedInUser } = res.data;
    localStorage.setItem('portfolio_token', token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  // ── logout() ──────────────────────────────────────────────────
  // JWT is stateless — no server call needed, just delete the token.
  const logout = () => {
    localStorage.removeItem('portfolio_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin:    user?.role === 'admin',
      isLoggedIn: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Shortcut hook — use this in any component: const { isAdmin } = useAuth()
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
