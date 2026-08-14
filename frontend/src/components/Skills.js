import React from 'react';

const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools', 'Other'];

export default function Skills({ skills }) {
  const grouped = categories.reduce((acc, cat) => {
    const catSkills = skills.filter(s => s.category === cat);
    if (catSkills.length) acc[cat] = catSkills;
    return acc;
  }, {});

  return (
    <section id="skills" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <div className="tag" style={{ marginBottom: '16px' }}>Skills</div>
        <h2 className="section-title">Technical Arsenal</h2>
        <p className="section-subtitle">Technologies I work with to build modern applications</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category} className="card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '14px', color: 'var(--accent-light)', marginBottom: '20px', fontFamily: 'var(--font-mono)' }}>
                // {category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {catSkills.map(skill => (
                  <div key={skill._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{skill.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{skill.proficiency}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${skill.proficiency}%`,
                        background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%)',
                        borderRadius: '2px', transition: 'width 1s ease-out'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!skills.length && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px' }}>
            No skills added yet. Add them through the API or seed the database.
          </div>
        )}
      </div>
    </section>
  );
}
