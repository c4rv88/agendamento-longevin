import { supabase } from "@/integrations/supabase/client";

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
 * Proxy fetch to Feegow API via Edge Function
 * @param endpoint - API endpoint path (e.g., "/api/specialties/list")
 * @param method - HTTP method (default: "GET")
 * @param body - Request body for POST/PUT requests
 */
export const feegowFetch = async (endpoint: string, method: string = "GET", body?: any): Promise<any> => {
  console.log(`feegowFetch: ${method} ${endpoint}`, body);

  const { data, error } = await supabase.functions.invoke('feegow-proxy', {
    body: { endpoint, method, body },
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error(`Proxy error: ${error.message}`);
  }

  console.log('feegowFetch response:', data);
  return data;
};
