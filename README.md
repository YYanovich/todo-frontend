# TODO Frontend — Vite + React + TypeScript

Overview

This repository contains the frontend for a simple TODO application built with Vite, React, and TypeScript. It demonstrates a small, production-minded architecture using Redux Toolkit for state management and Axios for HTTP.

Tech stack

- Vite
- React 19 + TypeScript
- Redux Toolkit
- Axios
- MUI (Dialog for modal forms)
- Sass (SCSS) for styles

Highlights

- Single-slice Redux pattern (todos)
- Async flows handled with `createAsyncThunk`
- ID normalization (`_id` → `id`) to support MongoDB responses

---

Quick start (local development)

1. Install dependencies:

```bash
cd todoFrontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the app in your browser at `http://localhost:5173` (or the port Vite selects).

By default the frontend expects the backend API at `http://localhost:5003/api/todos`. If your backend runs on a different address, either update the API URL in `src/store/todoSlice.ts` or use an environment variable (recommended).

---

Available scripts

- `npm run dev` — start Vite development server
- `npm run build` — compile TypeScript and build production assets (`tsc -b && vite build`)
- `npm run preview` — locally preview the production build
- `npm run lint` — run linter (if configured)

---

Environment variables

Create a `.env` file in the `todoFrontend` folder to override the API URL (optional):

```env
VITE_API_URL=http://localhost:5003
```

Use `import.meta.env.VITE_API_URL` in code to reference this variable. Current implementation uses a hardcoded backend URL; I can help switch to `VITE_API_URL` if desired.

---

Notes for reviewers / employers

- Structure: `src/store` (Redux slice), `src/components` (presentational), `src/Modal` (container handling side-effects)
- Type safety: the `ITODO` interface lives in `src/types/todo.ts`
- UX: the add/edit form is accessible, handles validation and shows submit state

---

Deploy

1. Build the app:

```bash
npm run build
```

2. Serve the contents of `dist/` from a static host (Netlify, Vercel, S3/CloudFront) or integrate into the backend server.

---

Optional improvements

- Add a `Dockerfile` and `docker-compose` for reproducible local setup
- Move API base URL to `VITE_API_URL` and remove hardcoded endpoints
- Add tests for reducers and critical components

If you'd like, I can add a production-ready `Dockerfile` and a simple GitHub Actions workflow for CI/CD.
