// Vercel Serverless API - Payout endpoint

let recentPayouts = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(recentPayouts.slice(0, 20));
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

    recentPayouts.unshift(payout);
    if (recentPayouts.length > 50) {
      recentPayouts = recentPayouts.slice(0, 50);
    }

    return res.status(200).json(payout);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
