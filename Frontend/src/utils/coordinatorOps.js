import { TODAY } from './piStudy';

export function subjectIdsForStudy(study) {
  const ids = new Set();
  (study.consentRecords || []).forEach((c) => c.subjectId && ids.add(c.subjectId));
  (study.queriesList || []).forEach((q) => q.subjectId && ids.add(q.subjectId));
  (study.adverseEventsList || []).forEach((ae) => ae.subjectId && ids.add(ae.subjectId));
  const fhirPatient = study.cdiscFhirConfig?.fhirR4Mapping?.patientResource;
  if (fhirPatient) ids.add(fhirPatient.split('/').pop());
  return [...ids];
}

export function crfTotals(studies) {
  return studies.reduce(
    (acc, s) => {
      const m = s.monitoring || {};
      acc.total += m.plannedVisits || 0;
      acc.completed += m.completedVisits || 0;
      acc.pending += m.upcomingVisits || 0;
      acc.overdue += m.overdueVisits || 0;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, overdue: 0 }
  );
}

export function screeningTotals(studies) {
  return studies.reduce(
    (acc, s) => {
      acc.screened += s.participants?.screened || 0;
      acc.eligible += s.participants?.eligible || 0;
      acc.enrolled += s.participants?.enrolled || 0;
      acc.randomized += s.participants?.randomized || 0;
      return acc;
    },
    { screened: 0, eligible: 0, enrolled: 0, randomized: 0 }
  );
}

export function coordinatorTasks(studies) {
  return studies.flatMap((s) =>
    (s.tasks || [])
      .filter((t) => t.assignedTo === 'Study Coordinator')
      .map((t) => ({ ...t, study: s }))
  );
}

export function coordinatorQueries(studies) {
  return studies.flatMap((s) =>
    (s.queriesList || [])
      .filter((q) => q.assignedTo === 'Study Coordinator')
      .map((q) => ({
        ...q,
        study: s,
        dueDate: (s.tasks || []).find((t) => t.assignedTo === 'Study Coordinator')?.dueDate || q.raisedDate,
      }))
  );
}

export function consentRows(studies) {
  return studies.flatMap((s) =>
    (s.consentRecords || []).map((c) => {
      let status = c.consentStatus || 'Pending';
      if (c.reConsentRequired) status = 'Requires Update';
      return { ...c, study: s, displayStatus: status };
    })
  );
}

export function consentSummary(rows) {
  return {
    consented: rows.filter((r) => r.displayStatus === 'Consented').length,
    pending: rows.filter((r) => r.displayStatus !== 'Consented' && r.displayStatus !== 'Requires Update').length,
    update: rows.filter((r) => r.displayStatus === 'Requires Update').length,
  };
}

export function deviationRows(studies) {
  const rows = [];
  studies.forEach((s) => {
    const fromAudit = (s.auditTrail || []).filter((a) =>
      (a.action || '').toLowerCase().includes('deviation')
    );
    fromAudit.forEach((a) => {
      rows.push({
        id: a.auditId,
        study: s,
        detail: a.newValue || a.entityModified,
        entity: a.entityModified,
        severity: (a.newValue || '').toLowerCase().includes('window') ? 'Minor' : 'Major',
        date: (a.timestamp || '').slice(0, 10),
        status: 'Open',
      });
    });
    const remaining = Math.max(0, (s.protocolDeviations?.open || 0) - fromAudit.length);
    if (remaining > 0) {
      rows.push({
        id: `${s.studyId}-open`,
        study: s,
        detail: `${remaining} open deviation(s) at site`,
        entity: s.sites?.[0]?.name || s.studyId,
        severity: (s.protocolDeviations?.major || 0) > 0 ? 'Major' : 'Minor',
        date: s.startDate,
        status: 'Open',
      });
    }
  });
  return rows;
}

function visitLabel(study, index, overdue) {
  const fromQuery = study.queriesList?.[0]?.formName;
  if (fromQuery) return overdue ? `${fromQuery} (overdue)` : fromQuery;
  const fromAudit = (study.auditTrail || []).find((a) => (a.entityModified || '').includes('Visit'));
  if (fromAudit) {
    const match = fromAudit.entityModified.match(/Visit\s+\d+/i);
    if (match) return match[0];
  }
  return overdue ? 'Monitoring visit' : 'Scheduled visit';
}

export function visitRows(studies) {
  const rows = [];
  studies.forEach((s) => {
    const subjects = subjectIdsForStudy(s);
    const overdue = s.monitoring?.overdueVisits || 0;
    const upcoming = s.monitoring?.upcomingVisits || 0;
    const coordTask = (s.tasks || []).find((t) => t.assignedTo === 'Study Coordinator');

    for (let i = 0; i < overdue; i += 1) {
      const subject = subjects[i] || subjects[0];
      if (!subject && !s.studyId) continue;
      rows.push({
        id: `${s.studyId}-od-${i}`,
        study: s,
        subjectId: subject || s.sites?.[0]?.siteId,
        visit: visitLabel(s, i, true),
        scheduledDate: TODAY,
        status: 'Overdue',
      });
    }

    for (let i = 0; i < upcoming; i += 1) {
      const subject = subjects[overdue + i] || subjects[subjects.length - 1] || subjects[0];
      rows.push({
        id: `${s.studyId}-up-${i}`,
        study: s,
        subjectId: subject || s.sites?.[0]?.siteId,
        visit: visitLabel(s, i, false),
        scheduledDate: coordTask?.dueDate || s.expectedEndDate,
        status: 'Due soon',
      });
    }
  });
  return rows.sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));
}

export function pendingCrfRows(studies) {
  const fromQueries = studies.flatMap((s) =>
    (s.queriesList || [])
      .filter((q) => q.sdvStatus === 'Unverified' || q.status === 'Open')
      .map((q) => ({
        id: q.queryId,
        study: s,
        subjectId: q.subjectId,
        form: q.formName,
        issue: q.issue,
        status: (s.dataQuality?.overdueQueries || 0) > 0 && q.status === 'Open' ? 'Overdue' : 'Pending',
        date: q.raisedDate,
      }))
  );
  return fromQueries;
}

export function coordinatorAlerts(studies, visits, queries, consents, tasks, crfs) {
  const alerts = [];
  visits.filter((v) => v.status === 'Due soon').forEach((v) => {
    alerts.push({ kind: 'visit', text: `Upcoming visit ${v.visit} · ${v.subjectId} · ${v.study.studyId}`, tone: 'Pending' });
  });
  visits.filter((v) => v.status === 'Overdue').forEach((v) => {
    alerts.push({ kind: 'overdue', text: `Overdue visit ${v.visit} · ${v.study.studyId}`, tone: 'Overdue' });
  });
  const overdueCrf = crfs.filter((c) => c.status === 'Overdue').length;
  if (overdueCrf) alerts.push({ kind: 'crf', text: `${overdueCrf} pending CRF(s) overdue for entry`, tone: 'Delayed' });
  const pendingCrf = crfs.filter((c) => c.status === 'Pending').length;
  if (pendingCrf) alerts.push({ kind: 'crf', text: `${pendingCrf} CRF(s) still pending data entry`, tone: 'Pending' });
  queries.filter((q) => q.status === 'Open').forEach((q) => {
    alerts.push({ kind: 'query', text: `Unresolved ${q.queryId} on ${q.study.studyId}`, tone: 'Review Required' });
  });
  consents.filter((c) => c.reConsentRequired).forEach((c) => {
    alerts.push({ kind: 'consent', text: `Consent update required · ${c.subjectId} · ${c.study.studyId}`, tone: 'Review Required' });
  });
  tasks.forEach((t) => {
    alerts.push({
      kind: 'task',
      text: `${t.task} · due ${t.dueDate} · ${t.study.studyId}`,
      tone: t.status === 'Urgent' || t.dueDate <= TODAY ? 'Urgent' : 'Pending',
    });
  });
  studies.forEach((s) => {
    (s.alerts || []).forEach((a) => {
      alerts.push({ kind: 'alert', text: `${a} · ${s.studyId}`, tone: 'Warning' });
    });
  });
  return alerts;
}

export function todayWorkItems(visits, tasks) {
  const visitItems = visits.map((v) => ({
    id: v.id,
    kind: 'visit',
    study: v.study,
    subjectId: v.subjectId,
    title: v.visit,
    date: v.scheduledDate,
    status: v.status,
    action: 'Log Visit',
  }));
  const taskItems = tasks.map((t) => ({
    id: `task-${t.study.studyId}-${t.task}`,
    kind: 'task',
    study: t.study,
    subjectId: t.study.shortTitle,
    title: t.task,
    date: t.dueDate,
    status: t.status === 'Urgent' ? 'Urgent' : t.status,
    action: 'Complete Task',
  }));
  return [...visitItems, ...taskItems].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}
