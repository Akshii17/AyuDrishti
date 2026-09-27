import { TODAY } from './piStudy';

export function daysUntil(dateStr, today = TODAY) {
  if (!dateStr) return null;
  const a = new Date(`${today}T00:00:00`);
  const b = new Date(`${dateStr}T00:00:00`);
  return Math.round((b - a) / 86400000);
}

export function ethicsBadge(study) {
  const ethics = study.ethicsRegulatory || {};
  const days = daysUntil(ethics.approvalExpiry);
  if (ethics.regulatoryStatus === 'Renewal Required' || (days !== null && days < 0)) {
    return 'Renewal Required';
  }
  if (ethics.regulatoryStatus === 'Review Required' || (days !== null && days <= 60)) {
    return 'Expiring Soon';
  }
  return 'Valid';
}

export function ethicsRows(studies) {
  return studies.map((study) => {
    const ethics = study.ethicsRegulatory || {};
    const days = daysUntil(ethics.approvalExpiry);
    const badge = ethicsBadge(study);
    return { study, ethics, days, badge };
  });
}

export function consentByStudy(study) {
  const records = study.consentRecords || [];
  const tallies = { consented: 0, pending: 0, withdrawn: 0, reconsent: 0 };
  records.forEach((c) => {
    const status = (c.consentStatus || '').toLowerCase();
    if (c.reConsentRequired) tallies.reconsent += 1;
    else if (status.includes('withdraw')) tallies.withdrawn += 1;
    else if (status === 'consented') tallies.consented += 1;
    else tallies.pending += 1;
  });
  return tallies;
}

export function amendmentRows(studies) {
  return studies
    .filter((s) => {
      const badge = ethicsBadge(s);
      const reconsent = (s.consentRecords || []).some((c) => c.reConsentRequired);
      return badge === 'Expiring Soon' || badge === 'Renewal Required' || reconsent;
    })
    .map((s) => {
      const protocolDoc = (s.documents || []).find((d) => d.toLowerCase().includes('protocol')) || 'Study Protocol';
      const reconsent = (s.consentRecords || []).some((c) => c.reConsentRequired);
      const sae = (s.safety?.pendingSafetyReviews || 0) > 0;
      let reason = (s.alerts || [])[0] || s.ethicsRegulatory?.regulatoryStatus || 'Committee review requested';
      if (reconsent) reason = 'Updated consent / re-consent trigger';
      if (sae) reason = `${reason}; new safety information`;
      return {
        study: s,
        title: protocolDoc,
        version: (s.consentRecords || [])[0]?.icfVersion || 'Protocol dossier',
        submitted: s.ethicsRegulatory?.approvalDate || s.startDate,
        reason,
        priority: ethicsBadge(s) === 'Renewal Required' || sae ? 'Urgent' : 'Review Required',
        status: s.ethicsRegulatory?.regulatoryStatus || 'Review Required',
      };
    });
}

export function continuingReviews(studies) {
  return ethicsRows(studies)
    .map((row) => ({
      ...row,
      type: row.days !== null && row.days < 0 ? 'Overdue annual / continuing review' : 'Annual continuing review',
      status: row.days !== null && row.days < 0 ? 'Overdue' : row.days <= 45 ? 'Expiring Soon' : 'Pending',
    }))
    .sort((a, b) => (a.days ?? 9999) - (b.days ?? 9999));
}

export function ethicsDeviations(studies) {
  return studies
    .filter((s) => (s.protocolDeviations?.open || 0) > 0 || (s.protocolDeviations?.major || 0) > 0)
    .map((s) => {
      const major = s.protocolDeviations?.major || 0;
      const open = s.protocolDeviations?.open || 0;
      const relevant = major > 0 || open >= 2;
      return {
        study: s,
        site: s.sites?.[0]?.name,
        severity: major > 0 ? 'Major' : 'Minor',
        count: s.protocolDeviations?.total || open,
        open,
        ethicsRelevance: relevant ? 'Committee attention' : 'Site log only',
        status: open > 0 ? 'Open' : 'Completed',
        highlight: relevant,
      };
    });
}

export function reconsentTriggers(studies) {
  const items = [];
  studies.forEach((s) => {
    const needs = (s.consentRecords || []).some((c) => c.reConsentRequired);
    if (!needs) return;
    if (ethicsBadge(s) !== 'Valid') {
      items.push({ study: s, trigger: 'Protocol amendment', detail: s.ethicsRegulatory?.regulatoryStatus });
    }
    items.push({ study: s, trigger: 'Updated consent form', detail: (s.consentRecords || [])[0]?.icfVersion });
    if ((s.safety?.pendingSafetyReviews || 0) > 0 || (s.safety?.seriousAdverseEvents || 0) > 0) {
      items.push({ study: s, trigger: 'New safety information', detail: `${s.safety?.seriousAdverseEvents || 0} SAE dossier` });
    }
  });
  return items;
}

export function ethicsActions(studies) {
  const actions = [];
  amendmentRows(studies).forEach((a) => {
    actions.push({
      kind: 'amendment',
      label: 'Review Amendment',
      study: a.study,
      detail: `${a.title} · ${a.study.studyId}`,
      tone: a.priority,
    });
  });
  ethicsRows(studies)
    .filter((r) => r.badge === 'Renewal Required' || (r.days !== null && r.days < 0))
    .forEach((r) => {
      actions.push({
        kind: 'renewal',
        label: 'Review IEC Renewal',
        study: r.study,
        detail: `${r.ethics.approvalNumber} expires ${r.ethics.approvalExpiry}`,
        tone: 'Renewal Required',
      });
    });
  studies
    .filter((s) => (s.safety?.pendingSafetyReviews || 0) > 0 || (s.safety?.seriousAdverseEvents || 0) > 0)
    .forEach((s) => {
      actions.push({
        kind: 'sae',
        label: 'Review SAE Summary',
        study: s,
        detail: `${s.safety?.seriousAdverseEvents || 0} SAE · ${s.safety?.pendingSafetyReviews || 0} pending ethics note`,
        tone: 'Urgent',
      });
    });
  ethicsDeviations(studies)
    .filter((d) => d.highlight)
    .forEach((d) => {
      actions.push({
        kind: 'deviation',
        label: 'Review Ethics-Relevant Deviation',
        study: d.study,
        detail: `${d.severity} · ${d.open} open at ${d.site}`,
        tone: 'Review Required',
      });
    });
  continuingReviews(studies)
    .filter((r) => r.status === 'Overdue' || r.status === 'Expiring Soon')
    .forEach((r) => {
      actions.push({
        kind: 'continuing',
        label: 'Review Continuing Report',
        study: r.study,
        detail: `${r.type} · ${r.ethics.approvalExpiry}`,
        tone: r.status,
      });
    });
  return actions;
}
