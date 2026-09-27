import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ClipboardCheck,
  Database,
  MapPin,
  ShieldAlert,
  Wrench,
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
 * Adjust `s.monitor` if your data uses a different key
 * (e.g. s.monitorName, s.assignedMonitor).
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

  // Fallback: If no studies matched by exact name, but studies have monitor or findings listed, return them
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
    { label: 'Sites monitored', value: sites.length, sub: 'Across my studies', icon: MapPin, accent: 'border-t-sage' },
    { label: 'Overdue visits / SDV', value: overdueVisits, sub: 'Need action', icon: AlertTriangle, accent: 'border-t-clay' },
    { label: 'Open findings', value: openFindings, sub: 'Not yet actioned', icon: ShieldAlert, accent: 'border-t-clay' },
    { label: 'Corrective actions pending', value: capaPending, sub: 'CAPA in motion', icon: Wrench, accent: 'border-t-gold-ink' },
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
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">Monitor / CRA workspace</p>
          <h1 className="m-0 text-[28px] tracking-tight text-forest">Monitor dashboard</h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Sites you monitor — findings, deviations, data quality, and corrective actions.
          </p>
        </div>
        <StatusPill status={openFindings > 0 ? 'Urgent' : 'Compliant'} text={`${openFindings} open findings`} />
      </div>

      {mine.length === 0 && (
        <div className="mb-5 rounded-xl border border-ochre bg-cream px-4 py-3 text-sm text-muted shadow-[var(--shadow)]">
          No studies in the registry list you as monitor.
        </div>
      )}

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

      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] text-forest">
          <ClipboardCheck size={16} className="text-sage-deep" /> Findings board
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">Move a finding forward as its corrective action progresses.</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          {COLUMNS.map((col) => {
            const items = findings.filter((f) => f.status === col.key);
            return (
              <div key={col.key} className={`rounded-b-[10px] border border-ochre border-t-[3px] bg-linen p-2.5 ${col.accent}`}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                    <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} /> {col.label}
                  </span>
                  <span className="text-[11px] text-muted">{items.length}</span>
                </div>
                <div className="flex min-h-[60px] flex-col gap-2">
                  {items.map((f) => (
                    <div key={f.findingId} className="rounded-lg border border-ochre bg-cream p-2.5 shadow-[var(--shadow)]">
                      <div className="mb-1 flex items-center justify-between text-[11px] text-muted">
                        <span className="font-bold text-forest">{f.studyId}</span>
                        <span>{f.siteId}</span>
                      </div>
                      <p className="m-0 text-xs text-forest">{f.description}</p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <StatusPill status={f.severity === 'Major' ? 'Urgent' : 'Pending'} text={f.severity} />
                        {NEXT_STATUS[f.status] && (
                          <button
                            type="button"
                            onClick={() => advance(f.findingId)}
                            className="rounded-md bg-sage px-2 py-1 text-[11px] font-semibold text-cream-ink hover:bg-sage-deep"
                          >
                            Move to {NEXT_STATUS[f.status]}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <p className="m-0 px-1 text-[11px] text-muted">None</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 text-[15px] text-forest">Deviations and queries by site</h3>
        <p className="mb-3 mt-1 text-xs text-muted">Compare sites, not just studies — where data quality risk is concentrated.</p>
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

      <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] text-forest">
          <Database size={16} className="text-sage-deep" /> Site performance
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">Click a row to open the study dossier.</p>
        <div className="max-h-80 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['Site', 'Study', 'Investigator', 'Open deviations', 'SDV %', 'Open queries'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sites.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3.5 py-6 text-center text-muted">No monitor-assigned sites.</td>
                </tr>
              )}
              {sites.map((row) => (
                <tr
                  key={`${row.studyId}-${row.siteId}`}
                  className="cursor-pointer border-b border-ochre/40 last:border-0 hover:bg-mint"
                  onClick={() => onOpenStudy && onOpenStudy(mine.find((s) => s.studyId === row.studyId))}
                >
                  <td className="px-3.5 py-3 font-bold text-forest">{row.siteName}</td>
                  <td className="px-3.5 py-3 text-muted">{row.studyId}</td>
                  <td className="px-3.5 py-3 text-muted">{row.investigator}</td>
                  <td className="px-3.5 py-3">{row.openDeviations}</td>
                  <td className="px-3.5 py-3">{row.sdvPct}%</td>
                  <td className="px-3.5 py-3">{row.openQueries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}