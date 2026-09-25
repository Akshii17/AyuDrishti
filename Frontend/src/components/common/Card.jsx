import React from 'react';

export default function Card({ title, subtitle, children, style }) {
  return (
    <div className="card" style={{ padding: '24px', marginBottom: '20px', ...style }}>
      {title && (
        <div style={{ marginBottom: children ? '16px' : '0' }}>
          <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--text-h)' }}>{title}</h2>
          {subtitle && (
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}