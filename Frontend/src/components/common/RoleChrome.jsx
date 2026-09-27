import React from 'react';

export const C = {
  forest: '#1A221E',
  muted: '#5A6A70',
  sage: '#84A98C',
  sageDeep: '#6B9080',
  ochre: '#D4A373',
  cream: '#FAF8F5',
  oat: '#EFEAD8',
  linen: '#EFE8D8',
  sand: '#F4F0EA',
  clay: '#C86D51',
  gold: '#D48C46',
};

export const th = {
  padding: '12px 14px',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: C.muted,
  background: C.linen,
  borderBottom: `1px solid ${C.ochre}`,
  position: 'sticky',
  top: 0,
  zIndex: 1,
};

export const td = {
  padding: '12px 14px',
  borderBottom: '1px solid rgba(212,163,115,0.4)',
  fontSize: 13,
  verticalAlign: 'top',
};

export function PageHead({ kicker, title, subtitle, extra }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        marginBottom: 20,
        paddingBottom: 16,
        borderBottom: `2px solid ${C.sage}`,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: C.sageDeep,
            marginBottom: 6,
          }}
        >
          {kicker}
        </div>
        <h1 style={{ margin: 0, fontSize: 28, color: C.forest, letterSpacing: '-0.04em' }}>{title}</h1>
        {subtitle ? (
          <p style={{ marginTop: 6, fontSize: 13, color: C.muted }}>{subtitle}</p>
        ) : null}
      </div>
      {extra ? (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, paddingTop: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {extra}
        </div>
      ) : null}
    </div>
  );
}

export function KpiGrid({ items }) {
  return (
    <div
      className="pi-kpis"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}
    >
      {items.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            style={{
              background: C.cream,
              border: `1px solid ${C.ochre}`,
              borderTop: `3px solid ${kpi.accent || C.sage}`,
              borderRadius: '0 0 10px 10px',
              padding: '14px 16px',
              minHeight: 108,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: C.muted,
                marginBottom: 10,
              }}
            >
              {Icon ? <Icon size={14} /> : null}
              {kpi.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: C.forest }}>{kpi.value}</div>
            {kpi.sub ? <div style={{ marginTop: 6, fontSize: 12, color: C.muted }}>{kpi.sub}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

export function Panel({ title, subtitle, toolbar, children, sand }) {
  return (
    <section
      style={{
        background: sand ? C.sand : C.cream,
        border: `1px solid ${C.ochre}`,
        borderRadius: 12,
        padding: 16,
      }}
    >
      {(title || toolbar) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: subtitle || children ? 12 : 0, flexWrap: 'wrap' }}>
          <div>
            {title ? <h3 style={{ margin: 0, fontSize: 15, color: C.forest }}>{title}</h3> : null}
            {subtitle ? <p style={{ margin: '4px 0 0', fontSize: 12, color: C.muted }}>{subtitle}</p> : null}
          </div>
          {toolbar}
        </div>
      )}
      {children}
    </section>
  );
}

export function ScrollBox({ children, height = 320 }) {
  return (
    <div style={{ maxHeight: height, overflow: 'auto', borderRadius: 8 }}>
      {children}
    </div>
  );
}

export function TableWrap({ children, height = 320 }) {
  return (
    <div
      style={{
        overflow: 'auto',
        maxHeight: height,
        border: `1px solid ${C.ochre}`,
        borderRadius: 12,
        background: C.cream,
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
        {children}
      </table>
    </div>
  );
}

export function AsideRail({ title, children }) {
  return (
    <aside
      className="pi-aside"
      style={{
        width: 260,
        flexShrink: 0,
        background: C.oat,
        border: `1px solid ${C.ochre}`,
        borderRadius: 12,
        padding: 14,
        position: 'sticky',
        top: 76,
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'auto',
      }}
    >
      <h2
        style={{
          margin: '0 0 12px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: C.muted,
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{children}</div>
    </aside>
  );
}

export function PageShell({ header, aside, children }) {
  return (
    <div style={{ width: '100%', paddingTop: 20 }}>
      <style>{`
        @media (max-width: 1024px) {
          .pi-shell { flex-direction: column !important; }
          .pi-aside { width: 100% !important; position: static !important; max-height: none !important; }
          .pi-kpis { grid-template-columns: 1fr 1fr !important; }
          .pi-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
      {header}
      <div className="pi-shell" style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        {aside}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>{children}</div>
      </div>
    </div>
  );
}

export function ActionChip({ children, onClick, kind = 'primary' }) {
  const styles =
    kind === 'clay'
      ? { background: C.clay, color: C.cream, border: 'none' }
      : kind === 'ghost'
        ? { background: C.cream, color: C.forest, border: `1px solid ${C.ochre}` }
        : { background: C.sage, color: C.cream, border: 'none' };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        borderRadius: 8,
        padding: '6px 12px',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function RailCard({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        textAlign: 'left',
        background: C.cream,
        border: `1px solid ${C.ochre}`,
        borderRadius: 10,
        padding: 10,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </button>
  );
}
