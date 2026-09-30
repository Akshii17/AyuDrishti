import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import {
  ShieldCheck,
  AlertTriangle,
  FileText,
  ArrowLeft,
  X,
  Download,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Clock,
  FileCheck2,
  Gavel
} from 'lucide-react';

export default function IecApprovals({ onBack }) {
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [activeStageFilter, setActiveStageFilter] = useState('All');
  const [approvalActionDone, setApprovalActionDone] = useState(false);

  // Mock IEC Protocol Pipeline Dataset
  const initialProtocols = [
    {
      id: 'AIIA-AYU-001',
      title: 'Ashwagandha Extract in Type 2 Diabetes Mellitus',
      pi: 'Dr. Ananya Sharma',
      stage: 'Approved & Active',
      committee: 'Institutional Ethics Committee - Central A',
      approvalDate: '14-Nov-2025',
      expiryDate: '13-Nov-2026',
      daysToExpiry: 48,
      documents: ['Protocol_v3.2_Final.pdf', 'ICF_Hindi_English_v2.0.pdf', 'Investigator_Brochure_2025.pdf'],
      gcpStatus: 'Full Clearance',
      notes: 'Annual progress report approved during 42nd IEC committee convention.',
    },
    {
      id: 'AIIA-AYU-003',
      title: 'Ayush-64 in Mild-to-Moderate Upper Respiratory Tract Infection',
      pi: 'Dr. Rajesh Kumar',
      stage: 'Renewal Required',
      committee: 'Institutional Ethics Committee - Central B',
      approvalDate: '02-Oct-2024',
      expiryDate: '01-Oct-2026',
      daysToExpiry: 5,
      documents: ['Protocol_v1.4.pdf', 'ICF_Regional_Goa.pdf'],
      gcpStatus: 'Expedited Review Pending',
      notes: 'Annual GCP renewal dossier submitted. Pending Ethics Chair digital signature.',
    },
    {
      id: 'AIIA-AYU-007',
      title: 'Clinical Evaluation of Samshamani Vati in Post-Viral Recovery',
      pi: 'Prof. Dr. Anand Kumar',
      stage: 'Under IEC Review',
      committee: 'Institutional Ethics Committee - Central A',
      approvalDate: 'Pending',
      expiryDate: 'N/A',
      daysToExpiry: 0,
      documents: ['Draft_Protocol_v1.0.pdf', 'Safety_Tox_Data.pdf'],
      gcpStatus: 'Under Primary Vetting',
      notes: 'Initial protocol submission undergoing preliminary bio-ethics safety evaluation.',
    },
    {
      id: 'AIIA-AYU-009',
      title: 'Guduchi Ghan Vati in Immune Response Modulation',
      pi: 'Dr. Meera S.',
      stage: 'Submitted & Vetted',
      committee: 'Institutional Ethics Committee - Sub Unit',
      approvalDate: 'Pending',
      expiryDate: 'N/A',
      daysToExpiry: 0,
      documents: ['Initial_Dossier_2026.pdf'],
      gcpStatus: 'Document Vetting Complete',
      notes: 'Submitted to scientific advisory board. Slated for October ethics agenda.',
    },
  ];

  const [protocols, setProtocols] = useState(initialProtocols);

  // Pipeline Stages
  const pipelineStages = [
    { id: 'Submitted & Vetted', label: '📥 Submitted & Vetted', color: '#6272A4' },
    { id: 'Under IEC Review', label: '🔬 Under IEC Review', color: 'var(--accent, #84A98C)' },
    { id: 'Approved & Active', label: '✓ Approved & Active', color: 'var(--accent, #84A98C)' },
    { id: 'Renewal Required', label: '⚠️ Renewal Required', color: 'var(--accent-terracotta, #C86D51)' },
  ];

  const handleApproveProtocol = (protocolId) => {
    setApprovalActionDone(true);
    setTimeout(() => {
      setProtocols(prev => prev.map(p => {
        if (p.id === protocolId) {
          return {
            ...p,
            stage: 'Approved & Active',
            approvalDate: '29-Sep-2026',
            expiryDate: '28-Sep-2027',
            daysToExpiry: 365,
            gcpStatus: 'Full Clearance Extended',
          };
        }
        return p;
      }));
      setApprovalActionDone(false);
      setSelectedProtocol(null);
      alert(`Protocol ${protocolId} approved and digital clearance certificate issued!`);
    }, 1000);
  };

  const activeClearances = protocols.filter(p => p.stage === 'Approved & Active').length;
  const renewalsDue = protocols.filter(p => p.stage === 'Renewal Required' || p.daysToExpiry <= 30).length;

  return (
    <div style={{ padding: '24px 0', width: '100%', maxWidth: '1440px', margin: '0 auto', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Dynamic Aesthetic Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-fade-in {
          animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .iec-pipeline-card {
          transition: all 0.22s ease-in-out;
        }
        .iec-pipeline-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -6px rgba(132, 169, 140, 0.25);
          border-color: var(--accent, #84A98C) !important;
        }
      `}</style>

      {/* 1. TOP HEADER & METRIC STAT CARDS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button
            type="button"
            onClick={onBack}
            style={{
              padding: '6px 14px',
              fontSize: '12px',
              marginBottom: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--card-bg, #FFF)',
              border: '1px solid var(--border, #E5E7EB)',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--text-h, #0C0A09)'
            }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
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
              IEC Governance Desk
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-h, #0C0A09)', fontWeight: 800 }}>
            📋 Institutional Ethics Committee (IEC) Approvals Hub
          </h1>
          <p style={{ color: 'var(--text-muted, #78716C)', fontSize: '14px', marginTop: '4px' }}>
            Ayush-GCP Ethical Oversight, Protocol Review Pipelines & Annual Re-certifications
          </p>
        </div>

        {/* METRIC STAT CARDS */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Active Clearances Stat Card */}
          <div style={{
            background: 'var(--card-bg, #FFF)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid var(--border, #E5E7EB)',
            borderLeft: '4px solid var(--accent, #84A98C)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: '180px'
          }}>
            <div style={{
              backgroundColor: 'rgba(132, 169, 140, 0.15)',
              color: 'var(--accent, #84A98C)',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', fontWeight: 800, letterSpacing: '0.5px' }}>
                ACTIVE CLEARANCES
              </div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-h, #0C0A09)', marginTop: '1px' }}>
                {activeClearances} Protocols
              </div>
            </div>
          </div>

          {/* Renewals Due Stat Card */}
          <div style={{
            background: 'var(--card-bg, #FFF)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: '1px solid var(--accent-terracotta, #C86D51)',
            boxShadow: '0 4px 14px rgba(200, 109, 81, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: '180px'
          }}>
            <div style={{
              backgroundColor: 'rgba(200, 109, 81, 0.15)',
              color: 'var(--accent-terracotta, #C86D51)',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--accent-terracotta, #C86D51)', fontWeight: 800, letterSpacing: '0.5px' }}>
                RENEWALS DUE
              </div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--accent-terracotta, #C86D51)', marginTop: '2px' }}>
                {renewalsDue} Critical
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. ATTENTION REQUIRED SECTION (COMMITTEE BOTTLENECKS) */}
      <section className="animate-fade-in" style={{
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
              <ShieldAlert size={20} /> Ethics Committee — Attention Required Panel
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
              Protocols awaiting primary vetting, expedited renewal clearance, or safety amendment approvals.
            </p>
          </div>
          <span style={{
            background: 'rgba(200, 109, 81, 0.15)',
            color: 'var(--accent-terracotta, #C86D51)',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800
          }}>
            {protocols.filter(p => p.stage !== 'Approved & Active').length} Submissions Pending
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {protocols.filter(p => p.stage !== 'Approved & Active').map(p => (
            <div key={p.id} style={{
              background: 'var(--bg, #FAFAF9)',
              border: '1px solid var(--border, #E5E7EB)',
              borderLeft: `4px solid ${p.stage === 'Renewal Required' ? 'var(--accent-terracotta, #C86D51)' : 'var(--accent-gold, #D4A373)'}`,
              borderRadius: '10px',
              padding: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-h, #0C0A09)' }}>{p.id}</span>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'rgba(212, 163, 115, 0.2)', color: 'var(--accent-gold, #D4A373)' }}>
                  {p.stage}
                </span>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-h, #0C0A09)', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                {p.title}
              </p>
              <button
                type="button"
                onClick={() => setSelectedProtocol(p)}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent, #84A98C)', fontSize: '11px', fontWeight: 800, cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Review Submission Dossier &rarr;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* AI FEATURE #4: AI PROTOCOL PARSER & ETHICS RISK CLASSIFIER */}
      <section className="animate-fade-in" style={{
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
                AI Protocol Parser & Ethics Deviation Classifier
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFF' }}>
              Auto-Parsed Dossier: Protocol AIIA-AYU-007 (Ver 1.0)
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              AI verified <strong>minimal risk classification</strong> for Samshamani Vati trial. Informed Consent Form (ICF) compliant with CDSCO 2026 Ayush-GCP guidelines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('AI Protocol Analysis: Risk score = Low (1.2/5). Blood sampling volume is within ethics thresholds (10mL total). ICF readability score = High.')}
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
            <Sparkles size={14} /> Parse Dossier PDF
          </button>
        </div>
      </section>

      {/* 3. PIPELINE STAGE FILTER BUTTONS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted, #78716C)' }}>Pipeline Stage Filter:</span>
        <button
          type="button"
          onClick={() => setActiveStageFilter('All')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border, #E5E7EB)',
            background: activeStageFilter === 'All' ? 'var(--accent, #84A98C)' : 'var(--card-bg, #FFF)',
            color: activeStageFilter === 'All' ? '#FFF' : 'var(--text, #1C1917)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          All Stages ({protocols.length})
        </button>

        {pipelineStages.map((stg) => (
          <button
            key={stg.id}
            type="button"
            onClick={() => setActiveStageFilter(stg.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border, #E5E7EB)',
              background: activeStageFilter === stg.id ? 'var(--accent, #84A98C)' : 'var(--card-bg, #FFF)',
              color: activeStageFilter === stg.id ? '#FFF' : 'var(--text, #1C1917)',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {stg.label}
          </button>
        ))}
      </div>

      {/* 4. PIPELINE KANBAN REVIEW BOARD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeStageFilter === 'All' ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr',
        gap: '16px',
        alignItems: 'start',
      }}>
        {pipelineStages
          .filter(stg => activeStageFilter === 'All' || activeStageFilter === stg.id)
          .map((stage) => {
            const stageProtocols = protocols.filter(p => p.stage === stage.id);
            return (
              <div
                key={stage.id}
                style={{
                  backgroundColor: 'var(--card-bg, #FFF)',
                  border: '1px solid var(--border, #E5E7EB)',
                  borderTop: `4px solid ${stage.color}`,
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border, #E5E7EB)' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text-h, #0C0A09)', fontWeight: 800 }}>{stage.label}</strong>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    background: 'var(--bg, #FAFAF9)',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    border: '1px solid var(--border, #E5E7EB)',
                  }}>
                    {stageProtocols.length}
                  </span>
                </div>

                {/* Protocol Cards in Stage Column */}
                {stageProtocols.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted, #78716C)' }}>
                    No protocols in this stage.
                  </div>
                ) : (
                  <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {stageProtocols.map((p) => (
                      <div
                        key={p.id}
                        className="iec-pipeline-card"
                        onClick={() => setSelectedProtocol(p)}
                        style={{
                          padding: '14px',
                          borderRadius: '10px',
                          border: '1px solid var(--border, #E5E7EB)',
                          background: 'var(--bg, #FAFAF9)',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent, #84A98C)' }}>{p.id}</span>
                          {p.daysToExpiry > 0 && p.daysToExpiry <= 30 && (
                            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-terracotta, #C86D51)', background: 'rgba(200, 109, 81, 0.15)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <AlertTriangle size={10} /> {p.daysToExpiry}d Expiry
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-h, #0C0A09)', marginBottom: '8px', lineHeight: '140%' }}>
                          {p.title}
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--text-muted, #78716C)', marginBottom: '10px' }}>
                          PI: <strong>{p.pi}</strong>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed var(--border, #E5E7EB)', fontSize: '11px' }}>
                          <span style={{ color: 'var(--text-muted, #78716C)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FileText size={12} /> {p.documents.length} Files
                          </span>
                          <span style={{ color: 'var(--accent, #84A98C)', fontWeight: 700 }}>Review Dossier &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* 5. DOCUMENT REVIEW & APPROVAL ACTION DRAWER MODAL */}
      {selectedProtocol && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div style={{
            maxWidth: '620px',
            width: '100%',
            backgroundColor: 'var(--card-bg, #FFF)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            border: '1px solid var(--border, #E5E7EB)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>

            <button
              type="button"
              onClick={() => setSelectedProtocol(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted, #78716C)',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Badge status={selectedProtocol.stage === 'Approved & Active' ? 'Active' : 'Urgent'} text={selectedProtocol.stage} />
              <strong style={{ fontSize: '14px', color: 'var(--text-h, #0C0A09)' }}>{selectedProtocol.id}</strong>
            </div>

            <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-h, #0C0A09)', fontWeight: 800 }}>
              {selectedProtocol.title}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted, #78716C)', marginBottom: '16px' }}>
              Reviewing Authority: <strong>{selectedProtocol.committee}</strong>
            </p>

            <div style={{ background: 'var(--bg, #FAFAF9)', border: '1px solid var(--border, #E5E7EB)', padding: '14px', borderRadius: '10px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Principal Investigator:</strong> {selectedProtocol.pi}</div>
              <div style={{ marginBottom: '6px' }}><strong>GCP Compliance Status:</strong> {selectedProtocol.gcpStatus}</div>
              <div style={{ marginBottom: '6px' }}><strong>Approval Window:</strong> {selectedProtocol.approvalDate} to {selectedProtocol.expiryDate}</div>
              <div><strong>Committee Notes:</strong> {selectedProtocol.notes}</div>
            </div>

            {/* Document Vault Tree */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted, #78716C)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Document Vault & Version Control ({selectedProtocol.documents.length} Attachments)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedProtocol.documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--card-bg, #FFF)', borderRadius: '8px', border: '1px solid var(--border, #E5E7EB)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h, #0C0A09)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} color="var(--accent, #84A98C)" /> {doc}
                    </span>
                    <button
                      type="button"
                      style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--accent, #84A98C)', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                      onClick={() => alert(`Downloading verified document: ${doc}`)}
                    >
                      <Download size={12} /> PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Committee Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border, #E5E7EB)' }}>
              {selectedProtocol.stage !== 'Approved & Active' && (
                <button
                  type="button"
                  onClick={() => handleApproveProtocol(selectedProtocol.id)}
                  disabled={approvalActionDone}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--accent, #84A98C)', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(132, 169, 140, 0.35)' }}
                >
                  <CheckCircle2 size={16} />
                  {approvalActionDone ? 'Signing Ethics Clearance...' : 'Grant IEC Ethical Clearance'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedProtocol(null)}
                style={{ background: 'transparent', color: 'var(--text, #1C1917)', border: '1px solid var(--border, #E5E7EB)', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}