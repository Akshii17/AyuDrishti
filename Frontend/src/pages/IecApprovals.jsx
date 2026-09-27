import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import { ShieldCheck, AlertTriangle, FileText, ArrowLeft, X, Download, CheckCircle2 } from 'lucide-react';

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
    { id: 'Under IEC Review', label: '🔬 Under IEC Review', color: 'var(--accent)' },
    { id: 'Approved & Active', label: '✓ Approved & Active', color: 'var(--badge-active-text)' },
    { id: 'Renewal Required', label: '⚠️ Renewal Required', color: 'var(--accent-terracotta)' },
  ];

  const handleApproveProtocol = (protocolId) => {
    setApprovalActionDone(true);
    setTimeout(() => {
      setProtocols(prev => prev.map(p => {
        if (p.id === protocolId) {
          return {
            ...p,
            stage: 'Approved & Active',
            approvalDate: '26-Sep-2026',
            expiryDate: '25-Sep-2027',
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

  return (
    <div style={{ padding: '24px 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <button 
            className="btn-primary" 
            onClick={onBack} 
            style={{ padding: '6px 14px', fontSize: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-h)' }}>
            📋 Institutional Ethics Committee (IEC) Approvals Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Ayush-GCP Ethical Oversight, Protocol Review Pipelines & Annual Re-certifications
          </p>
        </div>

        {/* REDESIGNED PRETTY METRIC STAT CARDS WITH LUCIDE ICONS */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          
          {/* Active Clearances Stat Card */}
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: '180px'
          }}>
            <div style={{ 
              backgroundColor: 'rgba(39, 201, 63, 0.12)', 
              color: 'var(--badge-active-text)', 
              padding: '10px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
                ACTIVE CLEARANCES
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-h)', marginTop: '1px' }}>
                2 Protocols
              </div>
            </div>
          </div>

          {/* Renewals Due Stat Card */}
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            border: '1px solid var(--accent-terracotta)',
            boxShadow: '0 4px 14px rgba(192, 86, 33, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            minWidth: '180px'
          }}>
            <div style={{ 
              backgroundColor: 'var(--badge-urgent-bg)', 
              color: 'var(--accent-terracotta)', 
              padding: '10px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--accent-terracotta)', fontWeight: 700, letterSpacing: '0.5px' }}>
                RENEWALS DUE
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--accent-terracotta)', marginTop: '2px' }}>
                1 Critical
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stage Filter Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Pipeline Stage Filter:</span>
        <button
          onClick={() => setActiveStageFilter('All')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            background: activeStageFilter === 'All' ? 'var(--accent)' : 'var(--card-bg)',
            color: activeStageFilter === 'All' ? 'var(--accent-text)' : 'var(--text)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          All Stages ({protocols.length})
        </button>

        {pipelineStages.map((stg) => (
          <button
            key={stg.id}
            onClick={() => setActiveStageFilter(stg.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: activeStageFilter === stg.id ? 'var(--accent)' : 'var(--card-bg)',
              color: activeStageFilter === stg.id ? 'var(--accent-text)' : 'var(--text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {stg.label}
          </button>
        ))}
      </div>

      {/* PIPELINE KANBAN REVIEW BOARD */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: activeStageFilter === 'All' ? 'repeat(4, 1fr)' : '1fr', 
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
                className="card" 
                style={{ 
                  backgroundColor: 'var(--code-bg)', 
                  borderTop: `4px solid ${stage.color}`, 
                  padding: '16px',
                  minHeight: '0',
                  maxHeight: '480px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {/* Column Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                  <strong style={{ fontSize: '13px', color: 'var(--text-h)' }}>{stage.label}</strong>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    background: 'var(--card-bg)', 
                    padding: '2px 8px', 
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                  }}>
                    {stageProtocols.length}
                  </span>
                </div>

                {/* Protocol Cards in Stage Column */}
                {stageProtocols.length === 0 ? (
                  <div style={{ padding: '20px 0', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                    No protocols in this stage.
                  </div>
                ) : (
                  <div style={{ maxHeight: 360, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {stageProtocols.map((p) => (
                    <div
                      key={p.id}
                      className="iec-pipeline-card"
                      onClick={() => setSelectedProtocol(p)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: 'var(--card-bg)',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>{p.id}</span>
                        {p.daysToExpiry > 0 && p.daysToExpiry <= 30 && (
                          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent-terracotta)', background: 'var(--badge-urgent-bg)', padding: '2px 6px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <AlertTriangle size={10} /> {p.daysToExpiry}d Expiry
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px', lineHeight: '140%' }}>
                        {p.title}
                      </div>

                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        PI: <strong>{p.pi}</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed var(--border)', fontSize: '11px' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={12} /> {p.documents.length} Files
                        </span>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Review Dossier &rarr;</span>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* DOCUMENT REVIEW & APPROVAL ACTION DRAWER MODAL */}
      {selectedProtocol && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', backgroundColor: 'var(--card-bg)', position: 'relative' }}>
            
            <button 
              onClick={() => setSelectedProtocol(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Badge status={selectedProtocol.stage === 'Approved & Active' ? 'Active' : 'Urgent'} text={selectedProtocol.stage} />
              <strong style={{ fontSize: '14px', color: 'var(--text-h)' }}>{selectedProtocol.id}</strong>
            </div>

            <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-h)' }}>
              {selectedProtocol.title}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Reviewing Authority: <strong>{selectedProtocol.committee}</strong>
            </p>

            <div style={{ background: 'var(--code-bg)', padding: '14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Principal Investigator:</strong> {selectedProtocol.pi}</div>
              <div style={{ marginBottom: '6px' }}><strong>GCP Compliance Status:</strong> {selectedProtocol.gcpStatus}</div>
              <div style={{ marginBottom: '6px' }}><strong>Approval Window:</strong> {selectedProtocol.approvalDate} to {selectedProtocol.expiryDate}</div>
              <div><strong>Committee Notes:</strong> {selectedProtocol.notes}</div>
            </div>

            {/* Document Vault Tree */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                DOCUMENT VAULT & VERSION CONTROL ({selectedProtocol.documents.length} ATTACHMENTS)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedProtocol.documents.map((doc, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} /> {doc}
                    </span>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '4px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => alert(`Downloading verified document: ${doc}`)}
                    >
                      <Download size={12} /> PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Committee Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              {selectedProtocol.stage !== 'Approved & Active' && (
                <button 
                  className="btn-primary"
                  onClick={() => handleApproveProtocol(selectedProtocol.id)}
                  disabled={approvalActionDone}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <CheckCircle2 size={16} />
                  {approvalActionDone ? 'Signing Ethics Clearance...' : 'Grant IEC Ethical Clearance'}
                </button>
              )}
              <button className="btn-primary" onClick={() => setSelectedProtocol(null)} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}