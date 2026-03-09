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

// Transparent proxy: /api/feegow/v1/* → https://api.feegow.com/v1/*
app.all('/api/feegow/v1/*', async (req, res) => {
  try {
    if (!FEEGOW_API_KEY) {
      console.error('FEEGOW_API_KEY is not set!');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const feegowPath = req.originalUrl.replace('/api/feegow/v1', '');
    if (feegowPath.includes('..')) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    const url = `${FEEGOW_API_URL}${feegowPath}`;
    console.log(`Proxying ${req.method} → ${url}`);

    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': FEEGOW_API_KEY,
      },
    };

    if (req.body && Object.keys(req.body).length > 0 && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
      fetchOptions.body = JSON.stringify(req.body);
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
