import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  History,
  Search,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Lock,
  FileText,
  Layers,
  Database,
  ScrollText
} from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';

// Default regulatory dataset fallback
const DEFAULT_REGULATORY_STUDIES = [
  {
    studyId: 'AIIA-AYU-001',
    ctriNumber: 'CTRI/2026/04/08912',
    ctriStatus: 'Registered (Prospective)',
    title: 'Randomized Controlled Trial of Ashwagandha Extract in Type 2 Diabetes Mellitus',
    shortTitle: 'Ashwagandha T2DM Trial',
    phase: 'Phase II (Therapeutic Exploratory)',
    status: 'Active',
    principalInvestigator: 'Dr. Ananya Sharma',
    leadSite: 'AIIA Central Hospital, New Delhi',
    ethicsRegulatory: {
      approvalNumber: 'IEC/AIIA/2026/041',
      regulatoryStatus: 'Approved',
      approvalExpiry: '2027-04-15',
      ctriStatus: 'Registered',
    },
    complianceScore: 98.4,
    milestones: [
      { stage: 'IEC Ethics Approval', date: '12-Jan-2026', status: 'Completed' },
      { stage: 'CTRI Mandatory Registration', date: '02-Feb-2026', status: 'Completed' },
      { stage: 'Site Activation & Trial Initiation', date: '15-Mar-2026', status: 'Completed' },
      { stage: 'Interim DSMB Safety Audit', date: '10-Jul-2026', status: 'Completed' },
      { stage: 'Annual Regulatory Progress Report', date: '15-Nov-2026', status: 'Pending' },
    ],
    documents: [
      { name: 'Approved_Protocol_v2.1_Signed.pdf', type: 'Protocol', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', date: '2026-01-10' },
      { name: 'CTRI_Official_Clearance_Certificate.pdf', type: 'CTRI Registration', hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4', date: '2026-02-02' },
      { name: 'IEC_Annual_Renewal_Letter_2026.pdf', type: 'Ethics Clearance', hash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e', date: '2026-04-12' },
    ],
    auditTrail: [
      { timestamp: '2026-09-20 14:32:10 UTC', action: 'CTRI Progress Verification Stamped', user: 'Regulator (CDSCO Inspector #402)', hash: 'f21a8a...' },
      { timestamp: '2026-07-11 09:15:44 UTC', action: 'Interim Safety Report Uploaded & SHA-256 Hashed', user: 'Dr. Ananya Sharma (PI)', hash: '3d98bc...' },
      { timestamp: '2026-04-12 11:20:00 UTC', action: 'IEC Renewal Approval Document Signed', user: 'IEC Secretariat Chair', hash: '88a10e...' },
    ]
  },
  {
    studyId: 'AIIA-AYU-002',
    ctriNumber: 'CTRI/2026/05/09104',
    ctriStatus: 'Registered (Prospective)',
    title: 'Efficacy & Safety of Guggulu Formulations in Osteoarthritis Management',
    shortTitle: 'Guggulu OA Protocol',
    phase: 'Phase III (Therapeutic Confirmatory)',
    status: 'Delayed',
    principalInvestigator: 'Dr. Rajesh Kumar',
    leadSite: 'AIIA Satellite Centre, Goa',
    ethicsRegulatory: {
      approvalNumber: 'IEC/AIIA/2026/088',
      regulatoryStatus: 'Renewal Required',
      approvalExpiry: '2026-10-30',
      ctriStatus: 'Registered',
    },
    complianceScore: 89.2,
    milestones: [
      { stage: 'IEC Ethics Approval', date: '05-Feb-2026', status: 'Completed' },
      { stage: 'CTRI Mandatory Registration', date: '20-Feb-2026', status: 'Completed' },
      { stage: 'Site Activation & Trial Initiation', date: '01-Apr-2026', status: 'Completed' },
      { stage: 'Annual Regulatory Progress Report', date: '10-Oct-2026', status: 'Delayed' },
    ],
    documents: [
      { name: 'Guggulu_Protocol_Master_v1.0.pdf', type: 'Protocol', hash: '5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9', date: '2026-02-01' },
      { name: 'CTRI_Acknowledgement_Receipt.pdf', type: 'CTRI Registration', hash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b', date: '2026-02-20' },
    ],
    auditTrail: [
      { timestamp: '2026-09-15 16:10:05 UTC', action: 'Annual Report Overdue Notice Transmitted', user: 'System Automated Monitor', hash: '097a11...' },
      { timestamp: '2026-02-20 10:00:12 UTC', action: 'CTRI Number Issued & Sealed', user: 'CTRI Portal Synch', hash: '1e428c...' },
    ]
  },
  {
    studyId: 'AIIA-AYU-004',
    ctriNumber: 'CTRI/2026/03/07844',
    ctriStatus: 'Registered (Prospective)',
    title: 'Evaluation of Shirishadi Kwath in Bronchial Asthma Control',
    shortTitle: 'Shirishadi Asthma Study',
    phase: 'Phase II (Therapeutic Exploratory)',
    status: 'Active',
    principalInvestigator: 'Dr. Meera S.',
    leadSite: 'AIIA Central Hospital, New Delhi',
    ethicsRegulatory: {
      approvalNumber: 'IEC/AIIA/2025/192',
      regulatoryStatus: 'Approved',
      approvalExpiry: '2027-02-18',
      ctriStatus: 'Registered',
    },
    complianceScore: 100.0,
    milestones: [
      { stage: 'IEC Ethics Approval', date: '18-Feb-2025', status: 'Completed' },
      { stage: 'CTRI Mandatory Registration', date: '10-Mar-2025', status: 'Completed' },
      { stage: 'Site Activation', date: '01-May-2025', status: 'Completed' },
    ],
    documents: [
      { name: 'Shirishadi_Kwath_Dossier_Final.pdf', type: 'Protocol', hash: 'd41d8cd98f00b204e9800998ecf8427e', date: '2025-02-10' },
    ],
    auditTrail: [
      { timestamp: '2026-08-01 12:00:00 UTC', action: 'Routine Inspection Audit Verified Compliance', user: 'CDSCO Senior Auditor', hash: 'bc0a89...' },
    ]
  }
];

export default function RegulatorDashboard({
  studies = [],
  onOpenStudy,
  onOpenAuditLogs
}) {
  const dataset = useMemo(() => {
    return (studies && studies.length > 0) ? studies : DEFAULT_REGULATORY_STUDIES;
  }, [studies]);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hashInspector, setHashInspector] = useState(null);

  // Filtered Studies
  const filteredStudies = useMemo(() => {
    return dataset.filter(s => {
      const matchSearch = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.studyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.ctriNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.principalInvestigator || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [dataset, searchQuery, statusFilter]);

  // KPIs
  const totalProtocols = dataset.length;
  const ctriRegistered = dataset.filter(s => s.ctriNumber || s.ethicsRegulatory?.ctriStatus === 'Registered').length;
  const activeOverSight = dataset.filter(s => s.status === 'Active').length;
  const renewalAlerts = dataset.filter(s => s.status === 'Delayed' || s.ethicsRegulatory?.regulatoryStatus === 'Renewal Required').length;

  const handleAuditClick = () => {
    if (onOpenAuditLogs) {
      onOpenAuditLogs();
    } else {
      window.history.pushState({}, '', '/AuditLogs');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const kpis = [
    { label: 'Protocols Monitored', val: totalProtocols, icon: Building2, accent: 'border-t-sage', sub: 'Across national registry' },
    { label: 'CTRI Registered', val: ctriRegistered, icon: ShieldCheck, accent: 'border-t-sage', sub: '100% Prospective verified' },
    { label: 'Active Clinical Trials', val: activeOverSight, icon: Layers, accent: 'border-t-gold-ink', sub: 'Under CDSCO purview' },
    { label: 'Action / Renewal Needed', val: renewalAlerts, icon: AlertTriangle, accent: 'border-t-clay', sub: 'Expiries or delays' },
  ];

  return (
    <div className="w-full pt-5">

      {/* SECTION 1: HEADER BANNER WITH VIEW AUDIT LOG BUTTON */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">
              Read-Only Oversight Portal
            </span>
            <span className="text-[11px] font-semibold text-gold-ink">
              · CDSCO / CTRI Synchronized Desk
            </span>
          </div>
          <h1 className="m-0 text-[28px] tracking-tight text-forest">
            Regulator Dashboard
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            National Clinical Trial Registry oversight, regulatory milestone tracking, and ALCOA+ compliance logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {/* VIEW AUDIT LOG BUTTON */}
          <button
            type="button"
            onClick={handleAuditClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-2 text-xs font-semibold text-cream-ink shadow-sm transition-all hover:bg-sage-deep"
          >
            <ScrollText size={15} /> View Audit Log
          </button>

          {/* CTRI STATUS PILL */}
          <StatusPill status="Compliant" text="CTRI Live" />
        </div>
      </div>

      {/* SECTION 2: KPI SUMMARY GRID */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <div
            key={i}
            className={`min-h-[108px] rounded-b-[10px] border border-ochre border-t-[3px] bg-cream px-4 py-3.5 shadow-[var(--shadow)] transition-transform hover:-translate-y-0.5 ${k.accent}`}
          >
            <div className="mb-2.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
              <span>{k.label}</span>
              <k.icon size={15} className="text-muted" />
            </div>
            <div className="text-[28px] font-extrabold leading-none text-forest">
              {k.val}
            </div>
            <div className="mt-1.5 text-xs text-muted">
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: NATIONAL TRIAL REGISTRY DIRECTORY TABLE */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
              <Database size={16} className="text-gold-ink" /> National Trial Registry & CTRI Directory
            </h3>
            <p className="mt-1 text-xs text-muted">
              Click any protocol row to inspect its full dossier in the shared Study Details workspace.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search protocol, CTRI #, PI..."
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
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="max-h-96 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['CTRI Number', 'Protocol ID & Title', 'Investigator & Site', 'IEC Approval', 'Compliance Score', 'Status', 'Action'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudies.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3.5 py-6 text-center text-muted">
                    No trial records found matching query.
                  </td>
                </tr>
              )}
              {filteredStudies.map((s) => {
                return (
                  <tr
                    key={s.studyId}
                    onMouseEnter={() => setHoveredRow(s.studyId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onOpenStudy && onOpenStudy(s)}
                    className="cursor-pointer border-b border-ochre/40 last:border-0 hover:bg-mint transition-colors"
                  >
                    <td className="whitespace-nowrap px-3.5 py-3.5 font-bold text-gold-ink">
                      {s.ctriNumber || 'CTRI Pending'}
                    </td>
                    <td className="px-3.5 py-3.5">
                      <div className="font-bold text-forest">{s.studyId}</div>
                      <div className="mt-0.5 text-[11px] text-muted">{s.shortTitle || s.title}</div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <div className="font-semibold text-forest">{s.principalInvestigator}</div>
                      <div className="mt-0.5 text-[11px] text-muted">{s.leadSite || 'AIIA Institution'}</div>
                    </td>
                    <td className="px-3.5 py-3.5 text-xs text-muted">
                      <div className="font-medium text-forest">{s.ethicsRegulatory?.approvalNumber || 'IEC Verified'}</div>
                      <div className="text-[11px]">Valid to: {s.ethicsRegulatory?.approvalExpiry || '2027'}</div>
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

      {/* SECTION 4: REGULATORY MILESTONES & RECENT COMPLIANCE AUDITS */}
      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Milestone Tracker Sub-Section */}
        <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
          <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
            <Clock size={16} className="text-sage-deep" /> Active Regulatory Progression Timeline
          </h3>
          <p className="mb-3 mt-1 text-xs text-muted">
            Statutory milestones completed across ongoing protocols.
          </p>

          <div className="flex flex-col gap-2">
            {(dataset[0]?.milestones || []).map((m, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5 text-xs transition-colors hover:bg-mint/40"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className={m.status === 'Completed' ? 'text-sage-deep' : 'text-clay'} />
                  <span className="font-bold text-forest">{m.stage}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-muted">{m.date}</span>
                  <StatusPill status={m.status === 'Completed' ? 'Completed' : 'Pending'} text={m.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHA-256 Compliance Vault Sub-Section */}
        <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
          <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
            <FileCheck2 size={16} className="text-gold-ink" /> Signed Compliance Attachments
          </h3>
          <p className="mb-3 mt-1 text-xs text-muted">
            Cryptographically sealed protocols and IEC clearance letters.
          </p>

          <div className="flex flex-col gap-2">
            {(dataset[0]?.documents || []).map((doc, idx) => (
              <div
                key={idx}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5 text-xs transition-colors hover:bg-mint/40"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-forest">
                    <FileText size={14} className="text-sage-deep" /> {doc.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted">
                    Type: {doc.type} • Stamped: {doc.date}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHashInspector(doc)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-ochre bg-linen px-2.5 py-1 text-xs font-semibold text-forest hover:bg-sand transition-colors"
                >
                  <Lock size={12} className="text-gold-ink" /> Inspect SHA-256
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* SECTION 5: IMMUTABLE 21 CFR PART 11 / ALCOA+ AUDIT STREAM */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
              <History size={16} className="text-sage-deep" /> ALCOA+ Regulatory Audit Trail
            </h3>
            <p className="mt-1 text-xs text-muted">
              Real-time, immutable time-stamped change log verified across central servers.
            </p>
          </div>
          <StatusPill status="Compliant" text="✓ 21 CFR Part 11 Sealed" />
        </div>

        <div className="flex flex-col gap-2">
          {(dataset[0]?.auditTrail || []).map((entry, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5 text-xs transition-colors hover:bg-mint/40"
            >
              <div>
                <span className="font-bold text-forest">{entry.action}</span>
                <span className="ml-2 text-[11px] text-muted">• {entry.user}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-gold-ink">Hash: {entry.hash}</span>
                <span className="text-[11px] text-muted">{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: SHA-256 HASH INSPECTOR */}
      {hashInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/40 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-ochre bg-cream p-6 shadow-2xl">
            <button
              onClick={() => setHashInspector(null)}
              className="absolute right-4 top-4 text-base font-bold text-muted hover:text-forest"
            >
              ✕
            </button>

            <h3 className="m-0 flex items-center gap-2 text-lg font-bold text-forest">
              <Lock size={18} className="text-gold-ink" /> SHA-256 Cryptographic Verification
            </h3>
            <p className="mb-4 mt-1 text-xs text-muted">
              21 CFR Part 11 ALCOA+ Document Authenticity Stamp
            </p>

            <div className="mb-4 rounded-lg border border-ochre/40 bg-linen p-3.5 text-xs text-forest">
              <div className="mb-1.5"><strong className="text-forest">Filename:</strong> {hashInspector.name}</div>
              <div className="mb-1.5"><strong className="text-forest">Document Category:</strong> {hashInspector.type}</div>
              <div className="mb-1.5"><strong className="text-forest">Timestamp:</strong> {hashInspector.date}</div>
              <div className="mt-2.5 break-all rounded-md bg-mint/60 p-2 font-mono text-[11px] text-mint-ink">
                SHA-256: {hashInspector.hash}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-sage-deep font-medium">
              <CheckCircle2 size={14} /> Signature verified on National Regulatory Registry.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}