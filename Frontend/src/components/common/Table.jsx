import React from 'react';

export default function Table({ columns, data, emptyMessage = "No record found" }) {
  return (
    <div style={{ 
      overflowX: 'auto', 
      borderRadius: '8px', 
      border: '1px solid var(--border)',
      backgroundColor: 'var(--card-bg)'
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        textAlign: 'left',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ 
            backgroundColor: 'var(--code-bg)', 
            borderBottom: '1px solid var(--border)' 
          }}>
            {columns.map((col, index) => (
              <th 
                key={index} 
                style={{ 
                  padding: '12px 16px', 
                  fontWeight: 700, 
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                style={{ 
                  borderBottom: rowIndex === data.length - 1 ? 'none' : '1px solid var(--border)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{ padding: '14px 16px', color: 'var(--text)' }}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                style={{ 
                  padding: '24px', 
                  textAlign: 'center', 
                  color: 'var(--text-muted)' 
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}