import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import Board from './components/Board';
import History from './components/History';
import { startGame, makeMove, getGame, getHistory } from './api';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Tic Tac Toe app with Ocean Professional styling.
   * Handles starting games, making moves, and viewing history.
   */
  const [gameId, setGameId] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [status, setStatus] = useState('idle'); // idle | in_progress | X_won | O_won | draw
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorAction, setErrorAction] = useState(null); // for retry handler
  const [history, setHistory] = useState([]);
  const [selectedHistoryGame, setSelectedHistoryGame] = useState(null);

  // Fetch history on mount
  useEffect(() => {
    refreshHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isGameOver = useMemo(() => {
    return ['X_won', 'O_won', 'draw', 'finished'].includes(status);
  }, [status]);

  const statusText = useMemo(() => {
    if (!gameId) return 'Click "Start New Game" to begin.';
    if (status === 'in_progress') return `Current turn: ${currentPlayer}`;
    if (status === 'X_won') return 'Game Over — X wins 🎉';
    if (status === 'O_won') return 'Game Over — O wins 🎉';
    if (status === 'draw') return 'Game Over — Draw 🤝';
    if (status === 'finished') return 'Game finished.';
    return String(status);
  }, [status, currentPlayer, gameId]);

  const clearError = useCallback(() => {
    setError('');
    setErrorAction(null);
  }, []);

  const handleStart = useCallback(async () => {
    setLoading(true);
    setSelectedHistoryGame(null);
    clearError();
    try {
      const g = await startGame();
      setGameId(g.id);
      setBoard(g.board || Array(9).fill(null));
      setCurrentPlayer(g.currentPlayer || 'X');
      setStatus(g.status || 'in_progress');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Start New Game failed', e);
      setError(e.message || 'Failed to start game');
      // enable retry
      setErrorAction(() => handleStart);
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const handleSquareClick = useCallback(async (index) => {
    if (!gameId || isGameOver) return;
    if (board[index] !== null) return;
    setLoading(true);
    clearError();
    try {
      const g = await makeMove(gameId, index);
      setBoard(g.board || Array(9).fill(null));
      setCurrentPlayer(g.currentPlayer || currentPlayer);
      setStatus(g.status || status);
      if (['X_won', 'O_won', 'draw', 'finished'].includes(g.status)) {
        // Refresh history after game ends
        refreshHistory();
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Make move failed', e);
      setError(e.message || 'Move failed');
      // allow retrying the same move
      setErrorAction(() => () => handleSquareClick(index));
    } finally {
      setLoading(false);
    }
  }, [gameId, isGameOver, board, currentPlayer, status, clearError]);

  const refreshHistory = useCallback(async () => {
    try {
      const items = await getHistory();
      setHistory(Array.isArray(items) ? items : []);
    } catch (e) {
      // Non-fatal but log
      // eslint-disable-next-line no-console
      console.error('Failed to fetch history', e);
      // Do not surface global error here to avoid noise
    }
  }, []);

  const handleSelectHistory = useCallback(async (g) => {
    setSelectedHistoryGame(null);
    // If the history item has full board data, use it; otherwise try fetching
    if (g.board && Array.isArray(g.board)) {
      setSelectedHistoryGame(g);
      return;
    }
    try {
      const full = await getGame(g.id);
      setSelectedHistoryGame({ ...g, board: full.board || g.board });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch game details', e);
      setSelectedHistoryGame(g);
    }
  }, []);

  const ErrorBanner = ({ message, onRetry, onDismiss }) => {
    if (!message) return null;
    return (
      <div
        className="surface card"
        style={{
          borderColor: 'rgba(239,68,68,0.3)',
          borderWidth: 1,
          borderStyle: 'solid',
          background: '#fff5f5',
          marginBottom: 12,
        }}
        role="alert"
        aria-live="assertive"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <span className="error-text">Error: {message}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {onRetry && (
              <button className="btn secondary" onClick={onRetry} aria-label="Retry last action">
                Retry
              </button>
            )}
            <button className="btn ghost" onClick={onDismiss} aria-label="Dismiss error">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="logo-circle" aria-hidden="true">○</div>
          <h1 className="title">Tic Tac Toe</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn primary"
            onClick={handleStart}
            aria-label="Start a new game"
            disabled={loading}
          >
            {loading ? 'Starting…' : 'Start New Game'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <section className="game-section">
          <ErrorBanner message={error} onRetry={errorAction} onDismiss={clearError} />
          <div className="surface card">
            <div className="status-row" role="status" aria-live="polite">
              <span className="status-text">{statusText}</span>
            </div>

            <Board
              board={board}
              onSquareClick={handleSquareClick}
              disabled={!gameId || loading || isGameOver}
              ariaLabel="Active game board"
            />

            <div className="controls">
              <div className="legend">
                <span className="badge badge-primary">Player X</span>
                <span className="badge badge-secondary">Player O</span>
              </div>
              <div className="actions">
                <button
                  className="btn ghost"
                  onClick={() => {
                    setGameId(null);
                    setBoard(Array(9).fill(null));
                    setCurrentPlayer('X');
                    setStatus('idle');
                    clearError();
                  }}
                  aria-label="Reset current board locally"
                >
                  Reset Board
                </button>
                <button
                  className="btn secondary"
                  onClick={refreshHistory}
                  aria-label="Refresh game history"
                >
                  Refresh History
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="history-section">
          <div className="surface card">
            <History
              items={history}
              onSelect={handleSelectHistory}
              selectedGame={selectedHistoryGame}
            />
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span className="footnote">Ocean Professional theme</span>
      </footer>
    </div>
  );
}

export default App;
