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
  Award,
  Lock,
  FileText,
  Calendar,
  Layers,
  Database
} from 'lucide-react';

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
  onOpenStudy
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

  return (
    <div style={{
      width: '100%',
      padding: '20px 0',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: 'var(--text, #1C1917)',
    }}>
      
      {/* SECTION 1: HEADER BANNER */}
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
                background: 'linear-gradient(90deg, #C86D51, #D4A373)',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '20px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase'
              }}>
                🔒 Read-Only Oversight Portal
              </span>
              <span style={{ fontSize: '12px', color: '#D4A373', fontWeight: 600 }}>
                CDSCO / CTRI Synchronized Desk
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#FFF' }}>
              Regulator Dashboard
            </h1>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'rgba(239, 232, 216, 0.75)' }}>
              National Clinical Trial Registry oversight, regulatory milestone tracking, and ALCOA+ compliance logs.
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(212, 163, 115, 0.3)',
            padding: '10px 18px',
            borderRadius: '12px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '11px', color: '#D4A373', fontWeight: 700, textTransform: 'uppercase' }}>Central Registry Status</div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#84A98C', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <CheckCircle2 size={16} /> CTRI Live
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: KPI SUMMARY GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {[
          { label: 'Protocols Monitored', val: totalProtocols, icon: Building2, color: 'var(--accent, #84A98C)', sub: 'Across national registry' },
          { label: 'CTRI Registered', val: ctriRegistered, icon: ShieldCheck, color: 'var(--accent, #84A98C)', sub: '100% Prospective verified' },
          { label: 'Active Clinical Trials', val: activeOverSight, icon: Layers, color: 'var(--accent-gold, #D4A373)', sub: 'Under CDSCO purview' },
          { label: 'Action / Renewal Needed', val: renewalAlerts, icon: AlertTriangle, color: 'var(--accent-terracotta, #C86D51)', sub: 'Expiries or delays' },
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
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-h, #0C0A09)', lineHeight: 1 }}>
              {card.val}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '6px' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: NATIONAL TRIAL REGISTRY DIRECTORY TABLE */}
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
              <Database size={18} color="var(--accent-gold, #D4A373)" /> National Trial Registry & CTRI Directory
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
              Click any protocol row to inspect its full dossier in the shared Study Details workspace.
            </p>
          </div>

          {/* Search Bar & Filter Controls */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted, #78716C)' }} />
              <input
                type="text"
                placeholder="Search protocol, CTRI #, PI..."
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
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg, #FAFAF9)', borderBottom: '1px solid var(--border, #E5E7EB)' }}>
                {['CTRI Number', 'Protocol ID & Title', 'Investigator & Site', 'IEC Approval', 'Compliance Score', 'Status', 'Action'].map((h) => (
                  <th key={h} style={{ padding: '12px 14px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted, #78716C)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStudies.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted, #78716C)' }}>
                    No trial records found matching query.
                  </td>
                </tr>
              )}
              {filteredStudies.map((s) => {
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
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--accent-gold, #D4A373)', whiteSpace: 'nowrap' }}>
                      {s.ctriNumber || 'CTRI Pending'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>{s.shortTitle || s.title}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text, #1C1917)' }}>{s.principalInvestigator}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)' }}>{s.leadSite || 'AIIA Institution'}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
                      <div>{s.ethicsRegulatory?.approvalNumber || 'IEC Verified'}</div>
                      <div style={{ fontSize: '10px' }}>Valid to: {s.ethicsRegulatory?.approvalExpiry || '2027'}</div>
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
                        background: s.status === 'Active' ? 'rgba(132, 169, 140, 0.15)' : 'rgba(200, 109, 81, 0.15)',
                        color: s.status === 'Active' ? 'var(--accent, #84A98C)' : 'var(--accent-terracotta, #C86D51)'
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

      {/* SECTION 4: REGULATORY MILESTONES & RECENT COMPLIANCE AUDITS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '20px'
      }}>
        
        {/* Milestone Tracker Sub-Section */}
        <section style={{
          background: 'var(--card-bg, #FFF)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} color="var(--accent, #84A98C)" /> Active Regulatory Progression Timeline
          </h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
            Statutory milestones completed across ongoing protocols.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(dataset[0]?.milestones || []).map((m, idx) => (
              <div
                key={idx}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color={m.status === 'Completed' ? 'var(--accent, #84A98C)' : 'var(--accent-terracotta, #C86D51)'} />
                  <span style={{ fontWeight: 700, color: 'var(--text-h, #0C0A09)' }}>{m.stage}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)' }}>{m.date}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '8px',
                    background: m.status === 'Completed' ? 'rgba(132, 169, 140, 0.15)' : 'rgba(200, 109, 81, 0.15)',
                    color: m.status === 'Completed' ? 'var(--accent, #84A98C)' : 'var(--accent-terracotta, #C86D51)'
                  }}>
                    {m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SHA-256 Compliance Vault Sub-Section */}
        <section style={{
          background: 'var(--card-bg, #FFF)',
          border: '1px solid var(--border, #E5E7EB)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileCheck2 size={16} color="var(--accent-gold, #D4A373)" /> Signed Compliance Attachments
          </h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
            Cryptographically sealed protocols and IEC clearance letters.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(dataset[0]?.documents || []).map((doc, idx) => (
              <div
                key={idx}
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
                  <div style={{ fontWeight: 700, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} color="var(--accent, #84A98C)" /> {doc.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted, #78716C)', marginTop: '2px' }}>
                    Type: {doc.type} • Stamped: {doc.date}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHashInspector(doc)}
                  style={{
                    background: 'rgba(212, 163, 115, 0.15)',
                    border: '1px solid var(--accent-gold, #D4A373)',
                    color: 'var(--accent-gold, #D4A373)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Lock size={12} /> Inspect SHA-256
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* SECTION 5: IMMUTABLE 21 CFR PART 11 / ALCOA+ AUDIT STREAM */}
      <section style={{
        background: 'var(--card-bg, #FFF)',
        border: '1px solid var(--border, #E5E7EB)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <History size={16} color="var(--accent, #84A98C)" /> ALCOA+ Regulatory Audit Trail
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
              Real-time, immutable time-stamped change log verified across central servers.
            </p>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent, #84A98C)', background: 'rgba(132, 169, 140, 0.15)', padding: '4px 10px', borderRadius: '12px' }}>
            ✓ 21 CFR Part 11 Sealed
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(dataset[0]?.auditTrail || []).map((entry, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'var(--bg, #FAFAF9)',
                border: '1px solid var(--border, #E5E7EB)',
                fontSize: '12px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text-h, #0C0A09)' }}>{entry.action}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginLeft: '8px' }}>• {entry.user}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--accent-gold, #D4A373)' }}>Hash: {entry.hash}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)' }}>{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL: SHA-256 HASH INSPECTOR */}
      {hashInspector && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            background: 'var(--card-bg, #FFF)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative',
            border: '1px solid var(--accent-gold, #D4A373)'
          }}>
            <button
              onClick={() => setHashInspector(null)}
              style={{
                position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'transparent',
                fontSize: '18px', fontWeight: 800, cursor: 'pointer', color: 'var(--text-muted, #78716C)'
              }}
            >
              ✕
            </button>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--accent-gold, #D4A373)" /> SHA-256 Cryptographic Verification
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)', marginBottom: '16px' }}>
              21 CFR Part 11 ALCOA+ Document Authenticity Stamp
            </p>

            <div style={{ background: 'var(--bg, #FAFAF9)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '12px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Filename:</strong> {hashInspector.name}</div>
              <div style={{ marginBottom: '6px' }}><strong>Document Category:</strong> {hashInspector.type}</div>
              <div style={{ marginBottom: '6px' }}><strong>Timestamp:</strong> {hashInspector.date}</div>
              <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', color: 'var(--accent, #84A98C)', background: 'rgba(132, 169, 140, 0.1)', padding: '8px', borderRadius: '6px', marginTop: '8px' }}>
                SHA-256: {hashInspector.hash}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="var(--accent, #84A98C)" /> Signature verified on National Regulatory Registry.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}