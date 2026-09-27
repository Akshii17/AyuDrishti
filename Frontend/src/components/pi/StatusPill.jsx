const STYLES = {
  Compliant: 'bg-mint text-mint-ink',
  Completed: 'bg-mint text-mint-ink',
  Active: 'bg-mint text-mint-ink',
  Resolved: 'bg-mint text-mint-ink',
  Pending: 'bg-amber-soft text-amber-ink',
  Recruiting: 'bg-amber-soft text-amber-ink',
  Open: 'bg-amber-soft text-amber-ink',
  'In Progress': 'bg-amber-soft text-amber-ink',
  'Review Required': 'bg-gold-soft text-gold-ink',
  'Renewal Required': 'bg-gold-soft text-gold-ink',
  Delayed: 'bg-gold-soft text-gold-ink',
  Warning: 'bg-gold-soft text-gold-ink',
  Urgent: 'bg-clay-soft text-clay',
  Overdue: 'bg-clay-soft text-clay',
  Consented: 'bg-mint text-mint-ink',
  'Requires Update': 'bg-gold-soft text-gold-ink',
  Valid: 'bg-mint text-mint-ink',
  'Expiring Soon': 'bg-gold-soft text-gold-ink',
  Withdrawn: 'bg-clay-soft text-clay',
};

export default function StatusPill({ status, text }) {
  const label = text || status || 'Pending';
  const cls = STYLES[status] || STYLES[label] || 'bg-amber-soft text-amber-ink';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {label}
    </span>
  );
}
