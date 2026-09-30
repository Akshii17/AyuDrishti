import React from 'react';
import {
  Leaf,
  ShieldCheck,
  ClipboardList,
  Activity,
  ScrollText,
  Flower2,
  LayoutGrid,
  FileStack,
  CheckCircle2,
  BrainCircuit,
  TrendingUp,
  Clock3,
  MapPin,
  AlertTriangle,
  FileSearch,
  Siren,
  ShieldAlert,
  Database,
  BarChart3,
  Bell,
  ListChecks,
  BadgeCheck,
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
  {
    icon: LayoutGrid,
    title: 'Role-based dashboards',
    text: 'Seven tailored workspaces — investigators to regulators — each scoped to what they need.',
  },
  {
    icon: FileStack,
    title: 'CDISC & FHIR export',
    text: 'Submission-ready SDTM/ADaM datasets and HL7 FHIR R4 interoperability with EDC and ABDM.',
  },
];

const lifecycleStages = [
  { label: 'Protocol / IEC', text: 'Protocol drafted and ethics-reviewed' },
  { label: 'CTRI Registration', text: 'Prospective registry entry' },
  { label: 'Site Activation', text: 'Centres cleared to begin' },
  { label: 'Screening', text: 'Candidates checked against criteria' },
  { label: 'Enrolment / Randomization', text: 'Consented and assigned to arms' },
  { label: 'Data Collection', text: 'Visits, vitals, and outcomes logged' },
  { label: 'Analysis', text: 'Findings evaluated against hypothesis' },
  { label: 'Close-out', text: 'Data locked, archived, reported' },
];

const aiCapabilities = [
  {
    icon: TrendingUp,
    title: 'Recruitment Prediction',
    text: 'Predict enrolment velocity and identify studies at risk of missing recruitment targets.',
  },
  {
    icon: Clock3,
    title: 'Delay Prediction',
    text: 'Forecast milestone delays before they impact the overall trial timeline.',
  },
  {
    icon: MapPin,
    title: 'Site-Risk Prediction',
    text: 'Identify sites showing operational patterns that may require intervention.',
  },
  {
    icon: AlertTriangle,
    title: 'Anomaly & Data-Quality Intelligence',
    text: 'Surface unusual patterns, missing data, inconsistencies, and quality concerns.',
  },
  {
    icon: FileSearch,
    title: 'Document Intelligence',
    text: 'Extract, classify, and interpret information across clinical research documents.',
  },
  {
    icon: Siren,
    title: 'Safety-Signal Detection',
    text: 'Detect emerging safety patterns and surface signals for pharmacovigilance review.',
  },
  {
    icon: ShieldAlert,
    title: 'Compliance Intelligence',
    text: 'Identify compliance risks and help teams act before issues become critical.',
  },
];

const complianceBadges = [
  'CTRI',
  'GCP-ASU',
  'ICMR Guidelines',
  'NDCT Rules 2019',
  'DPDP Act 2023',
  'ISO/IEC 27001',
  'CERT-In',
  'HL7 FHIR R4',
  'ABDM',
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
              Real-time, role-based, and built to replace the spreadsheet.
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

        <section className="landing-lifecycle">
          <h2 className="landing-section-title">
            How a trial moves through AyuDrishti
          </h2>

          <p className="landing-section-sub">
            Every study is tracked across the same lifecycle, from protocol to close-out.
          </p>

          <div
            className="relative mx-auto mt-10 aspect-square w-full max-w-[620px]"
            style={{ minHeight: '420px' }}
          >
            {/* Circular lifecycle track */}
            <div
              className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed"
              style={{ borderColor: '#D4A373' }}
            />

            {/* Inner decorative ring */}
            <div
              className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor: 'rgba(132, 169, 140, 0.35)',
              }}
            />

            {/* Center */}
            <div
              className="absolute left-1/2 top-1/2 flex h-[130px] w-[130px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #244332 0%, #355B43 100%)',
                border: '4px solid #EAE7DC',
              }}
            >
              <div
                className="text-[11px] font-extrabold uppercase tracking-[0.12em]"
                style={{ color: '#D4A373' }}
              >
                AyuDrishti
              </div>

              <div
                className="mt-1 text-sm font-bold"
                style={{ color: '#FAF8F5' }}
              >
                Trial Lifecycle
              </div>

              <div
                className="mt-1 text-[10px]"
                style={{ color: 'rgba(250, 248, 245, 0.7)' }}
              >
                Protocol → Close-out
              </div>
            </div>

            {/* Lifecycle stages */}
            {lifecycleStages.map((stage, i) => {
              const angle = (360 / lifecycleStages.length) * i - 90;

              return (
                <div
                  key={stage.label}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `
              translate(-50%, -50%)
              rotate(${angle}deg)
              translateY(clamp(-260px, -20vw, -185px))
              rotate(${-angle}deg)
            `,
                  }}
                >
                  <div
                    className="w-[120px] rounded-xl bg-white p-3 text-center shadow-md transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: '1px solid #D4A373',
                      boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                    }}
                  >
                    {/* Number */}
                    <div
                      className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold"
                      style={{
                        background: '#EAF0EB',
                        color: '#355B43',
                      }}
                    >
                      {i + 1}
                    </div>

                    {/* Stage title */}
                    <div
                      className="text-[11px] font-bold leading-tight"
                      style={{ color: '#24332A' }}
                    >
                      {stage.label}
                    </div>

                    {/* Description */}
                    <div
                      className="mt-1 text-[9px] leading-tight"
                      style={{ color: '#6B756F' }}
                    >
                      {stage.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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

        <section className="landing-ai">
          <div className="landing-ai-header">
            <div className="landing-ai-badge">
              <BrainCircuit size={15} />
              AI Intelligence Layer
            </div>

            <h2 className="landing-section-title">
              Intelligence that turns trial data into action
            </h2>

            <p className="landing-section-sub">
              AI capabilities continuously analyse clinical research data to surface
              predictions, risks, anomalies, safety signals, and compliance insights.
            </p>
          </div>

          <div className="landing-ai-grid">
            {aiCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <article key={capability.title} className="landing-ai-card">
                  <div className="landing-ai-card-icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3>{capability.title}</h3>
                    <p>{capability.text}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* AI Intelligence Pipeline */}
          <div className="landing-ai-pipeline">
            <div className="landing-ai-pipeline-title">
              <span>From data to verified action</span>
            </div>

            <div className="landing-ai-flow">
              {[
                { icon: Database, label: 'Data' },
                { icon: BarChart3, label: 'KPI' },
                { icon: BrainCircuit, label: 'AI' },
                { icon: Bell, label: 'Alert' },
                { icon: ListChecks, label: 'Task' },
                { icon: BadgeCheck, label: 'Verified' },
              ].map((step, index, arr) => {
                const Icon = step.icon;

                return (
                  <React.Fragment key={step.label}>
                    <div className="landing-ai-flow-step">
                      <div className="landing-ai-flow-icon">
                        <Icon size={18} />
                      </div>

                      <span>{step.label}</span>
                    </div>

                    {index < arr.length - 1 && (
                      <div
                        className="landing-ai-flow-arrow"
                        aria-hidden="true"
                      >
                        →
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-compliance">
          <h2 className="landing-section-title">Built to the standards AIIA is held to</h2>
          <p className="landing-section-sub">
            Compliance and interoperability aren't an afterthought — they're built into the platform.
          </p>
          <div className="landing-compliance-grid">
            {complianceBadges.map((badge) => (
              <div key={badge} className="landing-compliance-badge">
                <CheckCircle2 size={14} />
                {badge}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        All India Institute of Ayurveda (AIIA) | Ministry of Ayush, Govt. of India | GCP Compliant CTMS
      </footer>
    </div>
  );
}