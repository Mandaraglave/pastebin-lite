# Pastebin-Lite

A minimal Pastebin-like app built with Next.js 14 and Upstash Redis. Users can create a text paste, get a shareable link, and optionally set constraints:
- Time-based expiry (TTL)
- View-count limit

The app exposes required API routes, deterministic time for testing, and a simple UI.

## Stack
- Next.js 14 (App Router)
- Upstash Redis (serverless REST Redis)
- TypeScript

## Persistence Layer
Upstash Redis is used as the persistence layer. It survives across requests and works on serverless platforms like Vercel.

Environment variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

A sample `.env.example` is included.

## Deterministic Time for Testing
If `TEST_MODE=1`, the app reads the request header `x-test-now-ms` (milliseconds since epoch) as "current time" for expiry logic only. If absent, it falls back to real time.

## Routes
- GET `/api/healthz`
  - Returns `{ ok: boolean, redis?: boolean }` with HTTP 200
- POST `/api/pastes`
  - Body: `{ content: string, ttl_seconds?: number>=1, max_views?: number>=1 }`
  - Returns: `{ id: string, url: string }`
- GET `/api/pastes/:id`
  - Returns: `{ content: string, remaining_views: number|null, expires_at: string|null }` or 404 JSON on unavailable
  - Each successful fetch counts as a view
- GET `/p/:id`
  - Returns HTML with the paste content (escaped), or 404 if unavailable

## Local Development
1. Install dependencies
   - `npm install`
2. Copy `.env.example` to `.env.local` and set values
   - `UPSTASH_REDIS_REST_URL=...`
   - `UPSTASH_REDIS_REST_TOKEN=...`
   - Optionally: `TEST_MODE=1`
3. Run dev server
   - `npm run dev`
4. Open http://localhost:3000

### Testing deterministic expiry locally
- Set `TEST_MODE=1` in `.env.local`
- For GET `/api/pastes/:id`, add header `x-test-now-ms: <ms since epoch>` to simulate time

## Deployment (Vercel)
- Push to a public Git repository
- Import the repository into Vercel
- Add the environment variables in Vercel Project Settings → Environment Variables
- Deploy. The app should work without manual DB migrations.

## Design Decisions
- Serverless-ready design using Upstash Redis REST API
- Atomic view decrement and checks via a Redis Lua script to avoid race conditions under concurrency
- HTML view uses server-rendered fetch to the API and safely escapes content
- No hardcoded localhost URLs in code; base URL is derived from headers

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build
- `npm run start` – start production server

## Notes
- Health check returns HTTP 200 with `{ ok: true|false }` and includes a `redis` field when the Redis ping succeeds.
