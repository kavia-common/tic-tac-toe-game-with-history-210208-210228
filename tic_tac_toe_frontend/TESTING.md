# Frontend Testing (Jest + React Testing Library)

This frontend uses Create React App's test setup.

## Install
npm install

## Run tests
Non-interactive (CI):
CI=true npm test -- --watchAll=false

Or locally (watch mode):
npm test

## Mocking
- API calls from src/api.js are mocked with jest.mock in tests to prevent real network requests.
- Accessibility checks include ARIA roles/labels and keyboard interaction basics.
