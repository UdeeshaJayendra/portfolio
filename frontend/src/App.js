/**
 * ============================================================
 *  App.js — Root Application Component
 * ============================================================
 *
 * This is the top-level component React renders into #root (index.js).
 *
 * Responsibilities:
 *  1. Fetches all portfolio data from the backend on load
 *  2. Stores data in state and passes it as props to sections
 *  3. Controls which modals are open (Add Project, Auth)
 *  4. Passes the right props to Navbar based on auth state
 *
 * Data flow:
 *   MongoDB → Express API → fetchAll() → state → props → UI components
 *
 * Auth state is managed by AuthContext (context/AuthContext.js).
 * Any component can call useAuth() to get user/isAdmin/logout.
 */

import React, { useState, useEffect } from 'react';

// ── Section components (each renders one portfolio section) ────
import Navbar         from './components/Navbar';
import Hero           from './components/Hero';
import About          from './components/About';
import Skills         from './components/Skills';
import Projects       from './components/Projects';
import Experience     from './components/Experience';
import Education      from './components/Education';
import Certifications from './components/Certifications';
import Contact        from './components/Contact';
import Footer         from './components/Footer';

// ── Modal components ───────────────────────────────────────────
import AddProjectModal from './components/AddProjectModal'; // Admin: add project form
import AuthModal       from './components/AuthModal';       // Login / Register form

// ── Auth ───────────────────────────────────────────────────────
import { useAuth } from './context/AuthContext';

// ── Toast notifications ────────────────────────────────────────
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ── API functions ──────────────────────────────────────────────
import {
  getProfile, getProjects, getSkills,
  getExperience, getEducation, getCertifications,
} from './api';

export default function App() {
  // ── Portfolio data state ───────────────────────────────────────
  // All sections pull data from this single state object.
  // This makes it easy to re-fetch everything with one call.
  const [data, setData] = useState({
    profile:        {},
    projects:       [],
    skills:         [],
    experience:     [],
    education:      [],
    certifications: [],
  });
  const [loading, setLoading] = useState(true); // Show loader while fetching

  // ── Modal visibility state ─────────────────────────────────────
  const [showAddProject, setShowAddProject] = useState(false); // Admin: add project modal
  const [showAuth, setShowAuth]             = useState(false); // Login/Register modal

  // ── Auth context ───────────────────────────────────────────────
  // isAdmin — true if logged in user has role: 'admin'
  const { isAdmin } = useAuth();

  // ── Fetch all portfolio data from backend ──────────────────────
  // Promise.all() fires all 6 requests simultaneously (parallel, not sequential)
  // This is much faster than awaiting them one by one.
  const fetchAll = async () => {
    try {
      const [profile, projects, skills, experience, education, certifications] =
        await Promise.all([
          getProfile(), getProjects(), getSkills(),
          getExperience(), getEducation(), getCertifications(),
        ]);
      setData({
        profile:        profile.data        || {},
        projects:       projects.data       || [],
        skills:         skills.data         || [],
        experience:     experience.data     || [],
        education:      education.data      || [],
        certifications: certifications.data || [],
      });
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err.message);
    } finally {
      setLoading(false); // Always stop the loader, even on error
    }
  };

  // Run fetchAll once when the component first mounts (empty [] dependency array)
  useEffect(() => { fetchAll(); }, []);

  // ── Loader screen ──────────────────────────────────────────────
  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)',
    }}>
      <div className="mono" style={{ color: 'var(--accent)', fontSize: '15px' }}>
        {'> initialising portfolio...'}
      </div>
      <div style={{ width: '220px', height: '2px', background: 'var(--border)', borderRadius: '1px', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
          borderRadius: '1px', animation: 'progress 1.4s ease-in-out infinite',
        }} />
      </div>
      <style>{`@keyframes progress{0%{width:0;left:0}50%{width:60%;left:20%}100%{width:0;left:100%}}`}</style>
    </div>
  );

  // ── CV data — passed to Hero for the "Download CV" button ─────
  // We collect all sections into one object so cvGenerator.js can build the PDF
  const cvData = {
    projects:       data.projects,
    skills:         data.skills,
    experience:     data.experience,
    education:      data.education,
    certifications: data.certifications,
  };

  return (
    <>
      {/* ── Navbar — fixed at top of page ─────────────────────── */}
      <Navbar
        profile={data.profile}
        onAddProject={() => setShowAddProject(true)} // Admin button in navbar
        onAuthClick={() => setShowAuth(true)}         // Sign In button in navbar
      />

      {/* ── Main content — all portfolio sections ─────────────── */}
      <main>
        <Hero           profile={data.profile} cvData={cvData} />
        <About          profile={data.profile} />
        <Skills         skills={data.skills} />
        <Projects       projects={data.projects} onRefresh={fetchAll} onAdd={() => setShowAddProject(true)} />
        <Experience     experience={data.experience} />
        <Education      education={data.education} />
        <Certifications certifications={data.certifications} />
        <Contact        profile={data.profile} />
      </main>

      <Footer profile={data.profile} />

      {/* ── Modals — rendered outside <main> to sit above everything ── */}

      {/* Add Project modal — only admin can open it (button is hidden from others) */}
      {showAddProject && isAdmin && (
        <AddProjectModal
          onClose={() => setShowAddProject(false)}
          onSuccess={() => { setShowAddProject(false); fetchAll(); }}
        />
      )}

      {/* Auth modal — login/register — shown when "Sign In" is clicked */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)} // Close after successful login
        />
      )}

      {/* Toast notifications container — renders toasts from any component */}
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
    </>
  );
}
