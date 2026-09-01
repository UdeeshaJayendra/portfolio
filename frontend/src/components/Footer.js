import React from 'react';

export default function Footer({ profile }) {
  return (
    <footer style={{ padding: '40px 0', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          © {new Date().getFullYear()} {profile.name || 'Developer'} — Built with MERN Stack
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[['GitHub', profile.github], ['LinkedIn', profile.linkedin]].filter(([, url]) => url).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--text-muted)' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent-light)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
