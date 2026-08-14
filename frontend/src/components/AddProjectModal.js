/**
 * ============================================================
 *  components/AddProjectModal.js — Admin: Add New Project Modal
 * ============================================================
 *
 * Only rendered when isAdmin is true (checked in App.js).
 * Sends a POST request to /api/projects with the form data.
 *
 * Props:
 *   onClose   — close the modal
 *   onSuccess — called after successful creation (triggers re-fetch)
 */

import React, { useState } from 'react';
import { createProject } from '../api';
import { toast } from 'react-toastify';

export default function AddProjectModal({ onClose, onSuccess }) {
  // ── Form state ─────────────────────────────────────────────────
  // techStack is stored as a comma-separated string in the input,
  // then split into an array before sending to the API.
  const [form, setForm] = useState({
    title: '', description: '', techStack: '',
    githubUrl: '', liveUrl: '', featured: false, status: 'completed',
  });
  const [loading, setLoading] = useState(false);

  // Generic change handler — handles text inputs AND checkboxes
  const update = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [e.target.name]: val }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject({
        ...form,
        // Convert "React, Node.js, MongoDB" → ['React', 'Node.js', 'MongoDB']
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      });
      toast.success('Project added!');
      onSuccess(); // Parent will re-fetch projects and close modal
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add project.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px',
    background: 'var(--bg-primary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none',
  };
  const labelStyle = { fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px', fontWeight: 500 };
  const focus = (e) => (e.target.style.borderColor = 'var(--accent)');
  const blur  = (e) => (e.target.style.borderColor = 'var(--border)');

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Add New Project</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Admin only — saved to MongoDB</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>✕</button>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Project Title *</label>
            <input name="title" value={form.title} onChange={update} required style={inputStyle}
              placeholder="My Awesome Project" onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" value={form.description} onChange={update} required rows="3"
              style={{ ...inputStyle, resize: 'vertical' }} placeholder="What does this project do?"
              onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={labelStyle}>Tech Stack (comma-separated)</label>
            <input name="techStack" value={form.techStack} onChange={update} style={inputStyle}
              placeholder="React, Node.js, MongoDB, Express" onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>GitHub URL</label>
              <input name="githubUrl" value={form.githubUrl} onChange={update} style={inputStyle}
                placeholder="https://github.com/..." onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Live Demo URL</label>
              <input name="liveUrl" value={form.liveUrl} onChange={update} style={inputStyle}
                placeholder="https://demo.com" onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" value={form.status} onChange={update} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
            <input type="checkbox" name="featured" checked={form.featured} onChange={update}
              style={{ width: '15px', height: '15px', accentColor: 'var(--accent)' }} />
            Mark as Featured Project (shows ⭐ badge)
          </label>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Adding...' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
