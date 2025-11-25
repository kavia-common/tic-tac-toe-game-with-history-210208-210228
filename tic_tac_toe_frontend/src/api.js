/**
 * Simple API client for the Tic Tac Toe backend.
 * PUBLIC_INTERFACE
 */
export async function startGame() {
  /** Starts a new game and returns { game_id, state } */
  const res = await fetch('http://localhost:3001/games', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to start game');
  return res.json();
}

// PUBLIC_INTERFACE
export async function makeMove(gameId, index, player) {
  /** Makes a move at index for player and returns updated { game_id, state } */
  const res = await fetch(`http://localhost:3001/games/${gameId}/moves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, player }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.detail || 'Invalid move';
    throw new Error(msg);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function getGame(gameId) {
  /** Fetch a game state and history by id */
  const res = await fetch(`http://localhost:3001/games/${gameId}`);
  if (!res.ok) throw new Error('Game not found');
  return res.json();
}

// PUBLIC_INTERFACE
export async function listGames() {
  /** List finished games */
  const res = await fetch('http://localhost:3001/games');
  if (!res.ok) throw new Error('Failed to fetch games');
  return res.json();
}
