import React, { useState, useMemo } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck2,
  Layers,
  Search,
  Eye,
  Award,
  Archive,
  BookOpen,
  FolderPlus,
  ShieldAlert,
  Calendar,
  PieChart as PieChartIcon,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';

// Default fallback dataset for Admin / Leadership workspace
const DEFAULT_ADMIN_STUDIES = [
  {
    studyId: 'AIIA-AYU-001',
    ctriNumber: 'CTRI/2026/04/08912',
    title: 'Ashwagandha Extract in Type 2 Diabetes Mellitus',
    shortTitle: 'Ashwagandha T2DM Trial',
    phase: 'Phase II',
    status: 'Active',
    stage: 'Enrolment / Randomization',
    principalInvestigator: 'Dr. Ananya Sharma',
    primarySite: 'AIIA Central Hospital, New Delhi',
    participants: { enrolled: 148, target: 200 },
    ethicsRegulatory: { ctriStatus: 'Registered (Prospective)', approvalExpiry: '2027-04-15' },
    complianceScore: 98.4,
    safety: { adverseEvents: 12, seriousAdverseEvents: 1 },
    closeOutStatus: 'In Progress',
    publicationStatus: 'Manuscript Drafted',
  },
  {
    studyId: 'AIIA-AYU-002',
    ctriNumber: 'CTRI/2026/05/09104',
    title: 'Guggulu Formulations in Osteoarthritis Management',
    shortTitle: 'Guggulu OA Protocol',
    phase: 'Phase III',
    status: 'Delayed',
    stage: 'Site Activation',
    principalInvestigator: 'Dr. Rajesh Kumar',
    primarySite: 'AIIA Satellite Centre, Goa',
    participants: { enrolled: 92, target: 150 },
    ethicsRegulatory: { ctriStatus: 'Registered (Prospective)', approvalExpiry: '2026-10-30' },
    complianceScore: 89.2,
    safety: { adverseEvents: 18, seriousAdverseEvents: 2 },
    closeOutStatus: 'Pending Initiation',
    publicationStatus: 'Protocol Registered',
  },
  {
    studyId: 'AIIA-AYU-003',
    ctriNumber: 'CTRI/2026/01/06120',
    title: 'Brahmi Rasayana in Cognitive Function Improvement',
    shortTitle: 'Brahmi Nootropic Study',
    phase: 'Phase II',
    status: 'Active',
    stage: 'Data Collection',
    principalInvestigator: 'Dr. K. V. Raghunath',
    primarySite: 'AIIA Peripheral Unit, Haridwar',
    participants: { enrolled: 61, target: 120 },
    ethicsRegulatory: { ctriStatus: 'Registered (Prospective)', approvalExpiry: '2027-01-20' },
    complianceScore: 95.0,
    safety: { adverseEvents: 5, seriousAdverseEvents: 0 },
    closeOutStatus: 'Not Started',
    publicationStatus: 'In Peer Review',
  },
  {
    studyId: 'AIIA-AYU-004',
    ctriNumber: 'CTRI/2026/03/07844',
    title: 'Shirishadi Kwath in Bronchial Asthma Control',
    shortTitle: 'Shirishadi Asthma Study',
    phase: 'Phase II',
    status: 'Completed',
    stage: 'Close-out & Archiving',
    principalInvestigator: 'Dr. Meera S.',
    primarySite: 'AIIA Central Hospital, New Delhi',
    participants: { enrolled: 100, target: 100 },
    ethicsRegulatory: { ctriStatus: 'Registered (Prospective)', approvalExpiry: '2027-02-18' },
    complianceScore: 100.0,
    safety: { adverseEvents: 8, seriousAdverseEvents: 1 },
    closeOutStatus: 'Archived (21 CFR Part 11)',
    publicationStatus: 'Published in AYU Journal',
  }
];

export default function AdminDashboard({
  studies = [],
  onOpenStudy,
  onAddProtocol
}) {
  const dataset = useMemo(() => {
    return (studies && studies.length > 0) ? studies : DEFAULT_ADMIN_STUDIES;
  }, [studies]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filtered Studies Calculation
  const filteredStudies = useMemo(() => {
    return dataset.filter(s => {
      const matchSearch = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.studyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.principalInvestigator || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.ctriNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [dataset, searchQuery, statusFilter]);

  // High-Level Leadership Portfolio Metrics
  const totalStudies = dataset.length;
  const activeStudies = dataset.filter(s => s.status === 'Active' || s.status === 'Recruiting').length;
  const delayedStudies = dataset.filter(s => s.status === 'Delayed').length;
  const ctriRegisteredCount = dataset.filter(s => s.ctriNumber || s.ethicsRegulatory?.ctriStatus?.includes('Registered')).length;
  const totalEnrolled = dataset.reduce((acc, s) => acc + (s.participants?.enrolled || 0), 0);
  const totalTarget = dataset.reduce((acc, s) => acc + (s.participants?.target || 0), 0);
  const avgCompliance = Math.round(dataset.reduce((acc, s) => acc + (s.complianceScore || 95), 0) / (totalStudies || 1));
  const totalSaes = dataset.reduce((acc, s) => acc + (s.safety?.seriousAdverseEvents || 0), 0);

  const kpis = [
    { label: 'Total Portfolio Studies', val: totalStudies, icon: Building2, accent: 'border-t-sage', sub: `${activeStudies} Active · ${delayedStudies} Delayed` },
    { label: 'CTRI Registration Rate', val: `${Math.round((ctriRegisteredCount / (totalStudies || 1)) * 100)}%`, icon: Award, accent: 'border-t-gold-ink', sub: `${ctriRegisteredCount}/${totalStudies} CTRI Prospectively Verified` },
    { label: 'Overall Recruitment Target', val: `${totalEnrolled}/${totalTarget}`, icon: TrendingUp, accent: 'border-t-sage', sub: `${Math.round((totalEnrolled / (totalTarget || 1)) * 100)}% Portfolio Completion` },
    { label: 'Avg GCP Compliance Score', val: `${avgCompliance}%`, icon: ShieldCheck, accent: 'border-t-sage', sub: 'Across all active trial sites' },
    { label: 'Safety & SAE Alerts', val: totalSaes, icon: ShieldAlert, accent: 'border-t-clay', sub: `${totalSaes} Expedited SAEs Monitored` },
  ];

  return (
    <div className="w-full pt-5">
      
      {/* 1. ADMINISTRATION & LEADERSHIP HEADER */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">
              Institutional Governance
            </span>
            <span className="text-[11px] font-semibold text-gold-ink">
              · AIIA Portfolio Leadership Desk
            </span>
          </div>
          <h1 className="m-0 text-[28px] tracking-tight text-forest">
            Administration & Portfolio Leadership
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Overarching logistics, site setup, CTRI registrations, high-level milestone progress, close-outs, and publication oversight.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {onAddProtocol && (
            <button
              type="button"
              onClick={onAddProtocol}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-2 text-xs font-semibold text-cream-ink shadow-sm transition-all hover:bg-sage-deep"
            >
              <FolderPlus size={15} /> Setup / Register Protocol
            </button>
          )}
        </div>
      </div>

      {/* 2. EXECUTIVE KPI & RISK SUMMARY GRID */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k, i) => (
          <div
            key={i}
            className={`min-h-[108px] rounded-b-[10px] border border-ochre border-t-[3px] bg-cream px-4 py-3.5 shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5 ${k.accent}`}
          >
            <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
              <span>{k.label}</span>
              <k.icon size={15} className="text-muted" />
            </div>
            <div className="text-[26px] font-extrabold leading-none text-forest">
              {k.val}
            </div>
            <div className="mt-1.5 text-xs text-muted">
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 3. PORTFOLIO-WIDE STUDY DIRECTORY TABLE */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
              <Briefcase size={16} className="text-gold-ink" /> Institutional Portfolio & CTRI Tracking
            </h3>
            <p className="mt-1 text-xs text-muted">
              Master overview of protocol setups, recruitment progress, CTRI status, and compliance scores.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search study, PI, CTRI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-ochre bg-linen py-1.5 pl-8 pr-3 text-xs text-forest placeholder:text-muted/70 focus:outline-none focus:ring-1 focus:ring-sage"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-ochre bg-linen px-3 py-1.5 text-xs font-semibold text-forest focus:outline-none focus:ring-1 focus:ring-sage"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="max-h-96 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['Protocol ID & Title', 'PI & Primary Site', 'CTRI Registration', 'Lifecycle Stage', 'Enrolment / Target', 'Compliance', 'Status', 'Action'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudies.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3.5 py-6 text-center text-muted">
                    No institutional protocols found matching query.
                  </td>
                </tr>
              )}
              {filteredStudies.map((s) => {
                const enrPct = s.participants?.target ? Math.round((s.participants.enrolled / s.participants.target) * 100) : 0;

                return (
                  <tr
                    key={s.studyId}
                    onMouseEnter={() => setHoveredRow(s.studyId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onOpenStudy && onOpenStudy(s)}
                    className="cursor-pointer border-b border-ochre/40 last:border-0 hover:bg-mint transition-colors"
                  >
                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-forest">{s.studyId}</div>
                      <div className="mt-0.5 text-[11px] text-muted">{s.shortTitle || s.title}</div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <div className="font-semibold text-forest">{s.principalInvestigator}</div>
                      <div className="mt-0.5 text-[11px] text-muted">{s.primarySite || s.leadSite || 'AIIA Unit'}</div>
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3.5 font-bold text-gold-ink">
                      {s.ctriNumber || 'CTRI Pending'}
                    </td>
                    <td className="px-3.5 py-3.5 text-xs font-semibold text-forest">
                      {s.stage || 'Active Trial'}
                    </td>
                    <td className="min-w-[140px] px-3.5 py-3.5">
                      <div className="mb-1 flex justify-between text-[11px] text-muted">
                        <span>{s.participants?.enrolled || 0}/{s.participants?.target || 0}</span>
                        <span className="font-bold text-forest">{enrPct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-linen">
                        <div className="h-full bg-sage" style={{ width: `${Math.min(enrPct, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5 font-extrabold text-sage-deep">
                      {s.complianceScore || 95}%
                    </td>
                    <td className="px-3.5 py-3.5">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-3.5 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenStudy) onOpenStudy(s);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-sage px-2.5 py-1 text-xs font-semibold text-cream-ink hover:bg-sage-deep transition-colors"
                      >
                        <Eye size={12} /> Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. ADMINISTRATIVE CLOSE-OUT, ARCHIVING & PUBLICATIONS OVERVIEW */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        
        {/* Administrative Close-Out & Archiving Panel */}
        <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
          <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
            <Archive size={16} className="text-gold-ink" /> Study Close-Out & 21 CFR Part 11 Archiving
          </h3>
          <p className="mb-3 mt-1 text-xs text-muted">
            Administrative tracking of study completion, TMF reconciliation, and regulatory archiving.
          </p>

          <div className="flex flex-col gap-2">
            {dataset.map((s) => (
              <div
                key={s.studyId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5 text-xs transition-colors hover:bg-mint/40"
              >
                <div>
                  <span className="font-bold text-forest">{s.studyId}</span>
                  <div className="mt-0.5 text-[11px] text-muted">{s.shortTitle}</div>
                </div>
                <StatusPill
                  status={s.closeOutStatus?.includes('Archived') ? 'Completed' : s.closeOutStatus === 'In Progress' ? 'Pending' : 'Pending'}
                  text={s.closeOutStatus || 'Active Study'}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Publication & Reporting Oversight Panel */}
        <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
          <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
            <BookOpen size={16} className="text-sage-deep" /> Reporting & Publication Logistics
          </h3>
          <p className="mb-3 mt-1 text-xs text-muted">
            Oversight of trial disclosures, peer-reviewed publications, and Ministry reporting.
          </p>

          <div className="flex flex-col gap-2">
            {dataset.map((s) => (
              <div
                key={s.studyId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5 text-xs transition-colors hover:bg-mint/40"
              >
                <div>
                  <span className="font-bold text-forest">{s.studyId}</span>
                  <div className="mt-0.5 text-[11px] text-muted">PI: {s.principalInvestigator}</div>
                </div>
                <StatusPill
                  status={s.publicationStatus?.includes('Published') ? 'Completed' : s.publicationStatus?.includes('Drafted') ? 'Pending' : 'Active'}
                  text={s.publicationStatus || 'Protocol Registered'}
                />
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}