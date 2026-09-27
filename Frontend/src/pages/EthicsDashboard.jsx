import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { FileSearch, Gavel, ShieldAlert } from 'lucide-react';
import StatusPill from '../components/pi/StatusPill';
import {
  ActionChip,
  AsideRail,
  C,
  KpiGrid,
  PageHead,
  PageShell,
  Panel,
  RailCard,
  ScrollBox,
  TableWrap,
  td,
  th,
} from '../components/common/RoleChrome';
import {
  amendmentRows,
  consentByStudy,
  continuingReviews,
  ethicsActions,
  ethicsDeviations,
  ethicsRows,
  reconsentTriggers,
} from '../utils/ethicsOps';

const PIE_COLORS = {
  Valid: '#84A98C',
  'Expiring Soon': '#D48C46',
  'Renewal Required': '#C86D51',
};

export default function EthicsDashboard({ studies, onOpenIec }) {
  const rows = useMemo(() => ethicsRows(studies), [studies]);
  const amendments = useMemo(() => amendmentRows(studies), [studies]);
  const reviews = useMemo(() => continuingReviews(studies), [studies]);
  const deviations = useMemo(() => ethicsDeviations(studies), [studies]);
  const actions = useMemo(() => ethicsActions(studies), [studies]);
  const triggers = useMemo(() => reconsentTriggers(studies), [studies]);

  const [docket, setDocket] = useState(null);
  const [cleared, setCleared] = useState({});

  const valid = rows.filter((r) => r.badge === 'Valid').length;
  const expiring = rows.filter((r) => r.badge === 'Expiring Soon').length;
  const renewal = rows.filter((r) => r.badge === 'Renewal Required').length;
  const continuingDue = reviews.filter((r) => r.status === 'Overdue' || r.status === 'Expiring Soon').length;
  const ethicsDevOpen = deviations.filter((d) => d.highlight && d.open > 0).length;
  const saeTotal = studies.reduce((a, s) => a + (s.safety?.seriousAdverseEvents || 0), 0);
  const saeEthics = studies.reduce((a, s) => a + (s.safety?.pendingSafetyReviews || 0), 0);
  const saeStudies = studies.filter((s) => (s.safety?.seriousAdverseEvents || 0) > 0).length;

  const consentTotals = studies.reduce(
    (acc, s) => {
      const t = consentByStudy(s);
      acc.consented += t.consented;
      acc.pending += t.pending;
      acc.withdrawn += t.withdrawn;
      acc.reconsent += t.reconsent;
      return acc;
    },
    { consented: 0, pending: 0, withdrawn: 0, reconsent: 0 }
  );

  const pieData = [
    { name: 'Valid', value: valid },
    { name: 'Expiring Soon', value: expiring },
    { name: 'Renewal Required', value: renewal },
  ].filter((d) => d.value > 0);

  const amendmentChart = studies.map((s) => ({
    name: s.shortTitle.replace('AYU-', ''),
    pending: amendments.filter((a) => a.study.studyId === s.studyId).length,
  }));

  const consentChart = studies.map((s) => {
    const t = consentByStudy(s);
    return {
      name: s.shortTitle.replace('AYU-', ''),
      Consented: t.consented,
      Pending: t.pending,
      Withdrawn: t.withdrawn,
      'Re-consent Required': t.reconsent,
    };
  });

  const deadlineChart = [...rows]
    .sort((a, b) => (a.days ?? 0) - (b.days ?? 0))
    .map((r) => ({
      name: r.study.shortTitle.replace('AYU-', ''),
      days: r.days,
    }));

  const saeTrend = studies.map((s) => ({
    name: s.shortTitle.replace('AYU-', ''),
    SAE: s.safety?.seriousAdverseEvents || 0,
    'Ethics review': s.safety?.pendingSafetyReviews || 0,
  }));

  const openDocket = (item) => setDocket(item);
  const liveActions = actions.filter((a) => !cleared[`${a.kind}-${a.study.studyId}-${a.label}`]);

  return (
    <PageShell
      header={
        <PageHead
          kicker="Ethics review & compliance"
          title="Institutional Ethics Committee"
          subtitle="Review → oversight → approval → compliance → deadlines. AIIA IEC docket from the study registry."
          extra={
            <>
              <StatusPill status="Compliant" text="IEC chamber" />
              <StatusPill status="Pending" text={`${liveActions.length} on docket`} />
              <ActionChip kind="ghost" onClick={onOpenIec}>Open IEC pipeline</ActionChip>
            </>
          }
        />
      }
      aside={
        <AsideRail title="Requires your attention">
          {liveActions.slice(0, 14).map((a, i) => (
            <RailCard
              key={`${a.kind}-${a.study.studyId}-${i}`}
              onClick={() => {
                openDocket(a);
                setCleared((c) => ({ ...c, [`${a.kind}-${a.study.studyId}-${a.label}`]: true }));
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: C.forest }}>
                <Gavel size={13} color={C.sageDeep} />
                {a.label}
              </span>
              <span style={{ fontSize: 11, lineHeight: 1.4, color: C.muted }}>{a.detail}</span>
              <StatusPill status={a.tone} />
            </RailCard>
          ))}
        </AsideRail>
      }
    >
      <KpiGrid
        items={[
          { label: 'Active ethics approvals', value: valid + expiring, sub: 'Valid or still in window', accent: C.sage },
          { label: 'Approvals expiring soon', value: expiring, sub: 'Within 45 days', accent: C.gold },
          { label: 'Amendments awaiting review', value: amendments.length, sub: 'Protocol / ICF change', accent: C.clay },
          { label: 'Studies requiring attention', value: expiring + renewal, sub: 'Expiry or renewal', accent: C.gold },
          { label: 'Continuing reviews due', value: continuingDue, sub: 'Annual / progress reports', accent: C.sage },
          { label: 'Open ethics-relevant deviations', value: ethicsDevOpen, sub: 'Committee-level only', accent: C.clay },
        ]}
      />

      <div className="pi-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
        <Panel title="Ethics approval status" subtitle="Valid · Expiring soon · Renewal required">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={84} paddingAngle={2}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Protocol amendments pending" subtitle="Count of pending amendments by study">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={amendmentChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4A373" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="pending" name="Pending amendments" fill="#C86D51" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Ethics approval overview" subtitle="IEC numbers and validity from the registry.">
        <TableWrap height={300}>
          <thead>
            <tr>
              {['Study', 'IEC approval no.', 'Approval date', 'Valid until', 'Status', 'Action'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.study.studyId}>
                <td style={td}>
                  <div style={{ fontWeight: 600, color: C.forest }}>{r.study.studyId}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{r.study.title}</div>
                </td>
                <td style={{ ...td, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{r.ethics.approvalNumber}</td>
                <td style={td}>{r.ethics.approvalDate}</td>
                <td style={td}>{r.ethics.approvalExpiry}</td>
                <td style={td}><StatusPill status={r.badge} /></td>
                <td style={td}>
                  <ActionChip onClick={() => openDocket({ kind: 'renewal', label: 'Review IEC Renewal', study: r.study, detail: r.ethics.approvalNumber, tone: r.badge })}>
                    View / Review
                  </ActionChip>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="pi-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
        <Panel title="Consent overview" subtitle="Consented · Pending · Withdrawn · Re-consent">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consentChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4A373" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Consented" stackId="c" fill="#84A98C" />
                <Bar dataKey="Pending" stackId="c" fill="#D4A373" />
                <Bar dataKey="Withdrawn" stackId="c" fill="#C86D51" />
                <Bar dataKey="Re-consent Required" stackId="c" fill="#D48C46" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Ethics deadlines" subtitle="Days remaining to approval expiry. Negative values are overdue.">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={deadlineChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4A373" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="days" name="Days remaining" stroke="#6B9080" strokeWidth={2} dot={{ r: 4, fill: '#C86D51' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Amendments awaiting review">
        <TableWrap height={260}>
          <thead>
            <tr>
              {['Study', 'Amendment', 'Submitted', 'Reason', 'Priority', 'Review status', 'Action'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {amendments.map((a) => (
              <tr key={a.study.studyId}>
                <td style={{ ...td, fontWeight: 600 }}>{a.study.studyId}</td>
                <td style={td}>{a.title} · {a.version}</td>
                <td style={td}>{a.submitted}</td>
                <td style={td}>{a.reason}</td>
                <td style={td}><StatusPill status={a.priority} /></td>
                <td style={td}><StatusPill status={a.status} /></td>
                <td style={td}>
                  <ActionChip onClick={() => openDocket({ kind: 'amendment', label: 'Review Amendment', study: a.study, detail: a.reason, tone: a.priority })}>
                    Review amendment
                  </ActionChip>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="pi-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }}>
        <Panel title="Consent oversight">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, marginBottom: 12 }}>
            {[
              ['Consented', consentTotals.consented, 'Consented'],
              ['Pending', consentTotals.pending, 'Pending'],
              ['Withdrawn', consentTotals.withdrawn, 'Withdrawn'],
              ['Re-consent required', consentTotals.reconsent, 'Requires Update'],
            ].map(([l, n, st]) => (
              <div key={l} style={{ background: C.sand, borderRadius: 10, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.forest }}>{n}</div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.muted, margin: '4px 0 6px' }}>{l}</div>
                <StatusPill status={st} />
              </div>
            ))}
          </div>
          <h4 style={{ margin: '0 0 8px', fontSize: 13, color: C.forest }}>Re-consent triggers</h4>
          <ScrollBox height={140}>
            {triggers.length === 0 && <p style={{ fontSize: 12, color: C.muted }}>No re-consent flags in the current registry sitting.</p>}
            {triggers.map((t, i) => (
              <div key={`${t.study.studyId}-${t.trigger}-${i}`} style={{ padding: '8px 0', borderBottom: '1px solid rgba(212,163,115,0.4)', fontSize: 12 }}>
                <span style={{ fontWeight: 600, color: C.forest }}>{t.trigger}</span>
                <span style={{ color: C.muted }}> · {t.study.studyId} · {t.detail}</span>
              </div>
            ))}
          </ScrollBox>
        </Panel>

        <Panel title="SAE summary for ethics" subtitle="Committee-level only — no subject-level operational listing.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: C.forest }}>
            <ShieldAlert size={16} color={C.clay} /> Safety docket
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, textAlign: 'center', marginBottom: 12 }}>
            <div style={{ background: C.sand, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.forest }}>{saeTotal}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.muted }}>Total SAE reports</div>
            </div>
            <div style={{ background: C.sand, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.clay }}>{saeEthics}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.muted }}>Requiring ethics review</div>
            </div>
            <div style={{ background: C.sand, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.forest }}>{saeStudies}</div>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: C.muted }}>Studies with SAE activity</div>
            </div>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={saeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4A373" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="SAE" fill="#C86D51" />
                <Bar dataKey="Ethics review" fill="#D48C46" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Ethics-relevant protocol deviations">
        <TableWrap height={260}>
          <thead>
            <tr>
              {['Study', 'Site', 'Severity', 'No. of deviations', 'Ethics relevance', 'Status'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deviations.map((d) => (
              <tr key={d.study.studyId} style={{ background: d.highlight ? 'rgba(248,234,230,0.7)' : 'transparent' }}>
                <td style={{ ...td, fontWeight: 600 }}>{d.study.studyId}</td>
                <td style={td}>{d.site}</td>
                <td style={td}>{d.severity}</td>
                <td style={td}>{d.count} (open {d.open})</td>
                <td style={td}>{d.ethicsRelevance}</td>
                <td style={td}><StatusPill status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <Panel sand title="Continuing review / annual reports">
        <TableWrap height={260}>
          <thead>
            <tr>
              {['Study', 'Review / report type', 'Due date', 'Days remaining', 'Status'].map((h) => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr
                key={r.study.studyId}
                style={{
                  background: r.days < 0 ? 'rgba(248,234,230,0.7)' : r.days <= 45 ? 'rgba(247,238,223,0.8)' : 'transparent',
                }}
              >
                <td style={{ ...td, fontWeight: 600 }}>{r.study.studyId}</td>
                <td style={td}>{r.type}</td>
                <td style={td}>{r.ethics.approvalExpiry}</td>
                <td style={{ ...td, fontWeight: 700 }}>{r.days}</td>
                <td style={td}><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      {docket && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'grid', placeItems: 'center', background: 'rgba(26,34,30,0.4)', padding: 16 }}
          onClick={() => setDocket(null)}
        >
          <div
            style={{ width: '100%', maxWidth: 480, background: C.cream, border: `1px solid ${C.ochre}`, borderRadius: 12, padding: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.sageDeep }}>IEC sitting note</p>
            <h3 style={{ margin: '6px 0 0', fontSize: 18, color: C.forest }}>{docket.label}</h3>
            <p style={{ marginTop: 8, fontSize: 14 }}>{docket.study?.title}</p>
            <p style={{ marginTop: 4, fontSize: 12, color: C.muted }}>{docket.study?.studyId} · {docket.detail}</p>
            <p style={{ marginTop: 12, fontSize: 12, color: C.muted }}>
              Committee review recorded for this demo sitting. Final minute remains with the IEC chair — this desk does not replace the full IEC pipeline.
            </p>
            <div style={{ marginTop: 16 }}>
              <ActionChip onClick={() => setDocket(null)}>
                <FileSearch size={14} /> Close docket
              </ActionChip>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
