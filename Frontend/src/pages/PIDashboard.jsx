import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Flag,
  FlaskConical,
  MessageSquareWarning,
  ShieldAlert,
  Users,
  BrainCircuit,
  Sparkles,
  PlusCircle,
  ChevronRight,
  Clock,
  FileCheck2,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';
import { TODAY, enrollmentPct, getDeviationRows } from '../utils/piStudy';

function normalizePerson(value) {
  return (value || '')
    .toLowerCase()
    .replace(/\b(dr|prof|professor|ms|mr|mrs)\.?\b/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function studiesForLoggedInPi(studies, user) {
  const name = normalizePerson(user?.name);
  const emailLocal = normalizePerson((user?.email || '').split('@')[0]);
  const tokens = new Set(
    [name, emailLocal]
      .join(' ')
      .split(' ')
      .filter((t) => t.length > 2)
  );

  return studies.filter((s) => {
    const pi = normalizePerson(s.principalInvestigator);
    if (!pi) return false;
    if (name && (pi === name || pi.includes(name) || name.includes(pi))) return true;
    if (emailLocal && (pi === emailLocal || pi.includes(emailLocal) || emailLocal.includes(pi))) return true;
    const piTokens = pi.split(' ');
    return piTokens.some((t) => t.length > 2 && tokens.has(t));
  });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const t = new Date(`${dateStr}T00:00:00`);
  const today = new Date(`${TODAY}T00:00:00`);
  if (Number.isNaN(t.getTime())) return null;
  return Math.round((t - today) / 86400000);
}

function collectAlerts(studies) {
  const items = [];
  studies.forEach((s) => {
    if ((s.monitoring?.overdueVisits || 0) > 0) {
      items.push({
        id: `mon-${s.studyId}`,
        studyId: s.studyId,
        tone: 'Urgent',
        title: 'Overdue monitoring visit',
        detail: `${s.monitoring.overdueVisits} overdue visit(s) on ${s.shortTitle}.`,
      });
    }

    const ethicsDays = daysUntil(s.ethicsRegulatory?.approvalExpiry);
    const ethicsStatus = s.ethicsRegulatory?.regulatoryStatus;
    if (
      ethicsStatus === 'Renewal Required' ||
      ethicsStatus === 'Review Required' ||
      (ethicsDays !== null && ethicsDays <= 45)
    ) {
      items.push({
        id: `iec-${s.studyId}`,
        studyId: s.studyId,
        tone: ethicsDays !== null && ethicsDays < 0 ? 'Urgent' : 'Warning',
        title: ethicsDays !== null && ethicsDays < 0 ? 'IEC approval expired' : 'IEC approval expiring soon',
        detail: `${s.ethicsRegulatory?.approvalNumber || 'IEC'} valid until ${s.ethicsRegulatory?.approvalExpiry || '—'} (${ethicsDays ?? '—'} days).`,
      });
    }

    const pct = enrollmentPct(s);
    if (s.status === 'Delayed' || pct < 60 || (s.alerts || []).some((a) => /recruit|enrol/i.test(a))) {
      items.push({
        id: `enr-${s.studyId}`,
        studyId: s.studyId,
        tone: s.status === 'Delayed' ? 'Urgent' : 'Warning',
        title: 'Enrolment lag',
        detail: `${s.participants?.enrolled || 0}/${s.participants?.target || 0} enrolled (${pct}%) on ${s.studyId}.`,
      });
    }

    (s.adverseEventsList || []).forEach((ae) => {
      if (!ae.isSerious && !(ae.expeditedReportingDeadline || '').length) return;
      const deadline = (ae.expeditedReportingDeadline || '').slice(0, 10);
      const d = daysUntil(deadline);
      if (d === null) return;
      if (d <= 7) {
        items.push({
          id: `sae-${s.studyId}-${ae.aeId}`,
          studyId: s.studyId,
          tone: d < 0 ? 'Urgent' : 'Warning',
          title: d < 0 ? 'SAE reporting deadline passed' : 'SAE reporting deadline approaching',
          detail: `${ae.aeId} · ${ae.term} · due ${deadline}.`,
        });
      }
    });

    if ((s.safety?.reportingDeadlines || 0) > 0 && !(s.adverseEventsList || []).some((ae) => ae.expeditedReportingDeadline)) {
      items.push({
        id: `saedl-${s.studyId}`,
        studyId: s.studyId,
        tone: 'Warning',
        title: 'SAE reporting deadline approaching',
        detail: `${s.safety.reportingDeadlines} expedited safety deadline(s) on ${s.studyId}.`,
      });
    }

    (s.alerts || []).forEach((text, i) => {
      const already = items.some((it) => it.studyId === s.studyId && it.detail.toLowerCase().includes(String(text).slice(0, 18).toLowerCase()));
      if (already) return;
      items.push({
        id: `flag-${s.studyId}-${i}`,
        studyId: s.studyId,
        tone: /overdue|urgent|sae/i.test(text) ? 'Urgent' : 'Warning',
        title: 'Study flag',
        detail: `${s.studyId}: ${text}`,
      });
    });
  });
  return items;
}

function pendingReviewItems(studies) {
  const rows = [];
  studies.forEach((s) => {
    getDeviationRows(s)
      .filter((d) => ['Open', 'Pending', 'Pending Review', 'Review Required'].includes(d.status))
      .forEach((d) => {
        rows.push({
          id: `dev-${s.studyId}-${d.id}`,
          kind: 'Deviation',
          studyId: s.studyId,
          title: d.detail,
          meta: `${d.type} · ${d.reason}`,
          status: d.status === 'Review Required' ? 'Pending Review' : d.status,
        });
      });

    if ((s.protocolDeviations?.open || 0) > 0 && !rows.some((r) => r.kind === 'Deviation' && r.studyId === s.studyId)) {
      rows.push({
        id: `devsum-${s.studyId}`,
        kind: 'Deviation',
        studyId: s.studyId,
        title: `${s.protocolDeviations.open} open deviation(s) awaiting PI sign-off`,
        meta: `${s.protocolDeviations.major || 0} major · ${s.protocolDeviations.minor || 0} minor`,
        status: 'Pending Review',
      });
    }

    (s.queriesList || [])
      .filter((q) => q.status === 'Open' || q.status === 'Pending' || q.status === 'Pending Review')
      .forEach((q) => {
        rows.push({
          id: `qry-${s.studyId}-${q.queryId}`,
          kind: 'Data query',
          studyId: s.studyId,
          title: `${q.queryId}: ${q.issue}`,
          meta: `${q.formName} / ${q.fieldName} · ${q.assignedTo}`,
          status: q.status,
        });
      });
  });
  return rows;
}

function statusBadge(status) {
  if (status === 'Active' || status === 'Recruiting' || status === 'Near Completion') return 'Active';
  if (status === 'Delayed') return 'Delayed';
  return status;
}

export default function PIDashboard({ studies = [], sessionUser, onOpenStudy }) {
  const mine = useMemo(() => studiesForLoggedInPi(studies, sessionUser), [studies, sessionUser]);
  const [approved, setApproved] = useState({});
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const enrolled = mine.reduce((a, s) => a + (s.participants?.enrolled || 0), 0);
  const pendingDevs = mine.reduce((a, s) => a + (s.protocolDeviations?.open || 0), 0);
  const openSaes = mine.reduce((a, s) => a + (s.safety?.seriousAdverseEvents || 0), 0);

  const barData = mine.map((s) => ({
    name: s.studyId.replace('AIIA-', ''),
    Enrolled: s.participants?.enrolled || 0,
    AE: s.safety?.adverseEvents || 0,
    SAE: s.safety?.seriousAdverseEvents || 0,
  }));

  const openDev = mine.reduce((a, s) => a + (s.protocolDeviations?.open || 0), 0);
  const resolvedDev = mine.reduce((a, s) => a + (s.protocolDeviations?.resolved || 0), 0);
  const pieData = [
    { name: 'Open', value: openDev },
    { name: 'Resolved', value: resolvedDev },
  ].filter((d) => d.value > 0);

  const alerts = collectAlerts(mine);
  const reviewQueue = pendingReviewItems(mine).filter((r) => !approved[r.id]);

  const kpis = [
    { label: 'Studies I lead', value: mine.length, sub: sessionUser?.name || 'Logged-in PI', icon: FlaskConical, accent: 'border-t-sage' },
    { label: 'Total enrolled', value: enrolled, sub: 'Across my protocols', icon: Users, accent: 'border-t-sage' },
    { label: 'Deviations pending sign-off', value: pendingDevs, sub: 'Open / pending review', icon: Flag, accent: 'border-t-gold-ink' },
    { label: 'Open SAEs', value: openSaes, sub: 'Serious events on my studies', icon: ShieldAlert, accent: 'border-t-clay' },
  ];

  const handleCreateTask = (e) => {
    e.preventDefault();
    alert(`Task "${newTaskTitle}" created and assigned to Study Coordinator.`);
    setNewTaskTitle('');
    setTaskModalOpen(false);
  };

  return (
    <div className="w-full pt-5">

      {/* 1. PI HEADER */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">
              Investigator Desk
            </span>
            <span className="text-[11px] font-semibold text-gold-ink">
              · {sessionUser?.name || 'Dr. Ananya Sharma'}
            </span>
          </div>
          <h1 className="m-0 text-[28px] tracking-tight text-forest">
            Principal Investigator Workspace
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Protocols where you are Principal Investigator — quality, enrolment, safety, and sign-off verification.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <StatusPill status="Compliant" text="PI Workspace" />
          <StatusPill status="Pending" text={`${reviewQueue.length} awaiting review`} />
          <button
            type="button"
            onClick={() => setTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3 py-1.5 text-xs font-semibold text-cream-ink shadow-sm transition-all hover:bg-sage-deep ml-2"
          >
            <PlusCircle size={14} /> Create Task
          </button>
        </div>
      </div>

      {mine.length === 0 && (
        <div className="mb-5 rounded-xl border border-ochre bg-cream px-4 py-3 text-sm text-muted shadow-[var(--shadow)]">
          No studies in the registry list you as PI. Sign in with a name or email that matches a protocol investigator (for example <strong className="text-forest">ananya.sharma@aiia.gov.in</strong> for Dr. Ananya Sharma).
        </div>
      )}

      {/* 2. TOP METRIC CARDS */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`min-h-[108px] rounded-b-[10px] border border-ochre border-t-[3px] bg-cream px-4 py-3.5 shadow-[var(--shadow)] ${k.accent}`}
          >
            <div className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
              <k.icon size={14} />
              {k.label}
            </div>
            <div className="text-[28px] font-extrabold leading-none text-forest">{k.value}</div>
            <div className="mt-1.5 text-xs text-muted">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 3. ATTENTION REQUIRED PANEL (CRITICAL PI REQUIREMENT) */}
      <section className="mb-5 rounded-xl border border-clay/60 bg-cream p-4 shadow-[var(--shadow)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-clay">
              <ShieldAlert size={18} /> Attention Required Section
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Critical triggers needing PI review, verification, or action sign-off.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTaskModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-lg border border-clay/40 bg-sand px-3 py-1 text-xs font-bold text-clay hover:bg-clay hover:text-white transition-colors"
          >
            <PlusCircle size={13} /> + Create Task
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="rounded-lg border border-clay/30 border-l-[4px] border-l-clay bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-clay">
              <span>Recruitment Delay</span>
              <span className="rounded bg-clay/20 px-1.5 py-0.5 text-[10px] text-clay">HIGH RISK</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              AIIA-AYU-003 is 38% behind target velocity.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 2 */}
          <div className="rounded-lg border border-ochre border-l-[4px] border-l-gold-ink bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-gold-ink">
              <span>IEC Renewal Due</span>
              <span className="rounded bg-gold-ink/20 px-1.5 py-0.5 text-[10px] text-gold-ink">18 Days Left</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              IEC/AIIA/2025/031 approval renewal due on Oct 15.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 3 */}
          <div className="rounded-lg border border-clay/30 border-l-[4px] border-l-clay bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-clay">
              <span>SAE Review</span>
              <span className="rounded bg-clay/20 px-1.5 py-0.5 text-[10px] text-clay">3 Pending</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              3 serious adverse events requiring PI causality review.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 4 */}
          <div className="rounded-lg border border-ochre border-l-[4px] border-l-sage bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-sage-deep">
              <span>Open Deviations</span>
              <span className="rounded bg-sage/20 px-1.5 py-0.5 text-[10px] text-sage-deep">4 Open</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              4 protocol deviations awaiting PI sign-off.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* AI FEATURE #1: RECRUITMENT VELOCITY PREDICTOR WIDGET */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-mint-ink border border-sage/40">
                <BrainCircuit size={12} /> AI Intelligence Engine
              </span>
              <span className="text-xs font-semibold text-gold-ink">
                · PI Recruitment Velocity Predictor
              </span>
            </div>
            <h3 className="m-0 text-base font-bold text-forest">
              Projected Protocol Target Completion: Dec 2026
            </h3>
            <p className="mt-1 text-xs text-muted">
              AI predicts <strong>AIIA-AYU-001</strong> will complete enrollment 12 days ahead of target, while <strong>AIIA-AYU-003</strong> requires 2 additional satellite recruitment nodes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('AI Recruitment Analysis: Velocity is strong at Central Unit (8 subjects/week). Recommending community outreach for AYU-003.')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-2 text-xs font-bold text-cream-ink shadow-sm transition-all hover:bg-sage-deep"
          >
            <Sparkles size={14} /> View AI Predictions
          </button>
        </div>
      </section>

      {/* 4. CHARTS SECTION */}
      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
          <h3 className="m-0 text-[15px] text-forest">Enrolment, AE and SAE by study</h3>
          <p className="mb-3 mt-1 text-xs text-muted">Grouped bars from the study registry. Sage = enrolled, ochre = AE, clay = SAE.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData.length ? barData : [{ name: '—', Enrolled: 0, AE: 0, SAE: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4A373" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Enrolled" fill="#84A98C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="AE" fill="#D4A373" radius={[4, 4, 0, 0]} />
                <Bar dataKey="SAE" fill="#C86D51" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
          <h3 className="m-0 text-[15px] text-forest">Deviation status</h3>
          <p className="mb-3 mt-1 text-xs text-muted">Open vs resolved protocol deviations across my studies.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData.length ? pieData : [{ name: 'None', value: 1 }]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {(pieData.length ? pieData : [{ name: 'None' }]).map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.name === 'Open' ? '#C86D51' : entry.name === 'Resolved' ? '#84A98C' : '#EFE8D8'}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* 5. ALERTS & FLAGS SECTION */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] text-forest">
          <AlertTriangle size={16} className="text-clay" /> Alerts needing attention
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">Overdue visits, IEC expiry, enrolment lag, and SAE reporting windows — from each study’s flags.</p>
        <div className="max-h-72 overflow-auto">
          {alerts.length === 0 && (
            <p className="m-0 text-sm text-muted">No urgent flags on your current protocols.</p>
          )}
          <div className="flex flex-col gap-2">
            {alerts.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-forest">
                    {a.title.includes('monitoring') ? <CalendarClock size={14} /> : null}
                    {a.title}
                  </div>
                  <div className="mt-0.5 text-xs text-muted">{a.detail}</div>
                </div>
                <StatusPill status={a.tone} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEEDS MY REVIEW & SIGN-OFF SECTION */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] text-forest">
          <ClipboardList size={16} className="text-sage-deep" /> Needs my review & verify
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">Open deviations and data queries awaiting PI approval. Click Approve to sign off on this record.</p>
        <div className="max-h-80 overflow-auto">
          {reviewQueue.length === 0 && (
            <p className="m-0 text-sm text-muted">Nothing pending your sign-off.</p>
          )}
          <div className="flex flex-col gap-2">
            {reviewQueue.map((row) => (
              <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ochre bg-oat px-3 py-2.5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-forest">
                    {row.kind === 'Deviation' ? <Flag size={13} className="text-clay" /> : <MessageSquareWarning size={13} className="text-gold-ink" />}
                    {row.kind} · {row.studyId}
                  </div>
                  <div className="mt-0.5 text-xs text-forest">{row.title}</div>
                  <div className="text-[11px] text-muted">{row.meta}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={row.status === 'Open' ? 'Open' : 'Pending'} text={row.status} />
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg bg-sage px-3 py-1.5 text-xs font-semibold text-cream-ink hover:bg-sage-deep"
                    onClick={() => setApproved((m) => ({ ...m, [row.id]: true }))}
                  >
                    <CheckCircle2 size={13} /> Verify & Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MY STUDIES TABLE */}
      <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 text-[15px] text-forest">My studies</h3>
        <p className="mb-3 mt-1 text-xs text-muted">Click a row to open the full study workspace dossier.</p>
        <div className="max-h-80 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['Study ID', 'Title', 'Phase', 'Enrolled / target', 'Status', 'Action'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mine.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3.5 py-6 text-center text-muted">No PI-assigned studies.</td>
                </tr>
              )}
              {mine.map((row) => {
                const pct = enrollmentPct(row);
                return (
                  <tr
                    key={row.studyId}
                    className="cursor-pointer border-b border-ochre/40 last:border-0 hover:bg-mint transition-colors"
                    onClick={() => onOpenStudy && onOpenStudy(row)}
                  >
                    <td className="px-3.5 py-3.5 font-bold text-forest">{row.studyId}</td>
                    <td className="px-3.5 py-3.5 font-semibold text-forest">{row.title}</td>
                    <td className="px-3.5 py-3.5 text-muted">{row.phase}</td>
                    <td className="min-w-[140px] px-3.5 py-3.5">
                      <div className="mb-1 flex justify-between text-[11px] text-muted">
                        <span>{row.participants?.enrolled}/{row.participants?.target}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-linen">
                        <div className="h-full bg-sage" style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </td>
                    <td className="px-3.5 py-3.5">
                      <StatusPill
                        status={statusBadge(row.status)}
                        text={row.status}
                      />
                    </td>
                    <td className="px-3.5 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenStudy) onOpenStudy(row);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg bg-sage px-2.5 py-1 text-xs font-semibold text-cream-ink hover:bg-sage-deep"
                      >
                        Open Workspace <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* CREATE TASK MODAL */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-ochre bg-cream p-5 shadow-2xl">
            <h3 className="m-0 text-base font-bold text-forest">Create PI Task</h3>
            <p className="mt-1 text-xs text-muted">Assign an operational task to the Study Coordinator or Monitor.</p>
            <form onSubmit={handleCreateTask} className="mt-4 flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-forest mb-1">Task Title / Instruction</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Expedite IEC renewal dossier submission"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-lg border border-ochre bg-linen p-2 text-xs text-forest focus:outline-none focus:ring-1 focus:ring-sage"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="rounded-lg border border-ochre px-3 py-1.5 text-xs font-semibold text-muted hover:bg-linen"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-sage px-4 py-1.5 text-xs font-bold text-cream-ink hover:bg-sage-deep"
                >
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}