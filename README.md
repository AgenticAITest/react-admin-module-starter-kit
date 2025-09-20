# Module Sandbox Template (v2)

A turnkey sandbox for developing **business modules** that run standalone *and* plug cleanly into the Foundation via a tiny adapter.
- Authoring API: `export default { meta:{id,version,api:'1.x'}, async register(ctx) }` + `export const permissions`
- Dev DX: `npm run dev` starts the sandbox API (with CORS) and the client (Vite)
- Tenancy: **schema-per-tenant** for module tables (no `tenantId`), while **system tables** may keep `tenantId`
- Works in Foundation using a small **Router adapter** (Phase 2)

---

## Requirements
- Node 18+ (or 20+)
- PostgreSQL (local, Docker, or managed)
- Git

---

## Quick Start

```bash
# 1) Clone
git clone https://github.com/<you>/<repo>.git
cd <repo>

# 2) Env
cp .env.example .env
# Edit .env -> set DATABASE_URL=postgres://user:pass@host:5432/dbname

# 3) Install deps
npm install

# 4) Run (starts API + client if combined)
npm run dev
