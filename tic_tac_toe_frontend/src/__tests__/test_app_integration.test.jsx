import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

// Mock API
jest.mock('../api', () => {
  return {
    startGame: jest.fn(async () => ({
      id: 'game-1',
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: 'in_progress',
    })),
    makeMove: jest.fn(async (_gid, pos) => {
      // Return a simple progression: X at pos, O turn
      const b = Array(9).fill(null);
      b[pos] = 'X';
      return {
        id: 'game-1',
        board: b,
        currentPlayer: 'O',
        status: 'in_progress',
      };
    }),
    getGame: jest.fn(async (_gid) => ({
      id: 'game-1',
      board: ['X','O',null, null,null,null, null,null,null],
      currentPlayer: null,
      status: 'finished',
    })),
    getHistory: jest.fn(async () => []),
  };
});

describe('App integration with mocked API', () => {
  test('renders with Ocean Professional classes and Start New Game', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /start new game/i })).toBeInTheDocument();
    // Minimal class presence checks
    expect(document.querySelector('.app-shell')).toBeInTheDocument();
    expect(document.querySelector('.surface.card')).toBeInTheDocument();
    expect(document.querySelector('.ttt-board')).toBeInTheDocument();
  });

  test('Start New Game calls API and enables moves', async () => {
    render(<App />);
    const startBtn = screen.getByRole('button', { name: /start a new game/i });
    fireEvent.click(startBtn);

    // After start, board squares should exist and be enabled
    const board = screen.getByRole('grid', { name: /active game board/i });
    const squares = within(board).getAllByRole('gridcell');
    expect(squares).toHaveLength(9);
  });

  test('Clicking a square calls makeMove and updates UI', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start a new game/i }));

    const board = await screen.findByRole('grid', { name: /active game board/i });
    const squaresButtons = within(board).getAllByRole('gridcell');

    // Click first cell
    fireEvent.click(squaresButtons[0]);
    // After mocked move, mark X should appear
    expect(squaresButtons[0]).toHaveTextContent('X');
  });
});
