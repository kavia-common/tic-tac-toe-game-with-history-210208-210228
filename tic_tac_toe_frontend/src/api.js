/**
 * Resolve backend base URL safely with sensible default and normalization.
 * Order of precedence:
 * 1) REACT_APP_API_BASE (some environments supply this)
 * 2) REACT_APP_BACKEND_URL
 * 3) http://localhost:3001 (dev default)
 *
 * Ensure value includes protocol + host (+ port) and no trailing slash.
 */
function getBaseUrl() {
  try {
    const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
    const raw =
      (env.REACT_APP_API_BASE && String(env.REACT_APP_API_BASE).trim()) ||
      (env.REACT_APP_BACKEND_URL && String(env.REACT_APP_BACKEND_URL).trim()) ||
      '';

    const fallback = 'http://localhost:3001';
    const base = raw || fallback;

    // Remove trailing slash to keep path joins predictable
    const normalized = base.endsWith('/') ? base.slice(0, -1) : base;

    // Basic sanity: ensure it looks like an absolute URL with protocol
    if (!/^https?:\/\//i.test(normalized)) {
      // If an origin without protocol was passed, default to http
      return `http://${normalized.replace(/^\/+/, '')}`;
    }
    return normalized;
  } catch {
    return 'http://localhost:3001';
  }
}

const BASE_URL = getBaseUrl();

/**
 * Helper to handle fetch with JSON and robust error handling.
 * Logs full error details including response status and body when available.
 */
export function __debug_getBaseUrlForDiagnostics() {
  return BASE_URL;
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = res.headers.get('content-type') || '';
    let data = null;
    try {
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
    } catch (parseErr) {
      // eslint-disable-next-line no-console
      console.error('API response parse error', { url, contentType, parseErr });
      data = null;
    }

    if (!res.ok) {
      const message =
        (data && typeof data === 'object' && 'detail' in data && data.detail) ||
        (typeof data === 'string' && data) ||
        `Request failed with status ${res.status}`;

      // eslint-disable-next-line no-console
      console.error('API request failed', {
        url,
        path,
        status: res.status,
        statusText: res.statusText,
        responseBody: data,
      });
      const error = new Error(message);
      error.status = res.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Network/CORS or other fetch-level failure
    // eslint-disable-next-line no-console
    console.error('API request error', { url, options, error: err && err.message, stack: err && err.stack });
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Network error');
  }
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
