// ── PIH NUTRITION DASHBOARD — DUMMY DATA ──
// Synthetic patients. All names, IDs, and clinical values are fictional.
// Locations are real PIH Haiti sites. Clinical thresholds based on WHO/Sphere SAM/MAM protocols.
// This data should be validated by PIH clinical staff before production use.

const SITES = [
  { id: 'HUM', name_fr: 'Hôpital Universitaire de Mirebalais', name_en: 'University Hospital of Mirebalais', dept: 'Centre', commune: 'Mirebalais' },
  { id: 'SAP', name_fr: 'Centre de Santé de Sapaterre', name_en: 'Sapaterre Health Center', dept: 'Centre', commune: 'Sapaterre' },
  { id: 'HIN', name_fr: 'Hôpital de Hinche', name_en: 'Hinche Hospital', dept: 'Centre', commune: 'Hinche' },
  { id: 'LAS', name_fr: 'Centre de Santé de Lascahobas', name_en: 'Lascahobas Health Center', dept: 'Centre', commune: 'Lascahobas' },
  { id: 'BCH', name_fr: 'Hôpital St. Nicolas de Boucan Carré', name_en: 'Boucan Carré Hospital', dept: 'Centre', commune: 'Boucan Carré' },
  { id: 'PON', name_fr: 'Centre de Santé de Pignon', name_en: 'Pignon Health Center', dept: 'Nord', commune: 'Pignon' },
];

const CHWS = [
  { id: 'chw01', name: 'Marie-Claire Toussaint', site: 'HUM' },
  { id: 'chw02', name: 'Jean-Baptiste Augustin', site: 'HUM' },
  { id: 'chw03', name: 'Roseline Pierre', site: 'SAP' },
  { id: 'chw04', name: 'Théodore Lafortune', site: 'HIN' },
  { id: 'chw05', name: 'Nadège Dorismond', site: 'LAS' },
  { id: 'chw06', name: 'Claudel Mérisier', site: 'BCH' },
  { id: 'chw07', name: 'Josiane Belizaire', site: 'PON' },
];

// Base demo date — the simulation slider moves forward from this
const BASE_DATE = new Date('2026-01-15');
let SIM_DAYS = 0; // incremented by slider

function simDate(offset = 0) {
  const d = new Date(BASE_DATE);
  d.setDate(d.getDate() + SIM_DAYS + offset);
  return d;
}

function fmtDate(d) {
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function daysSince(dateStr) {
  const d = new Date(dateStr);
  const now = simDate();
  return Math.floor((now - d) / 86400000);
}

// ── PATIENTS ──
// Programs: USN (inpatient SAM), PTA (outpatient SAM), PNS (preventive/MAM)
// Status: active, discharged
// Risk computed dynamically based on simDate

const PATIENTS_RAW = [
  // ── USN PATIENTS (inpatient SAM) ──
  {
    id: 'PIH-2025-0041', name: 'Esperancia Dorival', age_months: 14, sex: 'F',
    program: 'USN', site: 'HUM', chw: 'chw01',
    admission_date: '2025-12-18',
    admission_weight: 5.8, admission_muac: 102, oedema_admission: true,
    visits: [
      { date: '2025-12-18', weight: 5.8, muac: 102, pt: 68, oedema: true, type: 'Admission' },
      { date: '2025-12-25', weight: 6.1, muac: 106, pt: 71, oedema: true, type: 'Suivi' },
      { date: '2026-01-02', weight: 6.5, muac: 110, pt: 74, oedema: false, type: 'Suivi' },
      { date: '2026-01-09', weight: 6.9, muac: 113, pt: 77, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2026-01-09',
    status: 'active',
    notes: 'Bonne progression. Oedème résolu.',
  },
  {
    id: 'PIH-2025-0055', name: 'Joudly Mésidor', age_months: 9, sex: 'M',
    program: 'USN', site: 'HUM', chw: 'chw01',
    admission_date: '2025-12-28',
    admission_weight: 4.9, admission_muac: 98, oedema_admission: false,
    visits: [
      { date: '2025-12-28', weight: 4.9, muac: 98, pt: 65, oedema: false, type: 'Admission' },
      { date: '2026-01-04', weight: 5.0, muac: 99, pt: 66, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2026-01-04',
    status: 'active',
    notes: 'Gain de poids insuffisant. Surveillance rapprochée requise.',
  },
  {
    id: 'PIH-2026-0003', name: 'Naomie Cadet', age_months: 22, sex: 'F',
    program: 'USN', site: 'HIN', chw: 'chw04',
    admission_date: '2026-01-05',
    admission_weight: 7.2, admission_muac: 105, oedema_admission: true,
    visits: [
      { date: '2026-01-05', weight: 7.2, muac: 105, pt: 70, oedema: true, type: 'Admission' },
      { date: '2026-01-12', weight: 7.4, muac: 107, pt: 72, oedema: true, type: 'Suivi' },
    ],
    last_visit: '2026-01-12',
    status: 'active',
    notes: 'Oedème persistant. Transfert à considérer si pas d\'amélioration.',
  },
  {
    id: 'PIH-2025-0038', name: 'Wadley Jean-Baptiste', age_months: 18, sex: 'M',
    program: 'USN', site: 'BCH', chw: 'chw06',
    admission_date: '2025-11-20',
    admission_weight: 6.1, admission_muac: 100, oedema_admission: false,
    visits: [
      { date: '2025-11-20', weight: 6.1, muac: 100, pt: 67, oedema: false, type: 'Admission' },
      { date: '2025-11-27', weight: 6.4, muac: 103, pt: 69, oedema: false, type: 'Suivi' },
      { date: '2025-12-04', weight: 6.8, muac: 107, pt: 72, oedema: false, type: 'Suivi' },
      { date: '2025-12-12', weight: 7.2, muac: 111, pt: 76, oedema: false, type: 'Suivi' },
      { date: '2025-12-20', weight: 7.7, muac: 115, pt: 80, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-20',
    status: 'active',
    notes: 'Excellente progression. Proche du seuil de sortie.',
  },

  // ── PTA PATIENTS (outpatient SAM) ──
  {
    id: 'PIH-2025-0061', name: 'Dieudonné Exantus', age_months: 30, sex: 'M',
    program: 'PTA', site: 'HUM', chw: 'chw02',
    admission_date: '2025-12-10',
    admission_weight: 9.3, admission_muac: 112, oedema_admission: false,
    visits: [
      { date: '2025-12-10', weight: 9.3, muac: 112, pt: 73, oedema: false, type: 'Admission' },
      { date: '2025-12-24', weight: 9.6, muac: 114, pt: 74, oedema: false, type: 'Suivi' },
      { date: '2026-01-07', weight: 9.9, muac: 116, pt: 76, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2026-01-07',
    status: 'active',
    notes: 'Progression stable.',
  },
  {
    id: 'PIH-2025-0073', name: 'Loudmia Sainvil', age_months: 16, sex: 'F',
    program: 'PTA', site: 'SAP', chw: 'chw03',
    admission_date: '2025-11-28',
    admission_weight: 6.8, admission_muac: 108, oedema_admission: false,
    visits: [
      { date: '2025-11-28', weight: 6.8, muac: 108, pt: 71, oedema: false, type: 'Admission' },
      { date: '2025-12-12', weight: 7.0, muac: 109, pt: 72, oedema: false, type: 'Suivi' },
      { date: '2025-12-26', weight: 7.1, muac: 109, pt: 73, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-26',
    status: 'active',
    notes: 'Gain de poids très lent. Adhérence aux suppléments à vérifier.',
  },
  {
    id: 'PIH-2025-0081', name: 'Cherdly Noël', age_months: 24, sex: 'M',
    program: 'PTA', site: 'LAS', chw: 'chw05',
    admission_date: '2025-12-01',
    admission_weight: 8.1, admission_muac: 110, oedema_admission: false,
    visits: [
      { date: '2025-12-01', weight: 8.1, muac: 110, pt: 72, oedema: false, type: 'Admission' },
      { date: '2025-12-15', weight: 8.4, muac: 112, pt: 74, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-15',
    status: 'active',
    notes: 'Dernier rendez-vous manqué le 29 déc.',
  },
  {
    id: 'PIH-2025-0066', name: 'Thérèse Milfort', age_months: 36, sex: 'F',
    program: 'PTA', site: 'PON', chw: 'chw07',
    admission_date: '2025-11-15',
    admission_weight: 10.2, admission_muac: 111, oedema_admission: false,
    visits: [
      { date: '2025-11-15', weight: 10.2, muac: 111, pt: 73, oedema: false, type: 'Admission' },
      { date: '2025-11-29', weight: 10.5, muac: 113, pt: 74, oedema: false, type: 'Suivi' },
      { date: '2025-12-13', weight: 10.9, muac: 115, pt: 76, oedema: false, type: 'Suivi' },
      { date: '2025-12-27', weight: 11.2, muac: 117, pt: 78, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-27',
    status: 'active',
    notes: 'Proche du seuil de guérison.',
  },
  {
    id: 'PIH-2025-0089', name: 'Bernadin Clervil', age_months: 20, sex: 'M',
    program: 'PTA', site: 'HIN', chw: 'chw04',
    admission_date: '2025-12-05',
    admission_weight: 7.5, admission_muac: 109, oedema_admission: false,
    visits: [
      { date: '2025-12-05', weight: 7.5, muac: 109, pt: 72, oedema: false, type: 'Admission' },
      { date: '2025-12-19', weight: 7.6, muac: 108, pt: 71, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-19',
    status: 'active',
    notes: 'MUAC en régression. Réévaluation urgente nécessaire.',
  },

  // ── PNS PATIENTS (preventive / MAM) ──
  {
    id: 'PIH-2025-0102', name: 'Magalie Augustin', age_months: 12, sex: 'F',
    program: 'PNS', site: 'HUM', chw: 'chw01',
    admission_date: '2025-12-20',
    admission_weight: 7.1, admission_muac: 124, oedema_admission: false,
    visits: [
      { date: '2025-12-20', weight: 7.1, muac: 124, pt: 82, oedema: false, type: 'Admission' },
      { date: '2026-01-03', weight: 7.4, muac: 126, pt: 84, oedema: false, type: 'Suivi' },
      { date: '2026-01-13', weight: 7.7, muac: 128, pt: 86, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2026-01-13',
    status: 'active',
    notes: 'Bonne réponse aux suppléments.',
  },
  {
    id: 'PIH-2025-0115', name: 'Rovensky Pierre-Louis', age_months: 27, sex: 'M',
    program: 'PNS', site: 'SAP', chw: 'chw03',
    admission_date: '2025-11-25',
    admission_weight: 9.8, admission_muac: 122, oedema_admission: false,
    visits: [
      { date: '2025-11-25', weight: 9.8, muac: 122, pt: 80, oedema: false, type: 'Admission' },
      { date: '2025-12-09', weight: 10.0, muac: 123, pt: 81, oedema: false, type: 'Suivi' },
      { date: '2025-12-23', weight: 10.1, muac: 122, pt: 80, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-23',
    status: 'active',
    notes: 'Stagnation du poids. Visite domiciliaire recommandée.',
  },
  {
    id: 'PIH-2025-0121', name: 'Lovely Désir', age_months: 19, sex: 'F',
    program: 'PNS', site: 'BCH', chw: 'chw06',
    admission_date: '2025-12-15',
    admission_weight: 8.3, admission_muac: 125, oedema_admission: false,
    visits: [
      { date: '2025-12-15', weight: 8.3, muac: 125, pt: 83, oedema: false, type: 'Admission' },
      { date: '2025-12-29', weight: 8.6, muac: 127, pt: 84, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-29',
    status: 'active',
    notes: 'Progression normale.',
  },
  {
    id: 'PIH-2025-0098', name: 'Widlyne Métayer', age_months: 48, sex: 'F',
    program: 'PNS', site: 'LAS', chw: 'chw05',
    admission_date: '2025-10-10',
    admission_weight: 13.5, admission_muac: 121, oedema_admission: false,
    visits: [
      { date: '2025-10-10', weight: 13.5, muac: 121, pt: 79, oedema: false, type: 'Admission' },
      { date: '2025-10-24', weight: 13.8, muac: 123, pt: 80, oedema: false, type: 'Suivi' },
      { date: '2025-11-07', weight: 14.1, muac: 125, pt: 82, oedema: false, type: 'Suivi' },
      { date: '2025-11-21', weight: 14.5, muac: 127, pt: 84, oedema: false, type: 'Suivi' },
      { date: '2025-12-05', weight: 14.9, muac: 129, pt: 86, oedema: false, type: 'Suivi' },
    ],
    last_visit: '2025-12-05',
    status: 'active',
    notes: 'Séjour long mais progression constante. Dossier à réviser.',
  },
  {
    id: 'PIH-2026-0011', name: 'Kesly Dormeus', age_months: 8, sex: 'M',
    program: 'PNS', site: 'PON', chw: 'chw07',
    admission_date: '2026-01-08',
    admission_weight: 5.9, admission_muac: 122, oedema_admission: false,
    visits: [
      { date: '2026-01-08', weight: 5.9, muac: 122, pt: 81, oedema: false, type: 'Admission' },
    ],
    last_visit: '2026-01-08',
    status: 'active',
    notes: 'Nouveau patient. Première visite de suivi planifiée.',
  },
];

// ── DISCHARGED PATIENTS (for analytics cohort analysis) ──
const DISCHARGED_PATIENTS = [
  { id:'PIH-2025-0001', name:'Claudine Sénat', age_months:15, sex:'F', program:'USN', site:'HUM', admission_date:'2025-09-01', discharge_date:'2025-10-14', outcome:'Guéri', stay_days:43, admission_weight:5.2, discharge_weight:7.1 },
  { id:'PIH-2025-0002', name:'Roody Hyppolite', age_months:22, sex:'M', program:'PTA', site:'HIN', admission_date:'2025-09-05', discharge_date:'2025-11-02', outcome:'Guéri', stay_days:58, admission_weight:7.8, discharge_weight:10.1 },
  { id:'PIH-2025-0008', name:'Fabiola Dorce', age_months:10, sex:'F', program:'USN', site:'BCH', admission_date:'2025-09-12', discharge_date:'2025-10-28', outcome:'Guéri', stay_days:46, admission_weight:4.8, discharge_weight:6.4 },
  { id:'PIH-2025-0012', name:'Wilfrid Joseph', age_months:36, sex:'M', program:'PNS', site:'SAP', admission_date:'2025-09-15', discharge_date:'2025-11-10', outcome:'Guéri', stay_days:56, admission_weight:11.2, discharge_weight:13.0 },
  { id:'PIH-2025-0015', name:'Nadine Laguerre', age_months:18, sex:'F', program:'PTA', site:'LAS', admission_date:'2025-09-20', discharge_date:'2025-11-28', outcome:'Abandon', stay_days:69, admission_weight:6.9, discharge_weight:7.2 },
  { id:'PIH-2025-0018', name:'Saintilus Bien-Aimé', age_months:28, sex:'M', program:'PNS', site:'PON', admission_date:'2025-09-22', discharge_date:'2025-11-15', outcome:'Guéri', stay_days:54, admission_weight:9.5, discharge_weight:11.8 },
  { id:'PIH-2025-0022', name:'Guerline Prophète', age_months:14, sex:'F', program:'USN', site:'HUM', admission_date:'2025-10-01', discharge_date:'2025-11-20', outcome:'Guéri', stay_days:50, admission_weight:5.5, discharge_weight:7.3 },
  { id:'PIH-2025-0025', name:'Michelet Fleurival', age_months:30, sex:'M', program:'PTA', site:'HIN', admission_date:'2025-10-05', discharge_date:'2025-12-01', outcome:'Transféré', stay_days:57, admission_weight:9.0, discharge_weight:9.8 },
  { id:'PIH-2025-0029', name:'Annette Célestin', age_months:8, sex:'F', program:'USN', site:'BCH', admission_date:'2025-10-10', discharge_date:'2025-11-30', outcome:'Guéri', stay_days:51, admission_weight:4.5, discharge_weight:6.0 },
  { id:'PIH-2025-0031', name:'Duplex Moïse', age_months:42, sex:'M', program:'PNS', site:'HUM', admission_date:'2025-10-12', discharge_date:'2025-12-05', outcome:'Guéri', stay_days:54, admission_weight:13.0, discharge_weight:15.2 },
  { id:'PIH-2025-0033', name:'Stéphane Larose', age_months:20, sex:'M', program:'PTA', site:'SAP', admission_date:'2025-10-15', discharge_date:'2025-12-10', outcome:'Abandon', stay_days:56, admission_weight:7.2, discharge_weight:7.5 },
  { id:'PIH-2025-0035', name:'Vanie Pierre', age_months:16, sex:'F', program:'USN', site:'LAS', admission_date:'2025-10-18', discharge_date:'2025-12-08', outcome:'Décédé', stay_days:51, admission_weight:4.2, discharge_weight:null },
  { id:'PIH-2025-0037', name:'Jeanty Morissaint', age_months:24, sex:'M', program:'PNS', site:'PON', admission_date:'2025-11-01', discharge_date:'2025-12-28', outcome:'Guéri', stay_days:57, admission_weight:8.8, discharge_weight:11.0 },
  { id:'PIH-2025-0039', name:'Celestine Alcide', age_months:13, sex:'F', program:'PTA', site:'HUM', admission_date:'2025-11-05', discharge_date:'2026-01-10', outcome:'Guéri', stay_days:66, admission_weight:6.0, discharge_weight:8.2 },
  { id:'PIH-2025-0043', name:'Bénissoit Fleurant', age_months:36, sex:'M', program:'USN', site:'HIN', admission_date:'2025-11-08', discharge_date:'2026-01-05', outcome:'Guéri', stay_days:58, admission_weight:10.1, discharge_weight:13.0 },
];

// ── ALERT LOG ──
// Pre-populated with realistic alerts. New ones added by simulation.
let ALERT_LOG = [
  { id: 'a001', time: '2026-01-15 07:00', type: 'daily', patient_id: null, chw: 'chw01', fr: 'Résumé quotidien — 3 patients à visiter, 1 en retard', en: 'Daily digest — 3 patients to visit, 1 overdue', channel: 'whatsapp', icon: '📋' },
  { id: 'a002', time: '2026-01-15 07:01', type: 'daily', patient_id: null, chw: 'chw04', fr: 'Résumé quotidien — 2 patients à visiter', en: 'Daily digest — 2 patients to visit', channel: 'whatsapp', icon: '📋' },
  { id: 'a003', time: '2026-01-14 08:30', type: 'urgent', patient_id: 'PIH-2025-0081', chw: 'chw05', fr: 'URGENT — Cherdly Noël (PTA/LAS) n\'a pas été vu depuis 27 jours', en: 'URGENT — Cherdly Noël (PTA/LAS) not seen for 27 days', channel: 'whatsapp', icon: '🚨' },
  { id: 'a004', time: '2026-01-13 09:15', type: 'urgent', patient_id: 'PIH-2025-0089', chw: 'chw04', fr: 'URGENT — Bernadin Clervil (PTA/HIN): MUAC en régression (109→108)', en: 'URGENT — Bernadin Clervil (PTA/HIN): MUAC declining (109→108)', channel: 'whatsapp', icon: '🚨' },
  { id: 'a005', time: '2026-01-13 09:16', type: 'escalation', patient_id: 'PIH-2025-0089', chw: null, fr: 'ESCALADE — Bernadin Clervil: alerte MUAC non acquittée après 24h. Superviseur notifié.', en: 'ESCALATION — Bernadin Clervil: MUAC alert unacknowledged after 24h. Supervisor notified.', channel: 'email', icon: '🔴' },
  { id: 'a006', time: '2026-01-10 07:00', type: 'weekly', patient_id: null, chw: null, fr: 'Rapport hebdomadaire — Site HUM: 5 actifs, 2 en retard, taux de guérison 84%', en: 'Weekly report — Site HUM: 5 active, 2 overdue, recovery rate 84%', channel: 'email', icon: '📊' },
  { id: 'a007', time: '2026-01-09 11:00', type: 'urgent', patient_id: 'PIH-2025-0115', chw: 'chw03', fr: 'URGENT — Rovensky Pierre-Louis (PNS/SAP): stagnation du poids — 3 semaines sans progrès', en: 'URGENT — Rovensky Pierre-Louis (PNS/SAP): weight stagnation — 3 weeks without progress', channel: 'whatsapp', icon: '🚨' },
  { id: 'a008', time: '2026-01-07 07:00', type: 'daily', patient_id: null, chw: 'chw06', fr: 'Résumé quotidien — 2 patients à visiter cette semaine', en: 'Daily digest — 2 patients to visit this week', channel: 'whatsapp', icon: '📋' },
  { id: 'a009', time: '2026-01-03 07:00', type: 'weekly', patient_id: null, chw: null, fr: 'Rapport hebdomadaire — 3 sites: 14 actifs, taux de guérison mensuel 78%', en: 'Weekly report — 3 sites: 14 active, monthly recovery rate 78%', channel: 'email', icon: '📊' },
  { id: 'a010', time: '2025-12-28 10:00', type: 'urgent', patient_id: 'PIH-2025-0055', chw: 'chw01', fr: 'URGENT — Joudly Mésidor (USN/HUM): gain de poids insuffisant semaine 1', en: 'URGENT — Joudly Mésidor (USN/HUM): insufficient weight gain week 1', channel: 'whatsapp', icon: '🚨' },
];

// ── RISK SCORING ──
// Returns: 'critical' | 'high' | 'moderate' | 'low'
// Based on: days overdue, MUAC trend, weight gain, oedema

function computeRisk(patient) {
  const days = daysSince(patient.last_visit);
  const visits = patient.visits;
  const lastVisit = visits[visits.length - 1];
  const prevVisit = visits.length > 1 ? visits[visits.length - 2] : null;

  let score = 0;

  // Overdue penalty (USN: >7 days critical, PTA: >14 days critical)
  const overdueThreshold = patient.program === 'USN' ? 7 : 14;
  if (days > overdueThreshold * 2) score += 4;
  else if (days > overdueThreshold) score += 3;
  else if (days > overdueThreshold * 0.7) score += 1;

  // Oedema
  if (lastVisit && lastVisit.oedema) score += 3;

  // MUAC declining
  if (prevVisit && lastVisit && lastVisit.muac < prevVisit.muac) score += 2;

  // MUAC very low
  if (lastVisit && lastVisit.muac < 105) score += 3;
  else if (lastVisit && lastVisit.muac < 115) score += 1;

  // Weight gain < 5g/kg/day (approximate — between last two visits)
  if (prevVisit && lastVisit) {
    const daysBetween = Math.max(1, (new Date(lastVisit.date) - new Date(prevVisit.date)) / 86400000);
    const gainRate = ((lastVisit.weight - prevVisit.weight) * 1000) / (prevVisit.weight * daysBetween);
    if (gainRate < 0) score += 3;
    else if (gainRate < 3) score += 2;
    else if (gainRate < 5) score += 1;
  }

  if (score >= 6) return 'critical';
  if (score >= 4) return 'high';
  if (score >= 2) return 'moderate';
  return 'low';
}

function getRiskLabel(risk) {
  const labels = {
    critical: { fr: 'Critique', en: 'Critical' },
    high: { fr: 'Élevé', en: 'High' },
    moderate: { fr: 'Modéré', en: 'Moderate' },
    low: { fr: 'Faible', en: 'Low' },
  };
  return labels[risk] || labels.low;
}

function getOverdueLabel(patient) {
  const days = daysSince(patient.last_visit);
  const threshold = patient.program === 'USN' ? 7 : 14;
  if (days <= threshold) return null;
  return { days, overdue: days - threshold };
}

function getPatients() {
  return PATIENTS_RAW.map(p => ({
    ...p,
    risk: computeRisk(p),
    days_since_visit: daysSince(p.last_visit),
    overdue: getOverdueLabel(p),
  })).sort((a, b) => {
    const order = { critical: 0, high: 1, moderate: 2, low: 3 };
    return order[a.risk] - order[b.risk];
  });
}

function getSiteStats() {
  const patients = getPatients();
  return SITES.map(site => {
    const sp = patients.filter(p => p.site === site.id);
    const alerts = sp.filter(p => p.risk === 'critical' || p.risk === 'high').length;
    return { ...site, count: sp.length, alerts, patients: sp };
  }).filter(s => s.count > 0);
}

function getCHWPatients(chwId) {
  return getPatients().filter(p => p.chw === chwId);
}

// ── COHORT DATA for analytics ──
const COHORT_DATA = [
  { month: 'Oct 2025', admitted: 12, recovered: 9, defaulted: 1, transferred: 1, deceased: 1, active: 0 },
  { month: 'Nov 2025', admitted: 14, recovered: 8, defaulted: 2, transferred: 1, deceased: 0, active: 3 },
  { month: 'Déc 2025', admitted: 11, recovered: 3, defaulted: 1, transferred: 0, deceased: 0, active: 7 },
  { month: 'Jan 2026', admitted: 4, recovered: 0, defaulted: 0, transferred: 0, deceased: 0, active: 4 },
];

const MONTHLY_ADMISSIONS = [
  { month: 'Juil', usn: 8, pta: 12, pns: 15 },
  { month: 'Août', usn: 10, pta: 14, pns: 18 },
  { month: 'Sep', usn: 7, pta: 11, pns: 14 },
  { month: 'Oct', usn: 9, pta: 13, pns: 16 },
  { month: 'Nov', usn: 11, pta: 16, pns: 19 },
  { month: 'Déc', usn: 8, pta: 10, pns: 14 },
  { month: 'Jan', usn: 3, pta: 5, pns: 6 },
];
