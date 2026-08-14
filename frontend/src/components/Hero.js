import React, { useEffect, useState } from 'react';
import { generateCV } from '../utils/cvGenerator';

const rotateTitles = ['Full Stack Developer', 'MERN Stack Engineer', 'React Developer', 'Node.js Developer'];

export default function Hero({ profile, cvData }) {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const target = profile.title || rotateTitles[titleIdx % rotateTitles.length];
    let i = 0;
    if (typing) {
      const t = setInterval(() => {
        if (i <= target.length) setDisplayed(target.slice(0, i++));
        else { clearInterval(t); setTimeout(() => setTyping(false), 2200); }
      }, 60);
      return () => clearInterval(t);
    } else {
      const t = setInterval(() => {
        setDisplayed(p => {
          if (p.length === 0) { clearInterval(t); setTimeout(() => { setTyping(true); setTitleIdx(x => x + 1); }, 200); return p; }
          return p.slice(0, -1);
        });
      }, 30);
      return () => clearInterval(t);
    }
  }, [typing, titleIdx]);

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '15%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div className="container">
        <div style={{ maxWidth: '760px' }}>
          <div className="tag" style={{ marginBottom: '28px' }}>✦ Available for Internship Opportunities</div>
          <h1 style={{ fontSize: 'clamp(40px, 6vw, 74px)', fontWeight: 700, lineHeight: 1.08, marginBottom: '20px', letterSpacing: '-2.5px' }}>
            Hi, I'm{' '}
            <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {profile.name || 'Your Name'}
            </span>
          </h1>
          <div style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: 400, minHeight: '40px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontFamily: 'var(--font-mono)' }}>&gt; </span>
            <span>{displayed}</span>
            <span style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--accent)', animation: 'blink 1s step-end infinite', marginLeft: '2px' }} />
          </div>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.85, maxWidth: '580px', marginBottom: '44px' }}>
            {profile.tagline || 'Building scalable, performant web applications with modern technologies. Passionate about clean code and great user experiences.'}
          </p>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="#projects" className="btn btn-primary">View My Work</a>
            <button className="btn btn-outline" onClick={() => generateCV(profile, cvData)}>↓ Download CV</button>
            <a href="#contact" className="btn btn-outline">Get In Touch</a>
          </div>
          <div style={{ display: 'flex', gap: '32px', marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
            {[['GitHub', profile.github], ['LinkedIn', profile.linkedin], ['Email', profile.email ? `mailto:${profile.email}` : null]].map(([label, url]) => url && (
              <a key={label} href={url} target="_blank" rel="noreferrer"
                style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-light)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                {label} →
              </a>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  );
}
