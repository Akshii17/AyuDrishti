import React from 'react';
import Badge from './Badge';

export default function Header({ onNavigate, currentPage }) {
  const navItems = [
    { label: '📊 Portfolio Overview', page: 'ExecutiveDashboard' },
    { label: '📁 Clinical Studies', page: 'StudyDetails' },
    { label: '🛡️ Pharmacovigilance', page: 'PvDashboard' },
    { label: '📋 IEC Approvals', page: 'IecApprovals' },
    { label: '📜 ALCOA+ Logs', page: 'AuditLogs' },
  ];

  return (
    <header style={{
      backgroundColor: 'var(--header-bg)',
      borderBottom: '1px solid var(--border)',
      padding: '12px 24px',
      width: '100%',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1440px',
        margin: '0 auto',
      }}>
        {/* Left: Branding */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => onNavigate('ExecutiveDashboard')}
        >
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.5px' }}>
            AIIA CTMS
          </div>
          <Badge status="Compliant" text="AIIA Institutional" />
        </div>

        {/* Center: Global Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                style={{
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? 'var(--accent-text)' : 'var(--text)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.target.style.background = 'var(--code-bg)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.target.style.background = 'transparent';
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: 'var(--accent-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px',
          }}>
            AS
          </div>
          <div style={{ fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>Dr. Ananya Sharma</div>
            <div style={{ color: 'var(--text-muted)' }}>Investigator</div>
          </div>
        </div>
      </div>
    </header>
  );
}