import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import mockData from '../data/mockStudies.json';

export default function StudyDetails({ study, onBack }) {
  // Interactive Study State
  const [currentStudy, setCurrentStudy] = useState(study || mockData[0]);
  const [activeTab, setActiveTab] = useState('eCRF');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [protocolSearch, setProtocolSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sdvChecked, setSdvChecked] = useState(false);

  // Dynamic Patient eCRF Dataset generator based on selected disease/study
  const getPatientLogsForStudy = (studyId) => {
    const patientMap = {
      'AIIA-AYU-001': [
        { patientId: 'PAT-1042', site: 'AIIA Central Hospital, New Delhi', visit: 'Visit 3 (Week 4)', dosageCompliance: '98%', formulation: 'Ashwagandha Extract 500mg BID', sdvStatus: 'Verified', dataQuery: 'None', vitals: 'BP: 122/80 mmHg | Fasting Glucose: 110 mg/dL | HbA1c: 6.8%' },
        { patientId: 'PAT-1048', site: 'AIIA Central Hospital, New Delhi', visit: 'Visit 2 (Week 2)', dosageCompliance: '92%', formulation: 'Ashwagandha Extract 500mg BID', sdvStatus: 'Pending SDV', dataQuery: 'Out-of-range ALT value', vitals: 'BP: 130/85 mmHg | Fasting Glucose: 135 mg/dL | HbA1c: 7.2%' },
        { patientId: 'PAT-2011', site: 'AIIA Satellite Centre, Goa', visit: 'Visit 4 (Week 8)', dosageCompliance: '100%', formulation: 'Ashwagandha Extract 500mg BID', sdvStatus: 'Verified', dataQuery: 'None', vitals: 'BP: 118/78 mmHg | Fasting Glucose: 102 mg/dL | HbA1c: 6.4%' },
      ],
      'AIIA-AYU-002': [
        { patientId: 'PAT-2089', site: 'AIIA Satellite Centre, Goa', visit: 'Visit 2 (Week 4)', dosageCompliance: '88%', formulation: 'Shuddha Guggulu 1000mg Daily', sdvStatus: 'Pending SDV', dataQuery: 'NSAID Concomitant Use', vitals: 'WOMAC Knee Stiffness Score: 42/96 | Pain VAS: 6/10' },
        { patientId: 'PAT-2094', site: 'AIIA Satellite Centre, Goa', visit: 'Visit 3 (Week 8)', dosageCompliance: '96%', formulation: 'Shuddha Guggulu 1000mg Daily', sdvStatus: 'Verified', dataQuery: 'None', vitals: 'WOMAC Knee Stiffness Score: 24/96 | Pain VAS: 3/10' },
      ],
      'AIIA-AYU-004': [
        { patientId: 'PAT-3011', site: 'AIIA Central Hospital, New Delhi', visit: 'Visit 1 (Baseline)', dosageCompliance: '100%', formulation: 'Shirishadi Kwath 50ml Decoction', sdvStatus: 'Verified', dataQuery: 'None', vitals: 'FEV1: 2.1L (68% predicted) | AEC: 450 cells/mcL' },
        { patientId: 'PAT-3015', site: 'AIIA Central Hospital, New Delhi', visit: 'Visit 3 (Week 6)', dosageCompliance: '95%', formulation: 'Shirishadi Kwath 50ml Decoction', sdvStatus: 'Verified', dataQuery: 'None', vitals: 'FEV1: 2.6L (82% predicted) | AEC: 280 cells/mcL' },
      ],
      'AIIA-AYU-005': [
        { patientId: 'PAT-5012', site: 'AIIA Peripheral Unit, Haridwar', visit: 'Visit 4 (Week 12)', dosageCompliance: '90%', formulation: 'Bakuchi Taila External Application', sdvStatus: 'Verified', dataQuery: 'Sunlight Duration Log', vitals: 'PASI Score: 4.2 (75% Reduction) | Lesion Surface: 6%' },
      ],
    };

    return patientMap[studyId] || patientMap['AIIA-AYU-001'];
  };

  const patientLogs = getPatientLogsForStudy(currentStudy.studyId);

  // Auto-suggestion search filter across study title, disease shortTitle, ID, and PI
  const autoSuggestions = mockData.filter((s) => {
    if (!protocolSearch.trim()) return false;
    const query = protocolSearch.toLowerCase();
    return (
      s.title.toLowerCase().includes(query) ||
      s.studyId.toLowerCase().includes(query) ||
      s.shortTitle.toLowerCase().includes(query) ||
      s.principalInvestigator.toLowerCase().includes(query)
    );
  });

  const filteredPatients = patientLogs.filter((p) => 
    p.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.visit.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ecrfColumns = [
    {
      header: 'Subject ID & Site',
      render: (row) => (
        <div>
          <strong 
            style={{ color: 'var(--text-h)', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => {
              setSelectedPatient(row);
              setSdvChecked(row.sdvStatus === 'Verified');
            }}
          >
            {row.patientId}
          </strong>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.site}</div>
        </div>
      ),
    },
    {
      header: 'Visit Milestone',
      render: (row) => <span style={{ fontWeight: 600, fontSize: '13px' }}>{row.visit}</span>,
    },
    {
      header: 'Ayush Formulation & Dosing',
      render: (row) => (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600 }}>{row.formulation}</div>
          <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>Compliance: {row.dosageCompliance}</div>
        </div>
      ),
    },
    {
      header: 'Clinical Vitals & Endpoint Indicators',
      render: (row) => (
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-h)' }}>{row.vitals}</span>
      ),
    },
    {
      header: 'Data Quality',
      render: (row) => (
        <div>
          {row.dataQuery === 'None' ? (
            <span style={{ color: 'var(--badge-active-text)', fontSize: '12px', fontWeight: 600 }}>✓ Clean Data</span>
          ) : (
            <span style={{ color: 'var(--accent-terracotta)', fontSize: '12px', fontWeight: 700 }}>⚠️ {row.dataQuery}</span>
          )}
        </div>
      ),
    },
    {
      header: 'SDV Status',
      render: (row) => (
        <Badge status={row.sdvStatus === 'Verified' ? 'Compliant' : 'Pending'} text={row.sdvStatus} />
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <button 
          className="btn-primary" 
          style={{ padding: '4px 10px', fontSize: '12px' }}
          onClick={() => {
            setSelectedPatient(row);
            setSdvChecked(row.sdvStatus === 'Verified');
          }}
        >
          Open eCRF
        </button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* 1. GOOGLE-STYLE AUTO-SUGGESTION SEARCH BAR */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px', backgroundColor: 'var(--code-bg)', overflow: 'visible' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '16px' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search by Disease, Herb, PI, or Protocol ID (e.g., Diabetes, Asthma, Ashwagandha)..." 
              value={protocolSearch}
              onChange={(e) => {
                setProtocolSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1.5px solid var(--accent)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '14px',
                fontWeight: 500,
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            />
          </div>

          {/* AUTO-SUGGESTION POPUP DROPDOWN */}
          {showSuggestions && autoSuggestions.length > 0 && (
            <div 
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '6px',
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                zIndex: 999,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                SUGGESTED CLINICAL TRIALS ({autoSuggestions.length})
              </div>
              
              {autoSuggestions.map((s) => (
                <div
                  key={s.studyId}
                  onClick={() => {
                    setCurrentStudy(s);
                    setProtocolSearch('');
                    setShowSuggestions(false);
                    setSelectedPatient(null);
                  }}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.2s ease',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--code-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-h)' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {s.studyId} • Indication: <strong>{s.shortTitle}</strong> • PI: {s.principalInvestigator}
                    </div>
                  </div>
                  <Badge status={s.status} text={s.phase} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 2. ACTIVE PROTOCOL HEADER BANNER */}
      <div className="card" style={{ marginBottom: '20px', backgroundColor: 'var(--header-bg)', borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>{currentStudy.studyId}</span>
              <Badge status={currentStudy.status} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>CTRI Registered</span>
            </div>
            <h1 style={{ margin: '0 0 6px 0', fontSize: '24px', color: 'var(--text-h)' }}>
              {currentStudy.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
              {currentStudy.studyType} • {currentStudy.phase} • Principal Investigator: <strong>{currentStudy.principalInvestigator}</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right', background: 'var(--card-bg)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>RECRUITMENT PROGRESS</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-h)', marginTop: '2px' }}>
              {currentStudy.participants?.enrolled} / {currentStudy.participants?.target} Subjects
            </div>
          </div>
        </div>
      </div>

      {/* 3. SUB-TAB WORKSPACE NAVIGATION SWITCHER */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1.5px solid var(--border)', paddingBottom: '8px' }}>
        {[
          { id: 'eCRF', label: '📑 Subject eCRF Logs' },
          { id: 'Overview', label: '📋 Posology & Protocol' },
          { id: 'Sites', label: '🏥 Multi-Center Sites' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent-text)' : 'var(--text)',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PATIENT eCRF WORKSPACE */}
      {activeTab === 'eCRF' && (
        <Card 
          title={`Electronic Case Report Form (eCRF) Register — ${currentStudy.shortTitle}`} 
          subtitle="Real-time subject visit data entry, clinical endpoint vitals, and CRA verification"
        >
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Filter Subject ID, Site, or Visit..." 
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
                minWidth: '220px',
              }}
            />
          </div>

          <Table columns={ecrfColumns} data={filteredPatients} emptyMessage="No matching subject eCRF logs found for this protocol." />
        </Card>
      )}

      {/* TAB 2: PROTOCOL & POSOLOGY DETAILS */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <Card title="Ayush Herb Posology & Administration" subtitle="Investigational Traditional Medicine Specifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div style={{ background: 'var(--code-bg)', padding: '12px', borderRadius: '6px' }}>
                <strong>Active Protocol:</strong> {currentStudy.title}
              </div>
              <div style={{ background: 'var(--code-bg)', padding: '12px', borderRadius: '6px' }}>
                <strong>Target Disease / Indication:</strong> {currentStudy.shortTitle} Clinical Evaluation
              </div>
              <div style={{ background: 'var(--code-bg)', padding: '12px', borderRadius: '6px' }}>
                <strong>Principal Investigator:</strong> {currentStudy.principalInvestigator}
              </div>
            </div>
          </Card>

          <Card title="GCP Regulatory Milestones" subtitle="CTRI Registrations & Ethical Approvals">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div><strong>CTRI Registration Number:</strong> CTRI/2026/04/08912</div>
              <div><strong>Regulatory Status:</strong> {currentStudy.ethicsRegulatory?.regulatoryStatus || 'Compliant'}</div>
              <div><strong>Informed Consent Version:</strong> ICF Version 3.1 (English/Hindi)</div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: SITE NETWORK */}
      {activeTab === 'Sites' && (
        <Card title="Multi-Centric Trial Sites" subtitle="Source Data Verification (SDV) status across centers">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(currentStudy.sites || ['AIIA Central Hospital, New Delhi', 'AIIA Satellite Centre, Goa']).map((site, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--code-bg)', borderRadius: '8px' }}>
                <div>
                  <strong style={{ fontSize: '14px' }}>{typeof site === 'string' ? site : site.name}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Site Coordinator: Dr. Rajesh K.</div>
                </div>
                <Badge status="Compliant" text="SDV Operational" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* INTERACTIVE eCRF FORM ENTRY SIDE DRAWER / MODAL */}
      {selectedPatient && (
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
              onClick={() => setSelectedPatient(null)}
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

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
              <Badge status={selectedPatient.sdvStatus === 'Verified' ? 'Compliant' : 'Pending'} text={selectedPatient.visit} />
              <strong style={{ fontSize: '14px', color: 'var(--text-h)' }}>{selectedPatient.patientId}</strong>
            </div>

            <h2 style={{ fontSize: '20px', margin: '0 0 12px 0', color: 'var(--text-h)' }}>
              Electronic Case Report Form Entry
            </h2>

            <div style={{ background: 'var(--code-bg)', padding: '14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Investigational Regimen:</strong> {selectedPatient.formulation}</div>
              <div style={{ marginBottom: '6px' }}><strong>Clinical Endpoint Indicators:</strong> {selectedPatient.vitals}</div>
              <div><strong>Dosage Compliance Logged:</strong> {selectedPatient.dosageCompliance}</div>
            </div>

            {/* Source Data Verification Toggle */}
            <div style={{ marginBottom: '20px', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="checkbox" 
                  checked={sdvChecked} 
                  onChange={(e) => setSdvChecked(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent)' }}
                />
                CRA Source Data Verification (SDV) Checked & Attested
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-primary"
                onClick={() => {
                  alert(`eCRF entry for ${selectedPatient.patientId} saved and signed in ALCOA+ Audit Log!`);
                  setSelectedPatient(null);
                }}
              >
                Save & Sign eCRF Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}