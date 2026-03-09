// Unit IDs as specified in the requirements
export const UNIT_IDS = {
  'ISV - Papicu': 32,
  'ISV - Meireles': 44,
  'ISV - Oliveira Paiva': 45
};

// List of allowed unit names
export const ALLOWED_UNITS = ['ISV - Papicu', 'ISV - Meireles', 'ISV - Oliveira Paiva'];

// Function to get unit ID by name
export const getUnitIdByName = (unitName: string): number => {
  return UNIT_IDS[unitName as keyof typeof UNIT_IDS] || 0;
};

/**
 * Proxy fetch to Feegow API via self-hosted proxy server.
 * All requests are routed through the relative path /api/feegow,
 * which Traefik forwards to the proxy container (no tokens in frontend).
 * In development, Vite proxies /api/feegow to localhost:3001.
 *
 * @param endpoint - API endpoint path (e.g., "/api/specialties/list")
 * @param method - HTTP method (default: "GET")
 * @param body - Request body for POST/PUT requests
 */
export const feegowFetch = async (endpoint: string, method: string = "GET", body?: any): Promise<any> => {
  console.log(`feegowFetch: ${method} ${endpoint}`, body);

  const response = await fetch(`/api/feegow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint, method, body }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    console.error('Proxy error:', errorData);
    throw new Error(`Proxy error: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  console.log('feegowFetch response:', data);
  return data;
};
