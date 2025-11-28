import { render, screen } from '@testing-library/react';
import App from './App';

test('renders start new game button', () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /start new game/i });
  expect(btn).toBeInTheDocument();
});
