// ── SHARED UTILITIES ──

function programTag(program) {
  return `<span class="tag ${program.toLowerCase()}">${program}</span>`;
}

function riskBadge(risk) {
  const label = getRiskLabel(risk);
  const icons = { critical: '🔴', high: '🟠', moderate: '🟡', low: '🟢' };
  return `<span class="risk-badge ${risk}">${icons[risk]} ${label.fr} <span style="font-weight:400;opacity:0.7;">/ ${label.en}</span></span>`;
}

function oedemaFlag(val) {
  if (!val) return '<span style="color:var(--gray-300)">—</span>';
  return `<span class="oedema-flag">⚠ Oedème</span>`;
}

function daysSinceLabel(days) {
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Il y a 1 jour';
  return `Il y a ${days} jours`;
}

function progressBar(pct, color) {
  return `<div class="progress-bar"><div class="progress-fill" style="width:${Math.min(100,pct)}%;background:${color}"></div></div>`;
}

function sparkline(values) {
  if (!values || values.length < 2) return '';
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return `<div class="sparkline">${values.map((v, i) => {
    const h = Math.round(6 + ((v - min) / range) * 16);
    const cls = i > 0 ? (v >= values[i-1] ? 'up' : 'down') : '';
    return `<div class="spark-bar ${cls}" style="height:${h}px"></div>`;
  }).join('')}</div>`;
}

// ── NAV ──
function initNav(activeId) {
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.toggle('active', el.dataset.page === activeId);
    el.addEventListener('click', () => {
      window.location.href = el.dataset.href;
    });
  });
}

function buildNav(activeId) {
  const pages = [
    { id: 'intro', href: 'index.html', fr: 'Introduction', en: 'Overview' },
    { id: 'supervisor', href: 'supervisor.html', fr: 'Superviseur', en: 'Supervisor' },
    { id: 'clinical', href: 'clinical.html', fr: 'Clinique', en: 'Clinical' },
    { id: 'chw', href: 'chw.html', fr: 'ASC', en: 'CHW' },
    { id: 'analytics', href: 'analytics.html', fr: 'Analytique', en: 'Analytics' },
    { id: 'nextsteps', href: 'nextsteps.html', fr: 'Prochaines Étapes', en: 'Next Steps', special: true },
  ];

  return `
  <nav class="nav">
    <div class="nav-brand">
      <div>
        PIH Nutrition
        <span class="sub">Tableau de bord / Dashboard</span>
      </div>
      <span class="demo-badge">DÉMO</span>
    </div>
    <div class="nav-links">
      ${pages.map(p => `
        <a class="nav-link ${p.special ? 'nextsteps-link' : ''} ${p.id === activeId ? 'active' : ''}" href="${p.href}">
          <span class="fr">${p.fr}</span>
          <span class="en">${p.en}</span>
        </a>
      `).join('')}
    </div>
  </nav>`;
}

// ── SIMULATION BAR ──
function buildSimBar() {
  return `
  <div class="sim-bar">
    <label>⏱ Simuler le temps / Simulate time passing:</label>
    <input type="range" id="sim-slider" min="0" max="30" value="0" step="1">
    <span class="sim-date" id="sim-date-label">${fmtDate(simDate())}</span>
    <button class="sim-btn" id="sim-reset">Réinitialiser / Reset</button>
  </div>`;
}

function initSimBar(onUpdate) {
  const slider = document.getElementById('sim-slider');
  const label = document.getElementById('sim-date-label');
  const reset = document.getElementById('sim-reset');
  if (!slider) return;

  slider.addEventListener('input', () => {
    SIM_DAYS = parseInt(slider.value);
    label.textContent = fmtDate(simDate());
    onUpdate();
  });

  reset.addEventListener('click', () => {
    SIM_DAYS = 0;
    slider.value = 0;
    label.textContent = fmtDate(simDate());
    onUpdate();
  });
}

// ── ALERT LOG RENDERER ──
function renderAlertLog(containerId, limit) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const logs = ALERT_LOG.slice(0, limit || 20);
  el.innerHTML = logs.map(a => `
    <div class="alert-log-entry">
      <div class="alert-icon ${a.type}">${a.icon}</div>
      <div style="flex:1;min-width:0;">
        <div class="alert-text-fr">${a.fr}</div>
        <div class="alert-text-en">${a.en}</div>
        <div class="alert-time">${a.time}</div>
      </div>
      <div class="alert-channel ${a.channel}">${a.channel === 'whatsapp' ? '💬 WhatsApp' : '✉ Email'}</div>
    </div>
  `).join('');
}

// ── INJECT SIMULATED ALERTS ──
function maybeAddSimAlerts() {
  if (SIM_DAYS === 0) return;

  // Check if we need to add overdue alerts
  const patients = getPatients();
  const criticalNew = patients.filter(p => p.risk === 'critical' && !ALERT_LOG.find(a => a.patient_id === p.id && a.time.startsWith(fmtSimISO())));

  criticalNew.forEach(p => {
    const existing = ALERT_LOG.find(a => a.patient_id === p.id && a.type === 'urgent' && a.time > '2026-01-15');
    if (!existing) {
      ALERT_LOG.unshift({
        id: 'sim-' + p.id,
        time: fmtSimISO() + ' 08:00',
        type: 'urgent',
        patient_id: p.id,
        chw: p.chw,
        fr: `🚨 URGENT — ${p.name} (${p.program}/${p.site}): non vu depuis ${p.days_since_visit} jours`,
        en: `🚨 URGENT — ${p.name} (${p.program}/${p.site}): not seen for ${p.days_since_visit} days`,
        channel: 'whatsapp',
        icon: '🚨',
      });
    }
  });

  // Add daily digests for new days
  if (SIM_DAYS > 0 && SIM_DAYS % 1 === 0) {
    const digestExists = ALERT_LOG.find(a => a.type === 'daily' && a.time.startsWith(fmtSimISO()));
    if (!digestExists) {
      const overdue = patients.filter(p => p.overdue).length;
      ALERT_LOG.unshift({
        id: 'sim-digest-' + SIM_DAYS,
        time: fmtSimISO() + ' 07:00',
        type: 'daily',
        patient_id: null,
        chw: null,
        fr: `📋 Résumé quotidien — ${patients.length} patients actifs, ${overdue} en retard`,
        en: `📋 Daily digest — ${patients.length} active patients, ${overdue} overdue`,
        channel: 'whatsapp',
        icon: '📋',
      });
    }
  }
}

function fmtSimISO() {
  const d = simDate();
  return d.toISOString().slice(0, 10);
}

// ── MINI BAR CHART (canvas-free, CSS-based) ──
function renderBarChart(containerId, data, maxVal) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = maxVal || Math.max(...data.map(d => d.value));
  el.innerHTML = data.map(d => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <div style="width:60px;font-size:11px;color:var(--gray-500);text-align:right;">${d.label}</div>
      <div style="flex:1;background:var(--gray-100);border-radius:3px;height:20px;overflow:hidden;">
        <div style="width:${(d.value/max*100)}%;height:100%;background:${d.color||'var(--blue)'};border-radius:3px;transition:width 0.6s ease;"></div>
      </div>
      <div style="width:28px;font-size:12px;font-weight:700;color:var(--gray-700);">${d.value}</div>
    </div>
  `).join('');
}
