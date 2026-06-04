const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DISCHUB_API_KEY = process.env.DISCHUB_API_KEY || '084978e58f844ea5aaee1960d4f997ba';

app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const getApiKey = (req) => {
  return req.headers['x-api-key'] || DISCHUB_API_KEY;
};

const validatePhoneNumber = (phone) => {
  if (typeof phone !== 'string') return false;
  const normalized = phone.replace(/\s+/g, '');
  return /^(\+263|0?263|0)?7\d{8}$/.test(normalized) || /^(\+263|0?263|0)?11\d{7}$/.test(normalized);
};

app.post('/api/orders/create', async (req, res) => {
  try {
    const apiKey = getApiKey(req);
    if (!apiKey) {
      return res.status(401).json({ status: 'error', message: 'missing api key in request headers', response_code: 401 });
    }

    const {
      order_id,
      sender,
      recipient,
      amount,
      currency,
      callback_url,
      redirect_url,
      mode = 'test'
    } = req.body;

    if (typeof order_id !== 'string') {
      return res.status(400).json({ status: 'error', message: 'order_id must be posted as a string', response_code: 400 });
    }

    if (!order_id || order_id.length > 30) {
      return res.status(422).json({ status: 'error', message: 'order_id must be 30 characters or less', response_code: 422 });
    }

    if (!sender || !validatePhoneNumber(sender)) {
      return res.status(422).json({ status: 'error', message: 'invalid sender phone number format', response_code: 422 });
    }

    if (!recipient || typeof recipient !== 'string' || !recipient.includes('@')) {
      return res.status(422).json({ status: 'error', message: 'missing or invalid required keys in request data', response_code: 422 });
    }

    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0 || amount >= 100000) {
      return res.status(422).json({ status: 'error', message: 'amount must be greater than 0 and less than 100000', response_code: 422 });
    }

    if (currency !== 'USD' && currency !== 'ZWG') {
      return res.status(400).json({ status: 'error', message: 'invalid or unsupported currency. Accepted values: USD, ZWG', response_code: 400 });
    }

    const payload = {
      order_id,
      sender,
      recipient,
      amount,
      currency,
      callback_url,
      redirect_url,
      mode
    };

    const response = await fetch('https://dischub.co.zw/api/orders/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return res.status(response.status).json(data ?? { status: 'error', message: 'order could not be created due to an internal error', response_code: response.status });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Order creation proxy error:', error);
    return res.status(500).json({ status: 'error', message: 'order could not be created due to an internal error', response_code: 500 });
  }
});

app.post('/api/payment/status', async (req, res) => {
  try {
    const apiKey = getApiKey(req);
    if (!apiKey) {
      return res.status(401).json({ status: 'error', message: 'missing api key in request headers', response_code: 401 });
    }

    const { order_id, recipient } = req.body;

    if (typeof order_id !== 'string' || !order_id) {
      return res.status(422).json({ status: 'error', message: 'missing or invalid required keys in request data', response_code: 422 });
    }

    if (!recipient || typeof recipient !== 'string' || !recipient.includes('@')) {
      return res.status(422).json({ status: 'error', message: 'missing or invalid required keys in request data', response_code: 422 });
    }

    const response = await fetch('https://dischub.co.zw/api/payment/status/3/step/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({ order_id, recipient })
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      return res.status(response.status).json(data ?? { status: 'error', message: 'an unexpected error occurred while retrieving the order', response_code: response.status });
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Payment status proxy error:', error);
    return res.status(500).json({ status: 'error', message: 'an unexpected error occurred while retrieving the order', response_code: 500 });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
