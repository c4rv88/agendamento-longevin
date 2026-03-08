

## Plan: Remove WhatsApp and Replace Edge Function with Self-Hosted CORS Proxy

### What changes

**1. Remove WhatsApp integration entirely**
Delete the following files and all references:
- `src/services/whatsapp/` (entire directory: `whatsappService.ts`, `api/whatsappApi.ts`, `types/whatsappTypes.ts`, `utils/whatsappUtils.ts`)
- Remove WhatsApp import and all WhatsApp-related code from `src/hooks/useAppointmentConfirmation.ts`
- Remove `VITE_WHATSAPP_*` variables from `.env`

**2. Replace Supabase Edge Function with a self-hosted Express proxy server**

Instead of using the Supabase Edge Function (`feegow-proxy`), create a lightweight Express.js backend server that runs alongside the frontend in Docker.

New files:
- `server/index.js` — Express server with CORS proxy route `/api/feegow-proxy`
- `server/package.json` — minimal dependencies (express, cors, node-fetch or native fetch)

The server will:
- Listen on a configurable port (e.g., 3001)
- Accept POST requests to `/api/feegow-proxy` with `{ endpoint, method, body }`
- Forward them to `https://api.feegow.com/v1` with the `x-access-token` header from `FEEGOW_API_KEY` env var
- Return the JSON response

**3. Update frontend `apiConfig.ts`**
Replace `supabase.functions.invoke('feegow-proxy')` with a standard `fetch()` call to the self-hosted proxy:
```
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
fetch(`${PROXY_URL}/api/feegow-proxy`, { method: 'POST', body: ... })
```

**4. Update Docker setup**
Create/update `Dockerfile` and `docker-compose.yml` to run both:
- The Nginx container serving the frontend static files
- The Node.js proxy server container

```text
docker-compose.yml
├── frontend (nginx, port 80)
│   └── serves built React app
└── proxy (node, port 3001)
    └── CORS proxy to Feegow API
    └── env: FEEGOW_API_KEY
```

**5. Clean up Supabase references**
- Remove `supabase/functions/feegow-proxy/` directory
- Remove the `[functions.feegow-proxy]` entry from `supabase/config.toml`
- Remove the supabase client import from `apiConfig.ts`

### Files to create
- `server/index.js`
- `server/package.json`
- `docker-compose.yml`
- `Dockerfile` (multi-stage: frontend build + nginx)
- `server/Dockerfile`

### Files to modify
- `src/services/api/apiConfig.ts` — replace supabase invoke with fetch to proxy
- `src/hooks/useAppointmentConfirmation.ts` — remove all WhatsApp code
- `.env` — remove WhatsApp vars, add `VITE_PROXY_URL`

### Files to delete
- `src/services/whatsapp/` (all files)
- `supabase/functions/feegow-proxy/index.ts`
- `n8n-credenciais-setup.md`
- `n8n-workflow-agendamento-whatsapp.json`

