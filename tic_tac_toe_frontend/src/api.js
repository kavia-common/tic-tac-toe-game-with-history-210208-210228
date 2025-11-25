/**
 * Simple API client for the Tic Tac Toe backend.
 * PUBLIC_INTERFACE
 */

// Determine API base URL from environment with a safe fallback for local dev
const API_BASE =
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_APP_API_BASE) ||
  'http://localhost:3001';

// Internal helper to make requests with consistent error handling
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    // try to surface backend-provided error message
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.detail) msg = data.detail;
    } catch (_) {
      // ignore JSON parse errors
    }
    throw new Error(msg);
  }
  return res.json();
}

// PUBLIC_INTERFACE
export async function startGame() {
  /** Starts a new game and returns { game_id, state } */
  return request('/games', { method: 'POST' });
}

// PUBLIC_INTERFACE
export async function makeMove(gameId, index, player) {
  /** Makes a move at index for player and returns updated { game_id, state } */
  return request(`/games/${gameId}/moves`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index, player }),
  });
}

// PUBLIC_INTERFACE
export async function getGame(gameId) {
  /** Fetch a game state and history by id */
  return request(`/games/${gameId}`);
}

// PUBLIC_INTERFACE
export async function listGames() {
  /** List finished games */
  return request('/games');
}
