import React from 'react';
export default function Certifications({ certifications }) {
  return (
    <section id="certifications" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="tag" style={{ marginBottom: '16px' }}>Credentials</div>
        <h2 className="section-title">Certifications</h2>
        <p className="section-subtitle">Professional certifications and achievements</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {certifications.map(cert => (
            <div key={cert._id} className="card">
              <div style={{ fontSize: '28px', marginBottom: '16px' }}>🏅</div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', lineHeight: 1.3 }}>{cert.name}</h3>
              <p style={{ color: 'var(--accent-light)', fontSize: '14px', marginBottom: '12px' }}>{cert.issuer}</p>
              <p className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '13px', padding: '7px 14px', display: 'inline-flex' }}>
                  View Credential ↗
                </a>
              )}
            </div>
          ))}
          {!certifications.length && <p style={{ color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>No certifications yet.</p>}
        </div>
      </div>
    </section>
  );
}
