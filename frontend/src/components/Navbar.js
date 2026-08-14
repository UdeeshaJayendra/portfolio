/**
 * ============================================================
 *  components/Navbar.js — Top Navigation Bar
 * ============================================================
 *
 * Features:
 *  - Transparent when at top of page, blurred/dark when scrolled
 *  - Shows your name as a logo on the left
 *  - Navigation links in the middle
 *  - Right side changes based on auth state:
 *      Logged out → "Sign In" button
 *      Logged in as user → shows user name + logout
 *      Logged in as admin → shows "+ Add Project" + admin badge + logout
 *
 * Props:
 *   profile      — your profile object from MongoDB
 *   onAddProject — function to open the Add Project modal (admin only)
 *   onAuthClick  — function to open the Login/Register modal
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// All sections of the page — clicking a link scrolls to that section
const NAV_LINKS = ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];

export default function Navbar({ profile, onAddProject, onAuthClick }) {
  const [scrolled, setScrolled]     = useState(false);  // Is page scrolled > 50px?
  const [dropdownOpen, setDropdown] = useState(false);  // User dropdown menu open?
  const dropdownRef = useRef(null); // Used to detect clicks outside dropdown

  // Get auth state and logout function from context
  const { user, isAdmin, isLoggedIn, logout } = useAuth();

  // ── Scroll listener — makes navbar opaque when scrolled ───────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, []);

  // ── Click-outside handler — closes dropdown ────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdown(false);
    toast.info('Logged out successfully.');
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '14px 0',
      background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* ── Logo / name ─────────────────────────────────────────── */}
        <a href="#" className="mono" style={{ fontSize: '18px', fontWeight: 500, color: 'var(--accent-light)', letterSpacing: '-0.5px' }}>
          {profile.name ? `{${profile.name.split(' ')[0].toLowerCase()}}` : '{dev}'}
        </a>

        {/* ── Center nav links ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {NAV_LINKS.map(link => (
            <a key={link} href={`#${link}`}
              style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'capitalize', transition: 'var(--transition)' }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
              {link}
            </a>
          ))}
        </div>

        {/* ── Right side — changes based on auth state ────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

          {/* Admin gets the Add Project button */}
          {isAdmin && (
            <button className="btn btn-primary" onClick={onAddProject}
              style={{ fontSize: '12px', padding: '7px 14px' }}>
              + Add Project
            </button>
          )}

          {isLoggedIn ? (
            /* ── Logged-in user dropdown ─────────────────────────── */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button onClick={() => setDropdown(p => !p)} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '7px 12px', borderRadius: '8px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', cursor: 'pointer', fontSize: '13px',
                fontFamily: 'var(--font-body)', transition: 'var(--transition)',
              }}>
                {/* Avatar circle with first letter of name */}
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: isAdmin ? 'var(--accent)' : 'rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700, color: '#fff',
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
                {/* Admin badge */}
                {isAdmin && (
                  <span style={{
                    fontSize: '9px', background: 'var(--accent)', color: '#fff',
                    padding: '1px 5px', borderRadius: '3px', fontWeight: 700,
                  }}>ADMIN</span>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>▾</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '10px', padding: '8px', minWidth: '180px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 100,
                }}>
                  {/* User info */}
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</p>
                    <span style={{
                      fontSize: '10px', padding: '2px 6px', borderRadius: '3px', marginTop: '4px',
                      display: 'inline-block',
                      background: isAdmin ? 'rgba(99,102,241,0.2)' : 'rgba(16,185,129,0.15)',
                      color: isAdmin ? 'var(--accent-light)' : '#10b981',
                    }}>
                      {isAdmin ? '🔑 Administrator' : '👤 Visitor'}
                    </span>
                  </div>
                  {/* Logout button */}
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '8px 12px', background: 'transparent',
                    border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px',
                    textAlign: 'left', borderRadius: '6px', fontFamily: 'var(--font-body)',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Not logged in — show Sign In button ─────────────── */
            <button className="btn btn-outline" onClick={onAuthClick}
              style={{ fontSize: '13px', padding: '7px 16px' }}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
