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
  Briefcase,
  PlusCircle,
  X,
  BrainCircuit,
  Sparkles,
  Users,
  MapPin,
  FileText,
  Target,
  ArrowRight
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

  // "+ Create New Study" Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    protocolId: '',
    studyType: 'Interventional',
    phase: 'Phase II',
    principalInvestigator: '',
    sponsor: 'AIIA National Institute',
    objectives: '',
    targetEnrollment: '150',
    startDate: '',
    endDate: '',
    eligibility: '',
    studyTeam: '',
    sites: 'AIIA Delhi, AIIA Satellite Unit',
    milestones: 'Protocol Approval, Ethics Clearance, CTRI Registration',
    documents: null
  });

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
    { label: 'Total Portfolio Studies', val: totalStudies, icon: Building2, color: 'var(--accent, #84A98C)', sub: `${activeStudies} Active · ${delayedStudies} Delayed` },
    { label: 'CTRI Registration Rate', val: `${Math.round((ctriRegisteredCount / (totalStudies || 1)) * 100)}%`, icon: Award, color: 'var(--accent-gold, #D4A373)', sub: `${ctriRegisteredCount}/${totalStudies} CTRI Prospectively Verified` },
    { label: 'Overall Recruitment Target', val: `${totalEnrolled}/${totalTarget}`, icon: TrendingUp, color: 'var(--accent, #84A98C)', sub: `${Math.round((totalEnrolled / (totalTarget || 1)) * 100)}% Portfolio Completion` },
    { label: 'Avg GCP Compliance Score', val: `${avgCompliance}%`, icon: ShieldCheck, color: 'var(--accent, #84A98C)', sub: 'Across all active trial sites' },
    { label: 'Safety & SAE Alerts', val: totalSaes, icon: ShieldAlert, color: 'var(--accent-terracotta, #C86D51)', sub: `${totalSaes} Expedited SAEs Monitored` },
  ];

  const handleOpenModal = () => {
    if (onAddProtocol) {
      onAddProtocol();
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Protocol ${formData.protocolId || 'AYU-2026'} created successfully! Saved in master directory.`);
    setIsCreateModalOpen(false);
    setModalStep(1);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'var(--text, #1C1917)',
    }}>

      {/* 1. ADMINISTRATION & LEADERSHIP HEADER */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border, #E5E7EB)',
        paddingBottom: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: 'rgba(132, 169, 140, 0.18)',
              color: 'var(--accent, #84A98C)',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
              Institutional Governance
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-gold, #D4A373)' }}>
              · AIIA Portfolio Leadership Desk
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>
            Administration & Portfolio Leadership
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-muted, #78716C)' }}>
            Overarching logistics, site setup, CTRI registrations, milestone progress, and publication oversight.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={handleOpenModal}
            style={{
              background: 'var(--accent, #84A98C)',
              color: '#FFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(132, 169, 140, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <FolderPlus size={18} /> + Setup / Register New Protocol
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {kpis.map((k, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card-bg, #FFF)',
              border: '1px solid var(--border, #E5E7EB)',
              borderTop: `3px solid ${k.color}`,
              borderRadius: '12px',
              padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted, #78716C)' }}>
                {k.label}
              </span>
              <k.icon size={16} color={k.color} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-h, #0C0A09)', lineHeight: 1 }}>
              {k.val}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '6px' }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* AI FEATURE #2: TRIAL DELAY & MILESTONE PREDICTION WIDGET */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-mint-ink border border-sage/40">
                <BrainCircuit size={12} /> AI Intelligence Engine
              </span>
              <span className="text-xs font-semibold text-gold-ink">
                · Trial Delay & Milestone Risk Predictor
              </span>
            </div>

            <h3 className="m-0 text-base font-bold text-forest">
              High Delay Probability Detected: Protocol AIIA-AYU-002
            </h3>

            <p className="mt-1 text-xs text-muted">
              AI models predict a <strong>14-day milestone lag</strong> at AIIA
              Satellite Centre, Goa due to site activation bottlenecks and delayed
              IEC renewals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-ochre bg-gold-ink/10 px-3.5 py-2 text-center">
              <div className="text-[10px] font-bold uppercase text-muted">
                Predicted Delay
              </div>
              <div className="text-base font-black text-gold-ink">
                +14 Days
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  'AI Action Plan Generated: Re-allocating study coordinator resources to Goa unit and initiating accelerated IEC renewal file.'
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-2 text-xs font-bold text-cream-ink shadow-sm transition-all hover:bg-sage-deep"
            >
              <Sparkles size={14} /> Execute AI Mitigations
            </button>
          </div>
        </div>
      </section>

      {/* 3. PORTFOLIO-WIDE STUDY DIRECTORY TABLE */}
      <section style={{
        background: 'var(--card-bg, #FFF)',
        border: '1px solid var(--border, #E5E7EB)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="var(--accent-gold, #D4A373)" /> Institutional Portfolio & CTRI Directory
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
              Master overview of protocol setups, recruitment progress, CTRI status, and compliance scores.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #78716C)' }} />
              <input
                type="text"
                placeholder="Search study, PI, CTRI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 30px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #E5E7EB)',
                  background: 'var(--bg, #FAFAF9)',
                  color: 'var(--text, #1C1917)',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border, #E5E7EB)',
                background: 'var(--bg, #FAFAF9)',
                color: 'var(--text, #1C1917)',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg, #FAFAF9)', borderBottom: '1px solid var(--border, #E5E7EB)' }}>
                {['Protocol ID & Title', 'PI & Primary Site', 'CTRI Registration', 'Lifecycle Stage', 'Enrolment / Target', 'Compliance', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted, #78716C)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudies.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted, #78716C)' }}>
                    No institutional protocols found matching query.
                  </td>
                </tr>
              )}
              {filteredStudies.map((s) => {
                const enrPct = s.participants?.target ? Math.round((s.participants.enrolled / s.participants.target) * 100) : 0;
                const isHovered = hoveredRow === s.studyId;

                return (
                  <tr
                    key={s.studyId}
                    onMouseEnter={() => setHoveredRow(s.studyId)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => onOpenStudy && onOpenStudy(s)}
                    style={{
                      borderBottom: '1px solid var(--border, #E5E7EB)',
                      background: isHovered ? 'rgba(132, 169, 140, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>{s.shortTitle || s.title}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text, #1C1917)' }}>{s.principalInvestigator}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)' }}>{s.primarySite || s.leadSite || 'AIIA Unit'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent-gold, #D4A373)', whiteSpace: 'nowrap' }}>
                      {s.ctriNumber || 'CTRI Pending'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--text, #1C1917)' }}>
                      {s.stage || 'Active Trial'}
                    </td>
                    <td style={{ padding: '12px 14px', minWidth: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted, #78716C)', marginBottom: '4px' }}>
                        <span>{s.participants?.enrolled || 0}/{s.participants?.target || 0}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-h, #0C0A09)' }}>{enrPct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'var(--bg, #FAFAF9)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border, #E5E7EB)' }}>
                        <div style={{ width: `${Math.min(enrPct, 100)}%`, height: '100%', background: 'var(--accent, #84A98C)', borderRadius: '3px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent, #84A98C)' }}>
                      {s.complianceScore || 95}%
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusPill status={s.status} />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenStudy) onOpenStudy(s);
                        }}
                        style={{
                          background: 'var(--accent, #84A98C)',
                          color: '#FFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
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

      {/* 4. ADMINISTRATIVE CLOSE-OUT & PUBLICATIONS PANELS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px'
      }}>

        {/* Close-Out & Archiving Panel */}
        <section style={{
          background: 'var(--card-bg, #FFF)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Archive size={16} color="var(--accent-gold, #D4A373)" /> Study Close-Out & 21 CFR Part 11 Archiving
          </h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
            Administrative tracking of study completion, TMF reconciliation, and regulatory archiving.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dataset.map((s) => (
              <div
                key={s.studyId}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg, #FAFAF9)',
                  border: '1px solid var(--border, #E5E7EB)',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>{s.shortTitle}</div>
                </div>
                <StatusPill
                  status={s.closeOutStatus?.includes('Archived') ? 'Completed' : 'Pending'}
                  text={s.closeOutStatus || 'Active Study'}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Publication & Reporting Oversight Panel */}
        <section style={{
          background: 'var(--card-bg, #FFF)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} color="var(--accent, #84A98C)" /> Reporting & Publication Logistics
          </h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
            Oversight of trial disclosures, peer-reviewed publications, and Ministry reporting.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dataset.map((s) => (
              <div
                key={s.studyId}
                style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--bg, #FAFAF9)',
                  border: '1px solid var(--border, #E5E7EB)',
                  fontSize: '12px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>PI: {s.principalInvestigator}</div>
                </div>
                <StatusPill
                  status={s.publicationStatus?.includes('Published') ? 'Completed' : 'Active'}
                  text={s.publicationStatus || 'Protocol Registered'}
                />
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* 5. MODAL: "+ CREATE NEW STUDY" MULTI-STEP WIZARD */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 2000,
          padding: '20px',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            maxWidth: '680px',
            width: '100%',
            background: 'var(--card-bg, #FFF)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            border: '1px solid var(--border, #E5E7EB)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border, #E5E7EB)', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FolderPlus size={20} color="var(--accent, #84A98C)" /> Setup & Register New Protocol
                </h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
                  Step {modalStep} of 3: {modalStep === 1 ? 'Protocol Metadata & PI' : modalStep === 2 ? 'Enrollment & Trial Logistics' : 'Governance & Documents'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted, #78716C)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Progress Indicator */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: modalStep >= step ? 'var(--accent, #84A98C)' : 'var(--border, #E5E7EB)'
                  }}
                />
              ))}
            </div>

            {/* Form Steps */}
            <form onSubmit={handleFormSubmit}>
              {modalStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                      Full Study Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. Clinical Trial of Ashwagandha in Sleep Disorders"
                      value={formData.title}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Protocol ID *
                      </label>
                      <input
                        type="text"
                        name="protocolId"
                        required
                        placeholder="e.g. AIIA-AYU-011"
                        value={formData.protocolId}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Trial Phase
                      </label>
                      <select
                        name="phase"
                        value={formData.phase}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      >
                        <option value="Phase I">Phase I (Safety / Feasibility)</option>
                        <option value="Phase II">Phase II (Exploratory)</option>
                        <option value="Phase III">Phase III (Confirmatory)</option>
                        <option value="Observational">Observational</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Principal Investigator (PI) *
                      </label>
                      <input
                        type="text"
                        name="principalInvestigator"
                        required
                        placeholder="Dr. Name"
                        value={formData.principalInvestigator}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Primary Sponsor
                      </label>
                      <input
                        type="text"
                        name="sponsor"
                        value={formData.sponsor}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                      Primary & Secondary Objectives
                    </label>
                    <textarea
                      name="objectives"
                      rows={3}
                      placeholder="Specify primary efficacy endpoints..."
                      value={formData.objectives}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Target Enrollment
                      </label>
                      <input
                        type="number"
                        name="targetEnrollment"
                        value={formData.targetEnrollment}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Planned Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                        Expected End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleFormChange}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                      Participating Trial Sites
                    </label>
                    <input
                      type="text"
                      name="sites"
                      value={formData.sites}
                      onChange={handleFormChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'block', marginBottom: '4px' }}>
                      Upload Protocol Dossier (PDF)
                    </label>
                    <input
                      type="file"
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '12px', background: 'var(--bg, #FAFAF9)' }}
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border, #E5E7EB)' }}>
                {modalStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setModalStep(prev => prev - 1)}
                    style={{ background: 'var(--bg, #FAFAF9)', border: '1px solid var(--border, #E5E7EB)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Back
                  </button>
                ) : <div />}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      alert('Draft saved successfully!');
                      setIsCreateModalOpen(false);
                    }}
                    style={{ background: 'transparent', border: '1px solid var(--border, #E5E7EB)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', color: 'var(--text-muted, #78716C)' }}
                  >
                    Save Draft
                  </button>

                  {modalStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setModalStep(prev => prev + 1)}
                      style={{ background: 'var(--accent, #84A98C)', color: '#FFF', border: 'none', padding: '8px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      style={{ background: 'var(--accent, #84A98C)', color: '#FFF', border: 'none', padding: '8px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Create & Submit Study
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}