# Tic Tac Toe Frontend (React)

This app provides the user interface for playing Tic Tac Toe and viewing finished game history. It communicates with the backend REST API.

## Prerequisites

- Node.js 18+ and npm or yarn
- Backend running locally on http://localhost:3001 (see backend README)

## Configuration (.env)

Create a `.env` file (you can copy from `.env.example`) with:
```
REACT_APP_API_BASE=http://localhost:3001
```

- `REACT_APP_API_BASE`: The base URL of the Tic Tac Toe backend.
  - Local development: `http://localhost:3001`
  - Preview/production: Set to your backend preview URL (example: `https://<your-preview-host>:3001`)

If `REACT_APP_API_BASE` is not set, the UI will display a clear banner and the API module will throw at load time. This is intentional so misconfiguration is obvious in production builds.

During startup/build the resolved `REACT_APP_API_BASE` is logged in the browser console as:
[TicTacToe][API] Resolved REACT_APP_API_BASE: <value>

If the API origin differs from the app origin (host/port/scheme), a non-fatal banner warns about potential CORS or mixed-content issues. Ensure the backend CORS_ORIGINS includes the exact app origin (e.g., https://your-frontend-host:3000).

## Run locally

Using npm:
```
npm install
npm start
```

Using yarn:
```
yarn
yarn start
```

The app will start at:
- http://localhost:3000

Ensure the backend is running and that `REACT_APP_API_BASE` points to it.

## Notes on Persistence

By default, the backend uses SQLite with `DATABASE_URL=sqlite:///./tictactoe.db`. This means your game history persists between runs.
You can switch the backend to in-memory mode by unsetting `DATABASE_URL` before starting the backend for ephemeral sessions.

## Production build

Before building, ensure your `.env` contains the correct `REACT_APP_API_BASE` for your target environment.

```
npm run build
```

Then deploy the `build/` directory. If you change `REACT_APP_API_BASE`, rebuild the app so the new value is embedded in the bundle.
