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
    if (path.includes('studydetails')) {
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
    return 'ExecutiveDashboard';
  };

  const [currentPage, setCurrentPage] = useState(getPageFromPath);
  const [selectedStudy, setSelectedStudy] = useState(mockData[0]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getPageFromPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectStudy = (study) => {
    setSelectedStudy(study);
    setCurrentPage('StudyDetails');
    window.history.pushState({}, '', '/StudyDetails');
  };

  const handleHeaderNavigate = (pageKey) => {
    setCurrentPage(pageKey);
    window.history.pushState({}, '', `/${pageKey}`);
  };

  const navigateToHome = () => {
    setCurrentPage('ExecutiveDashboard');
    window.history.pushState({}, '', '/');
  };

  const renderContent = () => {
    switch (currentPage) {
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

  return (
    <div id="root">
      <Header onNavigate={handleHeaderNavigate} currentPage={currentPage} />

      <main style={{ flex: 1, width: '100%', maxWidth: '1440px', margin: '0 auto', boxSizing: 'border-box' }}>
        {renderContent()}
      </main>

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
    </div>
  );
}