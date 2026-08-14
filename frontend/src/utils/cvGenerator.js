/**
 * CV Generator — Generates a professional PDF-style CV
 * Opens a printable window with all portfolio data
 */
export function generateCV(profile, data = {}) {
  const { projects = [], skills = [], experience = [], education = [], certifications = [] } = data;
  
  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
  const grouped = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'].reduce((acc, cat) => {
    const s = skills.filter(x => x.category === cat).map(x => x.name);
    if (s.length) acc[cat] = s;
    return acc;
  }, {});

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${profile.name || 'Developer'} — CV</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',sans-serif;color:#1a1a2e;background:#fff;font-size:10pt;line-height:1.5}
  .page{max-width:794px;margin:0 auto;padding:48px 48px 60px}
  .header{border-bottom:2px solid #6366f1;padding-bottom:24px;margin-bottom:28px}
  .name{font-size:28pt;font-weight:700;color:#1a1a2e;letter-spacing:-1px;margin-bottom:4px}
  .title{font-size:13pt;color:#6366f1;font-weight:500;margin-bottom:12px}
  .contact-row{display:flex;flex-wrap:wrap;gap:16px;font-size:9pt;color:#555}
  .contact-row a{color:#6366f1;text-decoration:none}
  .section{margin-bottom:24px}
  .section-label{font-size:9pt;font-weight:700;color:#6366f1;letter-spacing:2px;text-transform:uppercase;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #e5e7eb}
  .exp-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px}
  .job-title{font-size:11pt;font-weight:600;color:#1a1a2e}
  .company{font-size:10pt;color:#6366f1;font-weight:500}
  .date{font-size:9pt;color:#888;font-family:monospace}
  .location{font-size:9pt;color:#888}
  .entry{margin-bottom:16px}
  ul{padding-left:16px;margin-top:6px}
  li{font-size:9.5pt;color:#444;margin-bottom:3px}
  .skills-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
  .skill-cat{margin-bottom:0}
  .skill-cat-name{font-size:9pt;font-weight:600;color:#555;margin-bottom:4px}
  .skill-tags{display:flex;flex-wrap:wrap;gap:4px}
  .tag{background:#f0f0ff;color:#6366f1;border-radius:3px;padding:2px 7px;font-size:8.5pt;border:1px solid #e0e0ff}
  .project-name{font-size:11pt;font-weight:600;margin-bottom:2px}
  .project-desc{font-size:9.5pt;color:#444;margin-bottom:6px}
  .cert-entry{display:flex;justify-content:space-between;margin-bottom:8px}
  .cert-name{font-size:10pt;font-weight:500}
  .cert-issuer{font-size:9pt;color:#6366f1}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  @page{margin:0}
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="name">${profile.name || 'Your Name'}</div>
    <div class="title">${profile.title || 'Full Stack Developer'}</div>
    <div class="contact-row">
      ${profile.email ? `<a href="mailto:${profile.email}">${profile.email}</a>` : ''}
      ${profile.phone ? `<span>${profile.phone}</span>` : ''}
      ${profile.location ? `<span>📍 ${profile.location}</span>` : ''}
      ${profile.github ? `<a href="${profile.github}">GitHub</a>` : ''}
      ${profile.linkedin ? `<a href="${profile.linkedin}">LinkedIn</a>` : ''}
      ${profile.website ? `<a href="${profile.website}">${profile.website}</a>` : ''}
    </div>
  </div>

  ${profile.bio ? `
  <div class="section">
    <div class="section-label">Summary</div>
    <p style="font-size:9.5pt;color:#444;line-height:1.7">${profile.bio}</p>
  </div>` : ''}

  ${Object.keys(grouped).length ? `
  <div class="section">
    <div class="section-label">Technical Skills</div>
    <div class="skills-grid">
      ${Object.entries(grouped).map(([cat, items]) => `
      <div class="skill-cat">
        <div class="skill-cat-name">${cat}</div>
        <div class="skill-tags">${items.map(i => `<span class="tag">${i}</span>`).join('')}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  ${experience.length ? `
  <div class="section">
    <div class="section-label">Work Experience</div>
    ${experience.map(exp => `
    <div class="entry">
      <div class="exp-header">
        <span class="job-title">${exp.role}</span>
        <span class="date">${fmt(exp.startDate)} – ${fmt(exp.endDate)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span class="company">${exp.company}</span>
        ${exp.location ? `<span class="location">${exp.location}</span>` : ''}
      </div>
      ${exp.highlights?.length ? `<ul>${exp.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
      ${exp.techUsed?.length ? `<div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">${exp.techUsed.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${education.length ? `
  <div class="section">
    <div class="section-label">Education</div>
    ${education.map(edu => `
    <div class="entry">
      <div class="exp-header">
        <span class="job-title">${edu.degree} in ${edu.field}</span>
        <span class="date">${new Date(edu.startDate).getFullYear()} – ${edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</span>
      </div>
      <div class="company">${edu.institution}</div>
      ${edu.gpa ? `<div style="font-size:9pt;color:#888;margin-top:2px">GPA: ${edu.gpa}</div>` : ''}
      ${edu.achievements?.length ? `<ul>${edu.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${projects.length ? `
  <div class="section">
    <div class="section-label">Projects</div>
    <div class="two-col">
      ${projects.slice(0, 4).map(p => `
      <div class="entry" style="margin-bottom:12px">
        <div class="project-name">${p.title} ${p.githubUrl ? `<a href="${p.githubUrl}" style="font-size:8pt;color:#6366f1;font-weight:400"> ↗ GitHub</a>` : ''}${p.liveUrl ? `<a href="${p.liveUrl}" style="font-size:8pt;color:#6366f1;font-weight:400"> ↗ Live</a>` : ''}</div>
        <div class="project-desc">${p.description}</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">${(p.techStack||[]).map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>`).join('')}
    </div>
  </div>` : ''}

  ${certifications.length ? `
  <div class="section">
    <div class="section-label">Certifications</div>
    ${certifications.map(c => `
    <div class="cert-entry">
      <div>
        <span class="cert-name">${c.name}</span>
        <span class="cert-issuer"> · ${c.issuer}</span>
      </div>
      <span class="date">${fmt(c.issueDate)}</span>
    </div>`).join('')}
  </div>` : ''}

</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
}
