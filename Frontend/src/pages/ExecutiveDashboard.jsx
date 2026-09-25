import React, { useState } from 'react';
import mockData from '../data/mockStudies.json';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Table from '../components/common/Table';

export default function ExecutiveDashboard({ studies = mockData, onSelectStudy, onAddProtocol, onReviewQueue }) {
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // 1. Calculate Portfolio KPIs
  const totalStudies = studies.length;
  const activeStudies = studies.filter(s => s.status === 'Active' || s.status === 'Recruiting').length;
  const totalEnrolled = studies.reduce((acc, s) => acc + (s.participants?.enrolled || 0), 0);
  const totalTarget = studies.reduce((acc, s) => acc + (s.participants?.target || 0), 0);
  const enrolmentPct = Math.round((totalEnrolled / totalTarget) * 100) || 0;
  const totalSAEs = studies.reduce((acc, s) => acc + (s.safety?.seriousAdverseEvents || 0), 0);
  const pendingReviews = studies.reduce((acc, s) => acc + (s.safety?.pendingSafetyReviews || 0), 0);
  const renewalDue = studies.filter(s => s.ethicsRegulatory?.regulatoryStatus === 'Renewal Required' || s.ethicsRegulatory?.regulatoryStatus === 'Review Required').length;

  // Filter studies for the table
  const filteredStudies = studies.filter(s => {
    const matchesPhase = selectedPhase === 'All' || s.phase === selectedPhase || (selectedPhase === 'Observational' && s.studyType === 'Observational');
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.studyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.principalInvestigator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  // --- Interactive Donut Chart Calculations ---
  const phaseData = [
    { label: 'Phase III', count: studies.filter(s => s.phase === 'Phase III').length, color: 'var(--accent)' },
    { label: 'Phases I & II', count: studies.filter(s => s.phase === 'Phase I' || s.phase === 'Phase II').length, color: 'var(--border)' },
    { label: 'Observational', count: studies.filter(s => s.studyType === 'Observational').length, color: 'var(--accent-terracotta)' },
  ].filter(d => d.count > 0);

  const totalChartCount = phaseData.reduce((acc, d) => acc + d.count, 0);

  // SVG parameters for Donut Chart
  const pieSize = 180;
  const center = pieSize / 2;
  const outerRadius = 75;
  const innerRadius = 48; // Creates clean hole in middle for stats
  const hoverOuterRadius = 82;

  let currentAngle = 0;
  const pieSlices = phaseData.map((slice, index) => {
    const angle = (slice.count / totalChartCount) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    const isHovered = hoveredSlice === index;
    const effectiveOuterRadius = isHovered ? hoverOuterRadius : outerRadius;

    const toCoords = (ang, radius) => {
      const radians = (ang - 90) * (Math.PI / 180);
      return [
        center + radius * Math.cos(radians),
        center + radius * Math.sin(radians)
      ];
    };

    const [outerStartX, outerStartY] = toCoords(startAngle, effectiveOuterRadius);
    const [outerEndX, outerEndY] = toCoords(endAngle, effectiveOuterRadius);
    const [innerStartX, innerStartY] = toCoords(startAngle, innerRadius);
    const [innerEndX, innerEndY] = toCoords(endAngle, innerRadius);

    const largeArc = angle > 180 ? 1 : 0;

    // Donut path calculation
    const pathData = `
      M ${outerStartX} ${outerStartY}
      A ${effectiveOuterRadius} ${effectiveOuterRadius} 0 ${largeArc} 1 ${outerEndX} ${outerEndY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}
      Z
    `;

    return (
      <path
        key={index}
        d={pathData}
        fill={slice.color}
        stroke="var(--card-bg)"
        strokeWidth={isHovered ? 2 : 1}
        onMouseEnter={() => setHoveredSlice(index)}
        onMouseLeave={() => setHoveredSlice(null)}
        style={{
          cursor: 'pointer',
          transition: 'all 0.25s ease-in-out',
          filter: isHovered ? `drop-shadow(0 0 8px ${slice.color})` : 'none',
          opacity: hoveredSlice !== null && hoveredSlice !== index ? 0.6 : 1,
        }}
      />
    );
  });

  // Currently active highlight slice info for center text
  const activeInfo = hoveredSlice !== null ? phaseData[hoveredSlice] : null;

  // Table Columns Setup
  const columns = [
    {
      header: 'Study ID',
      render: (row) => (
        <div>
          <strong 
            style={{ color: 'var(--text-h)', cursor: 'pointer', textDecoration: 'underline' }} 
            onClick={() => onSelectStudy && onSelectStudy(row)}
          >
            {row.studyId}
          </strong>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.shortTitle}</div>
        </div>
      )
    },
    {
      header: 'Study Title & Phase',
      render: (row) => (
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-h)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {row.studyType} • {row.phase}
          </div>
        </div>
      )
    },
    {
      header: 'Investigator & Sites',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.principalInvestigator}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {row.sites?.length || 1} Active Site(s)
          </div>
        </div>
      )
    },
    {
      header: 'Enrolment Progress',
      render: (row) => {
        const pct = Math.round(((row.participants?.enrolled || 0) / (row.participants?.target || 1)) * 100);
        return (
          <div style={{ width: '130px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
              <span>{row.participants?.enrolled} / {row.participants?.target}</span>
              <strong style={{ color: 'var(--accent)' }}>{pct}%</strong>
            </div>
            <div style={{ height: '6px', background: 'var(--code-bg)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        );
      }
    },
    {
      header: 'GCP / Ethics Status',
      render: (row) => (
        <Badge status={row.ethicsRegulatory?.regulatoryStatus || row.status} />
      )
    },
    {
      header: 'Action',
      render: (row) => (
        <button 
          className="btn-primary" 
          style={{ padding: '6px 12px', fontSize: '12px' }}
          onClick={() => onSelectStudy && onSelectStudy(row)}
        >
          View eCRF
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Dynamic Inline CSS for Animations & Hover Glows */}
      <style>{`
        .glow-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .glow-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 20px -5px rgba(132, 169, 140, 0.25), 0 4px 6px -2px rgba(45, 55, 72, 0.05);
          border-color: var(--accent) !important;
        }
        .glow-alert {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .glow-alert:hover {
          transform: scale(1.01);
          box-shadow: 0 8px 16px -4px rgba(200, 109, 81, 0.3);
        }
        .bar-hover {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .bar-hover:hover {
          opacity: 0.85;
          transform: scaleY(1.05);
        }
      `}</style>

      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '24px', textAlign: 'left' }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '28px', color: 'var(--text-h)' }}>
          Portfolio Executive Overview
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
          All India Institute of Ayurveda — Live CTMS & GCP Compliance Dashboard
        </p>
      </div>

      {/* 1. TOP METRIC CARDS (GRID WITH GLOW ANIMATION) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* Metric 1 */}
        <div className="card glow-card" style={{ margin: 0, borderLeft: '4px solid var(--accent)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            ACTIVE CLINICAL TRIALS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-h)' }}>{activeStudies}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>of {totalStudies} Total Studies</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Badge status="Compliant" text="Portfolio Active" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card glow-card" style={{ margin: 0, borderLeft: '4px solid #D4A373' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            TOTAL RECRUITMENT PROGRESS
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-h)' }}>{totalEnrolled}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ {totalTarget} Target ({enrolmentPct}%)</span>
          </div>
          <div style={{ height: '6px', background: 'var(--code-bg)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
            <div style={{ width: `${enrolmentPct}%`, height: '100%', background: '#D4A373', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card glow-card" style={{ margin: 0, borderLeft: '4px solid var(--badge-warning-text)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            ETHICS & REGULATORY HEALTH
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-h)' }}>{renewalDue}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Approvals Approaching Renewal</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Badge status="Renewal Required" text={`${renewalDue} Due Action`} />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card glow-card" style={{ margin: 0, borderLeft: '4px solid var(--accent-terracotta)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            SAFETY & SAE ALERTS (NPvCC)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '12px' }}>
            <span style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-terracotta)' }}>{totalSAEs}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pendingReviews} Pending Review</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Badge status="Urgent" text={`${totalSAEs} SAEs Logged`} />
          </div>
        </div>

      </div>

      {/* 2. VISUAL GRAPH ANALYTICS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Chart 1: Enrolment Progress Graph */}
        <Card title="Top Studies Recruitment Performance" subtitle="Target vs. Actual Enrolled Subjects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {studies.slice(0, 5).map((s) => {
              const pct = Math.round(((s.participants?.enrolled || 0) / (s.participants?.target || 1)) * 100);
              return (
                <div key={s.studyId} className="bar-hover" style={{ cursor: 'pointer' }} onClick={() => onSelectStudy && onSelectStudy(s)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)' }}>{s.studyId}: {s.shortTitle}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{s.participants?.enrolled} / {s.participants?.target} ({pct}%)</span>
                  </div>
                  <div style={{ height: '10px', background: 'var(--code-bg)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${pct}%`, 
                      height: '100%', 
                      background: pct >= 80 ? 'var(--accent)' : pct >= 50 ? '#D4A373' : 'var(--accent-terracotta)',
                      borderRadius: '5px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Chart 2: Clean Interactive Donut Chart */}
        <Card title="Portfolio Phase & Regulatory Standing" subtitle="Hover slices for detailed breakdown">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', minHeight: '180px' }}>
            
            {/* Interactive SVG Donut Container */}
            <div style={{ position: 'relative', width: `${pieSize}px`, height: `${pieSize}px` }}>
              <svg width={pieSize} height={pieSize} viewBox={`0 0 ${pieSize} ${pieSize}`}>
                {pieSlices}
              </svg>
              
              {/* Dynamic Center Badge (Zero Overlap Issue) */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
                width: '80px'
              }}>
                {activeInfo ? (
                  <>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', lineHeight: '1.1' }}>
                      {activeInfo.label}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-h)', marginTop: '2px' }}>
                      {activeInfo.count}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: activeInfo.color }}>
                      {((activeInfo.count / totalChartCount) * 100).toFixed(0)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-h)' }}>
                      {totalChartCount}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                      Studies
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Responsive Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginLeft: '16px' }}>
              {phaseData.map((slice, index) => (
                <div 
                  key={index} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    opacity: hoveredSlice !== null && hoveredSlice !== index ? 0.5 : 1,
                    transition: 'opacity 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: slice.color,
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: hoveredSlice === index ? `0 0 6px ${slice.color}` : 'none',
                    transform: hoveredSlice === index ? 'scale(1.25)' : 'scale(1)'
                  }} />
                  <span style={{ fontWeight: hoveredSlice === index ? 700 : 500 }}>
                    {slice.label} 
                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({slice.count})</span>
                  </span>
                </div>
              ))}
            </div>

          </div>
        </Card>

      </div>

      {/* 3. TIME-SENSITIVE COMPLIANCE ALERTS BANNER */}
      <div className="card glow-alert" style={{ backgroundColor: 'var(--badge-urgent-bg)', borderColor: 'var(--accent-terracotta)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>🚨</span>
            <div>
              <strong style={{ color: 'var(--accent-terracotta)', fontSize: '14px' }}>Action Required: High-Priority Regulatory Trigger</strong>
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                {renewalDue} study requires ethics renewal, and {pendingReviews} SAE report requires expedited NPvCC review.
              </div>
            </div>
          </div>
          <button className="btn-terracotta" style={{ fontSize: '12px', padding: '8px 16px' }} onClick={onReviewQueue}>
            Review Regulatory Queue &rarr;
          </button>
        </div>
      </div>

      {/* 4. INTERACTIVE PORTFOLIO TABLE WITH FILTERS */}
      <Card 
        title="Clinical Trial Portfolio Directory" 
        subtitle="Search and filter through all registered Ayurveda trials"
        action={
          <button className="btn-primary" style={{ fontSize: '13px' }} onClick={onAddProtocol}>
            + Register New Protocol
          </button>
        }
      >
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search study title, ID, or PI..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              borderRadius: '6px', 
              border: '1px solid var(--border)', 
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: '13px',
              flex: '1',
              minWidth: '220px'
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            {['All', 'Phase III', 'Phase II', 'Phase I', 'Observational'].map((phase) => (
              <button 
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: selectedPhase === phase ? 'var(--accent)' : 'var(--code-bg)',
                  color: selectedPhase === phase ? '#FAF8F5' : 'var(--text)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>

        {/* Table Render */}
        <Table columns={columns} data={filteredStudies} emptyMessage="No matching clinical trials found." />
      </Card>

    </div>
  );
}