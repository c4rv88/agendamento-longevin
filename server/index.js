const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const FEEGOW_API_URL = 'https://api.feegow.com/v1';
const FEEGOW_API_KEY = process.env.FEEGOW_API_KEY;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // handle preflight
app.use(express.json());

// Route must match Traefik PathPrefix('/api/feegow')
app.post('/api/feegow', async (req, res) => {
  try {
    const { endpoint, method, body } = req.body;

    if (!endpoint || !endpoint.startsWith('/') || endpoint.includes('..')) {
      return res.status(400).json({ error: 'Invalid endpoint path' });
    }

    if (!FEEGOW_API_KEY) {
      console.error('FEEGOW_API_KEY is not set!');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const url = `${FEEGOW_API_URL}${endpoint}`;
    const httpMethod = method || 'GET';
    console.log(`Proxying ${httpMethod} request to: ${url}`);

    const fetchOptions = {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': FEEGOW_API_KEY,
      },
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(httpMethod)) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);
    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(`Feegow returned non-JSON (${response.status}):`, responseText.substring(0, 500));
      return res.status(502).json({
        success: false,
        error: `Feegow API returned status ${response.status} with non-JSON response`,
      });
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Feegow proxy server running on port ${PORT}`);
});
