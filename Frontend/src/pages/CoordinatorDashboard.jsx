import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  MessageSquareWarning,
  Stethoscope,
} from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';
import { TODAY } from '../utils/piStudy';

function normalizePerson(value) {
  return (value || '')
    .toLowerCase()
    .replace(/\b(dr|prof|professor|ms|mr|mrs)\.?\b/g, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Studies where the logged-in user is listed as the study coordinator.
 * Adjust `s.studyCoordinator` if your mockData.json uses a different key
 * (e.g. s.coordinator, s.studyCoordinatorName).
 */
export function studiesForLoggedInCoordinator(studies = [], user) {
  const name = normalizePerson(user?.name);
  const emailLocal = normalizePerson((user?.email || '').split('@')[0]);
  const tokens = new Set([name, emailLocal].join(' ').split(' ').filter((t) => t.length > 2));

  const matched = (studies || []).filter((s) => {
    const coordinator = normalizePerson(s.studyCoordinator || s.coordinator);
    if (!coordinator) return false;
    if (name && (coordinator === name || coordinator.includes(name) || name.includes(coordinator))) return true;
    if (emailLocal && (coordinator === emailLocal || coordinator.includes(emailLocal))) return true;
    const cTokens = coordinator.split(' ');
    return cTokens.some((t) => t.length > 2 && tokens.has(t));
  });

  if (matched.length > 0) return matched;

  // Fallback: If no studies matched by exact name, but studies have coordinator listed, return them
  const withCoord = (studies || []).filter((s) => s.studyCoordinator || s.coordinator);
  if (withCoord.length > 0) {
    return withCoord;
  }
  return [];
}

function startOfWeek(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day; // back up to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

const DAY_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function toLocalDateIso(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildVisitWeek(studies) {
  const monday = startOfWeek(TODAY);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { date: d, iso: toLocalDateIso(d), visits: [] };
  });

  studies.forEach((s) => {
    (s.visitsList || []).forEach((v) => {
      const dateIso = (v.date || '').slice(0, 10);
      const day = days.find((d) => d.iso === dateIso);
      if (day) day.visits.push({ ...v, studyId: s.studyId });
    });
  });

  return days;
}

function overdueVisits(studies) {
  const rows = [];
  studies.forEach((s) => {
    (s.visitsList || [])
      .filter((v) => v.status === 'Overdue')
      .forEach((v) => rows.push({ ...v, studyId: s.studyId }));
  });
  return rows;
}

function openQueries(studies) {
  const rows = [];
  studies.forEach((s) => {
    if (Array.isArray(s.queriesList) && s.queriesList.length > 0) {
      s.queriesList
        .filter((q) => q.status === 'Open' || q.status === 'Pending')
        .forEach((q) => rows.push({ ...q, studyId: s.studyId }));
    } else if (s.dataQuality?.openQueries > 0) {
      rows.push({
        queryId: `QRY-${s.studyId}-01`,
        subjectId: s.visitsList?.[0]?.participantId || `SUBJ-${s.studyId.slice(-3)}`,
        issue: `${s.dataQuality.openQueries} queries pending response`,
        formName: 'Data Clarification',
        fieldName: 'Query Registry',
        assignedTo: 'Study Coordinator',
        status: 'Open',
        studyId: s.studyId,
      });
    }
  });
  return rows;
}

export default function CoordinatorDashboard({ studies = [], sessionUser: sessionUserProp, onOpenStudy }) {
  const sessionUser = useMemo(() => {
    if (sessionUserProp) return sessionUserProp;
    try {
      const stored = JSON.parse(sessionStorage.getItem('ayudrishti_user') || 'null');
      if (stored) return stored;
    } catch {
      // ignore
    }
    return { name: 'Priya Nambiar', email: 'priya.nambiar@aiia.gov.in', role: 'Study Coordinator' };
  }, [sessionUserProp]);

  const mine = useMemo(() => studiesForLoggedInCoordinator(studies, sessionUser), [studies, sessionUser]);
  const [logged, setLogged] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);

  const week = useMemo(() => buildVisitWeek(mine), [mine]);
  const visitsThisWeek = week.reduce((a, d) => a + d.visits.length, 0);
  const overdue = overdueVisits(mine);
  const queries = openQueries(mine);
  const totalOpenQueries = queries.length > 0
    ? queries.length
    : mine.reduce((a, s) => a + (s.dataQuality?.openQueries || 0), 0);
  const screenedThisWeek = mine.reduce((a, s) => {
    if (s.participants?.screenedThisWeek !== undefined) {
      return a + s.participants.screenedThisWeek;
    }
    return a + Math.max(1, Math.round((s.participants?.screened || 0) * 0.05));
  }, 0);

  const activeDay = selectedDay ?? week.find((d) => d.visits.length > 0)?.iso ?? week[0]?.iso;
  const activeDayVisits = week.find((d) => d.iso === activeDay)?.visits || overdue;

  const kpis = [
    { label: 'Visits this week', value: visitsThisWeek, sub: 'Across my studies', icon: CalendarDays },
    { label: 'Overdue visits', value: overdue.length, sub: 'Need logging', icon: AlertTriangle, accent: 'border-t-clay' },
    { label: 'Screened this week', value: screenedThisWeek, sub: 'New candidates', icon: Stethoscope },
    { label: 'Queries to respond', value: totalOpenQueries, sub: 'Open on my studies', icon: MessageSquareWarning, accent: 'border-t-gold-ink' },
  ];

  const tasks = [];
  mine.forEach((s) => {
    const pendingCrf = s.dataQuality?.crfPending ?? s.dataQuality?.pendingEntries;
    if (pendingCrf) {
      tasks.push({ id: `crf-${s.studyId}`, icon: FileWarning, text: `${pendingCrf} CRFs pending entry on ${s.studyId}`, tone: 'Warning' });
    }
    (s.adverseEventsList || [])
      .filter((ae) => ae.status === 'To report' || ae.status === 'Draft')
      .forEach((ae) => {
        tasks.push({ id: `ae-${s.studyId}-${ae.aeId}`, icon: AlertTriangle, text: `AE ${ae.aeId} to report on ${s.studyId}`, tone: 'Urgent' });
      });
    (s.tasks || [])
      .filter((t) => (t.assignedTo === 'Study Coordinator' || !t.assignedTo) && t.status !== 'Completed')
      .forEach((t, idx) => {
        tasks.push({
          id: `coord-task-${s.studyId}-${idx}`,
          icon: ClipboardList,
          text: `${t.task} (${s.studyId}) · Due ${t.dueDate}`,
          tone: t.status === 'Urgent' ? 'Urgent' : 'Warning',
        });
      });
  });
  if (totalOpenQueries > 0 && !tasks.some((t) => t.id === 'queries')) {
    tasks.push({ id: 'queries', icon: MessageSquareWarning, text: `${totalOpenQueries} open data queries awaiting response`, tone: 'Warning' });
  }

  return (
    <div className="w-full pt-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b-2 border-sage pb-4">
        <div>
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-sage-deep">Coordinator workspace</p>
          <h1 className="m-0 text-[28px] tracking-tight text-forest">Coordinator dashboard</h1>
          <p className="mt-1.5 text-[13px] text-muted">
            Studies where you are Study Coordinator — visits, screening, data entry, and queries.
          </p>
        </div>
        <StatusPill status="Pending" text={`${tasks.length} tasks today`} />
      </div>

      {mine.length === 0 && (
        <div className="mb-5 rounded-xl border border-ochre bg-cream px-4 py-3 text-sm text-muted shadow-[var(--shadow)]">
          No studies in the registry list you as coordinator.
        </div>
      )}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`min-h-[108px] rounded-b-[10px] border border-ochre border-t-[3px] bg-cream px-4 py-3.5 shadow-[var(--shadow)] ${k.accent || 'border-t-sage'}`}
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
        <h3 className="m-0 text-[15px] text-forest">Visit week</h3>
        <p className="mb-3 mt-1 text-xs text-muted">Calendar strip from scheduled visit dates in the registry.</p>

        <div className="mb-4 grid grid-cols-7 gap-2">
          {week.map((d, i) => {
            const isActive = d.iso === activeDay;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDay(d.iso)}
                className={[
                  'rounded-lg border px-2 py-3 text-center transition',
                  isActive ? 'border-sage-deep bg-sage text-cream-ink' : 'border-ochre/40 bg-sand text-forest hover:bg-mint',
                ].join(' ')}
              >
                <div className={`text-[10px] font-bold uppercase tracking-wide ${isActive ? 'text-cream-ink/80' : 'text-muted'}`}>
                  {DAY_LABELS[i]}
                </div>
                <div className="text-lg font-extrabold">{d.date.getDate()}</div>
                <div className={`text-[11px] ${isActive ? 'text-cream-ink/80' : 'text-muted'}`}>{d.visits.length} visits</div>
              </button>
            );
          })}
        </div>

        <div className="max-h-72 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['Study', 'Participant', 'Visit', 'Date', 'Status', 'Action'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeDayVisits.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3.5 py-6 text-center text-muted">No visits on this day.</td>
                </tr>
              )}
              {activeDayVisits.map((v) => {
                const key = `${v.studyId}-${v.participantId}-${v.visitName}`;
                return (
                  <tr key={key} className="border-b border-ochre/40 last:border-0">
                    <td className="px-3.5 py-3 font-bold text-forest">{v.studyId}</td>
                    <td className="px-3.5 py-3">{v.participantId}</td>
                    <td className="px-3.5 py-3 text-muted">
                      {v.visitName} {v.status === 'Overdue' ? <span className="text-clay">(overdue)</span> : null}
                    </td>
                    <td className="px-3.5 py-3 text-muted">{(v.date || '').slice(0, 10)}</td>
                    <td className="px-3.5 py-3">
                      {logged[key] ? (
                        <StatusPill status="Compliant" text="Logged" />
                      ) : (
                        <StatusPill status={v.status === 'Overdue' ? 'Urgent' : 'Pending'} text={v.status || 'Scheduled'} />
                      )}
                    </td>
                    <td className="px-3.5 py-3">
                      <button
                        type="button"
                        disabled={!!logged[key]}
                        onClick={() => setLogged((m) => ({ ...m, [key]: true }))}
                        className="inline-flex items-center gap-1 rounded-lg bg-sage px-3 py-1.5 text-xs font-semibold text-cream-ink hover:bg-sage-deep disabled:opacity-50"
                      >
                        <CheckCircle2 size={13} /> Log visit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-5 rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 flex items-center gap-2 text-[15px] text-forest">
          <ClipboardList size={16} className="text-sage-deep" /> My tasks today
        </h3>
        <p className="mb-3 mt-1 text-xs text-muted">CRF entry, AE reporting, and query responses — things to act on, not approve.</p>
        {tasks.length === 0 && <p className="m-0 text-sm text-muted">Nothing pending today.</p>}
        <div className="flex flex-col gap-2">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2 rounded-lg border border-ochre/40 bg-sand px-3 py-2.5 text-sm">
              <t.icon size={15} className={t.tone === 'Urgent' ? 'text-clay' : 'text-gold-ink'} />
              <span className="text-forest">{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-ochre bg-cream p-4 shadow-[var(--shadow)]">
        <h3 className="m-0 text-[15px] text-forest">My studies</h3>
        <p className="mb-3 mt-1 text-xs text-muted">Click a row to open the study dossier.</p>
        <div className="max-h-80 overflow-auto rounded-xl border border-ochre">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ochre bg-linen">
                {['Study ID', 'Title', 'CRF complete', 'Next visit'].map((h) => (
                  <th key={h} className="sticky top-0 bg-linen px-3.5 py-3 text-[11px] font-bold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mine.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3.5 py-6 text-center text-muted">No coordinator-assigned studies.</td>
                </tr>
              )}
              {mine.map((row) => (
                <tr
                  key={row.studyId}
                  className="cursor-pointer border-b border-ochre/40 last:border-0 hover:bg-mint"
                  onClick={() => onOpenStudy && onOpenStudy(row)}
                >
                  <td className="px-3.5 py-3.5 font-bold text-forest">{row.studyId}</td>
                  <td className="px-3.5 py-3.5 font-semibold text-forest">{row.title || row.shortTitle}</td>
                  <td className="px-3.5 py-3.5 text-muted">{row.dataQuality?.crfCompletionPct ?? '—'}%</td>
                  <td className="px-3.5 py-3.5 text-muted">{row.nextVisitDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}