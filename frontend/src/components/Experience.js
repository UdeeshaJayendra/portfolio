import React from 'react';
export default function Experience({ experience }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
  return (
    <section id="experience" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="tag" style={{ marginBottom: '16px' }}>Career</div>
        <h2 className="section-title">Work Experience</h2>
        <p className="section-subtitle">Where I've applied my skills professionally</p>
        {experience.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No experience entries yet.</p>}
        <div style={{ position: 'relative', paddingLeft: '32px' }}>
          <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
          {experience.map((exp, i) => (
            <div key={exp._id} style={{ position: 'relative', marginBottom: '40px' }}>
              <div style={{ position: 'absolute', left: '-29px', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--accent)', border: '3px solid var(--bg-secondary)' }} />
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{exp.role}</h3>
                    <p style={{ color: 'var(--accent-light)', fontSize: '15px' }}>{exp.company}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="tag" style={{ marginBottom: '4px', display: 'inline-block' }}>{exp.type}</div>
                    <p className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block' }}>{fmt(exp.startDate)} → {fmt(exp.endDate)}</p>
                    {exp.location && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>📍 {exp.location}</p>}
                  </div>
                </div>
                {exp.description && <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{exp.description}</p>}
                {exp.highlights?.length > 0 && (
                  <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    {exp.highlights.map((h, j) => <li key={j} style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{h}</li>)}
                  </ul>
                )}
                {exp.techUsed?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {exp.techUsed.map(t => <span key={t} className="tag" style={{ fontSize: '11px' }}>{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
