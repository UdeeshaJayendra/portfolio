import React from 'react';
export default function Education({ education }) {
  const fmt = (d) => d ? new Date(d).getFullYear() : 'Present';
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="tag" style={{ marginBottom: '16px' }}>Academic</div>
        <h2 className="section-title">Education</h2>
        <p className="section-subtitle">My academic foundation</p>
        <div style={{ display: 'grid', gap: '24px' }}>
          {education.map(edu => (
            <div key={edu._id} className="card" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>🎓</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '4px' }}>{edu.degree} in {edu.field}</h3>
                    <p style={{ color: 'var(--accent-light)', fontSize: '15px', marginBottom: '8px' }}>{edu.institution}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className="mono" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{fmt(edu.startDate)} — {fmt(edu.endDate)}</p>
                    {edu.gpa && <div className="tag" style={{ marginTop: '4px', display: 'inline-block' }}>GPA: {edu.gpa}</div>}
                  </div>
                </div>
                {edu.description && <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '12px' }}>{edu.description}</p>}
                {edu.achievements?.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {edu.achievements.map((a, i) => <span key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px', padding: '2px 10px' }}>🏆 {a}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {!education.length && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No education entries yet.</p>}
        </div>
      </div>
    </section>
  );
}
