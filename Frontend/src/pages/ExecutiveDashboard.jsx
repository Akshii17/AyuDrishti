import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ChevronRight,
  FolderKanban,
  UserCheck,
  Activity,
  Award,
  Calendar,
  Building2,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Search,
  Clock
} from 'lucide-react';
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
  const enrolmentPct = Math.round((totalEnrolled / (totalTarget || 1)) * 100) || 0;
  const totalSAEs = studies.reduce((acc, s) => acc + (s.safety?.seriousAdverseEvents || 0), 0);
  const pendingReviews = studies.reduce((acc, s) => acc + (s.safety?.pendingSafetyReviews || 0), 0);
  const renewalDue = studies.filter(s => s.ethicsRegulatory?.regulatoryStatus === 'Renewal Required' || s.ethicsRegulatory?.regulatoryStatus === 'Review Required').length;

  // Filter studies for the table
  const filteredStudies = studies.filter(s => {
    const matchesPhase = selectedPhase === 'All' || s.phase === selectedPhase || (selectedPhase === 'Observational' && s.studyType === 'Observational');
    const matchesSearch = (s.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studyId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.principalInvestigator || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPhase && matchesSearch;
  });

  // --- Interactive Donut Chart Calculations ---
  const phaseData = [
    { label: 'Phase III', count: studies.filter(s => s.phase === 'Phase III').length, color: 'var(--accent, #84A98C)' },
    { label: 'Phases I & II', count: studies.filter(s => s.phase === 'Phase I' || s.phase === 'Phase II').length, color: 'var(--accent-gold, #D4A373)' },
    { label: 'Observational', count: studies.filter(s => s.studyType === 'Observational').length, color: 'var(--accent-terracotta, #C86D51)' },
  ].filter(d => d.count > 0);

  const totalChartCount = phaseData.reduce((acc, d) => acc + d.count, 0);

  // SVG parameters for Donut Chart
  const pieSize = 180;
  const center = pieSize / 2;
  const outerRadius = 75;
  const innerRadius = 48;
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
        stroke="var(--card-bg, #FFF)"
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

  const activeInfo = hoveredSlice !== null ? phaseData[hoveredSlice] : null;

  // Table Columns Setup
  const columns = [
    {
      header: 'Study ID',
      render: (row) => (
        <div>
          <strong
            style={{ color: 'var(--text-h, #0C0A09)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => onSelectStudy && onSelectStudy(row)}
          >
            {row.studyId}
          </strong>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)' }}>{row.shortTitle}</div>
        </div>
      )
    },
    {
      header: 'Study Title & Phase',
      render: (row) => (
        <div style={{ maxWidth: '300px' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-h, #0C0A09)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.title}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
            {row.studyType} • {row.phase}
          </div>
        </div>
      )
    },
    {
      header: 'Investigator & Sites',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--text, #1C1917)' }}>{row.principalInvestigator}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)' }}>
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
              <strong style={{ color: 'var(--accent, #84A98C)' }}>{pct}%</strong>
            </div>
            <div style={{ height: '6px', background: 'var(--bg, #FAFAF9)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border, #E5E7EB)' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent, #84A98C)', transition: 'width 0.4s ease' }} />
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
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            background: 'var(--accent, #84A98C)',
            color: '#FFF',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onClick={() => onSelectStudy && onSelectStudy(row)}
        >
          View Workspace <ChevronRight size={12} />
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px 0', width: '100%', maxWidth: '1440px', margin: '0 auto', boxSizing: 'border-box' }}>

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
          transform: scale(1.005);
          box-shadow: 0 8px 16px -4px rgba(200, 109, 81, 0.25);
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
      <div style={{ marginBottom: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
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
              Leadership Intelligence
            </span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-gold, #D4A373)' }}>
              · Portfolio Overview
            </span>
          </div>
          <h1 style={{ margin: '0 0 4px 0', fontSize: '28px', color: 'var(--text-h, #0C0A09)', fontWeight: 800 }}>
            Executive Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted, #78716C)', fontSize: '14px', margin: 0 }}>
            All India Institute of Ayurveda — Live Portfolio, Recruitment Funnel, & Risk Oversight
          </p>
        </div>

        {onAddProtocol && (
          <button
            type="button"
            onClick={onAddProtocol}
            style={{
              background: 'var(--accent, #84A98C)',
              color: '#FFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(132, 169, 140, 0.35)'
            }}
          >
            + Register Protocol
          </button>
        )}
      </div>

      {/* 1. TOP METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glow-card" style={{ background: 'var(--card-bg, #FFF)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent, #84A98C)', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted, #78716C)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Active Clinical Trials
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-h, #0C0A09)' }}>{activeStudies}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>of {totalStudies} Total Studies</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Badge status="Compliant" text="Portfolio Active" />
          </div>
        </div>

        <div className="glow-card" style={{ background: 'var(--card-bg, #FFF)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent-gold, #D4A373)', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted, #78716C)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Total Recruitment Progress
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-h, #0C0A09)' }}>{totalEnrolled}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>/ {totalTarget} Target ({enrolmentPct}%)</span>
          </div>
          <div style={{ height: '6px', background: 'var(--bg, #FAFAF9)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden', border: '1px solid var(--border, #E5E7EB)' }}>
            <div style={{ width: `${enrolmentPct}%`, height: '100%', background: 'var(--accent-gold, #D4A373)', borderRadius: '3px' }} />
          </div>
        </div>

        <div className="glow-card" style={{ background: 'var(--card-bg, #FFF)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent-gold, #D4A373)', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted, #78716C)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Ethics & Regulatory Health
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--text-h, #0C0A09)' }}>{renewalDue}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>Approvals Approaching Renewal</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Badge status="Renewal Required" text={`${renewalDue} Due Action`} />
          </div>
        </div>

        <div className="glow-card" style={{ background: 'var(--card-bg, #FFF)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent-terracotta, #C86D51)', borderRadius: '12px', padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted, #78716C)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Safety & SAE Alerts (NPvCC)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: 'var(--accent-terracotta, #C86D51)' }}>{totalSAEs}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>{pendingReviews} Pending Review</span>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Badge status="Urgent" text={`${totalSAEs} SAEs Logged`} />
          </div>
        </div>
      </div>

      {/* EXECUTIVE "ATTENTION REQUIRED" PANEL */}
      <section style={{
        background: 'var(--card-bg, #FFF)',
        border: '1px solid var(--accent-terracotta, #C86D51)',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(200, 109, 81, 0.12)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: 'var(--accent-terracotta, #C86D51)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={20} /> Executive Attention Required Panel
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
              High-priority portfolio bottlenecks, regulatory renewal deadlines, and critical safety signals requiring executive intervention.
            </p>
          </div>
          <button
            type="button"
            onClick={onReviewQueue}
            style={{
              background: 'rgba(200, 109, 81, 0.15)',
              border: '1px solid var(--accent-terracotta, #C86D51)',
              color: 'var(--accent-terracotta, #C86D51)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Review All Regulatory Triggers &rarr;
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'var(--bg, #FAFAF9)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent-terracotta, #C86D51)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-terracotta, #C86D51)' }}>AYU-003 • High Risk</span>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'rgba(200, 109, 81, 0.15)', color: 'var(--accent-terracotta, #C86D51)' }}>Recruitment Lag</span>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-h, #0C0A09)', margin: '0 0 8px 0' }}>
              Recruitment 38% behind target due to strict exclusion criteria at Delhi site.
            </p>
            <button
              onClick={() => onSelectStudy && onSelectStudy({ studyId: 'AIIA-AYU-003', title: 'Ayurvedic Intervention for Chronic Migraine' })}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent, #84A98C)', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>

          <div style={{ background: 'var(--bg, #FAFAF9)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent-gold, #D4A373)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-gold, #D4A373)' }}>AYU-008 • Action Due</span>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'rgba(212, 163, 115, 0.15)', color: 'var(--accent-gold, #D4A373)' }}>Ethics Renewal</span>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-h, #0C0A09)', margin: '0 0 8px 0' }}>
              AIIA IEC annual approval expires in 18 days. Submission file pending PI sign-off.
            </p>
            <button
              onClick={() => onSelectStudy && onSelectStudy({ studyId: 'AIIA-AYU-008', title: 'Ayurvedic Management of Stress and Sleep' })}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent, #84A98C)', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>

          <div style={{ background: 'var(--bg, #FAFAF9)', border: '1px solid var(--border, #E5E7EB)', borderLeft: '4px solid var(--accent-terracotta, #C86D51)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-terracotta, #C86D51)' }}>AYU-004 • Safety Signal</span>
              <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'rgba(200, 109, 81, 0.15)', color: 'var(--accent-terracotta, #C86D51)' }}>3 SAEs Pending</span>
            </div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-h, #0C0A09)', margin: '0 0 8px 0' }}>
              3 expedited SAE reports requiring NPvCC causality verification & DSMB review.
            </p>
            <button
              onClick={() => onSelectStudy && onSelectStudy({ studyId: 'AIIA-AYU-004', title: 'Ayurvedic Supportive Therapy for Mild Asthma' })}
              style={{ background: 'transparent', border: 'none', color: 'var(--accent, #84A98C)', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* AI FEATURE #1: RECRUITMENT PREDICTION ENGINE WIDGET */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(20, 35, 25, 0.95) 0%, rgba(35, 55, 40, 0.98) 100%)',
        borderRadius: '14px',
        padding: '20px 24px',
        color: '#FFF',
        marginBottom: '24px',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.15), 0 0 0 1px rgba(132, 169, 140, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'linear-gradient(90deg, #D4A373, #84A98C)',
                color: '#FFF',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <BrainCircuit size={12} /> AI Intelligence Engine
              </span>
              <span style={{ fontSize: '12px', color: '#D4A373', fontWeight: 600 }}>
                Portfolio Recruitment Predictor
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
              Portfolio Target Completion Date: Q2 2027 (On Track)
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              Machine learning forecasting projects <strong>94% overall target completion</strong> across all 10 protocols based on 30-day site velocity trends.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('AI Recruitment Analysis: AYU-001 is performing +18% above trend while AYU-003 requires 2 additional recruiting satellite sites.')}
            style={{
              background: 'linear-gradient(135deg, #D4A373 0%, #B08256 100%)',
              color: '#FFF',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(212, 163, 115, 0.4)'
            }}
          >
            <Sparkles size={14} /> View AI Projections
          </button>
        </div>
      </section>

      {/* 2. VISUAL GRAPH ANALYTICS SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px', marginBottom: '24px' }}>

        {/* Chart 1: Enrolment Progress Graph */}
        <Card title="Top Studies Recruitment Performance" subtitle="Target vs. Actual Enrolled Subjects">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
            {studies.slice(0, 5).map((s) => {
              const pct = Math.round(((s.participants?.enrolled || 0) / (s.participants?.target || 1)) * 100);
              return (
                <div key={s.studyId} className="bar-hover" style={{ cursor: 'pointer' }} onClick={() => onSelectStudy && onSelectStudy(s)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h, #0C0A09)' }}>{s.studyId}: {s.shortTitle}</span>
                    <span style={{ color: 'var(--text-muted, #78716C)' }}>{s.participants?.enrolled} / {s.participants?.target} ({pct}%)</span>
                  </div>
                  <div style={{ height: '10px', background: 'var(--bg, #FAFAF9)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--border, #E5E7EB)' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: pct >= 80 ? 'var(--accent, #84A98C)' : pct >= 50 ? 'var(--accent-gold, #D4A373)' : 'var(--accent-terracotta, #C86D51)',
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

            <div style={{ position: 'relative', width: `${pieSize}px`, height: `${pieSize}px` }}>
              <svg width={pieSize} height={pieSize} viewBox={`0 0 ${pieSize} ${pieSize}`}>
                {pieSlices}
              </svg>

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
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #78716C)', lineHeight: '1.1' }}>
                      {activeInfo.label}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-h, #0C0A09)', marginTop: '2px' }}>
                      {activeInfo.count}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: activeInfo.color }}>
                      {((activeInfo.count / totalChartCount) * 100).toFixed(0)}%
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>
                      {totalChartCount}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', fontWeight: 500 }}>
                      Studies
                    </div>
                  </>
                )}
              </div>
            </div>

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
                    <span style={{ color: 'var(--text-muted, #78716C)', marginLeft: '6px' }}>({slice.count})</span>
                  </span>
                </div>
              ))}
            </div>

          </div>
        </Card>

      </div>

      {/* 4. INTERACTIVE PORTFOLIO TABLE WITH FILTERS */}
      <Card
        title="Clinical Trial Portfolio Directory"
        subtitle="Search and filter through all registered Ayurveda trials"
        action={
          onAddProtocol && (
            <button
              className="btn-primary"
              style={{ fontSize: '13px', background: 'var(--accent, #84A98C)', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              onClick={onAddProtocol}
            >
              + Register New Protocol
            </button>
          )
        }
      >
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search study title, ID, or PI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid var(--border, #E5E7EB)',
              background: 'var(--bg, #FAFAF9)',
              color: 'var(--text, #1C1917)',
              fontSize: '13px',
              flex: '1',
              minWidth: '220px'
            }}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'Phase III', 'Phase II', 'Phase I', 'Observational'].map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border, #E5E7EB)',
                  background: selectedPhase === phase ? 'var(--accent, #84A98C)' : 'var(--bg, #FAFAF9)',
                  color: selectedPhase === phase ? '#FFF' : 'var(--text, #1C1917)',
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

        <Table columns={columns} data={filteredStudies} emptyMessage="No matching clinical trials found." />
      </Card>

    </div>
  );
}