import React, { useMemo } from 'react';
import Board from './Board';

/**
 * History renders a list of finished games and allows viewing a final board.
 * Props:
 * - items: array of { id, result, finishedAt, board? }
 * - onSelect: function(game) -> void (to show final board)
 * - selectedGame: selected game object or null
 */
export default function History({ items = [], onSelect, selectedGame }) {
  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const da = new Date(a.finishedAt || a.createdAt || 0).getTime();
      const db = new Date(b.finishedAt || b.createdAt || 0).getTime();
      return db - da;
    });
  }, [items]);

  return (
    <aside className="history" aria-label="Game history">
      <div className="history-header">
        <h2 className="history-title">History</h2>
      </div>
      <ul className="history-list">
        {sorted.length === 0 && (
          <li className="history-empty">No finished games yet.</li>
        )}
        {sorted.map((g) => (
          <li key={g.id} className={`history-item ${selectedGame && selectedGame.id === g.id ? 'active' : ''}`}>
            <button
              className="history-item-btn"
              onClick={() => onSelect && onSelect(g)}
              aria-label={`Show game ${g.id} result ${g.result || 'unknown'}`}
            >
              <div className="history-meta">
                <span className={`badge ${g.result === 'Draw' ? 'badge-secondary' : 'badge-primary'}`}>
                  {g.result || 'Result'}
                </span>
                <span className="time">{formatTime(g.finishedAt || g.createdAt)}</span>
              </div>
              <div className="history-id">#{String(g.id).slice(-6)}</div>
            </button>
          </li>
        ))}
      </ul>
      {selectedGame && (
        <div className="history-preview">
          <div className="history-preview-title">Final Board</div>
          <Board
            board={selectedGame.board || Array(9).fill(null)}
            onSquareClick={() => {}}
            disabled
            ariaLabel="Final board preview"
          />
        </div>
      )}
    </aside>
  );
}

function formatTime(ts) {
  if (!ts) return '';
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return String(ts);
    return d.toLocaleString();
  } catch {
    return String(ts);
  }
}
