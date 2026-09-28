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

  return (
    <div style={{
      width: '100%',
      padding: '20px 0',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'var(--text, #1C1917)',
    }}>
      
      {/* 1. ADMINISTRATION & LEADERSHIP HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(20, 40, 25, 0.95) 0%, rgba(35, 60, 40, 0.98) 100%)',
        borderRadius: '16px',
        padding: '24px 28px',
        color: '#EFE8D8',
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.25), 0 0 0 1px rgba(212, 163, 115, 0.3)',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                background: 'linear-gradient(90deg, #84A98C, #D4A373)',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '20px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                🏛️ Institutional Governance
              </span>
              <span style={{ fontSize: '12px', color: '#D4A373', fontWeight: 600 }}>
                AIIA Portfolio Leadership Desk
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#FFF' }}>
              Administration & Portfolio Leadership
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'rgba(239, 232, 216, 0.75)' }}>
              Overarching logistics, site setup, CTRI registrations, high-level milestone progress, close-outs, and publication oversight.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {onAddProtocol && (
              <button
                onClick={onAddProtocol}
                style={{
                  background: 'linear-gradient(135deg, #D4A373 0%, #B08256 100%)',
                  color: '#FFF',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(212, 163, 115, 0.35)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <FolderPlus size={16} /> Setup / Register Protocol
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE KPI & RISK SUMMARY GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {[
          { label: 'Total Portfolio Studies', val: totalStudies, icon: Building2, color: 'var(--accent, #84A98C)', sub: `${activeStudies} Active · ${delayedStudies} Delayed` },
          { label: 'CTRI Registration Rate', val: `${Math.round((ctriRegisteredCount / (totalStudies || 1)) * 100)}%`, icon: Award, color: 'var(--accent-gold, #D4A373)', sub: `${ctriRegisteredCount}/${totalStudies} CTRI Prospectively Verified` },
          { label: 'Overall Recruitment Target', val: `${totalEnrolled}/${totalTarget}`, icon: TrendingUp, color: 'var(--accent, #84A98C)', sub: `${Math.round((totalEnrolled / (totalTarget || 1)) * 100)}% Portfolio Completion` },
          { label: 'Avg GCP Compliance Score', val: `${avgCompliance}%`, icon: ShieldCheck, color: 'var(--accent, #84A98C)', sub: 'Across all active trial sites' },
          { label: 'Safety & SAE Alerts', val: totalSaes, icon: ShieldAlert, color: 'var(--accent-terracotta, #C86D51)', sub: `${totalSaes} Expedited SAEs Monitored` },
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card-bg, #FFF)',
              border: '1px solid var(--border, #E5E7EB)',
              borderTop: `3px solid ${card.color}`,
              borderRadius: '10px',
              padding: '16px 18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted, #78716C)' }}>
                {card.label}
              </span>
              <card.icon size={16} color={card.color} />
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-h, #0C0A09)', lineHeight: 1 }}>
              {card.val}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '6px' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* 3. PORTFOLIO-WIDE STUDY DIRECTORY TABLE */}
      <section style={{
        background: 'var(--card-bg, #FFF)',
        border: '1px solid var(--border, #E5E7EB)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Briefcase size={18} color="var(--accent-gold, #D4A373)" /> Institutional Portfolio & CTRI Tracking
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
              Master overview of protocol setups, recruitment progress, CTRI status, and compliance scores.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                const isHovered = hoveredRow === s.studyId;
                const enrPct = s.participants?.target ? Math.round((s.participants.enrolled / s.participants.target) * 100) : 0;

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
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-gold, #D4A373)', whiteSpace: 'nowrap' }}>
                      {s.ctriNumber || 'CTRI Pending'}
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text, #1C1917)', fontWeight: 600 }}>
                      {s.stage || 'Active Trial'}
                    </td>
                    <td style={{ padding: '12px 14px', minWidth: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span>{s.participants?.enrolled || 0}/{s.participants?.target || 0}</span>
                        <span style={{ fontWeight: 700 }}>{enrPct}%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: 'var(--border, #E5E7EB)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.min(enrPct, 100)}%`, background: 'var(--accent, #84A98C)' }} />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent, #84A98C)' }}>
                      {s.complianceScore || 95}%
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '12px',
                        background: s.status === 'Active' ? 'rgba(132, 169, 140, 0.15)' : s.status === 'Completed' ? 'rgba(212, 163, 115, 0.15)' : 'rgba(200, 109, 81, 0.15)',
                        color: s.status === 'Active' ? 'var(--accent, #84A98C)' : s.status === 'Completed' ? 'var(--accent-gold, #D4A373)' : 'var(--accent-terracotta, #C86D51)'
                      }}>
                        {s.status}
                      </span>
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
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(132, 169, 140, 0.3)'
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

      {/* 4. ADMINISTRATIVE CLOSE-OUT, ARCHIVING & PUBLICATIONS OVERVIEW */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
      }}>
        
        {/* Administrative Close-Out & Archiving Panel */}
        <section style={{
          background: 'var(--card-bg, #FFF)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
                  <span style={{ fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>{s.shortTitle}</div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(212, 163, 115, 0.15)',
                  color: 'var(--accent-gold, #D4A373)'
                }}>
                  {s.closeOutStatus || 'Active Study'}
                </span>
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
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
                  <span style={{ fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}</span>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>PI: {s.principalInvestigator}</div>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(132, 169, 140, 0.15)',
                  color: 'var(--accent, #84A98C)'
                }}>
                  {s.publicationStatus || 'Protocol Registered'}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}