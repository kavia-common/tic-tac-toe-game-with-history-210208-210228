import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import Board from '../components/Board';

test('Board renders 9 squares with ARIA roles and labels', () => {
  const board = Array(9).fill(null);
  render(<Board board={board} onSquareClick={() => {}} ariaLabel="Test Board" />);

  const grid = screen.getByRole('grid', { name: /test board/i });
  const squares = within(grid).getAllByRole('gridcell');
  expect(squares).toHaveLength(9);

  // Squares are focusable when not disabled
  squares.forEach((sq) => {
    expect(sq).toHaveAttribute('tabindex', '0');
  });

  // ARIA labels exist
  expect(squares[0]).toHaveAttribute('aria-label', expect.stringMatching(/square 1, 1/i));
});

test('Keyboard interaction triggers onSquareClick', () => {
  const board = Array(9).fill(null);
  const clicks = [];
  const onSquareClick = (i) => clicks.push(i);

  render(<Board board={board} onSquareClick={onSquareClick} ariaLabel="Key Board" />);

  const grid = screen.getByRole('grid', { name: /key board/i });
  const squares = within(grid).getAllByRole('gridcell');

  // Press Enter on square[2]
  fireEvent.keyDown(squares[2], { key: 'Enter', code: 'Enter' });
  // Press Space on square[3]
  fireEvent.keyDown(squares[3], { key: ' ', code: 'Space' });

  expect(clicks).toEqual([2, 3]);
});
