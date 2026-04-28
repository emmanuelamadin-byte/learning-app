# Learn Tracker

Learn Tracker is a premium accountability web app for study groups and serious learners. It ships as a zero-install React SPA in this workspace so you can run it immediately with the bundled runtime, then connect Supabase when you are ready for production auth, data, realtime updates, and admin workflows.

## What is included

- React-based PWA with dark premium UI
- Auth flow, onboarding, dashboard, feed, leaderboard, public profiles, and admin view
- Weekly goal tracking with streaks, comparison insights, badges, and confetti
- Offline session logging with automatic sync when the connection returns
- Supabase schema and an admin edge function for secure user removal
- Local demo mode so the app is usable before backend credentials exist

## Run locally

From [learn-tracker](C:\Users\user\Documents\code\learn-tracker):

```powershell
& "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" server.mjs
```

Then open `http://127.0.0.1:4173`.

## Demo accounts

The default `app-config.js` starts in demo mode.

- `owner@example.com` / `demo1234`
- `priya@example.com` / `demo1234`
- `jonah@example.com` / `demo1234`

## Connect Supabase

1. Create a Supabase project.
2. Run [schema.sql](C:\Users\user\Documents\code\learn-tracker\supabase\schema.sql) in the SQL editor.
3. Create a public Storage bucket named `avatars`.
4. Copy [app-config.example.js](C:\Users\user\Documents\code\learn-tracker\app-config.example.js) to `app-config.js`.
5. Fill in:
   - `supabaseUrl`
   - `supabaseAnonKey`
   - `adminEmails`
   - `demoMode: false`
6. Deploy the edge function in [admin-remove-user/index.ts](C:\Users\user\Documents\code\learn-tracker\supabase\functions\admin-remove-user\index.ts).
7. Set function environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Product notes

- The weekly leaderboard uses a Sunday reset.
- Streaks count only on days with at least `0.5` hours logged.
- Users can count a session toward yesterday to support the 24-hour grace rule.
- Browser notification permission is wired in the UI; email and Telegram delivery are prepared for backend automation in Phase 2.

## Deployment notes

- Frontend hosting target: Vercel static hosting
- Backend target: Supabase Auth, Postgres, Realtime, Storage, and Edge Functions
- Because this workspace does not include `npm` by default, the app uses browser ESM imports and Tailwind CDN configuration instead of a bundler. The architecture is still modular, and it can be migrated into Vite later without rewriting the product logic.
