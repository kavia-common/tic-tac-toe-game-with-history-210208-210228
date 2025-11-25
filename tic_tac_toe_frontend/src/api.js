/**
 * Simple API client for the Tic Tac Toe backend.
 * PUBLIC_INTERFACE
 */

// Read API base URL strictly from environment at module load time.
// In development, show a helpful console error; in production, throw so misconfiguration is visible.
const apiBaseFromEnv =
  typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_BASE : undefined;

if (!apiBaseFromEnv) {
  const msg =
    'Configuration error: REACT_APP_API_BASE is not defined. Set it in your .env file (e.g., REACT_APP_API_BASE=http://localhost:3001) and rebuild.';
  // Always surface to console for easier diagnosis
  // eslint-disable-next-line no-console
  console.error(msg);

  // Throw so that consumers can catch and show a helpful banner; also fails fast in production builds
  throw new Error(msg);
}

const API_BASE = apiBaseFromEnv;

// Internal helper to make requests with consistent error handling
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  let res;
  try {
    res = await fetch(url, options);
  } catch (e) {
    // Network error likely due to CORS, DNS, or mixed content
    const base = apiBaseFromEnv || 'undefined';
    const hint = `Network error contacting ${url}. Check that REACT_APP_API_BASE (${base}) is reachable and CORS is configured.`;
    throw new Error(e?.message ? `${e.message} - ${hint}` : hint);
  }
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
