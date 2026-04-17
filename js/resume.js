/* ============================================
   INVOXIA - Resume Builder Logic
   Module Owner: Member 1
   Branch: feature/resume-builder
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Only run on resume page
  if (!document.querySelector('.resume-page')) return;

  const form = document.getElementById('resumeForm');
  const preview = document.getElementById('resumePreview');

  // Resume data model
  const resumeData = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  };

  // ---- Live Preview Update ----
  function updatePreview() {
    const data = resumeData;

    let html = `
      <h1>${data.fullName || 'Your Name'}</h1>
      <p class="contact-line">
        ${[data.email, data.phone, data.location, data.linkedin].filter(Boolean).join(' • ') || 'your@email.com • +91 12345 67890'}
      </p>
    `;

    // Summary
    if (data.summary) {
      html += `
        <div class="resume-section-title">Professional Summary</div>
        <p style="color: #334155; font-size: 0.9rem; line-height: 1.7;">${data.summary}</p>
      `;
    }

    // Experience
    if (data.experience.length) {
      html += `<div class="resume-section-title">Experience</div>`;
      data.experience.forEach(exp => {
        html += `
          <div class="resume-entry">
            <h4>${exp.title || 'Job Title'}</h4>
            <p class="meta">${exp.company || 'Company'} | ${exp.duration || 'Duration'}</p>
            <p>${exp.description || ''}</p>
          </div>
        `;
      });
    }

    // Education
    if (data.education.length) {
      html += `<div class="resume-section-title">Education</div>`;
      data.education.forEach(edu => {
        html += `
          <div class="resume-entry">
            <h4>${edu.degree || 'Degree'}</h4>
            <p class="meta">${edu.institution || 'Institution'} | ${edu.year || 'Year'}</p>
          </div>
        `;
      });
    }

    // Skills
    if (data.skills.length) {
      html += `<div class="resume-section-title">Skills</div>
        <div class="resume-skills-list">
          ${data.skills.map(s => `<span class="resume-skill-tag">${s}</span>`).join('')}
        </div>`;
    }

    // Projects
    if (data.projects.length) {
      html += `<div class="resume-section-title">Projects</div>`;
      data.projects.forEach(proj => {
        html += `
          <div class="resume-entry">
            <h4>${proj.name || 'Project Name'}</h4>
            <p>${proj.description || ''}</p>
          </div>
        `;
      });
    }

    preview.innerHTML = html;
  }

  // ---- Form Input Listeners ----
  const bindInput = (id, key) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        resumeData[key] = e.target.value;
        updatePreview();
      });
    }
  };

  bindInput('inputFullName', 'fullName');
  bindInput('inputEmail', 'email');
  bindInput('inputPhone', 'phone');
  bindInput('inputLocation', 'location');
  bindInput('inputLinkedin', 'linkedin');
  bindInput('inputPortfolio', 'portfolio');
  bindInput('inputSummary', 'summary');

  // ---- Skills Input ----
  const skillsInput = document.getElementById('inputSkills');
  if (skillsInput) {
    skillsInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const skill = e.target.value.trim().replace(',', '');
        if (skill && !resumeData.skills.includes(skill)) {
          resumeData.skills.push(skill);
          e.target.value = '';
          updateSkillTags();
          updatePreview();
        }
      }
    });
  }

  function updateSkillTags() {
    const container = document.getElementById('skillTags');
    if (!container) return;
    container.innerHTML = resumeData.skills.map((skill, i) => `
      <span class="skill-tag-added">
        ${skill}
        <button onclick="removeSkill(${i})" title="Remove">&times;</button>
      </span>
    `).join('');
  }

  window.removeSkill = (index) => {
    resumeData.skills.splice(index, 1);
    updateSkillTags();
    updatePreview();
  };

  // ---- Add Experience ----
  window.addExperience = () => {
    resumeData.experience.push({ title: '', company: '', duration: '', description: '' });
    renderExperienceFields();
  };

  function renderExperienceFields() {
    const container = document.getElementById('experienceFields');
    if (!container) return;
    container.innerHTML = resumeData.experience.map((exp, i) => `
      <div class="card" style="padding: 1rem; margin-bottom: 0.75rem;">
        <div class="form-row">
          <div class="form-group">
            <input class="form-input" placeholder="Job Title" value="${exp.title}"
              oninput="updateExp(${i}, 'title', this.value)">
          </div>
          <div class="form-group">
            <input class="form-input" placeholder="Company" value="${exp.company}"
              oninput="updateExp(${i}, 'company', this.value)">
          </div>
        </div>
        <div class="form-group">
          <input class="form-input" placeholder="Duration (e.g., Jan 2024 - Present)" value="${exp.duration}"
            oninput="updateExp(${i}, 'duration', this.value)">
        </div>
        <div class="form-group">
          <textarea class="form-input" placeholder="Description" rows="2"
            oninput="updateExp(${i}, 'description', this.value)">${exp.description}</textarea>
        </div>
        <button class="add-item-btn" style="color: var(--accent-rose);" onclick="removeExp(${i})">✕ Remove</button>
      </div>
    `).join('');
  }

  window.updateExp = (i, key, val) => { resumeData.experience[i][key] = val; updatePreview(); };
  window.removeExp = (i) => { resumeData.experience.splice(i, 1); renderExperienceFields(); updatePreview(); };

  // ---- Add Education ----
  window.addEducation = () => {
    resumeData.education.push({ degree: '', institution: '', year: '' });
    renderEducationFields();
  };

  function renderEducationFields() {
    const container = document.getElementById('educationFields');
    if (!container) return;
    container.innerHTML = resumeData.education.map((edu, i) => `
      <div class="card" style="padding: 1rem; margin-bottom: 0.75rem;">
        <div class="form-group">
          <input class="form-input" placeholder="Degree / Certification" value="${edu.degree}"
            oninput="updateEdu(${i}, 'degree', this.value)">
        </div>
        <div class="form-row">
          <div class="form-group">
            <input class="form-input" placeholder="Institution" value="${edu.institution}"
              oninput="updateEdu(${i}, 'institution', this.value)">
          </div>
          <div class="form-group">
            <input class="form-input" placeholder="Year" value="${edu.year}"
              oninput="updateEdu(${i}, 'year', this.value)">
          </div>
        </div>
        <button class="add-item-btn" style="color: var(--accent-rose);" onclick="removeEdu(${i})">✕ Remove</button>
      </div>
    `).join('');
  }

  window.updateEdu = (i, key, val) => { resumeData.education[i][key] = val; updatePreview(); };
  window.removeEdu = (i) => { resumeData.education.splice(i, 1); renderEducationFields(); updatePreview(); };

  // ---- Add Project ----
  window.addProject = () => {
    resumeData.projects.push({ name: '', description: '' });
    renderProjectFields();
  };

  function renderProjectFields() {
    const container = document.getElementById('projectFields');
    if (!container) return;
    container.innerHTML = resumeData.projects.map((proj, i) => `
      <div class="card" style="padding: 1rem; margin-bottom: 0.75rem;">
        <div class="form-group">
          <input class="form-input" placeholder="Project Name" value="${proj.name}"
            oninput="updateProj(${i}, 'name', this.value)">
        </div>
        <div class="form-group">
          <textarea class="form-input" placeholder="Description" rows="2"
            oninput="updateProj(${i}, 'description', this.value)">${proj.description}</textarea>
        </div>
        <button class="add-item-btn" style="color: var(--accent-rose);" onclick="removeProj(${i})">✕ Remove</button>
      </div>
    `).join('');
  }

  window.updateProj = (i, key, val) => { resumeData.projects[i][key] = val; updatePreview(); };
  window.removeProj = (i) => { resumeData.projects.splice(i, 1); renderProjectFields(); updatePreview(); };

  // ---- Download as PDF (Print) ----
  window.downloadResume = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>${resumeData.fullName || 'Resume'} - Resume</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; padding: 40px; color: #1a1a2e; line-height: 1.6; }
          h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; margin-bottom: 4px; }
          .contact-line { color: #64748b; font-size: 13px; margin-bottom: 20px; }
          .resume-section-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; margin-bottom: 12px; margin-top: 24px; }
          .resume-entry { margin-bottom: 14px; }
          .resume-entry h4 { font-size: 15px; margin-bottom: 2px; }
          .resume-entry .meta { color: #64748b; font-size: 13px; margin-bottom: 4px; }
          .resume-entry p { color: #334155; font-size: 14px; }
          .resume-skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
          .resume-skill-tag { padding: 3px 12px; background: #eef2ff; color: #4338ca; border-radius: 999px; font-size: 12px; font-weight: 500; }
        </style>
      </head>
      <body>${preview.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  // Initialize with default preview
  updatePreview();
});
