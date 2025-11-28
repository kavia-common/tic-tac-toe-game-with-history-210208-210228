const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * Helper to handle fetch with JSON and error handling.
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }
  if (!res.ok) {
    const message = data && data.detail ? data.detail : (typeof data === 'string' ? data : 'Request failed');
    throw new Error(message);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function startGame() {
  /** Starts a new game and returns game object with id, board, currentPlayer, and status. */
  return request('/games/start', { method: 'POST' });
}

// PUBLIC_INTERFACE
export async function makeMove(gameId, position) {
  /** Makes a move for the given game at a position 0-8; returns updated game state. */
  return request(`/games/${encodeURIComponent(gameId)}/move`, {
    method: 'POST',
    body: JSON.stringify({ position }),
  });
}

// PUBLIC_INTERFACE
export async function getGame(gameId) {
  /** Fetches current game state for the given id. */
  return request(`/games/${encodeURIComponent(gameId)}`, { method: 'GET' });
}

// PUBLIC_INTERFACE
export async function getHistory() {
  /** Fetches finished games history with results and timestamps. */
  return request('/games/history', { method: 'GET' });
}
