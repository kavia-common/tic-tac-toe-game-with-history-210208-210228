# Tic Tac Toe Frontend (React)

This app provides the user interface for playing Tic Tac Toe and viewing finished game history. It communicates with the backend REST API.

## Prerequisites

- Node.js 18+ and npm or yarn
- Backend running locally on http://localhost:3001 (see backend README)

## Configuration (.env)

Create a `.env` file (already provided) with:
```
REACT_APP_API_BASE=http://localhost:3001
```

- `REACT_APP_API_BASE`: The base URL of the Tic Tac Toe backend. For local development, the backend runs on port 3001.

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

```
npm run build
```

This creates an optimized build in the `build/` directory.
