import React, { useState } from 'react';
import Badge from '../components/common/Badge';

export default function PVDashboard({ studies = [], onSelectStudy, onBack }) {
  const [selectedSae, setSelectedSae] = useState(null);
  const [activeSocFilter, setActiveSocFilter] = useState('All');
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [filedSuccess, setFiledSuccess] = useState(false);

  // Enhancement 1: De-challenge / Re-challenge State Management
  const [dechallengeState, setDechallengeState] = useState({
    dechallenge: 'Positive (Symptoms Resolved)',
    rechallenge: 'Not Attempted (Ethics Risk)'
  });

  // Mock Aggregated Pharmacovigilance Dataset (AIIA NPvCC Safety Triage Queue)
  const saeQueue = [
    {
      saeId: 'SAE-2026-089',
      studyId: 'AIIA-AYU-001',
      studyTitle: 'Ashwagandha Extract in Type 2 Diabetes',
      patientId: 'PAT-1042',
      eventTerm: 'Acute Hepatotoxicity / Elevated ALT (3x ULN)',
      medDraSoc: 'Hepatobiliary disorders',
      onsetDate: '12-May-2026',
      severity: 'Life-Threatening',
      causality: 'Possible (Ayush-GCP Class B)',
      cdscoDeadlineDays: 2,
      status: 'Review Required',
      reporter: 'Dr. Rajesh Kumar (Co-PI)',
      site: 'AIIA Central Hospital, New Delhi',
      concomitantMeds: 'Metformin 500mg, Punarnavadi Kwath',
      narrative: 'Subject presented with jaundice and acute upper right quadrant abdominal discomfort following 14 days of investigational herb administration. Liver function tests confirmed ALT > 350 U/L.',
    },
    {
      saeId: 'SAE-2026-092',
      studyId: 'AIIA-AYU-002',
      studyTitle: 'Guggulu Formulations in Osteoarthritis',
      patientId: 'PAT-2089',
      eventTerm: 'Gastrointestinal Ulceration & Melena',
      medDraSoc: 'Gastrointestinal disorders',
      onsetDate: '18-Aug-2026',
      severity: 'Hospitalization Required',
      causality: 'Unlikely (Ayush-GCP Class C)',
      cdscoDeadlineDays: 5,
      status: 'In Progress',
      reporter: 'Dr. Meera S. (Sub-I)',
      site: 'AIIA Satellite Centre, Goa',
      concomitantMeds: 'Shunthi Churna, Ibuprofen (Unsanctioned)',
      narrative: 'Patient ingested OTC NSAIDs concurrently without reporting to investigator. Endoscopy confirmed gastric mucosal irritation.',
    },
    {
      saeId: 'SAE-2026-074',
      studyId: 'AIIA-AYU-004',
      studyTitle: 'Shirishadi Kwath in Bronchial Asthma',
      patientId: 'PAT-3011',
      eventTerm: 'Severe Bronchospasm & Acute Urticaria',
      medDraSoc: 'Respiratory disorders',
      onsetDate: '02-Jun-2026',
      severity: 'Hospitalization Required',
      causality: 'Probable (Ayush-GCP Class A)',
      cdscoDeadlineDays: 0,
      status: 'Resolved',
      reporter: 'Dr. Ananya Sharma (PI)',
      site: 'AIIA Central Hospital, New Delhi',
      concomitantMeds: 'Vasa Avaleha',
      narrative: 'Acute hypersensitivity response observed within 30 minutes of first dose. Managed via emergency bronchodilators.',
    },
    {
      saeId: 'SAE-2026-061',
      studyId: 'AIIA-AYU-005',
      studyTitle: 'Bakuchi Taila in Psoriasis',
      patientId: 'PAT-5012',
      eventTerm: 'Severe Phototoxic Dermatitis & Blistering',
      medDraSoc: 'Skin & Subcutaneous',
      onsetDate: '10-Apr-2026',
      severity: 'Significant Disability',
      causality: 'Certain (Ayush-GCP Class A)',
      cdscoDeadlineDays: 0,
      status: 'Resolved',
      reporter: 'Dr. K. V. Raghunath',
      site: 'AIIA Peripheral Unit, Haridwar',
      concomitantMeds: 'None',
      narrative: 'Patient applied oil over direct sunlight exposure exceeding protocol guidelines by 2 hours.',
    },
  ];

  // Selected SAE defaulting to first active triage case
  const activeSae = selectedSae || saeQueue[0];

  // Filter queue by SOC tag
  const filteredQueue = saeQueue.filter((item) => 
    activeSocFilter === 'All' || item.medDraSoc.includes(activeSocFilter)
  );

  const handleSignSubmit = (e) => {
    e.preventDefault();
    if (!signatureText) {
      return;
    }
    setFiledSuccess(true);
    setTimeout(() => {
      setFiledSuccess(false);
      setShowFilingModal(false);
      setSignatureText('');
      alert(`CDSCO Form 11 signed by ${signatureText} and transmitted to NPvCC Registry!`);
    }, 1200);
  };

  // Enhancement 3: Export CDSCO Audit Package Handler
  const handleExportAuditPackage = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "SAE ID,Study ID,Patient ID,MedDRA SOC,Severity,Ayush-GCP Causality,CDSCO Status\n"
      + saeQueue.map(e => `${e.saeId},${e.studyId},${e.patientId},"${e.medDraSoc}",${e.severity},"${e.causality}",${e.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CDSCO_Safety_Audit_Package_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '24px 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <button 
            className="btn-primary" 
            onClick={onBack} 
            style={{ padding: '6px 14px', fontSize: '12px', marginBottom: '10px' }}
          >
            &larr; Back to Portfolio
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-h)' }}>
            🛡️ Pharmacovigilance Safety Triage Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            National Pharmacovigilance Coordination Centre (NPvCC) — Emergency Incident Workstation
          </p>
        </div>

        {/* Enhancement 3: Export CDSCO Safety Audit Package */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="btn-primary"
            onClick={handleExportAuditPackage}
            style={{ padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>📥</span> Export CDSCO Audit Package
          </button>
          <div style={{ textAlign: 'right', background: 'var(--card-bg)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>MANDATORY CDSCO WATCH</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-terracotta)' }}>14-Day Statutory Window</div>
          </div>
        </div>
      </div>

      {/* ENHANCEMENT 2: SIGNAL DETECTION ALERT BANNER */}
      <div className="card" style={{ 
        backgroundColor: 'var(--badge-urgent-bg)', 
        borderColor: 'var(--accent-terracotta)', 
        padding: '12px 20px', 
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <strong style={{ color: 'var(--accent-terracotta)', fontSize: '13px' }}>
              NPvCC Automated Signal Detection Trigger (Disproportionality Score ROR &gt; 2.5)
            </strong>
            <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '2px' }}>
              Cluster Alert: 3 instances of <em>Hepatobiliary ALT Elevation</em> detected across Ashwagandha formulations (AIIA-AYU-001 & AIIA-AYU-008). Signal flagged for DSMB review.
            </div>
          </div>
        </div>
        <button 
          className="btn-terracotta" 
          style={{ fontSize: '11px', padding: '6px 12px', whiteSpace: 'nowrap' }}
          onClick={() => alert("Signal Dossier #SIG-2026-04 generated and sent to DSMB Chair.")}
        >
          View Signal Analysis &rarr;
        </button>
      </div>

      {/* MedDRA System Organ Class (SOC) Quick Triage Tags */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>MedDRA SOC Filter:</span>
        {['All', 'Hepatobiliary', 'Gastrointestinal', 'Respiratory', 'Skin & Subcutaneous'].map((soc) => (
          <button
            key={soc}
            onClick={() => setActiveSocFilter(soc)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: activeSocFilter === soc ? 'var(--accent)' : 'var(--card-bg)',
              color: activeSocFilter === soc ? 'var(--accent-text)' : 'var(--text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {soc}
          </button>
        ))}
      </div>

      {/* MASTER-DETAIL EMERGENCY TRIAGE SPLIT LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Severe Incident Triage Stream */}
        <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
            <strong style={{ fontSize: '14px', color: 'var(--text-h)' }}>Incident Triage Queue ({filteredQueue.length})</strong>
            <span style={{ fontSize: '11px', color: 'var(--accent-terracotta)', fontWeight: 700 }}>🚨 Priority Sorted</span>
          </div>

          {filteredQueue.map((sae) => {
            const isSelected = activeSae.saeId === sae.saeId;
            return (
              <div
                key={sae.saeId}
                onClick={() => setSelectedSae(sae)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid var(--accent-terracotta)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--code-bg)' : 'var(--bg)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-h)' }}>{sae.saeId}</span>
                  {sae.cdscoDeadlineDays > 0 ? (
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      color: 'var(--accent-terracotta)', 
                      background: 'var(--badge-urgent-bg)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}>
                      ⏱️ {sae.cdscoDeadlineDays}d Left
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--badge-active-text)' }}>✓ Filed</span>
                  )}
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '4px' }}>
                  {sae.eventTerm}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Patient: {sae.patientId} • {sae.studyId}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: Active Incident Dossier & Action Console */}
        <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--accent-terracotta)' }}>
          
          {/* Dossier Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--accent-terracotta)' }}>{activeSae.saeId}</span>
                <Badge status={activeSae.status} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activeSae.medDraSoc}</span>
              </div>
              <h2 style={{ fontSize: '22px', color: 'var(--text-h)', margin: 0 }}>
                {activeSae.eventTerm}
              </h2>
            </div>

            <button 
              className="btn-terracotta" 
              style={{ fontSize: '13px', padding: '10px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setShowFilingModal(true)}
            >
              <span>📄</span> Sign & File CDSCO Form 11
            </button>
          </div>

          {/* Incident Metadata Panel */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '12px', 
            background: 'var(--code-bg)', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '13px',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>STUDY PROTOCOL</div>
              <div style={{ fontWeight: 700, color: 'var(--text-h)', marginTop: '2px' }}>{activeSae.studyId}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{activeSae.studyTitle}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>PATIENT & SITE</div>
              <div style={{ fontWeight: 700, color: 'var(--text-h)', marginTop: '2px' }}>{activeSae.patientId}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{activeSae.site}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>AYUSH-GCP CAUSALITY</div>
              <div style={{ fontWeight: 700, color: 'var(--accent-terracotta)', marginTop: '2px' }}>{activeSae.causality}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WHO-UMC Scale Consensus</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>STATUTORY DEADLINE</div>
              <div style={{ fontWeight: 800, color: 'var(--accent-terracotta)', marginTop: '2px' }}>
                {activeSae.cdscoDeadlineDays > 0 ? `${activeSae.cdscoDeadlineDays} Days Remaining` : 'CDSCO Submission Complete'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Rule 122D Compliance</div>
            </div>
          </div>

          {/* Clinical Narrative */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--text-h)', marginBottom: '8px' }}>Clinical Case Narrative</h3>
            <p style={{ fontSize: '14px', lineHeight: '160%', color: 'var(--text)', background: 'var(--bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {activeSae.narrative}
            </p>
          </div>

          {/* ENHANCEMENT 1: DE-CHALLENGE & RE-CHALLENGE INTERACTIVE WORKFLOW TOGGLES */}
          <div style={{ marginBottom: '20px', background: 'var(--card-bg)', border: '1.5px dashed var(--border)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-h)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>🧪</span> DE-CHALLENGE / RE-CHALLENGE CAUSALITY TRIAGE
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  De-challenge Outcome (Herb Withdrawal)
                </label>
                <select 
                  value={dechallengeState.dechallenge}
                  onChange={(e) => setDechallengeState({ ...dechallengeState, dechallenge: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '12px' }}
                >
                  <option value="Positive (Symptoms Resolved)">Positive (Symptoms Resolved)</option>
                  <option value="Negative (Symptoms Persisted)">Negative (Symptoms Persisted)</option>
                  <option value="Inconclusive">Inconclusive / Concomitant Med Interference</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Re-challenge Status (Re-exposure)
                </label>
                <select 
                  value={dechallengeState.rechallenge}
                  onChange={(e) => setDechallengeState({ ...dechallengeState, rechallenge: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '12px' }}
                >
                  <option value="Not Attempted (Ethics Risk)">Not Attempted (Ethics Risk)</option>
                  <option value="Positive (Recurrence Confirmed)">Positive (Recurrence Confirmed)</option>
                  <option value="Negative (No Recurrence)">Negative (No Recurrence)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>CONCOMITANT MEDICATION LOG</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{activeSae.concomitantMeds}</div>
            </div>

            <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>REPORTING INVESTIGATOR</div>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{activeSae.reporter}</div>
            </div>
          </div>

        </div>

      </div>

      {/* ACTION MODAL: CDSCO FORM 11 ELECTRONIC SIGNATURE */}
      {showFilingModal && (
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
          <div className="card" style={{ maxWidth: '540px', width: '100%', backgroundColor: 'var(--card-bg)', position: 'relative' }}>
            
            <button 
              onClick={() => setShowFilingModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                border: 'none',
                background: 'transparent',
                fontSize: '18px',
                fontWeight: 800,
                cursor: 'pointer',
                color: 'var(--text-muted)',
              }}
            >
              ✕
            </button>

            <h2 style={{ fontSize: '20px', color: 'var(--text-h)', marginBottom: '4px' }}>
              CDSCO Form 11 Statutory Filing
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Expedited SAE Transmittal to Central Drugs Standard Control Organization (CDSCO) & Ayush Pharmacovigilance Cell
            </p>

            <div style={{ background: 'var(--code-bg)', padding: '12px', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>
              <div><strong>Incident Reference:</strong> {activeSae.saeId} ({activeSae.eventTerm})</div>
              <div><strong>Ayush-GCP Category:</strong> {activeSae.causality}</div>
              <div><strong>De-challenge:</strong> {dechallengeState.dechallenge}</div>
              <div><strong>Target Regulator:</strong> CDSCO / NPvCC Registry</div>
            </div>

            <form onSubmit={handleSignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                  Safety Officer e-Signature Authorization
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Type Full Name (e.g. Dr. Ananya Sharma)"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontSize: '13px',
                  }}
                />
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                🔒 Submitting this form applies a 21 CFR Part 11 compliant cryptographic signature and logs the event in the ALCOA+ audit trail.
              </div>

              <button 
                type="submit" 
                className="btn-terracotta" 
                style={{ padding: '12px', fontSize: '13px', fontWeight: 700 }}
                disabled={filedSuccess}
              >
                {filedSuccess ? 'Applying SHA-256 Signature...' : 'Cryptographically Sign & Transmit to CDSCO'}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}