# CAPA Frontend

Development notes and run instructions for the frontend.

Prerequisites
- Node.js 18+ and npm/yarn

Install and run

```bash
cd capa-frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` and proxies `/api` to `http://localhost:3001`.

Environment
- No special env vars required for frontend; backend endpoints are proxied via Vite.
