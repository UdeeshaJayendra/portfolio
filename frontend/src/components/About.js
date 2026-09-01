import React from 'react';
export default function About({ profile }) {
  return (
    <section id="about" className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <div className="tag" style={{ marginBottom: '16px' }}>About Me</div>
            <h2 className="section-title" style={{ marginBottom: '24px' }}>Crafting digital experiences</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, marginBottom: '20px', fontSize: '16px' }}>
              {profile.bio || "I'm a passionate full stack developer focused on building clean, performant web applications using the MERN stack. I love turning complex problems into elegant solutions."}
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, fontSize: '16px' }}>
              Currently pursuing my degree while actively seeking internship opportunities to apply my skills in real-world projects and grow as a developer.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
              {profile.location && <div className="tag">📍 {profile.location}</div>}
              <div className="tag">💼 Open to Internships</div>
              <div className="tag">🚀 MERN Stack</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { num: '10+', label: 'Projects Built' },
              { num: '1+', label: 'Years Experience' },
              { num: '5+', label: 'Certifications' },
              { num: '3.8', label: 'GPA' },
            ].map(({ num, label }) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '8px' }}>{num}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
