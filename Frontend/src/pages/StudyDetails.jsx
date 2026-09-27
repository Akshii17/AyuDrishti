import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Database,
  FileText,
  Flag,
  History,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';
import { enrollmentPct, getDeviationRows } from '../utils/piStudy';

/**
 * Which sections each role sees on the same StudyDetails page.
 * Adjust keys to match your route/auth role strings.
 */
const SECTION_VISIBILITY = {
  pi: {
    header: true,
    stepper: true,
    regulatory: true,
    enrolment: true,
    deviations: true,
    monitoring: true,
    dataQuality: true,
    safetySummary: true,
    safetyDetailLog: false,
    saeTimeline: true,
    dsmb: false,
    consent: true,
    dpdp: false,
    milestones: true,
    documents: true,
    auditTrail: false,
    exportPanel: false,
    signOffActions: true,
  },
  coordinator: {
    header: true,
    stepper: true,
    regulatory: false,
    enrolment: true,
    deviations: true,
    monitoring: true,
    dataQuality: true,
    safetySummary: true,
    safetyDetailLog: false,
    saeTimeline: false,
    dsmb: false,
    consent: true,
    dpdp: false,
    milestones: true,
    documents: true,
    auditTrail: false,
    exportPanel: false,
    signOffActions: false,
  },
  monitor: {
    header: true,
    stepper: true,
    regulatory: false,
    enrolment: true,
    deviations: true,
    monitoring: true,
    dataQuality: true,
    safetySummary: false,
    safetyDetailLog: false,
    saeTimeline: false,
    dsmb: false,
    consent: false,
    dpdp: false,
    milestones: false,
    documents: false,
    auditTrail: false,
    exportPanel: false,
    signOffActions: false,
  },
  ec: {
    header: true,
    stepper: true,
    regulatory: true,
    enrolment: false,
    deviations: true,
    monitoring: false,
    dataQuality: false,
    safetySummary: true,
    safetyDetailLog: false,
    saeTimeline: false,
    dsmb: false,
    consent: true,
    dpdp: false,
    milestones: false,
    documents: true,
    auditTrail: false,
    exportPanel: false,
    signOffActions: false,
  },
  pv: {
    header: true,
    stepper: false,
    regulatory: false,
    enrolment: false,
    deviations: false,
    monitoring: false,
    dataQuality: false,
    safetySummary: true,
    safetyDetailLog: true,
    saeTimeline: true,
    dsmb: true,
    consent: false,
    dpdp: false,
    milestones: false,
    documents: false,
    auditTrail: false,
    exportPanel: false,
    signOffActions: false,
  },
  admin: {
    header: true,
    stepper: true,
    regulatory: true,
    enrolment: true,
    deviations: true,
    monitoring: true,
    dataQuality: true,
    safetySummary: true,
    safetyDetailLog: false,
    saeTimeline: true,
    dsmb: false,
    consent: false,
    dpdp: true,
    milestones: true,
    documents: true,
    auditTrail: true,
    exportPanel: true,
    signOffActions: false,
  },
  regulator: {
    header: true,
    stepper: true,
    regulatory: true,
    enrolment: false,
    deviations: false,
    monitoring: false,
    dataQuality: false,
    safetySummary: true,
    safetyDetailLog: false,
    saeTimeline: true,
    dsmb: false,
    consent: false,
    dpdp: false,
    milestones: false,
    documents: false,
    auditTrail: true,
    exportPanel: false,
    signOffActions: false,
  },
};

const STAGES = [
  'Protocol / IEC',
  'CTRI Registration',
  'Site Activation',
  'Screening',
  'Enrolment / Randomization',
  'Data Collection',
  'Analysis',
  'Close-out',
];

function stageIndex(study) {
  const list = study.milestones || [];
  const inProgress = list.findIndex((m) => m.status === 'In Progress');
  if (inProgress !== -1) return inProgress;
  const pending = list.findIndex((m) => m.status === 'Pending' || m.status === 'Delayed');
  if (pending !== -1) return pending;
  return Math.max(list.length - 1, 0);
}

function Section({ icon: Icon, title, subtitle, children, className = '' }) {
  return (
    <section className={`rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)] ${className}`}>
      <h3 className="m-0 flex items-center gap-2 text-[15px] text-forest">
        {Icon ? <Icon size={16} className="text-sage-deep" /> : null}
        {title}
      </h3>
      {subtitle ? <p className="mb-3 mt-1 text-xs text-muted">{subtitle}</p> : <div className="mb-3" />}
      {children}
    </section>
  );
}

function KeyValueRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-ochre/30 py-2 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="font-semibold text-forest">{value ?? '—'}</span>
    </div>
  );
}

export default function StudyDetails({ study, role = 'pi', onBack }) {
  const [signedOff, setSignedOff] = useState({});
  const visible = SECTION_VISIBILITY[role] || SECTION_VISIBILITY.pi;

  const pct = enrollmentPct(study);
  const currentStage = useMemo(() => stageIndex(study), [study]);
  const deviationRows = useMemo(() => getDeviationRows(study), [study]);
  const openDeviations = deviationRows.filter((d) =>
    ['Open', 'Pending', 'Pending Review', 'Review Required'].includes(d.status)
  );
  const openQueries = (study.queriesList || []).filter((q) => q.status !== 'Resolved' && q.status !== 'Closed');

  if (!study) return null;

  return (
    <div className="w-full pt-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-ochre bg-cream px-3 py-1.5 text-xs font-semibold text-forest hover:bg-mint"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </button>
      )}

      {visible.header && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">{study.studyId}</span>
              <StatusPill status={study.status === 'Delayed' ? 'Delayed' : 'Active'} text={study.status} />
              {study.ethicsRegulatory?.ctriStatus && (
                <span className="text-[11px] text-muted">CTRI {study.ethicsRegulatory.ctriStatus}</span>
              )}
            </div>
            <h1 className="m-0 text-[24px] tracking-tight text-forest">{study.title || study.shortTitle}</h1>
            <p className="mt-1.5 text-[13px] text-muted">
              {study.studyType || 'Interventional'} · {study.phase} · PI: <strong className="text-forest">{study.principalInvestigator}</strong>
            </p>
          </div>
          <div className="min-w-[160px] rounded-xl border border-ochre bg-oat px-4 py-3 text-right shadow-[var(--shadow)]">
            <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-muted">Recruitment</p>
            <p className="m-0 text-[22px] font-extrabold text-forest">
              {study.participants?.enrolled ?? 0}/{study.participants?.target ?? 0}
            </p>
            <p className="m-0 text-xs text-muted">{pct}% of target</p>
          </div>
        </div>
      )}

      {visible.stepper && (
        <div className="mb-5 flex w-full overflow-hidden rounded-xl border border-ochre shadow-[var(--shadow)]">
          {STAGES.map((stage, i) => {
            const done = i < currentStage;
            const active = i === currentStage;
            return (
              <div
                key={stage}
                className={[
                  'flex-1 px-2 py-2.5 text-center text-[11px] font-semibold',
                  done ? 'bg-sage text-cream-ink' : active ? 'bg-clay text-cream-ink' : 'bg-linen text-muted',
                ].join(' ')}
              >
                {stage}
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visible.regulatory && (
          <Section icon={ShieldCheck} title="Regulatory & ethics status" subtitle="IEC approval and CTRI registration.">
            <KeyValueRow label="IEC approval no." value={study.ethicsRegulatory?.approvalNumber} />
            <KeyValueRow label="IEC status" value={study.ethicsRegulatory?.regulatoryStatus} />
            <KeyValueRow label="IEC valid until" value={study.ethicsRegulatory?.approvalExpiry} />
            <KeyValueRow label="CTRI number" value={study.ethicsRegulatory?.ctriNumber} />
          </Section>
        )}

        {visible.enrolment && (
          <Section icon={Users} title="Enrolment funnel" subtitle="Screened → eligible → enrolled → randomized, vs. target.">
            <KeyValueRow label="Screened" value={study.participants?.screened} />
            <KeyValueRow label="Eligible" value={study.participants?.eligible} />
            <KeyValueRow label="Enrolled" value={study.participants?.enrolled} />
            <KeyValueRow label="Randomized" value={study.participants?.randomized} />
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-linen">
              <div className="h-full bg-sage" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
          </Section>
        )}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visible.deviations && (
          <Section
            icon={Flag}
            title="Protocol deviations"
            subtitle={visible.signOffActions ? 'Review and sign off open deviations.' : 'Open and resolved deviations.'}
          >
            {openDeviations.length === 0 && <p className="m-0 text-sm text-muted">No open deviations.</p>}
            <div className="flex max-h-56 flex-col gap-2 overflow-auto">
              {openDeviations.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2 text-sm">
                  <div>
                    <p className="m-0 font-semibold text-forest">{d.detail}</p>
                    <p className="m-0 text-[11px] text-muted">{d.type} · {d.reason}</p>
                  </div>
                  {visible.signOffActions ? (
                    signedOff[d.id] ? (
                      <StatusPill status="Compliant" text="Signed off" />
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-lg bg-sage px-2.5 py-1 text-xs font-semibold text-cream-ink hover:bg-sage-deep"
                        onClick={() => setSignedOff((m) => ({ ...m, [d.id]: true }))}
                      >
                        <CheckCircle2 size={12} /> Approve
                      </button>
                    )
                  ) : (
                    <StatusPill status="Pending" text={d.status} />
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {visible.monitoring && (
          <Section icon={Calendar} title="Monitoring visits" subtitle="Site visit schedule and source data verification.">
            <KeyValueRow label="Planned visits" value={study.monitoring?.plannedVisits} />
            <KeyValueRow label="Completed" value={study.monitoring?.completedVisits} />
            <KeyValueRow label="Overdue" value={study.monitoring?.overdueVisits} />
            <KeyValueRow label="SDV status" value={study.monitoring?.sdvStatus} />
          </Section>
        )}
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visible.dataQuality && (
          <Section icon={Database} title="Data quality" subtitle="Query status, not subject-level values.">
            <KeyValueRow label="Open queries" value={openQueries.length} />
            <KeyValueRow label="Resolved queries" value={(study.queriesList || []).length - openQueries.length} />
            <KeyValueRow label="Flagged / out-of-range entries" value={study.dataQuality?.flaggedEntries} />
          </Section>
        )}

        {visible.safetySummary && (
          <Section icon={ShieldAlert} title="Safety summary" subtitle="Aggregate AE / SAE / ADR counts.">
            <KeyValueRow label="Adverse events (AE)" value={study.safety?.adverseEvents} />
            <KeyValueRow label="Serious adverse events (SAE)" value={study.safety?.seriousAdverseEvents} />
            <KeyValueRow label="ADRs" value={study.safety?.adverseDrugReactions} />
            {visible.saeTimeline && (
              <KeyValueRow
                label="Expedited reporting deadlines"
                value={study.safety?.reportingDeadlines}
              />
            )}
          </Section>
        )}
      </div>

      {visible.safetyDetailLog && (
        <Section
          icon={ShieldAlert}
          title="Coded safety log"
          subtitle="MedDRA / WHODrug coded AE / SAE listing (PV workspace)."
          className="mb-5"
        >
          <div className="max-h-72 overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-ochre bg-linen">
                  {['AE ID', 'Term', 'Serious', 'Coded term', 'Deadline'].map((h) => (
                    <th key={h} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(study.adverseEventsList || []).map((ae) => (
                  <tr key={ae.aeId} className="border-b border-ochre/30 last:border-0">
                    <td className="px-3 py-2 font-semibold text-forest">{ae.aeId}</td>
                    <td className="px-3 py-2">{ae.term}</td>
                    <td className="px-3 py-2">{ae.isSerious ? 'Yes' : 'No'}</td>
                    <td className="px-3 py-2 text-muted">{ae.meddraTerm || '—'}</td>
                    <td className="px-3 py-2 text-muted">{(ae.expeditedReportingDeadline || '').slice(0, 10) || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {visible.dsmb && (
        <Section icon={ShieldCheck} title="DSMB review" subtitle="Data Safety Monitoring Board schedule and outcome." className="mb-5">
          <KeyValueRow label="Next review" value={study.dsmb?.nextReviewDate} />
          <KeyValueRow label="Last outcome" value={study.dsmb?.lastOutcome} />
        </Section>
      )}

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {visible.consent && (
          <Section icon={BadgeCheck} title="Consent status" subtitle="Aggregate participant consent.">
            <KeyValueRow label="Consented" value={study.consent?.consented} />
            <KeyValueRow label="Withdrawn" value={study.consent?.withdrawn} />
            <KeyValueRow label="Re-consent pending" value={study.consent?.reconsentPending} />
          </Section>
        )}

        {visible.dpdp && (
          <Section icon={ShieldCheck} title="DPDP / privacy controls" subtitle="Data minimisation, encryption, hosting.">
            <KeyValueRow label="Data minimisation review" value={study.dpdp?.minimisationStatus} />
            <KeyValueRow label="Encryption" value={study.dpdp?.encryption} />
            <KeyValueRow label="Data-resident hosting" value={study.dpdp?.hosting} />
            <KeyValueRow label="Consent Manager linkage" value={study.dpdp?.consentManager} />
          </Section>
        )}
      </div>

      {visible.milestones && (
        <Section icon={ClipboardList} title="Milestones" subtitle="Planned vs. actual dates across the lifecycle." className="mb-5">
          <div className="flex flex-col gap-2">
            {(study.milestones || []).map((m) => (
              <div key={m.stage} className="flex items-center justify-between border-b border-ochre/30 py-2 text-sm last:border-0">
                <span className="text-forest">{m.stage}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">{m.date || 'TBD'}</span>
                  <StatusPill status={m.status === 'Completed' ? 'Compliant' : m.status === 'Delayed' ? 'Urgent' : 'Pending'} text={m.status} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {visible.documents && (
        <Section icon={FileText} title="Documents" subtitle="Protocol, IEC letter, CTRI certificate, amendments." className="mb-5">
          <div className="flex flex-col gap-2">
            {(study.documents || []).map((doc) => (
              <div key={doc.name} className="flex items-center justify-between rounded-lg border border-ochre/40 bg-sand px-3 py-2 text-sm">
                <span className="text-forest">{doc.name}</span>
                <span className="text-xs text-muted">{doc.date}</span>
              </div>
            ))}
            {(!study.documents || study.documents.length === 0) && (
              <p className="m-0 text-sm text-muted">No documents on file.</p>
            )}
          </div>
        </Section>
      )}

      {visible.auditTrail && (
        <Section icon={History} title="Audit trail" subtitle="Immutable, time-stamped change log (ALCOA+)." className="mb-5">
          <div className="flex flex-col gap-2">
            {(study.auditTrail || []).map((entry, i) => (
              <div key={i} className="flex items-center justify-between border-b border-ochre/30 py-2 text-xs last:border-0">
                <span className="text-forest">{entry.action}</span>
                <span className="text-muted">{entry.user} · {entry.timestamp}</span>
              </div>
            ))}
            {(!study.auditTrail || study.auditTrail.length === 0) && (
              <p className="m-0 text-sm text-muted">No changes logged yet.</p>
            )}
          </div>
        </Section>
      )}

      {visible.exportPanel && (
        <Section icon={Database} title="Export" subtitle="Submission-ready datasets." className="mb-5">
          <div className="flex flex-wrap gap-2">
            {['SDTM', 'ADaM', 'Define-XML'].map((f) => (
              <button
                key={f}
                type="button"
                className="rounded-lg border border-ochre bg-oat px-3 py-1.5 text-xs font-semibold text-forest hover:bg-mint"
              >
                Export {f}
              </button>
            ))}
          </div>
        </Section>
      )}

      {visible.deviations && openQueries.length > 0 && visible.dataQuality && (
        <Section icon={MessageSquareWarning} title="Open data queries" subtitle="Awaiting site response.">
          <div className="flex max-h-56 flex-col gap-2 overflow-auto">
            {openQueries.map((q) => (
              <div key={q.queryId} className="flex items-center justify-between gap-3 rounded-lg border border-ochre/40 bg-sand px-3 py-2 text-sm">
                <div>
                  <p className="m-0 font-semibold text-forest">{q.queryId}: {q.issue}</p>
                  <p className="m-0 text-[11px] text-muted">{q.formName} / {q.fieldName} · {q.assignedTo}</p>
                </div>
                <StatusPill status="Pending" text={q.status} />
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}