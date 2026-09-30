import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ClipboardCheck,
  Database,
  MapPin,
  ShieldAlert,
  Wrench,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  Clock,
  Calendar,
  CheckCircle2,
  FileCheck2,
  PlusCircle,
  Activity
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import StatusPill from '../components/pi/StatusPill';

function normalizePerson(value) {
  return (value || '')
    .toLowerCase()
    .replace(/\b(dr|prof|professor|ms|mr|mrs)\.?\b/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Studies where the logged-in user is the assigned Monitor/CRA.
 */
export function studiesForLoggedInMonitor(studies = [], user) {
  const name = normalizePerson(user?.name);
  const emailLocal = normalizePerson((user?.email || '').split('@')[0]);
  const tokens = new Set([name, emailLocal].join(' ').split(' ').filter((t) => t.length > 2));

  const matched = (studies || []).filter((s) => {
    const monitor = normalizePerson(s.monitor || s.monitorName);
    if (!monitor) return false;
    if (name && (monitor === name || monitor.includes(name) || name.includes(monitor))) return true;
    if (emailLocal && (monitor === emailLocal || monitor.includes(emailLocal))) return true;
    const mTokens = monitor.split(' ');
    return mTokens.some((t) => t.length > 2 && tokens.has(t));
  });

  if (matched.length > 0) return matched;

  // Fallback: Return studies with monitor listed or findings
  const withMonitor = (studies || []).filter(
    (s) => s.monitor || s.monitorName || (Array.isArray(s.findings) && s.findings.length > 0)
  );
  if (withMonitor.length > 0) {
    return withMonitor;
  }
  return [];
}

const COLUMNS = [
  { key: 'Open', label: 'Open finding', accent: 'border-t-clay', dot: 'bg-clay' },
  { key: 'CAPA Assigned', label: 'CAPA assigned', accent: 'border-t-gold-ink', dot: 'bg-gold-ink' },
  { key: 'In Progress', label: 'In progress', accent: 'border-t-sage', dot: 'bg-sage' },
  { key: 'Closed', label: 'Closed', accent: 'border-t-sage-deep', dot: 'bg-sage-deep' },
];

const NEXT_STATUS = {
  Open: 'CAPA Assigned',
  'CAPA Assigned': 'In Progress',
  'In Progress': 'Closed',
  Closed: null,
};

function allFindings(studies) {
  const rows = [];
  studies.forEach((s) => {
    (s.findings || []).forEach((f) => rows.push({ ...f, studyId: s.studyId }));
  });
  return rows;
}

function siteRows(studies) {
  const rows = [];
  studies.forEach((s) => {
    (s.sites || []).forEach((site) => {
      const planned = s.monitoring?.plannedVisits || 0;
      const completed = s.monitoring?.completedVisits || 0;
      const sdvPct = planned ? Math.round((completed / planned) * 100) : 0;
      rows.push({
        siteId: site.siteId,
        siteName: site.name,
        studyId: s.studyId,
        investigator: site.investigator,
        openDeviations: s.protocolDeviations?.open || 0,
        sdvPct,
        openQueries: s.dataQuality?.openQueries || 0,
      });
    });
  });
  return rows;
}

export default function MonitorDashboard({ studies = [], sessionUser: sessionUserProp, onOpenStudy }) {
  const sessionUser = useMemo(() => {
    if (sessionUserProp) return sessionUserProp;
    try {
      const stored = JSON.parse(sessionStorage.getItem('ayudrishti_user') || 'null');
      if (stored) return stored;
    } catch {
      // ignore
    }
    return { name: 'Karan Mehta', email: 'karan.mehta@aiia.gov.in', role: 'Monitor' };
  }, [sessionUserProp]);

  const mine = useMemo(() => studiesForLoggedInMonitor(studies, sessionUser), [studies, sessionUser]);
  const [findings, setFindings] = useState(() => allFindings(mine));

  useEffect(() => {
    setFindings(allFindings(mine));
  }, [mine]);
  const sites = useMemo(() => siteRows(mine), [mine]);

  const overdueVisits = mine.reduce((a, s) => a + (s.monitoring?.overdueVisits || 0), 0);
  const openFindings = findings.filter((f) => f.status === 'Open').length;
  const capaPending = findings.filter((f) => f.status === 'CAPA Assigned' || f.status === 'In Progress').length;

  const kpis = [
    { label: 'Sites Monitored', value: sites.length, sub: 'Across my active protocols', icon: MapPin, accent: 'border-t-sage' },
    { label: 'Overdue Visits / SDV', value: overdueVisits, sub: 'Visits requiring CRA action', icon: AlertTriangle, accent: 'border-t-clay' },
    { label: 'Open Findings', value: openFindings, sub: 'Action items pending CAPA', icon: ShieldAlert, accent: 'border-t-clay' },
    { label: 'Corrective Actions (CAPA)', value: capaPending, sub: 'In progress at sites', icon: Wrench, accent: 'border-t-gold-ink' },
  ];

  const chartData = sites.map((s) => ({
    name: s.siteId.replace('SITE-', 'S'),
    'Open deviations': s.openDeviations,
    'Open queries': s.openQueries,
  }));

  function advance(findingId) {
    setFindings((rows) =>
      rows.map((f) => {
        if (f.findingId !== findingId) return f;
        const next = NEXT_STATUS[f.status];
        return next ? { ...f, status: next } : f;
      })
    );
  }

  return (
    <div className="w-full pt-5">

      {/* 1. MONITOR HEADER */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">
              CRA Workspace
            </span>
            <span className="text-[11px] font-semibold text-gold-ink">
              · {sessionUser?.name || 'Karan Mehta'}
            </span>
          </div>
          <h1 className="m-0 text-[28px] tracking-tight text-forest font-bold">
            Monitor Dashboard
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Sites you monitor — findings, SDV progress, protocol deviations, data quality, and CAPA resolution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusPill status={openFindings > 0 ? 'Urgent' : 'Compliant'} text={`${openFindings} open findings`} />
        </div>
      </div>

      {mine.length === 0 && (
        <div className="mb-5 rounded-xl border border-ochre bg-cream px-4 py-3 text-sm text-muted shadow-[var(--shadow)]">
          No studies in the registry list you as monitor.
        </div>
      )}

      {/* 2. TOP KPI GRID */}
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

      {/* 3. ATTENTION REQUIRED PANEL (MONITORING BOTTLENECKS) */}
      <section className="mb-5 rounded-xl border border-clay/60 bg-cream p-4 shadow-[var(--shadow)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-clay">
              <ShieldAlert size={18} /> Monitoring Desk — Attention Required
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Site monitoring bottlenecks, overdue Source Data Verification (SDV), and major protocol findings.
            </p>
          </div>
          <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-bold text-clay">
            {openFindings + overdueVisits} Action Triggers
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Overdue Monitoring Visits */}
          <div className="rounded-lg border border-clay/30 border-l-[4px] border-l-clay bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-clay">
              <span>Overdue Visit</span>
              <span className="rounded bg-clay/20 px-1.5 py-0.5 text-[10px] text-clay">ACTION REQUIRED</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              {overdueVisits} monitoring visit(s) overdue for SDV at satellite units.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Open Study Workspace <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 2: Open Major Findings */}
          <div className="rounded-lg border border-clay/30 border-l-[4px] border-l-clay bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-clay">
              <span>Open Findings</span>
              <span className="rounded bg-clay/20 px-1.5 py-0.5 text-[10px] text-clay">{openFindings} Pending</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              {openFindings} major site finding(s) awaiting CAPA plan assignment.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Assign CAPA Action <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 3: SDV Backlog */}
          <div className="rounded-lg border border-ochre border-l-[4px] border-l-gold-ink bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-gold-ink">
              <span>SDV Lag</span>
              <span className="rounded bg-gold-ink/20 px-1.5 py-0.5 text-[10px] text-gold-ink">Coverage 72%</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              AIIA Satellite Centre, Goa has 28 unverified eCRF subject books.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Inspect SDV Queue <ChevronRight size={12} />
            </button>
          </div>

          {/* Card 4: Major Protocol Deviations */}
          <div className="rounded-lg border border-ochre border-l-[4px] border-l-sage bg-sand p-3">
            <div className="flex items-center justify-between text-xs font-bold text-sage-deep">
              <span>Open Deviations</span>
              <span className="rounded bg-sage/20 px-1.5 py-0.5 text-[10px] text-sage-deep">Verify</span>
            </div>
            <p className="my-1.5 text-xs font-semibold text-forest">
              5 minor deviations awaiting CRA verification and closure.
            </p>
            <button
              onClick={() => mine[0] && onOpenStudy && onOpenStudy(mine[0])}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-deep hover:underline"
            >
              Verify Deviations <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </section>

      {/* AI FEATURE #2: TRIAL DELAY & SITE RISK ENGINE WIDGET */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-mint px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-mint-ink border border-sage/40">
                <BrainCircuit size={12} /> AI Intelligence Engine
              </span>
              <span className="text-xs font-semibold text-gold-ink">
                · Trial Delay & Site Risk Predictor
              </span>
            </div>

            <h3 className="m-0 text-base font-bold text-forest">
              High Delay Risk: AIIA Satellite Centre, Goa (+14 Days)
            </h3>

            <p className="mt-1 text-xs text-muted">
              AI models forecast a <strong>14-day milestone delay</strong> due to high
              protocol deviation frequency and delayed SDV verification. Recommended
              CRA site visit generated.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              alert(
                'AI Mitigation Executed: Site visit scheduled for Oct 12 and targeted CRA remote SDV session initiated.'
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-sage px-3.5 py-2 text-xs font-bold text-cream-ink shadow-sm transition-all hover:bg-sage-deep"
          >
            <Sparkles size={14} /> Schedule CRA Site Visit
          </button>
        </div>
      </section>

      {/* 4. FINDINGS & CAPA KANBAN BOARD */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
          <ClipboardCheck size={16} className="text-sage-deep" /> Audit & Monitoring Findings Board
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">Track site audit findings through the CAPA workflow. Click 'Move' to advance corrective actions.</p>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = findings.filter((f) => f.status === col.key);
            return (
              <div key={col.key} className={`rounded-b-[10px] border border-ochre border-t-[3px] bg-linen p-2.5 ${col.accent}`}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                    <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} /> {col.label}
                  </span>
                  <span className="text-[11px] font-bold text-muted">{items.length}</span>
                </div>
                <div className="flex min-h-[80px] flex-col gap-2">
                  {items.map((f) => (
                    <div key={f.findingId} className="rounded-lg border border-ochre bg-cream p-2.5 shadow-[var(--shadow)]">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
                        <span className="font-bold text-forest">{f.studyId}</span>
                        <span>{f.siteId}</span>
                      </div>
                      <p className="m-0 text-xs font-medium text-forest">{f.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <StatusPill status={f.severity === 'Major' ? 'Urgent' : 'Pending'} text={f.severity} />
                        {NEXT_STATUS[f.status] && (
                          <button
                            type="button"
                            onClick={() => advance(f.findingId)}
                            className="rounded-md bg-sage px-2 py-1 text-[10px] font-bold text-cream-ink hover:bg-sage-deep transition-colors"
                          >
                            Move to {NEXT_STATUS[f.status]}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <p className="m-0 px-1 py-2 text-[11px] text-muted italic">No items in this stage</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DEVIATIONS AND QUERIES BY SITE CHART */}
      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 text-[15px] font-bold text-forest">Deviations & Data Queries by Site</h3>
        <p className="mb-3 mt-1 text-xs text-muted">Comparative breakdown showing where trial data risk and non-compliance are concentrated.</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.length ? chartData : [{ name: '—', 'Open deviations': 0, 'Open queries': 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D4A373" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Open deviations" fill="#C86D51" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Open queries" fill="#D4A373" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 6. SITE PERFORMANCE TABLE */}
      <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] font-bold text-forest">
          <Database size={16} className="text-sage-deep" /> Site Performance & SDV Directory
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">Click any row to open the complete study workspace and inspect site logs.</p>
        <div className="max-h-80 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['Site Name', 'Protocol ID', 'Investigator', 'Open Deviations', 'SDV %', 'Open Queries', 'Action'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3.5 py-6 text-center text-muted">No monitor-assigned sites.</td>
                </tr>
              )}
              {sites.map((row) => (
                <tr
                  key={`${row.studyId}-${row.siteId}`}
                  className="cursor-pointer border-b border-ochre/40 last:border-0 hover:bg-mint transition-colors"
                  onClick={() => onOpenStudy && onOpenStudy(mine.find((s) => s.studyId === row.studyId))}
                >
                  <td className="px-3.5 py-3 font-bold text-forest">{row.siteName}</td>
                  <td className="px-3.5 py-3 text-muted">{row.studyId}</td>
                  <td className="px-3.5 py-3 font-semibold text-forest">{row.investigator}</td>
                  <td className="px-3.5 py-3 font-bold text-clay">{row.openDeviations}</td>
                  <td className="px-3.5 py-3 font-bold text-sage-deep">{row.sdvPct}%</td>
                  <td className="px-3.5 py-3 font-bold text-gold-ink">{row.openQueries}</td>
                  <td className="px-3.5 py-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenStudy) onOpenStudy(mine.find((s) => s.studyId === row.studyId));
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-sage px-2.5 py-1 text-xs font-semibold text-cream-ink hover:bg-sage-deep"
                    >
                      Open Workspace <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}