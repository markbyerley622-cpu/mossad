// Vercel Serverless API - Payout endpoint with Upstash Redis

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(command, ...args) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return null;
  }

  const res = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([command, ...args])
  });

  const data = await res.json();
  return data.result;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const cached = await redis('GET', 'mossad:payouts');
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (e) {}
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    const { username, txUrl, amount } = req.body;

    if (!username || !txUrl || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const payout = {
      id: `PAY-${Date.now()}`,
      username: username.startsWith('@') ? username : `@${username}`,
      txUrl,
      amount: parseFloat(amount).toFixed(2),
      timestamp: new Date().toISOString(),
      verified: true
    };

    // Get existing payouts and prepend new one
    let payouts = [];
    try {
      const cached = await redis('GET', 'mossad:payouts');
      if (cached) {
        payouts = JSON.parse(cached);
      }
    } catch (e) {}

    payouts.unshift(payout);
    if (payouts.length > 50) {
      payouts = payouts.slice(0, 50);
    }

    // Save to Redis
    try {
      await redis('SET', 'mossad:payouts', JSON.stringify(payouts));
    } catch (e) {}

    return res.status(200).json(payout);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
