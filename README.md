# Backend Course — Minimal Node.js HTTP Server (TypeScript)

A minimal, production-ready Node.js HTTP server built with **TypeScript** and the built‑in `http` module. It serves static HTML pages for `/orders` and `/items` (with an intentional delay on `/items`), handles favicon requests, and returns a request counter in `404` responses. The project ships with `tsc` build, `nodemon` + `tsx` dev workflow, and strict TS settings.

> **Port:** `3007` (default)

---

## Table of contents

- [Quick start](#quick-start)
- [Scripts](#scripts)
- [API](#api)
- [Project structure](#project-structure)
- [TypeScript config](#typescript-config)
- [Production run](#production-run)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Quick start

> Requirements: **Node.js 18+** (due to `esbuild`/`tsx` engines), `npm` or `yarn`/`pnpm`.

```bash
# 1) Install deps
npm i

# 2) Dev mode (restarts on changes)
npm run dev

# 3) Build TypeScript to ./dist
npm run build

# 4) Start the compiled server
npm start
# -> http://localhost:3007
```

> **Note:** Ensure `package.json` has `start` pointing to the compiled JS:
>
> ```jsonc
> "start": "node dist/server/server.js"
> ```

---

## Scripts

- `dev` – watches `server/**/*.ts` and runs with `tsx` through `nodemon` (hot reload).
- `build` – cleans `dist` and compiles with `tsc`.
- `start` – runs the compiled JS from `dist`.

```jsonc
{
  "scripts": {
    "build": "rimraf dist && tsc -p tsconfig.json",
    "start": "node dist/server/server.js",
    "dev": "nodemon --watch server --ext ts,tsx --exec \"tsx server/server.ts\""
  }
}
```

---

## API

Base URL: `http://localhost:3007`

| Method | Path       | Description                                                                 |
|-------:|------------|-----------------------------------------------------------------------------|
|  GET   | `/`        | Serves the **Orders** page (same as `/orders`).                             |
|  GET   | `/orders`  | Serves `src/pages/orders.html`.                                             |
|  GET   | `/items`   | Serves `src/pages/items.html` **after ~3s delay** (simulates long request). |
|  GET   | `/favicon.ico` | Serves `public/favicon.ico` if present, else `public/favicon.svg`, else empty `204`. |
|  *    | `*`        | Returns `404 not found` with an incrementing request counter.                |

### Example

```bash
# Orders
curl -i http://localhost:3007/orders

# Items (note the ~3s delay)
time curl -i http://localhost:3007/items
```

---

## Project structure

```
.
├── public/
│   └── favicon.(ico|svg)      # optional; server falls back svg -> 204
├── server/
│   └── server.ts              # HTTP server entry
├── src/
│   └── pages/
│       ├── items.html         # served at /items (with delay)
│       └── orders.html        # served at /orders and /
├── tsconfig.json
├── package.json
└── dist/                      # build output (generated)
```

---

## TypeScript config

- `target`: ES2020
- `module`: commonjs
- `rootDir`: project root (`./`), output to `./dist`
- Strict mode and Node types enabled

---

## Production run

1. Build once: `npm run build`
2. Start: `npm start`
3. (Optional) Use a process manager in production: e.g. `pm2 start dist/server/server.js --name backend-course`
4. Reverse proxy (optional): serve behind nginx or a cloud load balancer
5. Health check idea: add `/healthz` route returning `200 OK`

### Environment

- `PORT` – not yet used; default hard‑coded `3007`. You may export this to an env var in `server.ts` in the future.

---

## Troubleshooting

- **Start script runs `.ts` file** – fix to run `dist/server/server.js` after build.
- **Node version** – ensure `>= 18` (required by dependencies).
- **404 shows a growing number** – that’s the request counter by design.
- **Missing favicon** – server returns `favicon.ico` if present, then `favicon.svg`, else `204 No Content`.
