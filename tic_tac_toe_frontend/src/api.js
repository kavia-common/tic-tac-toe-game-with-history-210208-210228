/**
 * Simple API client for the Tic Tac Toe backend.
 * PUBLIC_INTERFACE
 */

// Read API base URL strictly from environment at module load time.
// In development, show a helpful console error; in production, throw so misconfiguration is visible.
const apiBaseFromEnv =
  typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_BASE : undefined;

// Visible log of the resolved API base to assist with debugging in preview/prod
// eslint-disable-next-line no-console
console.log(
  '[TicTacToe][API] Resolved REACT_APP_API_BASE:',
  apiBaseFromEnv || '(undefined)'
);

if (!apiBaseFromEnv) {
  const msg =
    'Configuration error: REACT_APP_API_BASE is not defined. Set it in your .env file (e.g., REACT_APP_API_BASE=http://localhost:3001) and rebuild.';
  // Always surface to console for easier diagnosis
  // eslint-disable-next-line no-console
  console.error(msg);

  // Throw so that consumers can catch and show a helpful banner; also fails fast in production builds
  throw new Error(msg);
}

// Normalize any trailing slash to avoid double slashes in composed URLs
const API_BASE = String(apiBaseFromEnv).replace(/\/+$/, '');

// Internal helper to make requests with consistent error handling
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  let res;
  try {
    // Add defaults that help with CORS diagnostics
    const merged = {
      // do not force mode here; allow browser defaults so preflight behavior is visible
      headers: {
        ...(options.headers || {}),
      },
      ...options,
    };

    // eslint-disable-next-line no-console
    console.debug('[TicTacToe][API] fetch ->', merged.method || 'GET', url);

    res = await fetch(url, merged);
  } catch (e) {
    // Network error likely due to CORS, DNS, or mixed content
    const base = apiBaseFromEnv || 'undefined';
    const sameOrigin = typeof window !== 'undefined'
      ? new URL(base, window.location.href).origin === window.location.origin
      : false;
    const schemeMismatch =
      typeof window !== 'undefined'
        ? (new URL(base, window.location.href).protocol !== window.location.protocol)
        : false;

    const hints = [];
    if (!sameOrigin) hints.push('cross-origin request — ensure backend CORS allows this origin');
    if (schemeMismatch) hints.push('mixed-content (http vs https) may be blocked by the browser');

    const hint =
      `Network error contacting ${url}. ` +
      `Check that REACT_APP_API_BASE (${base}) is reachable and CORS is configured.` +
      (hints.length ? ` Possible causes: ${hints.join('; ')}.` : '');

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
