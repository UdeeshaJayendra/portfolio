import React, { useState } from 'react';
import { sendContactMessage } from '../api';
import { toast } from 'react-toastify';

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const update = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactMessage(form);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch { toast.error('Failed to send. Please try again.'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '14px', fontFamily: 'var(--font-body)', outline: 'none', transition: 'var(--transition)' };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div className="tag" style={{ marginBottom: '16px' }}>Let's Talk</div>
          <h2 className="section-title">Get In Touch</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            Open to internship opportunities, collaborations, and interesting projects.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '60px', alignItems: 'start' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Contact Info</h3>
            {[
              { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
              { label: 'Phone', value: profile.phone, href: `tel:${profile.phone}` },
              { label: 'Location', value: profile.location },
              { label: 'GitHub', value: profile.github?.replace('https://github.com/', '@'), href: profile.github },
              { label: 'LinkedIn', value: 'LinkedIn Profile', href: profile.linkedin },
            ].filter(item => item.value).map(item => (
              <div key={item.label} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-glow)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '16px' }}>{item.label === 'Email' ? '📧' : item.label === 'Phone' ? '📱' : item.label === 'Location' ? '📍' : item.label === 'GitHub' ? '⚡' : '🔗'}</span>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>{item.label}</p>
                  {item.href ? <a href={item.href} style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.value}</a> : <p style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.value}</p>}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Name *</label>
                <input name="name" value={form.name} onChange={update} required style={inputStyle} placeholder="Your name"
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Email *</label>
                <input name="email" type="email" value={form.email} onChange={update} required style={inputStyle} placeholder="your@email.com"
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Subject</label>
              <input name="subject" value={form.subject} onChange={update} style={inputStyle} placeholder="Internship Opportunity"
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Message *</label>
              <textarea name="message" value={form.message} onChange={update} required rows="6" style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell me about the opportunity or project..."
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
