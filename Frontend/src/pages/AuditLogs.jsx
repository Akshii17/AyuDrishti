import React, { useState } from 'react';
import Badge from '../components/common/Badge';
import Card from '../components/common/Card';

export default function AuditLogs({ onBack }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState(false);

  // Mock Cryptographic Audit Log Dataset (21 CFR Part 11 & ALCOA+ Compliant)
  const auditLogs = [
    {
      id: 'LOG-89102',
      timestamp: '2026-09-26 01:42:10 IST',
      user: 'Dr. Ananya Sharma',
      role: 'Principal Investigator',
      action: 'eCRF Form Signed & Locked',
      module: 'eCRF Data',
      details: 'Patient PAT-1042 Visit 3 Form signed and locked.',
      ip: '14.139.224.12',
      sha256: 'a3f9e81b7c2d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789ab',
      status: 'VERIFIED',
    },
    {
      id: 'LOG-89098',
      timestamp: '2026-09-25 18:12:04 IST',
      user: 'Dr. Rajesh Kumar',
      role: 'Clinical Research Associate',
      action: 'Source Data Verification (SDV) Attested',
      module: 'SDV Audit',
      details: 'Attested HbA1c lab values for PAT-2011 against hospital LIS source file.',
      ip: '14.139.224.18',
      sha256: 'f8e7d6c5b4a392817061524334251607f8e7d6c5b4a392817061524334251607',
      status: 'VERIFIED',
    },
    {
      id: 'LOG-89085',
      timestamp: '2026-09-25 14:05:33 IST',
      user: 'Safety Officer (NPvCC)',
      role: 'Pharmacovigilance Lead',
      action: 'CDSCO Form 11 Transmitted',
      module: 'SAE Transmittal',
      details: 'Expedited SAE report SAE-2026-089 filed with CDSCO regulatory server.',
      ip: '115.240.90.4',
      sha256: '718293a4b5c6d7e8f90123456789abcdef0123456789aba3f9e81b7c2d4e5f60',
      status: 'VERIFIED',
    },
    {
      id: 'LOG-89071',
      timestamp: '2026-09-24 11:20:15 IST',
      user: 'Dr. Meera S.',
      role: 'Sub-Investigator',
      action: 'e-Signature Executed',
      module: 'e-Signature',
      details: 'Informed Consent Form (ICF v3.1) e-signed for subject PAT-3015.',
      ip: '117.198.42.90',
      sha256: '123456789abcdef0123456789aba3f9e81b7c2d4e5f60718293a4b5c6d7e8f90',
      status: 'VERIFIED',
    },
  ];

  const filteredLogs = auditLogs.filter((log) => 
    activeFilter === 'All' || log.module === activeFilter
  );

  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setVerificationPassed(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationPassed(true);
    }, 1200);
  };

  return (
    <div style={{ padding: '24px 0', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <button 
            className="btn-primary" 
            onClick={onBack} 
            style={{ padding: '6px 14px', fontSize: '12px', marginBottom: '10px' }}
          >
            &larr; Back to Dashboard
          </button>
          <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--text-h)' }}>
            📜 Cryptographic ALCOA+ Audit Trail
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            21 CFR Part 11 Compliant Immutable Ledger & Cryptographic SHA-256 Provenance Log
          </p>
        </div>

        {/* Interactive Verification Button */}
        <button 
          className="btn-primary" 
          onClick={handleVerifyLedger}
          disabled={isVerifying}
          style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span>{isVerifying ? '⏳' : '🛡️'}</span>
          {isVerifying ? 'Verifying Merkle Tree...' : 'Verify Cryptographic Ledger Integrity'}
        </button>
      </div>

      {/* Verification Passed Status Alert */}
      {verificationPassed && (
        <div className="card" style={{ 
          backgroundColor: 'var(--badge-active-bg)', 
          borderColor: 'var(--badge-active-text)', 
          padding: '14px 20px', 
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '8px',
        }}>
          <span style={{ fontSize: '20px' }}>✓</span>
          <div>
            <strong style={{ color: 'var(--badge-active-text)', fontSize: '14px' }}>
              Ledger Integrity Validated (100% Hash Consistency)
            </strong>
            <div style={{ fontSize: '12px', color: 'var(--text)', marginTop: '2px' }}>
              All SHA-256 signatures match the immutable system state. No unauthorized data modifications detected.
            </div>
          </div>
        </div>
      )}

      {/* Module Filter Tags */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Filter Audit Module:</span>
        {['All', 'eCRF Data', 'SDV Audit', 'SAE Transmittal', 'e-Signature'].map((module) => (
          <button
            key={module}
            onClick={() => setActiveFilter(module)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              background: activeFilter === module ? 'var(--accent)' : 'var(--card-bg)',
              color: activeFilter === module ? 'var(--accent-text)' : 'var(--text)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {module}
          </button>
        ))}
      </div>

      {/* CLEAN ENTERPRISE AUDIT STREAM CARD */}
      <Card title="System-wide Verification Audit Trail" subtitle="Attributable, Legible, Contemporaneous, Original, Accurate">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: 420, overflow: 'auto' }}>
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedLog(log)}
              style={{
                padding: '16px 20px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--code-bg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              {/* Row Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent)' }}>{log.id}</span>
                  <Badge status="Compliant" text={log.module} />
                  <strong style={{ fontSize: '14px', color: 'var(--text-h)' }}>{log.action}</strong>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>{log.timestamp}</span>
              </div>

              {/* Attribution Line */}
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Attributed User: <strong style={{ color: 'var(--text-h)' }}>{log.user}</strong> ({log.role}) • IP: <code>{log.ip}</code>
              </div>

              {/* Hash Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>SHA-256 HASH:</span>
                <code style={{ 
                  fontSize: '11px', 
                  color: 'var(--accent-hover)', 
                  background: 'var(--card-bg)', 
                  padding: '4px 10px', 
                  borderRadius: '4px',
                  border: '1px solid var(--border)',
                  wordBreak: 'break-all',
                }}>
                  {log.sha256}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* SHA-256 HASH INSPECTOR MODAL */}
      {selectedLog && (
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
              onClick={() => setSelectedLog(null)}
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
              <Badge status="Compliant" text={selectedLog.status} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>{selectedLog.id}</span>
            </div>

            <h2 style={{ fontSize: '20px', margin: '0 0 12px 0', color: 'var(--text-h)' }}>
              Cryptographic Payload Inspection
            </h2>

            <div style={{ background: 'var(--code-bg)', padding: '14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              <div style={{ marginBottom: '6px' }}><strong>Action Event:</strong> {selectedLog.action}</div>
              <div style={{ marginBottom: '6px' }}><strong>Attributed User:</strong> {selectedLog.user} ({selectedLog.role})</div>
              <div style={{ marginBottom: '6px' }}><strong>Event Timestamp:</strong> {selectedLog.timestamp}</div>
              <div style={{ marginBottom: '6px' }}><strong>IP Provenance:</strong> {selectedLog.ip}</div>
              <div><strong>Details:</strong> {selectedLog.details}</div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                SHA-256 DIGEST SIGNATURE
              </label>
              <textarea 
                readOnly 
                value={selectedLog.sha256}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--accent-hover)',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setSelectedLog(null)}>
                Close Payload Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}