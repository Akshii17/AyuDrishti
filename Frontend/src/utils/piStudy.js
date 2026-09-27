export const TODAY = '2026-09-26';

export const LIFECYCLE_STAGES = [
  { key: 'Protocol Approval', aliases: ['Protocol Approval'] },
  { key: 'Ethics Approval', aliases: ['Ethics Approval'] },
  { key: 'CTRI Registration', aliases: ['CTRI Registration'] },
  { key: 'Site Activation', aliases: ['Site Activation'] },
  { key: 'Recruitment', aliases: ['Recruitment'] },
  { key: 'Data Collection', aliases: ['Data Collection'] },
  { key: 'Analysis', aliases: ['Analysis'] },
  { key: 'Close-out', aliases: ['Close-out', 'Study Close-out'] },
];

export function enrollmentPct(study) {
  const enrolled = study.participants?.enrolled || 0;
  const target = study.participants?.target || 1;
  return Math.round((enrolled / target) * 100);
}

export function currentLifecycleStage(study) {
  const inFlight = (study.milestones || []).find(
    (m) => m.status === 'In Progress' || m.status === 'Delayed'
  );
  if (inFlight) return inFlight.name === 'Study Close-out' ? 'Close-out' : inFlight.name;
  const pending = (study.milestones || []).find((m) => m.status === 'Pending');
  if (pending) return pending.name === 'Study Close-out' ? 'Close-out' : pending.name;
  return study.status;
}

export function classifyStudyHealth(study) {
  if (study.status === 'Near Completion') return 'Near Completion';
  if (study.status === 'Recruiting') return 'Recruiting';
  if (study.status === 'Delayed') return 'Delayed';
  const delayedMilestone = (study.milestones || []).some((m) => m.status === 'Delayed');
  if (delayedMilestone) return 'Delayed';
  return study.status || 'Active';
}

export function studyNeedsAttention(study) {
  const ethics = study.ethicsRegulatory?.regulatoryStatus;
  return (
    classifyStudyHealth(study) === 'Delayed' ||
    ethics === 'Review Required' ||
    ethics === 'Renewal Required' ||
    (study.protocolDeviations?.open || 0) > 0 ||
    (study.dataQuality?.overdueQueries || 0) > 0 ||
    (study.monitoring?.overdueVisits || 0) > 0 ||
    (study.safety?.pendingSafetyReviews || 0) > 0 ||
    (study.alerts || []).length > 0
  );
}

function findMilestone(study, aliases) {
  return (study.milestones || []).find((m) => aliases.includes(m.name));
}

function plannedAnchor(study, key) {
  const ethics = study.ethicsRegulatory || {};
  const firstSite = study.sites?.[0];
  switch (key) {
    case 'Protocol Approval':
      return study.startDate;
    case 'Ethics Approval':
      return ethics.approvalDate || study.startDate;
    case 'CTRI Registration':
      return ethics.ctriRegistrationDate || study.startDate;
    case 'Site Activation':
      return firstSite?.activationDate || study.startDate;
    case 'Recruitment':
      return study.startDate;
    case 'Data Collection':
      return study.startDate;
    case 'Analysis':
      return study.expectedEndDate;
    case 'Close-out':
      return study.expectedEndDate;
    default:
      return study.expectedEndDate;
  }
}

export function getLifecycle(study) {
  return LIFECYCLE_STAGES.map((stage) => {
    const found = findMilestone(study, stage.aliases);
    const actual = found?.date || null;
    const planned = actual || plannedAnchor(study, stage.key);
    const status = found?.status || 'Pending';
    const isDelayed = status === 'Delayed';
    const isUpcoming = status === 'In Progress' || status === 'Pending';
    const isOverdue =
      isDelayed ||
      (isUpcoming && planned && planned < TODAY && status !== 'Completed');
    return {
      key: stage.key,
      status,
      planned,
      actual,
      isDelayed,
      isUpcoming,
      isOverdue,
    };
  });
}

export function milestoneAttentionCount(studies) {
  return studies.reduce((acc, study) => {
    const life = getLifecycle(study);
    return acc + life.filter((step) => step.isOverdue || step.isUpcoming).length;
  }, 0);
}

export function getDeviationRows(study) {
  const fromAudit = (study.auditTrail || [])
    .filter((entry) => (entry.action || '').toLowerCase().includes('deviation'))
    .map((entry, index) => ({
      id: entry.auditId || `DEV-AUDIT-${index}`,
      source: 'Audit trail',
      detail: `${entry.entityModified}: ${entry.newValue}`,
      reason: entry.reasonForChange,
      status: 'Review Required',
      type: study.protocolDeviations?.major > 0 && index === 0 ? 'Major' : 'Minor',
    }));

  const rows = [...fromAudit];
  const open = study.protocolDeviations?.open || 0;
  const major = study.protocolDeviations?.major || 0;
  const minorOpen = Math.max(0, open - (major > 0 ? 1 : 0));

  if (open > rows.length) {
    if (major > 0 && !rows.some((r) => r.type === 'Major')) {
      rows.push({
        id: `${study.studyId}-MAJ`,
        source: 'Protocol deviations',
        detail: `${major} major deviation(s) remain open`,
        reason: (study.alerts || [])[0] || 'Requires PI review and sign-off',
        status: 'Review Required',
        type: 'Major',
      });
    }
    if (minorOpen > 0) {
      rows.push({
        id: `${study.studyId}-MIN`,
        source: 'Protocol deviations',
        detail: `${study.protocolDeviations.open} open / ${study.protocolDeviations.total} total (${study.protocolDeviations.minor} minor)`,
        reason: 'Site-level protocol window or procedure variance',
        status: 'Pending',
        type: 'Minor',
      });
    }
  }

  if (rows.length === 0 && (study.protocolDeviations?.total || 0) > 0) {
    rows.push({
      id: `${study.studyId}-RES`,
      source: 'Protocol deviations',
      detail: `${study.protocolDeviations.resolved} resolved of ${study.protocolDeviations.total} logged`,
      reason: 'No open deviations',
      status: 'Completed',
      type: 'Minor',
    });
  }

  return rows;
}

export function getDocumentRows(study) {
  return (study.documents || []).map((name) => {
    const ethics = study.ethicsRegulatory?.regulatoryStatus;
    const isProtocol = name.toLowerCase().includes('protocol');
    const needsAmendment = isProtocol && (ethics === 'Review Required' || ethics === 'Renewal Required');
    const needsSignature =
      name.toLowerCase().includes('consent') &&
      (study.consentRecords || []).some((c) => c.reConsentRequired);
    let status = 'Compliant';
    if (needsAmendment) status = 'Review Required';
    else if (needsSignature) status = 'Pending';
    else if (name.toLowerCase().includes('monitoring') && (study.monitoring?.overdueVisits || 0) > 0) {
      status = 'Delayed';
    }
    return { name, status, needsAmendment, needsSignature };
  });
}

export function collectPiActions(studies) {
  const actions = [];

  studies.forEach((study) => {
    if ((study.protocolDeviations?.open || 0) > 0) {
      actions.push({
        id: `dev-${study.studyId}`,
        kind: 'deviation',
        study,
        label: 'Review deviation',
        detail: `${study.protocolDeviations.open} open on ${study.studyId}`,
        badge: 'Review Required',
      });
    }

    (study.queriesList || [])
      .filter((q) => q.status === 'Open' || q.status === 'Pending')
      .forEach((q) => {
        actions.push({
          id: `qry-${study.studyId}-${q.queryId}`,
          kind: 'query',
          study,
          label: 'Approve data-query resolution',
          detail: `${q.queryId} · ${q.issue}`,
          badge: q.assignedTo === 'Principal Investigator' ? 'Pending' : 'Review Required',
        });
      });

    if ((study.dataQuality?.openQueries || 0) > 0 && !(study.queriesList || []).some((q) => q.status === 'Open')) {
      actions.push({
        id: `qsum-${study.studyId}`,
        kind: 'query',
        study,
        label: 'Approve data-query resolution',
        detail: `${study.dataQuality.openQueries} open queries on ${study.studyId}`,
        badge: (study.dataQuality.overdueQueries || 0) > 0 ? 'Delayed' : 'Pending',
      });
    }

    getDocumentRows(study)
      .filter((doc) => doc.needsSignature)
      .forEach((doc) => {
        actions.push({
          id: `sign-${study.studyId}-${doc.name}`,
          kind: 'sign',
          study,
          label: 'Sign document',
          detail: `${doc.name} · ${study.studyId}`,
          badge: 'Pending',
        });
      });

    getDocumentRows(study)
      .filter((doc) => doc.needsAmendment)
      .forEach((doc) => {
        actions.push({
          id: `amd-${study.studyId}-${doc.name}`,
          kind: 'amendment',
          study,
          label: 'Approve amendment',
          detail: `${doc.name} · ${study.ethicsRegulatory?.regulatoryStatus}`,
          badge: study.ethicsRegulatory?.regulatoryStatus || 'Review Required',
        });
      });

    if ((study.safety?.pendingSafetyReviews || 0) > 0 || (study.adverseEventsList || []).some((ae) => (ae.status || '').toLowerCase().includes('pending'))) {
      actions.push({
        id: `sae-${study.studyId}`,
        kind: 'safety',
        study,
        label: 'Review safety event',
        detail: `${study.safety?.pendingSafetyReviews || 0} pending · ${study.safety?.seriousAdverseEvents || 0} SAE`,
        badge: (study.safety?.seriousAdverseEvents || 0) > 0 ? 'Urgent' : 'Pending',
      });
    }

    (study.tasks || [])
      .filter((t) => t.assignedTo === 'Principal Investigator' && t.status !== 'Completed')
      .forEach((t, i) => {
        actions.push({
          id: `task-${study.studyId}-${i}`,
          kind: t.task.toLowerCase().includes('recruit') ? 'deviation' : 'sign',
          study,
          label: t.task,
          detail: `Due ${t.dueDate}`,
          badge: t.status === 'Urgent' ? 'Urgent' : 'Pending',
        });
      });
  });

  return actions;
}

export function funnelTotals(studies) {
  return studies.reduce(
    (acc, s) => {
      acc.screened += s.participants?.screened || 0;
      acc.eligible += s.participants?.eligible || 0;
      acc.enrolled += s.participants?.enrolled || 0;
      acc.randomized += s.participants?.randomized || 0;
      acc.completed += s.participants?.completed || 0;
      return acc;
    },
    { screened: 0, eligible: 0, enrolled: 0, randomized: 0, completed: 0 }
  );
}

export function healthDistribution(studies) {
  const buckets = { Active: 0, Recruiting: 0, Delayed: 0, 'Near Completion': 0 };
  studies.forEach((s) => {
    const key = classifyStudyHealth(s);
    if (buckets[key] !== undefined) buckets[key] += 1;
    else buckets.Active += 1;
  });
  return buckets;
}
