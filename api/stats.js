// Vercel Serverless API - Stats endpoint
// Using edge config or simple in-memory for demo

let globalStats = {
  networkNodes: 47,
  activeAgents: 892,
  activeMissions: 23,
  totalMissions: 147,
  totalPayouts: 1847,
  totalSolDistributed: 12453.7
};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json(globalStats);
  }

  if (req.method === 'POST') {
    const { agents, payouts, nodes, solDistributed } = req.body;

    if (agents !== undefined) globalStats.activeAgents = parseInt(agents);
    if (payouts !== undefined) globalStats.totalPayouts = parseInt(payouts);
    if (nodes !== undefined) globalStats.networkNodes = parseInt(nodes);
    if (solDistributed !== undefined) globalStats.totalSolDistributed = parseFloat(solDistributed);

    return res.status(200).json(globalStats);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
