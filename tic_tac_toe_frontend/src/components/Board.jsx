import React from 'react';
import Square from './Square';

/**
 * Board renders a 3x3 grid of squares.
 * Props:
 * - board: Array of 9 values ('X' | 'O' | null)
 * - onSquareClick: function(index) -> void
 * - disabled: boolean to disable interaction
 * - ariaLabel: label for the grid
 */
export default function Board({ board = Array(9).fill(null), onSquareClick, disabled = false, ariaLabel = 'Tic Tac Toe board' }) {
  return (
    <div
      className="ttt-board"
      role="grid"
      aria-label={ariaLabel}
      aria-disabled={disabled ? 'true' : 'false'}
    >
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          index={idx}
          onClick={() => !disabled && onSquareClick && onSquareClick(idx)}
          disabled={disabled || value !== null}
        />
      ))}
    </div>
  );
}
