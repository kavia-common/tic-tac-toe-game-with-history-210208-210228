const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

/**
 * Helper to handle fetch with JSON and error handling.
 * Adds console.error for visibility in case of failures.
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
    // Log for debugging network/CORS issues without crashing silently
    // eslint-disable-next-line no-console
    console.error('API request failed', { path, status: res.status, data });
    throw new Error(message);
  }
  return data;
}

/**
 * Normalize backend game payloads to a consistent frontend shape.
 * Backend uses "gameId"; the app code expects "id".
 */
function normalizeGamePayload(payload) {
  if (!payload || typeof payload !== 'object') return payload;
  const id = payload.id ?? payload.gameId ?? null;
  return {
    id,
    board: payload.board ?? Array(9).fill(null),
    currentPlayer: payload.currentPlayer ?? null,
    status: payload.status ?? 'in_progress',
    winner: payload.winner ?? null,
    // pass through any other fields
    ...payload,
    id, // ensure id overwrites any previous value
  };
}

// PUBLIC_INTERFACE
export async function startGame() {
  /** Starts a new game and returns game object with id, board, currentPlayer, and status. */
  const data = await request('/games/start', { method: 'POST' });
  return normalizeGamePayload(data);
}

// PUBLIC_INTERFACE
export async function makeMove(gameId, position) {
  /** Makes a move for the given game at a position 0-8; returns updated game state. */
  const data = await request(`/games/${encodeURIComponent(gameId)}/move`, {
    method: 'POST',
    body: JSON.stringify({ position }),
  });
  return normalizeGamePayload(data);
}

// PUBLIC_INTERFACE
export async function getGame(gameId) {
  /** Fetches current game state for the given id. */
  const data = await request(`/games/${encodeURIComponent(gameId)}`, { method: 'GET' });
  return normalizeGamePayload(data);
}

// PUBLIC_INTERFACE
export async function getHistory() {
  /** Fetches finished games history with results and timestamps. */
  const res = await request('/games/history', { method: 'GET' });
  // Backend OpenAPI suggests { items: [...] }; frontend expects an array.
  const items = Array.isArray(res) ? res : (Array.isArray(res?.items) ? res.items : []);
  // Normalize minimal fields so History component has id, result/status, finishedAt
  return items.map((it) => {
    const id = it.id ?? it.gameId ?? null;
    return {
      ...it,
      id,
    };
  });
}
