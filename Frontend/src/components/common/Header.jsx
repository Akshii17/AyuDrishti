import React from 'react';
import { LogOut } from 'lucide-react';
import Badge from './Badge';

export default function Header({ onNavigate, currentPage, sessionUser: sessionUserProp, onLogout }) {
  let sessionUser = sessionUserProp;
  if (sessionUser === undefined) {
    try {
      sessionUser = JSON.parse(sessionStorage.getItem('ayudrishti_user') || 'null');
    } catch {
      sessionUser = null;
    }
  }

  const isPi = (sessionUser?.role || '').trim() === 'Principal Investigator';
  const isCoordinator = (sessionUser?.role || '').trim() === 'Study Coordinator';
  const isMonitor = (sessionUser?.role || '').trim() === 'Monitor';
  const isEthics = (sessionUser?.role || '').trim() === 'Ethics Committee';
  const homePage = isPi
    ? 'PIDashboard'
    : isCoordinator
      ? 'CoordinatorDashboard'
      : isMonitor
        ? 'MonitorDashboard'
        : isEthics
          ? 'EthicsDashboard'
          : 'ExecutiveDashboard';

  const navItems = isPi
    ? [

    ]
    : isCoordinator
      ? [

      ]
      : isMonitor
        ? [

        ]
        : isEthics
          ? [

          ]
          : [

          ];

  const displayName = sessionUser?.name || 'Dr. Ananya Sharma';
  const displayRole = sessionUser?.role || 'Investigator';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AD';

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
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => onNavigate(homePage)}
        >
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '0.5px' }}>
            AyuDrishti
          </div>
          <Badge status="Compliant" text={isPi ? 'PI Workspace' : isCoordinator ? 'Coordinator Desk' : isMonitor ? 'Monitor Desk' : isEthics ? 'IEC Chamber' : 'AIIA Institutional'} />
        </div>

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
                  if (!isActive) e.currentTarget.style.background = 'var(--code-bg)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

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
            {initials}
          </div>
          <div style={{ fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-h)' }}>{displayName}</div>
            <div style={{ color: 'var(--text-muted)' }}>{displayRole}</div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Log out"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginLeft: 6,
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-h)',
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
