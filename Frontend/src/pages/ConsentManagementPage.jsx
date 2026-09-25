import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';
import Table from '../components/common/Table';
import { 
  FileCheck, 
  Video, 
  UserCheck, 
  UserX, 
  ArrowLeft, 
  Download, 
  Search, 
  ShieldCheck, 
  PlayCircle,
  X,
  FileText
} from 'lucide-react';

export default function ConsentManagementPage({ onBack }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Mock Consent Dataset (Ayush-GCP Multi-lingual Informed Consent)
  const consentRecords = [
    {
      subjectId: 'PAT-1042',
      studyId: 'AIIA-AYU-001',
      studyTitle: 'Ashwagandha Extract in Type 2 Diabetes',
      language: 'Hindi (हिंदी)',
      icfVersion: 'v3.1 (Approved)',
      consentDate: '12-May-2026',
      avRecording: 'Verified (04:12 mins)',
      witnessName: 'Dr. Rajesh Kumar (Co-PI)',
      status: 'Active',
      biometricHash: 'b7a9e81f7c2d4e5f60718293a4b5c6d7e8f90123',
    },
    {
      subjectId: 'PAT-2089',
      studyId: 'AIIA-AYU-002',
      studyTitle: 'Guggulu Formulations in Osteoarthritis',
      language: 'Marathi (मराठी)',
      icfVersion: 'v2.0',
      consentDate: '18-Aug-2026',
      avRecording: 'Pending Upload',
      witnessName: 'Dr. Meera S.',
      status: 'Pending Verification',
      biometricHash: 'a3f9e81b7c2d4e5f60718293a4b5c6d7e8f90123',
    },
    {
      subjectId: 'PAT-3011',
      studyId: 'AIIA-AYU-004',
      studyTitle: 'Shirishadi Kwath in Bronchial Asthma',
      language: 'English',
      icfVersion: 'v3.1 (Approved)',
      consentDate: '02-Jun-2026',
      avRecording: 'Verified (03:45 mins)',
      witnessName: 'Dr. Ananya Sharma',
      status: 'Active',
      biometricHash: 'f8e7d6c5b4a392817061524334251607f8e7d6c5',
    },
    {
      subjectId: 'PAT-5012',
      studyId: 'AIIA-AYU-005',
      studyTitle: 'Bakuchi Taila in Psoriasis',
      language: 'Hindi (हिंदी)',
      icfVersion: 'v1.2',
      consentDate: '10-Apr-2026',
      avRecording: 'Verified (05:20 mins)',
      witnessName: 'Dr. K. V. Raghunath',
      status: 'Consent Revoked',
      biometricHash: '718293a4b5c6d7e8f90123456789abcdef012345',
    },
  ];

  const filteredRecords = consentRecords.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
    const matchesSearch = 
      item.subjectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studyId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.language.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const columns = [
    {
      header: 'Subject ID & Protocol',
      render: (row) => (
        <div>
          <strong 
            style={{ color: 'var(--text-h)', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}
            onClick={() => setSelectedSubject(row)}
          >
            {row.subjectId}
          </strong>
          <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>{row.studyId}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{row.studyTitle}</div>
        </div>
      )
    },
    {
      header: 'Language & ICF Version',
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--text-h)' }}>{row.language}</span>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ICF: {row.icfVersion}</div>
        </div>
      )
    },
    {
      header: 'Audio / Video (AV) Proof',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Video size={14} color={row.avRecording.includes('Verified') ? 'var(--badge-active-text)' : 'var(--accent-terracotta)'} />
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.avRecording}</span>
        </div>
      )
    },
    {
      header: 'Attesting Witness',
      render: (row) => <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{row.witnessName}</span>
    },
    {
      header: 'Consent Status',
      render: (row) => (
        <Badge status={row.status === 'Active' ? 'Active' : row.status === 'Consent Revoked' ? 'Urgent' : 'Pending'} text={row.status} />
      )
    },
    {
      header: 'Action',
      render: (row) => (
        <button 
          className="btn-primary" 
          style={{ padding: '4px 10px', fontSize: '12px' }}
          onClick={() => setSelectedSubject(row)}
        >
          Inspect Certificate
        </button>
      )
    }
  ];

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
            <ArrowLeft size={14} /> Back to Portfolio
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-h)' }}>
            📝 Digital e-Consent & Vernacular Audio/Video Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Ayush-GCP & CDSCO Compliant Informed Consent Audit Trail, Vernacular AV Logs & SHA-256 Signatures
          </p>
        </div>

        {/* METRIC CARDS */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '12px 18px', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ backgroundColor: 'rgba(39, 201, 63, 0.12)', color: 'var(--badge-active-text)', padding: '10px', borderRadius: '10px' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>VERIFIED CONSENTS</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-h)' }}>142 Subjects</div>
            </div>
          </div>

          <div style={{ 
            background: 'var(--card-bg)', 
            padding: '12px 18px', 
            borderRadius: '12px', 
            border: '1px solid var(--accent-terracotta)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ backgroundColor: 'var(--badge-urgent-bg)', color: 'var(--accent-terracotta)', padding: '10px', borderRadius: '10px' }}>
              <UserX size={20} />
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'var(--accent-terracotta)', fontWeight: 700 }}>CONSENT REVOCATIONS</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent-terracotta)' }}>1 Logged</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px', backgroundColor: 'var(--code-bg)' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search Subject ID, Protocol, or Vernacular Language (e.g., Hindi, Marathi)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                background: 'var(--bg)',
                color: 'var(--text)',
                fontSize: '13px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Active', 'Pending Verification', 'Consent Revoked'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveFilter(status)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid var(--border)',
                  background: activeFilter === status ? 'var(--accent)' : 'var(--card-bg)',
                  color: activeFilter === status ? 'var(--accent-text)' : 'var(--text)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {status}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* CONSENT TABLE REGISTER */}
      <Card title="Vernacular Informed Consent Register" subtitle="Audited e-Consent records with AV proof & cryptographic hash stamp">
        <Table columns={columns} data={filteredRecords} emptyMessage="No consent records found matching the filter." />
      </Card>

      {/* INSPECT CONSENT CERTIFICATE & AV PLAYER MODAL */}
      {selectedSubject && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div className="card" style={{ maxWidth: '620px', width: '100%', backgroundColor: 'var(--card-bg)', position: 'relative' }}>
            
            <button 
              onClick={() => {
                setSelectedSubject(null);
                setIsPlayingVideo(false);
              }}
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
              <Badge status={selectedSubject.status === 'Active' ? 'Active' : 'Urgent'} text={selectedSubject.status} />
              <strong style={{ fontSize: '14px', color: 'var(--text-h)' }}>{selectedSubject.subjectId}</strong>
            </div>

            <h2 style={{ fontSize: '20px', margin: '0 0 8px 0', color: 'var(--text-h)' }}>
              Informed Consent Certificate & AV Audit
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Study: <strong>{selectedSubject.studyId}</strong> ({selectedSubject.studyTitle})
            </p>

            {/* AV Proof Player Simulator */}
            <div style={{ background: '#111827', color: '#FFF', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
              {!isPlayingVideo ? (
                <div style={{ padding: '20px 0' }}>
                  <Video size={36} color="var(--accent)" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Vernacular Video Consent Audit Record ({selectedSubject.language})</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '12px' }}>Timestamped: {selectedSubject.consentDate} • Witness: {selectedSubject.witnessName}</div>
                  <button 
                    className="btn-primary"
                    onClick={() => setIsPlayingVideo(true)}
                    style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <PlayCircle size={14} /> Stream Encrypted Video Proof
                  </button>
                </div>
              ) : (
                <div style={{ padding: '12px 0' }}>
                  <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700, marginBottom: '8px' }}>
                    ▶ STREAMING AV CONSENT PROOF (02:14 / 04:12)
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: '55%', height: '100%', backgroundColor: 'var(--accent)' }}></div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: 'var(--code-bg)', padding: '14px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>ICF Form Version:</strong> {selectedSubject.icfVersion}</div>
              <div style={{ marginBottom: '6px' }}><strong>Vernacular Language:</strong> {selectedSubject.language}</div>
              <div><strong>SHA-256 Biometric Hash:</strong> <code>{selectedSubject.biometricHash}</code></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                className="btn-primary" 
                style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => alert(`Consent Certificate for ${selectedSubject.subjectId} downloaded!`)}
              >
                <Download size={14} /> Download Certificate PDF
              </button>
              <button className="btn-primary" onClick={() => setSelectedSubject(null)} style={{ background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' }}>
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}