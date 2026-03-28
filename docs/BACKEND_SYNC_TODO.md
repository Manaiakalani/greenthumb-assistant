# Backend Sync — TODO

> **Status:** Deferred until a database is selected.

## Overview

Grasswise currently stores all data in `localStorage` via the Zustand store
(`src/stores/useGrassStore.ts`). This TODO tracks the future work needed to add
optional cloud sync so users can access their data across devices.

## Decision Points

| Decision | Options | Notes |
|---|---|---|
| Database | Supabase, Firebase, PlanetScale, self-hosted Postgres | Need auth, real-time sync, free tier |
| Auth provider | Supabase Auth, Firebase Auth, Clerk | Must integrate with chosen DB |
| Sync strategy | Full replace, CRDT merge, last-write-wins | Trade-off: simplicity vs. offline resilience |
| Conflict resolution | Server wins, client wins, manual merge | Depends on sync strategy |

## Implementation Plan (once DB is chosen)

1. **Auth layer** — Add sign-in/sign-up flow (email + OAuth).
2. **API client** — Create `src/lib/api.ts` with typed fetch/mutation helpers.
3. **Sync middleware** — Add Zustand middleware that pushes mutations to the
   backend after persisting locally (offline-first).
4. **Initial hydration** — On login, merge server state with local state.
5. **Conflict UI** — If merge conflicts arise, show a simple "Keep local /
   Keep server" prompt.
6. **Quota / limits** — Photo storage will need a blob store (S3, Supabase
   Storage, Cloudflare R2).
7. **Delete account** — GDPR-compliant data deletion endpoint.

## Zustand Integration

The store already centralises all state. Adding sync is a matter of:

```ts
// pseudocode — Zustand "sync" middleware
const syncMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      set(...args);
      debouncedPush(get()); // push to backend
    },
    get,
    api,
  );
```

## File Checklist

- [ ] `src/lib/api.ts` — API client
- [ ] `src/lib/auth.ts` — Auth helpers
- [ ] `src/context/AuthContext.tsx` — Auth provider
- [ ] `src/stores/useGrassStore.ts` — Add sync middleware
- [ ] `src/pages/Login.tsx` — Login page
- [ ] `src/components/SyncStatus.tsx` — Sync indicator in header
- [ ] Backend schema migrations
- [ ] Environment variables (`.env`) for API URL, keys
