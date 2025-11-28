import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import History from '../components/History';

function makeItem(id, result = 'X', finishedAt = '2024-01-01T00:00:00Z', board = null) {
  return { id, result, finishedAt, board };
}

test('History renders list and empty state', () => {
  const { rerender } = render(<History items={[]} onSelect={() => {}} selectedGame={null} />);
  expect(screen.getByText(/no finished games yet/i)).toBeInTheDocument();

  const items = [makeItem('g1', 'X', '2024-01-01T00:00:00Z')];
  rerender(<History items={items} onSelect={() => {}} selectedGame={null} />);
  expect(screen.getByRole('button', { name: /show game g1/i })).toBeInTheDocument();
});

test('Clicking history item shows final board read-only', () => {
  const items = [makeItem('g2', 'Draw', '2024-01-02T00:00:00Z', ['X','O',null,null,null,null,null,null,null])];
  const onSelect = jest.fn();
  render(<History items={items} onSelect={onSelect} selectedGame={items[0]} />);

  // Preview board is present and disabled
  const grid = screen.getByRole('grid', { name: /final board preview/i });
  expect(grid).toBeInTheDocument();
  // Squares should not be interactable (aria-disabled=true)
  expect(grid).toHaveAttribute('aria-disabled', 'true');
});
