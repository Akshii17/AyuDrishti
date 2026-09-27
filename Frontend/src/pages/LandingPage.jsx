import React from 'react';
import {
  Leaf,
  ShieldCheck,
  ClipboardList,
  Activity,
  ScrollText,
  Flower2,
} from 'lucide-react';
import './LandingPage.css';

const features = [
  {
    icon: ClipboardList,
    title: 'Protocol registry',
    text: 'Register Ayush-GCP protocols and track IEC review in one dossier view.',
  },
  {
    icon: ShieldCheck,
    title: 'Ethics oversight',
    text: 'Committee workflows, renewals, and clearance status stay visible to every role.',
  },
  {
    icon: Activity,
    title: 'Pharmacovigilance',
    text: 'Surface SAE signals and pending safety reviews across the trial portfolio.',
  },
  {
    icon: ScrollText,
    title: 'ALCOA+ audit trail',
    text: 'Immutable logs preserve attribution, contemporaneity, and regulatory readiness.',
  },
];

export default function LandingPage({ onOpenAuth }) {
  return (
    <div className="landing">
      <div className="landing-bg" aria-hidden="true">
        <div className="landing-mandala landing-mandala--lg" />
        <div className="landing-mandala landing-mandala--sm" />
      </div>

      <header className="landing-header">
        <button type="button" className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="landing-logo">
            <Leaf size={22} />
          </span>
          <span>
            <div className="landing-brand-name">AyuDrishti</div>
            <div className="landing-brand-sub">All India Institute of Ayurveda</div>
          </span>
        </button>

        <div className="landing-header-actions">
          <button type="button" className="landing-btn landing-btn--ghost" onClick={() => onOpenAuth('login')}>
            Login
          </button>
          <button type="button" className="landing-btn landing-btn--primary" onClick={() => onOpenAuth('register')}>
            Register
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div>
            <div className="landing-kicker">
              <Flower2 size={14} />
              Clinical research platform
            </div>
            <h1 className="landing-title">AyuDrishti</h1>
            <p className="landing-tagline">A unified view of Ayurveda clinical research.</p>
            <p className="landing-lead">
              Coordinate protocols, ethics review, pharmacovigilance, and audit-ready records
              across investigators, monitors, and regulators — in a single institutional workspace.
            </p>
            <div className="landing-cta-row">
              <button type="button" className="landing-btn landing-btn--primary landing-btn--lg" onClick={() => onOpenAuth('login')}>
                Login
              </button>
              <button type="button" className="landing-btn landing-btn--ghost landing-btn--lg" onClick={() => onOpenAuth('register')}>
                Register
              </button>
            </div>
          </div>

          <aside className="landing-hero-panel">
            <div className="landing-panel-label">Portfolio snapshot</div>
            <div className="landing-stat-grid">
              <div className="landing-stat">
                <div className="landing-stat-value">GCP</div>
                <div className="landing-stat-label">Ayush-compliant trials</div>
              </div>
              <div className="landing-stat">
                <div className="landing-stat-value">IEC</div>
                <div className="landing-stat-label">Ethics pipeline</div>
              </div>
              <div className="landing-stat">
                <div className="landing-stat-value">PV</div>
                <div className="landing-stat-label">Safety surveillance</div>
              </div>
              <div className="landing-stat">
                <div className="landing-stat-value">7</div>
                <div className="landing-stat-label">Role-based access</div>
              </div>
            </div>
            <div className="landing-panel-note">
              <Leaf size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              Built for AIIA investigators, coordinators, monitors, ethics committees, and regulators.
            </div>
          </aside>
        </section>

        <section className="landing-features">
          <h2 className="landing-section-title">What you can see in one place</h2>
          <p className="landing-section-sub">
            A concise operating picture for Ayurveda trials — from protocol to pharmacovigilance.
          </p>
          <div className="landing-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="landing-feature">
                  <div className="landing-feature-icon">
                    <Icon size={20} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        All India Institute of Ayurveda (AIIA) | Ministry of Ayush, Govt. of India | GCP Compliant CTMS
      </footer>
    </div>
  );
}
