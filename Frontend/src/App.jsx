import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import PVDashboard from './pages/PVDashboard';
import StudyDetails from './pages/StudyDetails';
import IecApprovals from './pages/IecApprovals';
import AuditLogs from './pages/AuditLogs';
import mockData from './data/mockStudies.json';
import RegisterProtocol from './pages/RegisterProtocol';
import ConsentManagementPage from './pages/ConsentManagementPage';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/auth/AuthModal';
import PIDashboard from './pages/PIDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import MonitorDashboard from './pages/MonitorDashboard';
import EthicsDashboard from './pages/EthicsDashboard';
import RegulatorDashboard from './pages/RegulatorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// --- Dedicated Secondary Page Views ---

// 1. Protocol Registration Form
function RegisterProtocolPage({ onBack }) {
  const [title, setTitle] = useState('');
  const [pi, setPi] = useState('');
  const [phase, setPhase] = useState('Phase II');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Protocol "${title}" registered successfully! Submitted to Institutional Ethics Committee (IEC).`);
    onBack();
  };

  return (
    <div style={{ padding: '24px 0', width: '100%' }}>
      <button className="btn-primary" onClick={onBack} style={{ marginBottom: '16px', fontSize: '12px' }}>
        &larr; Back to Dashboard
      </button>
      
      <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '4px' }}>+ Register New Clinical Protocol</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
          Initiate new Ayush-GCP compliant trial submission for IEC review
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Full Protocol Title</label>
            <input 
              type="text" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Clinical Evaluation of Samshamani Vati in Viral Fever Recovery"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Principal Investigator (PI)</label>
            <input 
              type="text" 
              required 
              value={pi} 
              onChange={(e) => setPi(e.target.value)}
              placeholder="e.g., Prof. Dr. Anand Kumar"
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Trial Phase</label>
            <select 
              value={phase} 
              onChange={(e) => setPhase(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}
            >
              <option value="Phase I">Phase I (Safety & Tolerability)</option>
              <option value="Phase II">Phase II (Therapeutic Exploratory)</option>
              <option value="Phase III">Phase III (Therapeutic Confirmatory)</option>
              <option value="Observational">Observational / Epidemiological</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '12px', padding: '12px' }}>
            Submit Protocol to IEC Review Queue
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Main Router Engine ---

export default function App() {
  const getPageFromPath = () => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('pvdashboard')) {
      return 'PvDashboard';
    }
    if (path.includes('/study/') || path.includes('studydetails')) {
      return 'StudyDetails';
    }
    if (path.includes('registerprotocol')) {
      return 'RegisterProtocol';
    }
    if (path.includes('consentmanagement')) {
      return 'ConsentManagement';
    }
    if (path.includes('iecapprovals')) {
      return 'IecApprovals';
    }
    if (path.includes('auditlogs')) {
      return 'AuditLogs';
    }
    if (path.includes('admindashboard') || path.includes('/admin') || path === '/admin') {
      return 'AdminDashboard';
    }
    if (path.includes('executivedashboard')) {
      return 'ExecutiveDashboard';
    }
    if (path.includes('pidashboard')) {
      return 'PIDashboard';
    }
    if (path.includes('coordinatordashboard')) {
      return 'CoordinatorDashboard';
    }
    if (path.includes('monitordashboard') || path.endsWith('/monitor') || path === '/monitor') {
      return 'MonitorDashboard';
    }
    if (path.includes('ethicsdashboard') || path.includes('/ethics') || path === '/iec') {
      return 'EthicsDashboard';
    }
    if (path.includes('regulatordashboard') || path.includes('/regulator') || path === '/regulator') {
      return 'RegulatorDashboard';
    }
    return 'Landing';
  };

  const getAuthModeFromPath = () => {
    const path = window.location.pathname.replace(/\/$/, '').toLowerCase();
    if (path.endsWith('/register') || path === '/register') return 'register';
    if (path.endsWith('/login') || path === '/login') return 'login';
    return null;
  };

  const readSessionUser = () => {
    try {
      return JSON.parse(sessionStorage.getItem('ayudrishti_user') || 'null');
    } catch {
      return null;
    }
  };

  const homePageForRole = (role) => {
    const key = (role || '').trim();
    if (key === 'Principal Investigator') return 'PIDashboard';
    if (key === 'Study Coordinator') return 'CoordinatorDashboard';
    if (key === 'Monitor') return 'MonitorDashboard';
    if (key === 'Ethics Committee') return 'EthicsDashboard';
    if (key === 'Regulator' || key === 'Read-only Regulator') return 'RegulatorDashboard';
    if (key === 'Admin' || key === 'Administration' || key === 'Administrator') return 'AdminDashboard';
    return 'ExecutiveDashboard';
  };

  const studyIdFromPath = () => {
    const match = window.location.pathname.match(/\/study\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]) : null;
  };

  const studyFromPath = () => {
    const id = studyIdFromPath();
    if (!id) return mockData[0];
    return mockData.find((s) => s.studyId.toLowerCase() === id.toLowerCase()) || mockData[0];
  };

  const [currentPage, setCurrentPage] = useState(getPageFromPath);
  const [selectedStudy, setSelectedStudy] = useState(studyFromPath);
  const [authMode, setAuthMode] = useState(getAuthModeFromPath);
  const [sessionUser, setSessionUser] = useState(readSessionUser);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath());
      setAuthMode(getAuthModeFromPath());
      setSelectedStudy(studyFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectStudy = (study) => {
    setSelectedStudy(study);
    setCurrentPage('StudyDetails');
    window.history.pushState({}, '', `/study/${study.studyId}`);
  };

  const handleHeaderNavigate = (pageKey) => {
    setCurrentPage(pageKey);
    const path = pageKey === 'Landing' ? '/' : `/${pageKey}`;
    window.history.pushState({}, '', path);
  };

  const navigateToHome = () => {
    const page = homePageForRole(sessionUser?.role);
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    window.history.pushState({}, '', mode === 'register' ? '/register' : '/login');
  };

  const closeAuth = () => {
    setAuthMode(null);
    if (currentPage === 'Landing') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ayudrishti_user');
    setSessionUser(null);
    setAuthMode(null);
    setCurrentPage('Landing');
    window.history.pushState({}, '', '/');
  };

  const handleAuthSuccess = (user) => {
    sessionStorage.setItem('ayudrishti_user', JSON.stringify(user));
    setSessionUser(user);
    setAuthMode(null);
    const page = homePageForRole(user.role);
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'Landing':
        return <LandingPage onOpenAuth={openAuth} />;
      case 'PIDashboard':
        return (
          <PIDashboard
            studies={mockData}
            sessionUser={sessionUser}
            onOpenStudy={handleSelectStudy}
          />
        );
      case 'CoordinatorDashboard':
        return (
          <CoordinatorDashboard
            studies={mockData}
            sessionUser={sessionUser}
            onOpenStudy={handleSelectStudy}
          />
        );
      case 'MonitorDashboard':
        return (
          <MonitorDashboard
            studies={mockData}
            sessionUser={sessionUser}
            onOpenStudy={handleSelectStudy}
          />
        );
      case 'EthicsDashboard':
        return (
          <EthicsDashboard
            studies={mockData}
            onOpenIec={() => {
              setCurrentPage('IecApprovals');
              window.history.pushState({}, '', '/IecApprovals');
            }}
          />
        );
      case 'RegulatorDashboard':
        return (
          <RegulatorDashboard
            studies={mockData}
            onOpenStudy={handleSelectStudy}
          />
        );
      case 'AdminDashboard':
        return (
          <AdminDashboard
            studies={mockData}
            onOpenStudy={handleSelectStudy}
            onAddProtocol={() => {
              setCurrentPage('RegisterProtocol');
              window.history.pushState({}, '', '/RegisterProtocol');
            }}
          />
        );
      case 'ExecutiveDashboard':
        return (
          <ExecutiveDashboard 
            studies={mockData}
            onSelectStudy={handleSelectStudy}
            onAddProtocol={() => {
              setCurrentPage('RegisterProtocol');
              window.history.pushState({}, '', '/RegisterProtocol');
            }}
            onReviewQueue={() => {
              setCurrentPage('PvDashboard');
              window.history.pushState({}, '', '/PvDashboard');
            }}
          />
        );
      case 'PvDashboard':
        return (
          <PVDashboard 
            studies={mockData}
            onSelectStudy={handleSelectStudy}
            onBack={navigateToHome}
          />
        );
      case 'StudyDetails':
        return (
          <StudyDetails 
            study={selectedStudy} 
            role={
              sessionUser?.role === 'Regulator' || sessionUser?.role === 'Read-only Regulator' 
                ? 'regulator' 
                : sessionUser?.role === 'Admin' || sessionUser?.role === 'Administration'
                ? 'admin'
                : 'pi'
            }
            onBack={navigateToHome} 
          />
        );
      case 'RegisterProtocol':
        return <RegisterProtocolPage onBack={navigateToHome} />;
      case 'ConsentManagement':
        return <ConsentManagementPage onBack={navigateToHome} />;
      case 'IecApprovals':
        return <IecApprovals onBack={navigateToHome} />;
      case 'AuditLogs':
        return <AuditLogs onBack={navigateToHome} />;
      default:
        return (
          <ExecutiveDashboard 
            studies={mockData} 
            onSelectStudy={handleSelectStudy}
            onAddProtocol={() => {
              setCurrentPage('RegisterProtocol');
              window.history.pushState({}, '', '/RegisterProtocol');
            }}
            onReviewQueue={() => {
              setCurrentPage('PvDashboard');
              window.history.pushState({}, '', '/PvDashboard');
            }}
          />
        );
    }
  };

  const isLanding = currentPage === 'Landing';

  return (
    <div id="root">
      {!isLanding && (
        <Header
          onNavigate={handleHeaderNavigate}
          currentPage={currentPage}
          sessionUser={sessionUser}
          onLogout={handleLogout}
        />
      )}

      {isLanding ? (
        renderContent()
      ) : (
        <main style={{ flex: 1, width: '100%', maxWidth: '1440px', margin: '0 auto', boxSizing: 'border-box', padding: '0 24px 32px' }}>
          {renderContent()}
        </main>
      )}

      {!isLanding && (
        <footer style={{
          backgroundColor: 'var(--code-bg)',
          borderTop: '1px solid var(--border)',
          padding: '16px 24px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          All India Institute of Ayurveda (AIIA) | Ministry of Ayush, Govt. of India | GCP Compliant CTMS
        </footer>
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={closeAuth}
          onSwitchMode={openAuth}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}