import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { startGame, makeMove, listGames } from './api';

// Colors per Ocean Professional theme
const colors = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
};

// Square component
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled || Boolean(value)}
      aria-label={value ? `Cell with ${value}` : 'Empty cell'}
    >
      {value}
    </button>
  );
}

// Board component
function Board({ board, onCellClick, disabled }) {
  return (
    <div className="ttt-board">
      {board.map((cell, idx) => (
        <Square
          key={idx}
          value={cell}
          onClick={() => onCellClick(idx)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// History list component
function History({ finished }) {
  return (
    <div className="history">
      <h3>Recent Finished Games</h3>
      <ul>
        {finished.length === 0 && <li>No games yet.</li>}
        {finished.map(g => (
          <li key={g.game_id}>
            {g.is_draw ? (
              <span className="badge draw">Draw</span>
            ) : (
              <span className="badge win">Winner: {g.winner}</span>
            )}
            <span className="meta">{new Date(g.finished_at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** This is a public function. */
  const [theme, setTheme] = useState('light');
  const [gameId, setGameId] = useState(null);
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const refreshFinished = useCallback(async () => {
    try {
      const res = await listGames();
      setFinished(res.games || []);
    } catch (e) {
      // ignore history load error in UI
    }
  }, []);

  useEffect(() => {
    refreshFinished();
  }, [refreshFinished]);

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await startGame();
      setGameId(res.game_id);
      setState(res.state);
    } catch (e) {
      setError(e.message || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (index) => {
    if (!gameId || !state) return;
    if (state.winner || state.is_draw) return;
    setError('');
    setLoading(true);
    try {
      const res = await makeMove(gameId, index, state.current_player);
      setState(res.state);
      if (res.state.winner || res.state.is_draw) {
        // update history once finished
        refreshFinished();
      }
    } catch (e) {
      setError(e.message || 'Invalid move');
    } finally {
      setLoading(false);
    }
  };

  const statusText = state
    ? state.winner
      ? `Winner: ${state.winner}`
      : state.is_draw
        ? 'Draw!'
        : `Next Player: ${state.current_player}`
    : 'Click "New Game" to start.';

  return (
    <div className="app-container" style={{ background: colors.background, color: colors.text }}>
      <header className="topbar">
        <div className="brand">
          <span className="dot" />
          <span>Tic Tac Toe</span>
        </div>
        <div className="actions">
          <button
            className="btn primary"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'Starting…' : 'New Game'}
          </button>
          <button
            className="btn ghost"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className="content">
        <section className="card">
          <div className="card-header">
            <h2>Game</h2>
            <div className="status">{statusText}</div>
          </div>
          {error && <div className="alert error">{error}</div>}
          <Board
            board={state?.board || Array(9).fill('')}
            onCellClick={handleCellClick}
            disabled={loading || !gameId}
          />
          <div className="legend">
            <span className="badge x">X</span>
            <span>vs</span>
            <span className="badge o">O</span>
          </div>
        </section>

        <aside className="card sidebar">
          <History finished={finished} />
        </aside>
      </main>
    </div>
  );
}

export default App;
