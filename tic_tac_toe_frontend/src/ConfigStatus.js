import React from 'react';

/**
 * ConfigStatus displays a clear message when the API base is misconfigured.
 * PUBLIC_INTERFACE
 */
// PUBLIC_INTERFACE
export default function ConfigStatus({ message }) {
  /** This is a public component to show configuration status messages. */
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        margin: '12px 0',
        padding: '10px 12px',
        borderRadius: 8,
        border: '1px solid rgba(239,68,68,0.25)',
        background: 'rgba(239,68,68,0.1)',
        color: '#b91c1c',
        fontWeight: 600,
      }}
    >
      {message}
    </div>
  );
}
