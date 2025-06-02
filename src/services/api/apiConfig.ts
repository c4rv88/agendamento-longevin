
// API configuration constants

export const API_BASE_URL = 'https://api.feegow.com/v1';
export const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3NDQxNTUwNTYsImxpY2Vuc2VJRCI6NDQyMzF9.AYoQZFc1vE7Pv0TX5r82uAAjjGFlFcXTGWe3ph-4TB0';

export const apiHeaders = {
  'Content-Type': 'application/json',
  'x-access-token': ACCESS_TOKEN,
};

// Unit IDs as specified in the requirements
export const UNIT_IDS = {
  'ISV - Papicu': 32,
  'ISV - Meireles': 44,
  'ISV - Oliveira Paiva': 45
};

// List of allowed unit names - these should match exactly what's in the API response
export const ALLOWED_UNITS = ['ISV - Papicu', 'ISV - Meireles', 'ISV - Oliveira Paiva'];

// Function to get unit ID by name
export const getUnitIdByName = (unitName: string): number => {
  return UNIT_IDS[unitName as keyof typeof UNIT_IDS] || 0;
};
