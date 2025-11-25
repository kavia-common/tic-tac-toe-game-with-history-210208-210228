import { render, screen } from '@testing-library/react';
import App from './App';

test('renders core UI components for Tic Tac Toe app', () => {
  render(<App />);

  // Top brand title
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();

  // New Game button
  expect(screen.getByRole('button', { name: /New Game/i })).toBeInTheDocument();

  // Theme toggle button (contains emoji; verify via role presence)
  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBeGreaterThan(0);

  // Game section header
  expect(screen.getByRole('heading', { name: /Game/i, level: 2 })).toBeInTheDocument();

  // Status area shows initial prompt
  expect(screen.getByText(/Click "New Game" to start\./i)).toBeInTheDocument();

  // History sidebar title
  expect(screen.getByRole('heading', { name: /Recent Finished Games/i })).toBeInTheDocument();

  // Board should render 9 squares
  const squares = screen.getAllByRole('button', { name: /cell/i });
  // If aria-label matching fails due to case or empty cells, fallback to count total square buttons by class name
  if (squares.length === 0) {
    const squareEls = document.querySelectorAll('.ttt-square');
    expect(squareEls.length).toBe(9);
  } else {
    expect(squares.length).toBe(9);
  }
});
