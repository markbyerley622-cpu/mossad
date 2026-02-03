// Vercel Serverless API - Stats endpoint with Upstash Redis

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const DEFAULT_STATS = {
  networkNodes: 47,
  activeAgents: 892,
  activeMissions: 23,
  totalMissions: 147,
  totalPayouts: 1847,
  totalSolDistributed: 12453.7
};

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
      const cached = await redis('GET', 'mossad:stats');
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (e) {}
    return res.status(200).json(DEFAULT_STATS);
  }

  if (req.method === 'POST') {
    const { agents, payouts, nodes, solDistributed } = req.body;

    // Get current stats
    let stats = { ...DEFAULT_STATS };
    try {
      const cached = await redis('GET', 'mossad:stats');
      if (cached) {
        stats = JSON.parse(cached);
      }
    } catch (e) {}

    // Update stats
    if (agents !== undefined) stats.activeAgents = parseInt(agents);
    if (payouts !== undefined) stats.totalPayouts = parseInt(payouts);
    if (nodes !== undefined) stats.networkNodes = parseInt(nodes);
    if (solDistributed !== undefined) stats.totalSolDistributed = parseFloat(solDistributed);

    // Save to Redis
    try {
      await redis('SET', 'mossad:stats', JSON.stringify(stats));
    } catch (e) {}

    return res.status(200).json(stats);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
