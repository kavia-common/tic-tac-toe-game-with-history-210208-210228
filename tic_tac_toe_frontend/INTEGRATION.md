# Frontend-Backend Integration

- The frontend reads REACT_APP_BACKEND_URL to reach the FastAPI backend.
- For local development, ensure:
  - Backend runs on PORT=3001 (default).
  - Frontend runs on port 3000.
  - Backend CORS allows http://localhost:3000 (default in backend).
- You can set REACT_APP_BACKEND_URL in .env (see .env.example). Defaults to http://localhost:3001.

Example .env:
REACT_APP_BACKEND_URL=http://localhost:3001
