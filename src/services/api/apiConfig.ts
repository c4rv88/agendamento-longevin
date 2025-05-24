
// API configuration constants

export const API_BASE_URL = 'https://api.feegow.com/v1';
export const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJmZWVnb3ciLCJhdWQiOiJwdWJsaWNhcGkiLCJpYXQiOjE3MjE5Njk3OTUsImxpY2Vuc2VJRCI6ODg3OX0.-_HMD-eocb0AM2xXUaF9lGnJxiohFZ9lSa5ri2ev-3Y';

export const apiHeaders = {
  'Content-Type': 'application/json',
  'x-access-token': ACCESS_TOKEN,
  'Host': 'api.feegow.com/v1'
};

// List of allowed unit names
export const ALLOWED_UNITS = ['ISV - Papicu', 'ISV - Meireles', 'ISV - Oliveira Paiva'];
