import React from 'react';

export default function Badge({ status, text }) {
  const getBadgeClass = (statusType) => {
    if (!statusType) return 'badge-pending';
    
    const normalized = statusType.toLowerCase();

    // Active / Compliant / Completed -> Green Mint Badge
    if (['active', 'compliant', 'completed', 'resolved', 'site activation'].includes(normalized)) {
      return 'badge-active';
    }

    // Pending / In Review / Recruiting / In Progress -> Amber/Sand Tint Badge
    if (['in progress', 'pending', 'recruiting', 'in review', 'open'].includes(normalized)) {
      return 'badge-pending';
    }

    // Warning / Renewal Due -> Muted Gold Badge
    if (['renewal required', 'review required', 'warning', 'delayed'].includes(normalized)) {
      return 'badge-warning';
    }

    // Urgent / SAE Flagged / Overdue -> Terracotta Red Badge
    if (['urgent', 'sae flagged', 'non-compliant', 'overdue', 'life-threatening'].includes(normalized)) {
      return 'badge-urgent';
    }

    return 'badge-pending';
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {text || status}
    </span>
  );
}