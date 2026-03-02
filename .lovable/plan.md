

## Problem

The browser blocks direct requests from your frontend (`https://agende.longevin.com.br`) to the Feegow API (`https://api.feegow.com`) due to CORS policy. The Feegow API does not include `Access-Control-Allow-Origin` headers.

## Solution

Create a Supabase Edge Function that acts as a proxy between your frontend and the Feegow API. All API calls will go through this proxy, which runs server-side (no CORS restrictions). This also removes the API key from the frontend code (security improvement).

## Implementation Plan

### 1. Create Edge Function `supabase/functions/feegow-proxy/index.ts`
- Accepts POST requests with `{ endpoint, method, body }` 
- Forwards to Feegow API using server-side `FEEGOW_API_KEY` secret
- Uses `x-access-token` header (Feegow's auth format)
- Returns response with CORS headers

### 2. Add secret via Lovable secrets tool
- Store `FEEGOW_API_KEY` with the existing JWT token value

### 3. Update `src/services/api/apiConfig.ts`
- Replace `API_BASE_URL` with a helper function that calls the Edge Function
- Remove the access token from frontend code
- Create a `feegowFetch` utility that wraps all API calls through the proxy

### 4. Update all 6 service files to use the proxy
- `specialtyService.ts` - GET specialties
- `professionalService.ts` - GET professionals  
- `unityService.ts` - GET unities
- `insuranceService.ts` - GET insurances
- `availableSchedulesService.ts` - GET schedules
- `patientService.ts` - GET search + POST create
- `appointmentService.ts` - POST create appointment

Each service will call the proxy instead of the Feegow API directly, using a shared `feegowFetch()` helper.

### 5. Update `supabase/config.toml`
- Set `verify_jwt = false` for the proxy function (public endpoint)

