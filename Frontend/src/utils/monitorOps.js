import { TODAY } from './piStudy';

function splitCount(total, parts, index) {
  if (!parts) return 0;
  const base = Math.floor((total || 0) / parts);
  const rem = (total || 0) % parts;
  return base + (index < rem ? 1 : 0);
}

export function dayAge(dateStr, today = TODAY) {
  if (!dateStr) return 0;
  const a = new Date(`${dateStr}T00:00:00`);
  const b = new Date(`${today}T00:00:00`);
  return Math.max(0, Math.round((b - a) / 86400000));
}

export function ageBucket(days) {
  if (days <= 7) return '0–7 days';
  if (days <= 14) return '8–14 days';
  if (days <= 30) return '15–30 days';
  return '30+ days';
}

export function flattenSites(studies) {
  const rows = [];
  studies.forEach((study) => {
    const sites = study.sites || [];
    const n = sites.length || 1;
    sites.forEach((site, i) => {
      const enrolled = splitCount(study.participants?.enrolled, n, i);
      const target = splitCount(study.participants?.target, n, i);
      const screened = splitCount(study.participants?.screened, n, i);
      const eligible = splitCount(study.participants?.eligible, n, i);
      const pct = target ? Math.round((enrolled / target) * 100) : 0;
      const unverified = (study.queriesList || []).filter((q) => {
        if (q.sdvStatus !== 'Unverified') return false;
        return q.siteId ? q.siteId === site.siteId : i === 0;
      }).length;
      const verified = (study.queriesList || []).filter((q) => {
        if (q.sdvStatus !== 'Verified') return false;
        return q.siteId ? q.siteId === site.siteId : i === 0;
      }).length;
      const openDev = study.protocolDeviations?.open || 0;
      const overdue = study.monitoring?.overdueVisits || 0;
      const ethics = study.ethicsRegulatory?.regulatoryStatus || 'Compliant';
      const behind = pct < 60;
      const attention = behind || overdue > 0 || openDev > 1 || unverified > 0 || ethics !== 'Compliant';
      rows.push({
        study,
        site,
        enrolled,
        target,
        screened,
        eligible,
        pct,
        unverified,
        verified,
        sdvTotal: unverified + verified,
        openDev: splitCount(openDev, n, i) || (i === 0 ? openDev : 0),
        overdue: i === 0 ? overdue : 0,
        upcoming: i === 0 ? (study.monitoring?.upcomingVisits || 0) : 0,
        completedVisits: i === 0 ? (study.monitoring?.completedVisits || 0) : 0,
        ethics,
        behind,
        attention,
        status: attention ? (overdue ? 'Delayed' : 'Review Required') : site.status || 'Active',
      });
    });
  });
  return rows;
}

export function monitoringVisits(siteRows) {
  const visits = [];
  siteRows.forEach((row) => {
    const monitor = row.site.investigator;
    const site = row.site;
    const study = row.study;
    if (row.completedVisits > 0) {
      visits.push({
        id: `${study.studyId}-${site.siteId}-past`,
        study,
        site,
        monitor,
        date: site.activationDate || study.startDate,
        status: 'Completed',
        kind: 'past',
      });
    }
    for (let i = 0; i < row.upcoming; i += 1) {
      const due = (study.tasks || []).find((t) => t.dueDate)?.dueDate || study.expectedEndDate;
      visits.push({
        id: `${study.studyId}-${site.siteId}-up-${i}`,
        study,
        site,
        monitor,
        date: due,
        status: 'Pending',
        kind: 'upcoming',
      });
    }
    for (let i = 0; i < row.overdue; i += 1) {
      visits.push({
        id: `${study.studyId}-${site.siteId}-od-${i}`,
        study,
        site,
        monitor,
        date: TODAY,
        status: 'Overdue',
        kind: 'overdue',
      });
    }
  });
  const rank = { overdue: 0, upcoming: 1, past: 2 };
  return visits.sort((a, b) => rank[a.kind] - rank[b.kind] || (a.date || '').localeCompare(b.date || ''));
}

export function monitorQueries(studies, siteRows) {
  const siteById = new Map(siteRows.map((r) => [r.site.siteId, r]));
  return studies.flatMap((study) =>
    (study.queriesList || []).map((q) => {
      const row = siteById.get(q.siteId) || siteRows.find((r) => r.study.studyId === study.studyId);
      const age = dayAge(q.raisedDate);
      return {
        ...q,
        study,
        site: row?.site,
        age,
        bucket: ageBucket(age),
      };
    })
  );
}

export function monitorDeviations(studies, siteRows) {
  const rows = [];
  studies.forEach((study) => {
    const primary = siteRows.find((r) => r.study.studyId === study.studyId);
    (study.auditTrail || [])
      .filter((a) => (a.action || '').toLowerCase().includes('deviation'))
      .forEach((a) => {
        rows.push({
          id: a.auditId,
          study,
          site: primary?.site,
          detail: a.newValue || a.entityModified,
          severity: (a.newValue || '').toLowerCase().includes('window') ? 'Minor' : 'Major',
          date: (a.timestamp || '').slice(0, 10),
          status: 'Open',
        });
      });
    if ((study.protocolDeviations?.open || 0) > 0 && !rows.some((r) => r.study.studyId === study.studyId)) {
      rows.push({
        id: `${study.studyId}-open-dev`,
        study,
        site: primary?.site,
        detail: `${study.protocolDeviations.open} open deviation(s)`,
        severity: (study.protocolDeviations.major || 0) > 0 ? 'Major' : 'Minor',
        date: study.startDate,
        status: 'Open',
      });
    }
  });
  return rows;
}

export function siteFlags(siteRows, queries) {
  const flags = [];
  siteRows.forEach((row) => {
    if (row.behind) {
      flags.push({
        site: row.site,
        study: row.study,
        issue: `Recruitment below target (${row.pct}%)`,
        severity: row.pct < 40 ? 'Urgent' : 'Delayed',
        date: TODAY,
        action: 'Review Site',
      });
    }
    if (row.overdue > 0) {
      flags.push({
        site: row.site,
        study: row.study,
        issue: `${row.overdue} overdue monitoring visit(s)`,
        severity: 'Overdue',
        date: TODAY,
        action: 'Schedule Monitoring Visit',
      });
    }
    if ((row.study.protocolDeviations?.open || 0) > 1 || (row.study.protocolDeviations?.major || 0) > 0) {
      flags.push({
        site: row.site,
        study: row.study,
        issue: `High protocol deviations (open ${row.study.protocolDeviations.open})`,
        severity: 'Review Required',
        date: TODAY,
        action: 'View Deviations',
      });
    }
    if (row.unverified > 0 && row.sdvTotal > 0 && row.verified / row.sdvTotal < 0.5) {
      flags.push({
        site: row.site,
        study: row.study,
        issue: `Poor source-data verification (${row.verified}/${row.sdvTotal})`,
        severity: 'Review Required',
        date: TODAY,
        action: 'Review Site',
      });
    }
  });
  queries.filter((q) => q.age >= 15 && q.status === 'Open').forEach((q) => {
    flags.push({
      site: q.site,
      study: q.study,
      issue: `Aging data query ${q.queryId} (${q.age} days)`,
      severity: q.age >= 30 ? 'Urgent' : 'Delayed',
      date: q.raisedDate,
      action: 'Review Data Queries',
    });
  });
  return flags;
}

export function sdvSummary(siteRows) {
  const verified = siteRows.reduce((a, r) => a + r.verified, 0);
  const pending = siteRows.reduce((a, r) => a + r.unverified, 0);
  const total = verified + pending;
  return { verified, pending, total, pct: total ? Math.round((verified / total) * 100) : 0 };
}
