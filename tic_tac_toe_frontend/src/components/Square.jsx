import React, { useCallback } from 'react';

/**
 * Square renders a single cell button-like element with accessibility.
 * Props:
 * - value: 'X' | 'O' | null
 * - index: number (0-8)
 * - onClick: function -> void
 * - disabled: boolean
 */
export default function Square({ value, index, onClick, disabled }) {
  const handleKeyDown = useCallback((e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick && onClick();
    }
  }, [onClick, disabled]);

  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;

  return (
    <div role="row" className="ttt-row-wrapper">
      <button
        type="button"
        className={`ttt-square ${value ? 'filled' : ''}`}
        role="gridcell"
        aria-label={`Square ${row}, ${col}${value ? `, ${value}` : ''}`}
        aria-disabled={disabled ? 'true' : 'false'}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <span className="ttt-mark" aria-hidden="true">{value || ''}</span>
      </button>
    </div>
  );
}
