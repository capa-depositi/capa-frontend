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

Robots.txt
- `public/robots.txt` is copied to the build output and served at `/robots.txt`.
- After deploying to Vercel, check `curl -i https://capadepositi.com/robots.txt`: the response should be HTTP 200 with `Content-Type: text/plain`, the robots directives, and no redirect to the application.
