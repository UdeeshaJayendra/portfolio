/**
 * ============================================================
 *  components/Projects.js — Projects Section
 * ============================================================
 *
 * Shows all projects with filter tabs.
 * Admin sees delete button and "Add Project" button.
 * Regular users and visitors only see the project cards.
 *
 * Props:
 *   projects   — array of project objects from MongoDB
 *   onRefresh  — function to re-fetch projects after add/delete
 *   onAdd      — function to open the Add Project modal
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { deleteProject } from '../api';
import { toast } from 'react-toastify';

const FILTERS = ['all', 'featured', 'completed', 'in-progress'];

export default function Projects({ projects, onRefresh, onAdd }) {
  const [filter, setFilter] = useState('all');
  const { isAdmin } = useAuth(); // Only admins can delete projects

  // ── Filter projects based on selected tab ─────────────────────
  const filtered =
    filter === 'all'      ? projects :
    filter === 'featured' ? projects.filter(p => p.featured) :
                            projects.filter(p => p.status === filter);

  // ── Delete handler (admin only) ───────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this project?')) return;
    try {
      await deleteProject(id); // DELETE /api/projects/:id
      toast.success('Project deleted.');
      onRefresh(); // Re-fetch from server so UI updates
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete.');
    }
  };

  // Status dot colour — green for completed, yellow for in-progress, grey for archived
  const statusColor = (s) =>
    s === 'completed' ? '#10b981' : s === 'in-progress' ? '#f59e0b' : 'var(--text-muted)';

  return (
    <section id="projects" className="section">
      <div className="container">

        {/* ── Section header ────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="tag" style={{ marginBottom: '16px' }}>Work</div>
            <h2 className="section-title" style={{ marginBottom: '8px' }}>Projects</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Things I've built</p>
          </div>

          {/* Filter tabs + Add button (admin only) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '6px 14px', borderRadius: '6px', border: '1px solid',
                borderColor: filter === f ? 'var(--accent)' : 'var(--border)',
                background: filter === f ? 'var(--accent-glow)' : 'transparent',
                color: filter === f ? 'var(--accent-light)' : 'var(--text-secondary)',
                fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)',
                transition: 'var(--transition)',
              }}>{f}</button>
            ))}
            {/* Only admin sees the Add Project button here */}
            {isAdmin && (
              <button className="btn btn-primary" onClick={onAdd} style={{ fontSize: '12px', padding: '7px 14px' }}>
                + Add Project
              </button>
            )}
          </div>
        </div>

        {/* ── Project cards grid ────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filtered.map(project => (
            <div key={project._id} className="card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>

              {/* Featured badge */}
              {project.featured && (
                <span className="tag" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px' }}>
                  ⭐ Featured
                </span>
              )}

              {/* Status dot + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor(project.status) }} />
                <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{project.status}</span>
              </div>

              <h3 style={{ fontSize: '19px', fontWeight: 600, marginBottom: '10px' }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, flex: 1, marginBottom: '18px' }}>
                {project.description}
              </p>

              {/* Tech stack tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {(project.techStack || []).map(tech => (
                  <span key={tech} className="tag" style={{ fontSize: '11px' }}>{tech}</span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer"
                    className="btn btn-outline" style={{ fontSize: '12px', padding: '6px 12px', flex: 1, justifyContent: 'center' }}>
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer"
                    className="btn btn-primary" style={{ fontSize: '12px', padding: '6px 12px', flex: 1, justifyContent: 'center' }}>
                    Live ↗
                  </a>
                )}
                {/* Delete button — admin only */}
                {isAdmin && (
                  <button onClick={() => handleDelete(project._id)} title="Delete project"
                    style={{
                      padding: '6px 10px', background: 'transparent',
                      border: '1px solid var(--border)', borderRadius: '6px',
                      color: '#ef4444', cursor: 'pointer', fontSize: '13px', transition: 'var(--transition)',
                    }}
                    onMouseEnter={e => e.target.style.borderColor = '#ef4444'}
                    onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}>
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!filtered.length && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>No projects found.</p>
            {isAdmin && (
              <button className="btn btn-primary" onClick={onAdd}>+ Add Your First Project</button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
